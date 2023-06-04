const files = new Map();
const bookstofd = new Map();
let statCache = new Map();
let readFdsCaches = new Map();
let readBookCaches = new Map();
let readBookCounts = new Map();
import {
    Axios
} from "@/services/_axios";
const {
    createMuPdf
} = require("@/utils/wasm_pdf/index.js");
let fdinx = 0;
const max_page_size_element = 1048576; //(1mb)
const min_page_size_element = 104857; //(~102kb)
let total = 0;

function getFilenameWithoutExt(path) {
    // Get the last segment of the path by splitting on the slash/backslash and taking the last element
    const segments = path.split(/[\\/]/);
    const filenameWithExt = segments[segments.length - 1];

    // Get the filename without the extension by splitting on the dot and taking the first element
    const filenameWithoutExt = filenameWithExt.split(".")[0];

    return filenameWithoutExt;
}
let mupdf = null;
createMuPdf().then((a) => (mupdf = a));
async function fopen(sfile, mode) {
    //increment the fd
    const fd = ++fdinx;
    //PDF books, previous version 21 - we need to handle different
    if (sfile.startsWith("tmp_")) return fd + 19000000;
    readFdsCaches.set(fd, sfile);
    let incCounter = readBookCounts.get(sfile);
    if (incCounter) readBookCounts.set(sfile, incCounter + 1);
    else readBookCounts.set(sfile, 1);

    //create info holder for fd (used in ftell and fseek)
    let chunkSize = max_page_size_element / 2; //this should be set by server info

    if (chunkSize > max_page_size_element) chunkSize = max_page_size_element;
    else if (chunkSize < min_page_size_element) chunkSize = min_page_size_element;
    let objInfo = {
        promiseWait: null,
        data: null
    };
    let info;
    let hadInfo = statCache.get(sfile);
    if (hadInfo) {
        if (hadInfo.data != null) {
            info = hadInfo.data;
            hadInfo.promiseWait = null;
        } else {
            info = await hadInfo.promiseWait;
            info = info.data;
        }
    } else {
        statCache.set(sfile, objInfo);
        info = Axios.get(`/api/fsMgr/stat/${sfile}`);
        objInfo.promiseWait = info;
        info = await info;
        info = info.data;
        objInfo.data = info;
    }

    const size = info.size;
    const fdFile = 0; //await fsmgr.open(sfile);
    const data = {
        handle: fdFile,
        chunkSize,
        current_position: 0,
        sfile,
        mode,
        filesize: size,
        buffers: [],
    };

    files.set(fd, data);
    bookstofd.set(getFilenameWithoutExt(sfile), fd);
    return fd;
}

async function fread(fd, size) {
    let i = performance.now();
    //this is actually return uint8array with the data - the wasm responsible for copy it to correct buff
    const info = files.get(fd);
    let buff = Buffer.alloc(4096);
    //await read(info.handle, buff, 0, size, info.current_position);
    await getPagePart(fd, info.handle, size, info.current_position, buff);
    total += performance.now() - i;
    info.current_position += size;
    // debugger;
    return buff;
}

function ftell(fd) {
    const info = files.get(fd);
    if (info == undefined) {
        console.log("no fd found - ftell");
        return 0;
    }
    return info.current_position;
}
async function fseek(fd, offest, fromWhere) {
    const info = files.get(fd);
    if (fromWhere == 0) info.current_position = offest;
    else if (fromWhere == 1) info.current_position += offest;
    else if (fromWhere == 2) info.current_position = info.filesize + offest;

    return 0;
}
async function fclose(fd) {
    console.log("total getPagePart() : " + total);
    total = 0;
    files.delete(fd);
}
async function otzar_fread(fd, from, size) {
    //get the bookid
    let bookid = readFdsCaches.get(fd);
    if (bookid) {
        let LocationsAlreadyRead = readBookCaches.get(bookid);
        //check if we have this book and this location

        if (LocationsAlreadyRead && LocationsAlreadyRead.has(from)) {
            let hadFrom = LocationsAlreadyRead.get(from);
            if (hadFrom.data != null) {
                return hadFrom.data;
            } else {
                await hadFrom.promiseToWait;
                hadFrom.promiseToWait = null;
                return hadFrom.data;
            }
        } else {
            const info = files.get(fd);
            const buff = Buffer.alloc(size);
            let objInfo = {
                promiseToWait: null,
                data: null
            };
            // await read(info.handle, buff, 0, size, from);
            let obj = getPagePart(fd, info.handle, size, from, buff);
            objInfo.promiseToWait = obj;
            if (LocationsAlreadyRead) {
                let bk = readBookCaches.get(bookid);
                bk.set(from, objInfo);
            } else {
                let tmp = new Map();
                tmp.set(from, objInfo);
                readBookCaches.set(bookid, tmp);
            }
            await obj;
            // await getPagePart(fd, info.handle, size, from, buff);
            let data = new Uint8Array(buff.buffer);
            objInfo.data = data;
            return data;
        }
    } else {
        const info = files.get(fd);
        const buff = Buffer.alloc(size);
        // await read(info.handle, buff, 0, size, from);
        let obj = getPagePart(fd, info.handle, size, from, buff);

        await obj;
        // await getPagePart(fd, info.handle, size, from, buff);
        let data = new Uint8Array(buff.buffer);
        return data;
    }
}

function ofilesize(fd) {
    const info = files.get(fd);
    if (info == undefined) {
        console.log("no fd found - ftell");
        return 0;
    }
    return info.filesize;
}
/*the way we gonna handle fread is reading chunks of pages
max_page_size_element=1048576 (1mb)
min_page_size_element=104857 (~102kb)
*/
async function getPagePart(stdio_fd, fd, size, full_offest, buff) {
    //get positions
    const info = files.get(stdio_fd);
    fd = info.sfile;
    const index = Math.floor(full_offest / info.chunkSize);
    const startAtOffest = full_offest - index * info.chunkSize;
    //check if we need two buffers
    let mergeTwo = startAtOffest + size > info.chunkSize ? true : false;

    //check if buffers ready
    //load first buffer
    if (!info.buffers[index]) {
        info.buffers[index] = await getPdfPart(
            fd,
            index * info.chunkSize,
            index * info.chunkSize + info.chunkSize
        );
    }
    //load second buffer
    if (mergeTwo && !info.buffers[index + 1]) {
        info.buffers[index + 1] = await getPdfPart(
            fd,
            (index + 1) * info.chunkSize,
            (index + 1) * info.chunkSize + info.chunkSize
        );
    }

    //all buffers ready - time to merge and return the data
    var tmpBuff = info.buffers[index];

    let tmp = new Uint8Array(tmpBuff.slice(startAtOffest, startAtOffest + size));
    buff.set(tmp, 0);

    // tmpBuff.copy(buff, 0, startAtOffest, info.chunkSize);
    if (mergeTwo) {
        tmpBuff = info.buffers[index + 1];

        tmp = new Uint8Array(
            tmpBuff.slice(0, size - (info.chunkSize - startAtOffest))
        );
        //x should be the second one
        buff.set(tmp, info.chunkSize - startAtOffest);
    }

    return buff;
}
async function getPdfPart(fd, start, end) {
    const data = await Axios.get(
        `/api/fsMgr/read/${fd}/${end - start}/${start}`, {
            responseType: "arraybuffer"
        }
    );
    return data.data;
}
async function bookclose(bookid) {
    const fd = getFilenameWithoutExt(bookid.toString());
    let counter = readBookCounts.get(bookid);
    if (counter == 1) {
        //delete
        readBookCounts.delete(bookid);
        readBookCaches.delete(bookid);
        readFdsCaches.forEach((v, k, m) => {
            if (v == bookid) readFdsCaches.delete(k);
        });
    } else {
        //delete only this fd
        readBookCounts.set(bookid, counter - 1);
    }
    mupdf.jsfclose(Number(fd));
}
globalThis.__v8_wasm_ofs = {
    fread,
    fopen,
    fclose,
    ftell,
    fseek,
    bookclose,
    otzar_fread,
    ofilesize,
};