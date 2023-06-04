import {
    Axios
} from "@/services/_axios";
import maxios from "axios";
import init from "@/config/init.js";
import router from "@/routes/router";
import {
    getRecentPage
} from "./userBooksData";
import store from "@/store/store";
import errorsMgr from "@/helper/errorCodes";
import ImageProccessor from "@/services/ImageProccessor.js";

import * as advLocalStorage from "localforage";
import {
    getAppInfo
} from "@/services/offline/license.js";
import VueInst from "@/main_app.js";
import wasm_pdf_mgr from "./bookData_WASM_pdf.js";
// import djvu from "@/helper/djvuConverter.js";

const Hebcal = require("hebcal");
import ShasBooks from "@/services/mefotzar.js";
const {
    inflate
} = require("pako");
const getDjvu = () =>
    import ("@/helper/djvuConverter.js");
let djvu = null;
import Vue from "vue";
import imgCode from "@/utils/imgUrlEnc";

import onlineHelper from "@/services/onlineStations";

// var lz4 = require("lz4js");
let reuqestIds = new Map();
let pdfBooks = new Map();
// var pdfjsLib = require("pdfjs-dist");
//const getpdfjsLib = () => import("pdfjs-dist");
// const getpdfjsWorker = () => import("pdfjs-dist/build/pdf.worker");
// const pdfjsWorker = require("pdfjs-dist/build/pdf.worker.entry");
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
let pdfjsLib = null;
let pdfjsWorker = null;

let imageCache = [];
let booksFiredErrors = [];
let licTimer = null; // used for lic timer to reload lic if we can
let maxWorkers = 5;
let workers = [];

function getWorker() {
    return new Promise((res, rej) => {
        var myInterval = setInterval(function() {
            for (let i = 0; i < maxWorkers; i++) {
                let ret = workers[i];
                if (!ret.busy) {
                    ret.busy = true;
                    res(ret);
                    clearInterval(myInterval);
                    break;
                }
            }
        }, 5);
    });
}
async function workerCodeAsBlob() {
    let fileData;
    if (globalThis.ELECTRON_ENV) {
        fileData = await Axios.get("/workers/djvu.mini.js");
    } else {
        fileData = await maxios.get("/workers/djvu.mini.js");
    }
    const response = fileData.data;

    let blob;
    try {
        blob = new Blob([response], {
            type: "application/javascript"
        });
    } catch (e) {
        // Backwards-compatibility
        window.BlobBuilder =
            window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
        blob = new BlobBuilder();
        blob.append(response);
        blob = blob.getBlob();
    }
    return blob;
}
async function initWorkers(count = maxWorkers) {
    const data = await workerCodeAsBlob();
    let djvuFile = URL.createObjectURL(data);
    for (let i = 1; i <= count; i++)
        workers.push({
            worker: new Worker(djvuFile),
            busy: false
        });
    URL.revokeObjectURL(djvuFile);
}
initWorkers();

export async function clearBooksCache() {
    await advLocalStorage.removeItem("inxBooks");
    await advLocalStorage.removeItem("books");
    await advLocalStorage.removeItem("bk_originals");
    await advLocalStorage.removeItem("books_decompressed");
    await advLocalStorage.removeItem("inxBooksNA");

    await advLocalStorage.removeItem("bk_originals_NA");
    await advLocalStorage.removeItem("books_decompressed_NA");
}

export async function reloadAllBooksAndInx() {
    console.time("reloadAllBooksAndInx");
    await clearBooksCache();

    await store.dispatch("books/loadBooksToMemory");
    await store.dispatch("books/loadIndexData");
    await store.dispatch("books/setHiddenBooks");
    store.dispatch("bookList/increaseCacheCount");
    console.timeEnd("reloadAllBooksAndInx");
    store.state.triggerBooksGetter++;
}

//do hard reload (offline only)
export function doHardReload() {
    let url = `${init.getServer()}${init.BooksDB.books}${
    init.BooksDB.hardReload
  }`;
    try {
        Axios.get(url);
    } catch (ex) {
        console.error(ex);
    }
}

//get pages table for PDF books (offline only)
export async function getPagesTable(book) {
    let url = `${init.getServer()}${init.BooksDB.books}${
    init.BooksDB.pagesTable
  }/${book}`;
    try {
        let data = await Axios.get(url);

        return data.data;
    } catch (ex) {
        console.error(ex);
        return [];
    }
}

//get html page of text book
export async function getHtmlPage(book, main, sub = 0) {
    let url = `${init.getServer()}${init.BooksDB.books}${
    init.BooksDB.textBooks
  }/${book}/${main}/${sub}`;
    try {
        let data = await Axios.get(url);

        return data.data;
    } catch (ex) {
        console.error(ex);
        return [];
    }
}
//open book
export async function openBook(book, page, tab, fsData, forceCurrTab = false) {
    // store.dispatch("mobile/setTab", "BOOK");
    if (tab && String(tab).startsWith("win_") && !forceCurrTab) {
        refreshFS(tab, fsData);
        return;
    }

    if (!tab) {
        if (
            (VueInst.userSettings.settings.newTabMode &&
                VueInst.userSettings.settings.newTabMode == "1") ||
            store.getters["tabsManager/isCurrentTabPinned"]
        ) {
            tab = new Date().getTime();
        }
    }

    if (!tab)
        store.state.tabsManager.currentTabId == "" ?
        (tab = new Date().getTime()) :
        store.state.tabsManager.currentTabId.startsWith("win_") ?
        (tab = new Date().getTime()) :
        (tab = store.state.tabsManager.currentTabId);

    //this is for scrolling in list
    if (forceCurrTab && !store.getters["tabsManager/isCurrentTabPinned"])
        tab = store.state.tabsManager.currentTabId || new Date().getTime();

    if (!String(page).startsWith("P")) {
        if (fsData == undefined && parseInt(page) <= 0) {
            //get recent page if not freesearch or meforshim
            //first check if we have a pinned page
            let pinnedPage = false;
            try {
                let pinnedPages = VueInst.userSettings.settings.pinnedPages;
                if (pinnedPages) {
                    pinnedPages = new Map(JSON.parse(pinnedPages));

                    if (pinnedPages.has(book.toString())) {
                        page = pinnedPages.get(book.toString());
                        pinnedPage = true;
                    }
                }
            } catch (ex) {
                console.error(ex);
            }
            if (!pinnedPage) {
                let p = await getRecentPage(book);
                if (p.length > 0) page = parseInt(p[0].pageId);
                else {
                    if (shasVilnaBooks.includes(Number(book))) {
                        let books = Object.values(ShasBooks);
                        let mefBook = books.find((b) => b.bookid == book);

                        page = mefBook.firstPage + 1;
                    } else page = 1;
                }
            }
        }
    }
    let fs = "0";
    let start = "0";
    let end = "0";
    if (fsData != undefined) {
        fs = fsData.fs;
        start = fsData.start;
        end = fsData.end;
    }
    const bookOnly = store.state.bookOnlyMode;

    router
        .push({
            name: bookOnly ? "bookOnly" : "book",
            params: {
                book,
                page,
                tab,
                fs,
                start,
                end
            },
        })
        .catch((err) => {
            // console.error(err);
        });
}

//go to page
export async function goToPage(page, tabId = null) {
    //if (page == 0) return;

    if (tabId && String(tabId).startsWith("win_")) {
        refreshPage(tabId, page, false);
        return;
    }
    let tab = store.state.tabsManager.currentTabId;
    let book = store.getters[`tabs/${tab}/getTabData`].book;
    let currentPage = router.currentRoute.params.page ?
        router.currentRoute.params.page :
        "0";
    let fs = router.currentRoute.params.fs ? router.currentRoute.params.fs : "0";
    let start = router.currentRoute.params.start ?
        router.currentRoute.params.start :
        "0";
    let end = router.currentRoute.params.end ?
        router.currentRoute.params.end :
        "0";

    if (currentPage == page) {
        refreshPage(tab, page);
        return;
    }
    var d = new Date();
    var c = d.getTime();
    const bookOnly = store.state.bookOnlyMode;

    router
        .push({
            name: bookOnly ? "bookOnly" : "book",
            params: {
                book,
                page,
                tab,
                fs,
                start,
                end,
                c
            },
            meta: {
                tab: tabId
            },
        })
        .catch((error) => {
            // if (error.name != "NavigationDuplicated") {
            //   throw error;
            // }
            // console.error(error);
        });
}

//refreshFS
function refreshFS(tabId, fsData) {
    store.dispatch(`tabs/${tabId}/refreshFS`, fsData, {
        root: true
    });
}

//go to page
function refreshPage(tabId, page, triggerResize = true) {
    if (typeof page == "string" && page.startsWith("PID_")) {
        page = store.state.tabs[tabId].pages.findIndex(
            (p) => p.name == page.split("PID_")[1]
        );
        if (page === false || page == undefined) return;
        page = store.state.tabs[tabId].pages[page].position;
    } else page = parseInt(page);
    store.state.tabs[tabId].page = page;
    store.dispatch(`tabs/${tabId}/setScrollTo`, page, {
        root: true
    }).then(() => {
        if (triggerResize)
            store.dispatch(`tabs/${tabId}/triggerResize`, null, {
                root: true
            });
    });
}

//get all data of book
export async function getAllDataOfBook(bookId) {
    let url =
        init.getServer() + init.BooksDB.books + init.BooksDB.allData + "/" + bookId;
    try {
        // let data = await Axios.get(url, { responseType: "arraybuffer" });
        let data = await Axios.get(url, {
            responseType: "arraybuffer"
        });
        return data.data;
    } catch (ex) {
        console.error(ex);
        return [];
    }
}

//get bibli info  of book
export async function getBibliInfoOfBook(bookId) {
    let url =
        init.getServer() +
        init.BooksDB.books +
        init.BooksDB.bibliInfo +
        "/" +
        bookId;
    try {
        // let data = await Axios.get(url, { responseType: "arraybuffer" });
        let data = await Axios.get(url, {
            responseType: "arraybuffer"
        });

        data = data.data;
        if (data.length != "") {
            try {
                data = inflate(data);
            } catch (ex) {}
            try {
                data = new TextDecoder().decode(data);
            } catch (ex) {}

            data = JSON.parse(data);
            return data;
        }
    } catch (ex) {
        //console.error(ex);
        return [];
    }
}

//get pages of book
export async function getPages(bookId, txtBook) {
    let url =
        init.getServer() + init.BooksDB.books + "/" + bookId + init.BooksDB.pages;

    if (txtBook) url += "/?text=true";

    let pages = await Axios.get(url);

    return pages.data;
}
//page
export async function getPageById(pageId) {
    let url = init.getServer() + init.BooksDB.page + pageId;
    let page = await Axios.get(url);
    return page.data;
}
//get tsiyunim of book
export async function getTsiyunim(bookId) {
    let url =
        init.getServer() +
        init.BooksDB.books +
        "/" +
        bookId +
        init.BooksDB.tsiyunim;

    try {
        let tsiyunim = await Axios.get(url);

        return tsiyunim.data;
    } catch (err) {
        console.error(err);
        return [];
    }
}

function sortNumber(a, b) {
    return a - b;
}

//get words and pages for gzirim from server
export function getGzirimData_old(id, start, end, numResults, bookId) {
    let type = "search";
    let isList = store.getters["freeSearchBookList/isSavedList"];
    if (isList) type = "list";
    return new Promise(function(resolve, reject) {
        let url =
            init.getServer() +
            init.BooksDB.freeSearch +
            init.BooksDB.gzirim +
            "/" +
            type +
            "/" +
            id +
            "/" +
            start +
            "/" +
            end +
            "/" +
            numResults +
            "/" +
            bookId;

        Axios.get(url).then((words) => {
            resolve(words.data);
        });
    });
}

//get words from server
function getFsWords(id, start, end) {
    let type = "search";
    let isList = store.getters["freeSearchBookList/isSavedList"];
    if (isList) type = "list";
    return new Promise(function(resolve, reject) {
        let url =
            init.getServer() +
            init.BooksDB.freeSearch +
            init.BooksDB.words +
            "/" +
            type +
            "/" +
            id +
            "/" +
            start +
            "/" +
            end;

        Axios.get(url).then((words) => {
            resolve(words.data);
        });
    });
}

//get pages of FS results
export function getFSResultsPages(fsResults, pages, book) {
    return new Promise((resolve, reject) => {
        if (fsResults == undefined) resolve();
        if (!fsResults.fs | (fsResults.fs == "0")) resolve();
        let pageIndex = 0;
        pages = pages.filter((p) => !p.empty);
        let pos = 1;
        pages.forEach((p) => {
            p.position = pos;
            pos++;
        });
        let pagesCopy = [...pages];
        pagesCopy.sort(
            (a, b) =>
            (a.pagedata[0] ? .firstWord || 0) - (b.pagedata[0] ? .firstWord || 0)
        );
        getFsWords(fsResults.fs.fs, fsResults.fs.start, fsResults.fs.end).then(
            (words) => {
                try {
                    words = [...new Set(words)];

                    words.sort(sortNumber).forEach((fs) => {
                        let found = false;
                        while (!found & (pageIndex < pages.length)) {
                            if (
                                pageIndex === pages.length - 1 &&
                                fs > (pagesCopy[pageIndex].pagedata[0] ? .firstWord || 0)
                            ) {
                                found = true;
                                let originIndex =
                                    pagesCopy[pageIndex].position !== undefined ?
                                    pagesCopy[pageIndex].position - 1 :
                                    pagesCopy[pageIndex].id - 1;
                                if (pages[originIndex].words) {
                                    pages[originIndex].words.push(fs);
                                } else {
                                    let x = pages[originIndex];
                                    Vue.set(x, "words", [fs]);
                                }
                            } else {
                                if (fs < (pagesCopy[pageIndex].pagedata[0] ? .firstWord || 0)) {
                                    found = true;
                                    let originIndex =
                                        pagesCopy[pageIndex].position !== undefined ?
                                        pagesCopy[pageIndex].position - 1 :
                                        pagesCopy[pageIndex].id - 1;
                                    if (pages[originIndex].words) {
                                        pages[originIndex].words.push(fs);
                                    } else {
                                        let x = pages[originIndex];
                                        Vue.set(x, "words", [fs]);
                                    }
                                } else if (
                                    fs >= (pagesCopy[pageIndex].pagedata[0] ? .firstWord || 0) &&
                                    fs <
                                    (pagesCopy[pageIndex].pagedata[0] ? .numWords || 0) +
                                    (pagesCopy[pageIndex].pagedata[0] ? .firstWord || 0) +
                                    1
                                ) {
                                    found = true;
                                    let originIndex =
                                        pagesCopy[pageIndex].position !== undefined ?
                                        pagesCopy[pageIndex].position - 1 :
                                        pagesCopy[pageIndex].id - 1;
                                    if (pages[originIndex].words) {
                                        pages[originIndex].words.push(fs);
                                    } else {
                                        let x = pages[originIndex];
                                        Vue.set(x, "words", [fs]);
                                    }
                                } else pageIndex++;
                            }
                        }
                    });
                    resolve();
                } catch (ex) {
                    console.error(ex);
                }
            }
        );
    });
}
//get user tsiyunim of book
export async function getUserTsiyunim(bookId) {
    let url =
        init.getServer() +
        init.UsersDB.users +
        init.UsersDB.tsiyuns +
        init.UsersDB.book +
        "/" +
        bookId;
    try {
        let tsiyunim = await Axios.get(url);
        return tsiyunim.data;
    } catch (err) {
        console.error(err);
        return [];
    }
}

//get all data of book (pages, book details, tsiyunim)
export async function getAllData(book, tabId) {
    let data = await getAllDataOfBook(book);
    // if (data.length != 0) { //TODO LIKE BELOW
    if (data.length != "") {
        try {
            try {
                //if we got the data from file or db then this will fail
                // data = JSON.parse(data);
                data = inflate(data);
            } catch (ex) {
                // console.error(ex);
            }
            try {
                //if we got the data from file or db then this will fail (if we in electron env)
                data = new TextDecoder().decode(data);
            } catch (ex) {}

            data = JSON.parse(data);
            let bookInfo = data[0][0];
            store.dispatch(`tabs/${tabId}/setTxtBook`, bookInfo.moredata ? .isText, {
                root: true,
            });
            if (bookInfo.moredata ? .isText == 1) {
                let pages = await getPages(book, true);

                let tsiyunim = [];
                let userTsiyuns = [];

                if (pages.length == 0) throw "no pages";
                return {
                    bookInfo,
                    pages,
                    tsiyunim,
                    userTsiyuns
                };
                //get special pages from files
            } else {
                let pages = data[1];
                let mm = data[3] || [];
                pages = pages.sort((a, b) => (a.position > b.position ? 1 : -1));
                let tsiyunim = data[2];

                let filteredTsiyuns = [];
                let tsiyunim1 = tsiyunim.filter((t) => t.type == 1 && t.page != null);
                let tsiyunim2 = tsiyunim.filter((t) => t.type == 2);
                tsiyunim1.forEach((t1) => {
                    let found = false;
                    tsiyunim2.forEach((t2) => {
                        if (t2.title == t1.title) found = true;
                    });
                    if (!found) filteredTsiyuns.push(t1);
                });

                tsiyunim2 = tsiyunim2.sort((a, b) => {
                    if (a.page < b.page) return -1;
                    if (a.page > b.page) return 1;

                    let a1 = a.title.replace("טו", "יה").replace("טז", "יו");
                    let b1 = b.title.replace("טו", "יה").replace("טז", "יו");
                    if (a1 < b1) return -1;
                    if (a1 > b1) return 1;
                    return 0;
                });
                tsiyunim = filteredTsiyuns.concat(tsiyunim2);

                let userTsiyuns = [];
                return {
                    bookInfo,
                    pages,
                    tsiyunim,
                    userTsiyuns,
                    mm
                };
            }
        } catch (ex) {
            throw ex.message;
        }
    }
}

//get books' pages and tsiyunim
export async function getBookPagesAndTsiyunimAndFSResults(book) {
    let pages = await getPages(book.book);
    let tsiyunim = await getTsiyunim(book.book);
    let userTsiyuns = await getUserTsiyunim(book.book);
    await getFSResults(book.drawData, pages);
    return {
        pages,
        tsiyunim,
        userTsiyuns
    };
}

export function getBookSubjects(book) {
    let url = init.getServer() + init.BooksDB.book + book + init.BooksDB.subjects;

    return new Promise(function(resolve, reject) {
        Axios.get(url).then((subjects) => resolve(subjects));
    });
}

export function getAllBooksSubjects() {
    let url = init.getServer() + init.BooksDB.book + init.BooksDB.subjects;

    return new Promise(function(resolve, reject) {
        Axios.get(url).then((subjects) => resolve(subjects.data));
    });
}

export function getBookName(name, volume, fullname = false) {
    if (!fullname) {
        let parts = volume.split("-");
        return volume.indexOf("<") != -1 ? name + " " + parts[0] : name;
    } else {
        if (!volume) return name;
        let parts = volume.split("-");
        return volume == "" || volume.indexOf("<") != -1 ?
            name + " " + volume :
            name + " - " + volume;
    }
}

//let lastReqBook = { book: 0, promise: null };
/** @returns {HTMLCanvasElement|OffscreenCanvas} */
export async function getImageObject(
    book,
    page,
    returnType = "image",
    forPrint = false,
    cropRect = {},
    idRequest = null,
    position = 0
) {
    try {
        //check if image is in cache
        /*  let cacheFound = imageCache.filter(
          (c) => c.book === book && c.page === page
        );
        if (cacheFound.length > 0) {
          let image = Object.assign(
            {},
            {
              picture: cloneCanvas(cacheFound[0].img.picture),
              width: cacheFound[0].img.width,
              height: cacheFound[0].img.height,
              webP: cacheFound[0].img.webP,
            }
          );
          return image;
        } */
        onlineHelper.startOnlineTimer(true);
        return await getImg(
            book,
            page,
            returnType,
            forPrint,
            cropRect,
            idRequest,
            position
        );
    } catch (ex) {
        throw ex;
    }
}

export async function getImageAsDataUrl(
    book,
    page,
    cropRect = {},
    idRequest = null,
    position = 0
) {
    let img = await getImageObject(
        book,
        page,
        "dataUrl",
        false,
        cropRect,
        idRequest,
        position
    );

    if (!img || typeof img != "object") throw "getting image failed";
    if (typeof img.picture == "string" && img.picture.match(/^data:/))
        return img.picture;

    let imgDatatl = await ImageProccessor.canvasToDataUrl(img.picture);
    return imgDatatl;
}

//TODO put suitable blocked image
export async function getBlockedImg(code = 1) {
    let errorPage = await errorsMgr.handleImageError(code, false);
    let imageData = new Uint8Array(errorPage);
    return new Promise((res, rej) => {
        const img = new Image();
        const blob = new Blob([imageData]);
        let url = URL.createObjectURL(blob);
        img.onload = function() {
            let width = img.naturalWidth;
            let height = img.naturalHeight;

            const c =
                typeof OffscreenCanvas !== "undefined" ?
                new OffscreenCanvas(width, height) :
                document.createElement("canvas");
            c.width = width;
            c.height = height;
            const ctx = c.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            let webP = false;
            /*   globalThis.SERVER_MODE == "online" && imageType == "webp"
                ? true
                : false; */
            res({
                picture: c,
                webP,
                width,
                height
            });
            URL.revokeObjectURL(url);
        };
        img.src = url;
    });
}

export async function getMultipleImages(
    results,
    book,
    returnType = "",
    decrypt
) {
    try {
        let results1 = [];
        for (let i = 0; i < results.length; i++) {
            let imageMetaData = results[i].imageMetaData;
            if (imageMetaData.isLimited) {
                let picture = getLimitedImg();
                results1.push(picture);
            } else {
                try {
                    let picture = await convertImg(
                        results[i].picture,
                        imageMetaData,
                        book,
                        returnType, {},
                        decrypt
                    );
                    results1.push(picture);
                } catch (ex) {
                    console.log(ex);
                }
            }
        }
        return results1;
    } catch (ex) {
        console.log(ex);
        return false;
    }
}

export async function getImg(
    book,
    page,
    returnType,
    forPrint,
    rectCrop,
    idRequest,
    position
) {
    let imageMetaData = {},
        imageData = null;
    //use to check for oldest request which not relevant anymore
    if (idRequest) {
        reuqestIds.set(idRequest, {
            book,
            page
        });
    }

    let doWASM = false;

    if (pdfBooks.has(book)) {
        let usePdfFile = pdfBooks.get(book) == "21";
        doWASM = true;
        imageMetaData = {
            wasm: true,
            usePdfFile
        };
    }
    try {
        if (!doWASM) {
            let url =
                init.getServer() +
                init.BooksDB.bookImages +
                "/" +
                book +
                "/" +
                page +
                "?c=" +
                imgCode(book, page);

            if (forPrint) url += "&forPrint=true";
            if (rectCrop.resize) {
                url += `&resize=${rectCrop.resize}`;
            }
            if (rectCrop.zoom) {
                url += `&zoom=${rectCrop.zoom}`;
            }
            if (rectCrop.y) {
                url += `&x=${rectCrop.x}&y=${rectCrop.y}&w=${rectCrop.w}&h=${rectCrop.h}`;
            }
            /*     if (rectCrop.header) {
              url += `&header=true`;
            } */
            imageData = await Axios.get(url, {
                responseType: "arraybuffer"
            });

            if (idRequest) {
                //check for not relevant requests
                let vals = reuqestIds.get(idRequest);
                if (vals.page != page || vals.book != book) {
                    return "skip";
                }
            }

            imageMetaData =
                typeof imageData.headers["metadata"] === "string" ?
                JSON.parse(imageData.headers["metadata"]) :
                imageData.headers["metadata"];

            if (imageMetaData.isLimited) return getLimitedImg();
        }

        if (imageMetaData.wasm) {
            //save book in set for next pages
            let PDFType = imageMetaData.usePdfFile ? "21" : "19";
            if (PDFType == "21") pdfBooks.set(book, PDFType);

            //start using WASM
            let pdfMode = 1; //PDFMODES: 1=getPxs, 2=getPngRaw, 3=drawPageAsPNG
            let dpi = rectCrop.zoom > 80 ? 200 : rectCrop.zoom > 50 ? 100 : 72;

            let image = null;
            if (imageData) {
                let tmp = new Uint8Array(imageData ? .data);
                image = decryptHeader(tmp);
            }

            let png = await wasm_pdf_mgr.getPdfPage(
                book,
                position,
                dpi,
                pdfMode,
                PDFType,
                image
            );

            let picture = png.data;

            if (pdfMode == 1) {
                // match it to "swiz" type
                let sizes = Buffer.alloc(8);
                sizes.writeInt32LE(png.w);
                sizes.writeInt32LE(png.h, 4);

                let header = new Uint8Array(4);
                header[2] = 73;
                header[1] = 88;

                picture = new Uint8Array(12 + png.data.length);
                picture.set(header);
                picture.set(sizes, 4);
                picture.set(png.data, 12);
            }

            let width = 3000;
            let height = parseInt((3000 / png.owidth) * png.oheight);

            imageMetaData = {
                width,
                height,
                top: 0,
                crop: true,
                wasm: true,
            };
            return await convertImg(
                picture,
                imageMetaData,
                book,
                returnType,
                rectCrop,
                false
            );
        }
        imageData = imageData.data;

        const ret = await convertImg(
            imageData,
            imageMetaData,
            book,
            returnType,
            rectCrop
        );
        return ret;
    } catch (ex) {
        throw ex;
    }
}

async function convertImg(
    imageData,
    imageMetaData,
    book,
    returnType,
    rectCrop = {
        y: 0
    },
    decrypt = true
) {
    try {
        let uinarray = new Uint8Array(imageData);
        if (isError(uinarray)) {
            let errorCode = uinarray[4];
            let errorPage = await errorsMgr.handleImageError(errorCode, notify(book));
            imageData = errorPage;
            uinarray = new Uint8Array(imageData);
            //create timer for 5 secs to check again for lic and reload images if needed (mostly
            // use for disk disconnect and connect again)
            if (!licTimer) {
                licTimer = setInterval(async () => {
                    const data = await getAppInfo();
                    if (typeof data !== "number") {
                        //lic ok so reload pages
                        store.state.reloadAllPages++;
                        //and stop lic check timer
                        clearInterval(licTimer);
                        licTimer = null;
                    }
                }, 5000);
            }
        } else {
            if (decrypt) decryptHeader(uinarray);
        }
        let imageType = "other";
        let webP = false;

        if (uinarray[0] == 65 && uinarray[1] == 84 && uinarray[2] == 38)
            imageType = "djvu";
        else if (uinarray[0] == 82 && uinarray[1] == 73 && uinarray[2] == 70) {
            imageType = "webp";
            webP = true;
        } else if (uinarray[0] == 37 && uinarray[1] == 80 && uinarray[2] == 68) {
            imageType = "pdf";
        } else if (uinarray[1] == 80 && uinarray[2] == 78 && uinarray[3] == 71) {
            imageType = "png";
        } else if (uinarray[1] == 0x42 && uinarray[2] == 0x4d) {
            imageType = "bmp";
        } else if (uinarray[2] == 73) {
            if (uinarray[1] == 87) imageType = "zwis";
            //rgba + lz4
            else if (uinarray[1] == 88) {
                imageType = "zwiz"; //rgba pure
            }
        }

        if (imageType == "djvu") {
            if (!djvu) {
                djvu = await getDjvu();
                djvu = djvu.default;
            }
            return new Promise(async (resolve, reject) => {
                try {
                    let Iworker = await getWorker();

                    let myWorker = Iworker.worker;
                    // let djvuPage = new djvu.Document(imageData);
                    // let picture = djvuPage.pages[0].createPngObjectUrl();
                    // resolve({
                    //   picture,
                    //   webP: false,
                    //   width: picture.width,
                    //   height: picture.height,
                    // });
                    // return;
                    myWorker.onmessage = function(e) {
                        Iworker.busy = false;
                        let imgdata = e.data;
                        const picture =
                            typeof OffscreenCanvas !== "undefined" ?
                            new OffscreenCanvas(imgdata.width, imgdata.height) :
                            document.createElement("canvas");
                        picture.width = imgdata.width;
                        picture.height = imgdata.height;

                        let width = picture.width;
                        let height = picture.height;
                        picture
                            .getContext("2d")
                            .drawImage(imgdata, 0, 0, imgdata.width, imgdata.height);
                        imgdata.close();
                        resolve({
                            picture,
                            webP,
                            width,
                            height,
                            imageMetaData
                        });
                    };
                    if (imageData.buffer) {
                        myWorker.postMessage(uinarray.buffer, [uinarray.buffer]);
                    } else myWorker.postMessage(imageData, [imageData]);
                } catch (ex) {
                    reject(ex);
                }
            });
        } else if (imageType == "zwiz") {
            let pxs = Buffer.from(uinarray);
            let pix = pxs.slice(12);
            const w = pxs.readInt32LE(4);
            const h = pxs.readInt32LE(8);

            let pixcomp = new Uint8ClampedArray(pix);

            let img_data = new ImageData(pixcomp, w, h);
            const cnv =
                typeof OffscreenCanvas !== "undefined" ?
                new OffscreenCanvas(w, h) :
                document.createElement("canvas");
            cnv.width = w;
            cnv.height = h;

            cnv.getContext("2d").putImageData(img_data, 0, 0);
            //  img_data.width = img_data.height = 0;
            return Promise.resolve({
                picture: cnv,
                webP,
                width: w,
                height: h,
                imageMetaData,
            });
        } else if (imageType == "zwis") {
            // let compData = new Uint8Array(uinarray, 9, uinarray.byteLength - 9);

            let pxs = Buffer.from(uinarray);
            let pix = pxs.slice(12);
            //is it zlib or lz4
            const w = pxs.readInt32LE(4);
            const h = pxs.readInt32LE(8);
            let data;
            if (uinarray[0] == 76) {
                let tmp = Buffer.alloc(w * h * 4);

                let uncompressedSize = window.LZ4.decodeBlock(pix, tmp);

                // pix = pix.slice(12 + 0xe64 + 39);
                // data = lz4.decompress(pix);
                data = tmp.slice(0, uncompressedSize);
            } else {
                //zlib
                data = inflate(pix);
            }

            let pixcomp = new Uint8ClampedArray(data);

            let img_data = new ImageData(pixcomp, w, h);
            const cnv =
                typeof OffscreenCanvas !== "undefined" ?
                new OffscreenCanvas(w, h) :
                document.createElement("canvas");
            cnv.width = w;
            cnv.height = h;

            cnv.getContext("2d").putImageData(img_data, 0, 0);

            return Promise.resolve({
                picture: cnv,
                webP,
                width: w,
                height: h,
                imageMetaData,
            });
        } else if (imageType == "pdf") {
            //lastImgAccess.content = imageData;
            // if (book < 6000000) {
            /* let pageGroup = (await Axios.get(`/api/books/table/${book}/group`))
                .data;

              //get the  page number from pageid

              const keys = Object.keys(lastImgAccess.group);
              for (let i = 0; i < keys.length; i++) {
                const keyName = keys[i];

                const arr = lastImgAccess.group[keyName];
                const inxInArr = arr.findIndex((p) => p === page);
                if (inxInArr !== -1) {
                  //we found the pageNum
                  pageNum = inxInArr;
                  lastImgAccess.lastGroup = arr;
                  break;
                }
              } */
            //   pageNum = 0;
            // } else pageNum = Number(page);
            //get pdf raw
            // const data = imageData; //lastImgAccess.content;
            //get pdf image as canvas object
            // const picture = await getPdfPageAsImage(data, pageNum);
            // return Promise.resolve({
            //   picture,
            //   pdf: true,
            //   width: picture.width,
            //   height: picture.height,
            // });
        } else if (
            imageType == "webp" ||
            imageType == "png" ||
            imageType == "bmp" ||
            imageType == "other"
        ) {
            return new Promise((res, rej) => {
                const img = new Image();

                // const url = `data:${imageType};base64,${Buffer.from(imageData).toString(
                //   "base64"
                // )}`;
                let url = "";
                let headerSign = new TextDecoder();
                headerSign = headerSign.decode(uinarray.slice(0, 5));
                let isdataUrl = headerSign === "data:";
                if (isdataUrl) {
                    url = Buffer.from(uinarray).toString();
                    if (returnType == "dataUrl")
                        res({
                            picture: url,
                            webP,
                            width: 0,
                            height: 0,
                            imageMetaData
                        });
                } else {
                    const blob = new Blob([uinarray]);
                    url = URL.createObjectURL(blob);
                }

                img.onload = function() {
                    let width = img.naturalWidth;
                    let height = img.naturalHeight;

                    let y = 0;

                    if (imageType == "webp" && rectCrop.y) {
                        //we need to cut the image
                        height = height * rectCrop.h;
                        y = rectCrop.y;

                        if (y + height > img.naturalHeight)
                            y -= y + height - img.naturalHeight;
                    }
                    const c =
                        typeof OffscreenCanvas !== "undefined" ?
                        new OffscreenCanvas(width, height) :
                        document.createElement("canvas");
                    c.height = height;
                    c.width = width;
                    const ctx = c.getContext("2d");
                    ctx.drawImage(img, 0, y, width, height, 0, 0, width, height);

                    let webP = false;
                    /*  globalThis.SERVER_MODE == "online" && imageType == "webp"
                        ? true
                        : false; */
                    res({
                        picture: c,
                        webP,
                        width,
                        height,
                        imageMetaData
                    });
                    URL.revokeObjectURL(url);
                };
                img.src = url;
            });
        } else {
            return new Promise((resolve, reject) => {
                let url = "";
                let headerSign = new TextDecoder();
                headerSign = headerSign.decode(imageData.slice(0, 5));
                let isdataUrl = headerSign === "data:";
                if (isdataUrl) url = Buffer.from(imageData).toString();
                else
                    url = `data:png;base64,${Buffer.from(imageData).toString("base64")}`;
                if (returnType == "dataUrl") {
                    resolve({
                        picture: url,
                        webP,
                        width: 0,
                        height: 0,
                        imageMetaData
                    });
                } else {
                    const img = new Image();
                    img.onload = function() {
                        let width = img.naturalWidth;
                        let height = img.naturalHeight;
                        const c =
                            typeof OffscreenCanvas !== "undefined" ?
                            new OffscreenCanvas(width, height) :
                            document.createElement("canvas");
                        c.height = height;
                        c.width = width;

                        const ctx = c.getContext("2d");
                        ctx.drawImage(img, 0, 0, width, height);

                        let webP = false;
                        resolve({
                            picture: c,
                            webP,
                            width,
                            height,
                            imageOriginSize
                        });
                    };
                    img.onerror = function(err) {
                        reject(err);
                    };
                    img.src = url;
                }
            });
        }
    } catch (ex) {
        throw ex;
    }
}

export const shasVilnaBooks = [
    173917,
    173919,
    173920,
    173921,
    173922,
    173923,
    173924,
    173925,
    173926,
    173927,
    173928,
    173929,
    173930,
    173931,
    173932,
    173933,
    173934,
    173935,
    173936,
    173937,
    176549,
    176550,
    176551,
    176552,
    176553,
    176554,
    176555,
    176556,
    176557,
    176558,
    176559,
    176562,
    176563,
    176564,
    176565,
    176566,
    176566,
];

function NodeCanvasFactory() {}
NodeCanvasFactory.prototype = {
    create: function NodeCanvasFactory_create(width, height) {
        // assert(width > 0 && height > 0, "Invalid canvas size");
        let canvas =
            typeof OffscreenCanvas !== "undefined" ?
            new OffscreenCanvas(width, height) :
            document.createElement("canvas");
        canvas.height = height;
        canvas.width = width;

        var context = canvas.getContext("2d");
        return {
            canvas: canvas,
            context: context,
        };
    },

    reset: function NodeCanvasFactory_reset(canvasAndContext, width, height) {
        // assert(canvasAndContext.canvas, "Canvas is not specified");
        // assert(width > 0 && height > 0, "Invalid canvas size");
        canvasAndContext.canvas.width = width;
        canvasAndContext.canvas.height = height;
    },

    destroy: function NodeCanvasFactory_destroy(canvasAndContext) {
        // assert(canvasAndContext.canvas, "Canvas is not specified");

        // Zeroing the width and height cause Firefox to release graphics
        // resources immediately, which can greatly reduce memory consumption.
        canvasAndContext.canvas.width = 0;
        canvasAndContext.canvas.height = 0;
        canvasAndContext.canvas = null;
        canvasAndContext.context = null;
    },
};
let lastPdfArray = [];
let uintPdfArray = null;
/* export async function getPdfPageAsImage(pdfRaw, pageNum) {
  return new Promise(async (resolve, reject) => {
    // Relative path of the PDF file.
    pageNum += 1;
    // Read the PDF file into a typed array so PDF.js can load it.
    let rawData;
    if (lastPdfArray == pdfRaw) {
      rawData = uintPdfArray;
    } else {
      rawData = new Uint8Array(pdfRaw);
      lastPdfArray = pdfRaw;
      uintPdfArray = rawData;
    }
    //should check if it need to be default or default()
    if (!pdfjsLib) {
      pdfjsLib = await getpdfjsLib();
      // pdfjsLib = pdfjsLib.default();
    }
    if (!pdfjsWorker) {
      pdfjsWorker = true;
      // pdfjsWorker = await getpdfjsWorker();
      // pdfjsWorker = pdfjsWorker.default();
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/workers/pdf.worker.js";
    }
    // Load the PDF file.

    var loadingTask = pdfjsLib.getDocument(rawData);
    loadingTask.promise
      .then(function (pdfDocument) {
        // Get the first page.
        pdfDocument.getPage(pageNum).then(function (page) {
          // Render the page on a Node canvas with 100% scale.
          let viewport = page.getViewport({ scale: 3.0 });

          var canvasFactory = new NodeCanvasFactory();
          var canvasAndContext =
            typeof OffscreenCanvas !== "undefined"
              ? new OffscreenCanvas(viewport.width, viewport.height)
              : document.createElement("canvas");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          var renderContext = {
            canvasContext: canvasAndContext.getContext("2d"),
            viewport: viewport,
            canvasFactory: canvasFactory,
          };

          //here we got the image buffer
          var renderTask = page.render(renderContext);
          renderTask.promise.then(function () {
            // Convert the canvas to an image buffer.
            // var image = canvasAndContext.canvas.toBuffer();

            resolve(canvasAndContext);
          });
        });
      })
      .catch(function (reason) {
        reject(reason);
      });
  });
} */

export function getMefoBookByDaf(masechet, daf, amud) {
    if (masechet.indexOf("מעילה") != -1) masechet = "מעילה";
    let books = Object.values(ShasBooks);
    let mefBook = books.find((b) => b.bookName == masechet);

    let goToPage = mefBook.firstPage + 1;

    daf = Hebcal.gematriya(daf);
    amud = Hebcal.gematriya(amud);
    goToPage += (daf - 2) * 2 + (amud - 1);

    return {
        bookId: mefBook.bookid,
        page: goToPage
    };
}

const decryptHeader = (uint8buff) => {
    /**@type {Uint8Array} */
    const buff = uint8buff;
    const key = `NsfbTQX=4xrAPFMA8^RHW6qFgM-gSrX-xXvF6@69R8GFHV2$agT#FzjmgFd5EHdQt%Vb$bkcCZUZHznFPj$L^LyXt#tuHtVaY+k#!?ZJjChQr9hSa4a$NJApVecm9ST`;
    const max = key.length > buff.length ? buff.length : key.length;
    for (let i = 0; i < max; i++) {
        buff[i] = buff[i] ^ key.charCodeAt(i);
    }

    return buff;
};

function isError(data) {
    return data.length === 6 && data[0] === 6;
}

function notify(book) {
    setTimeout(() => {
        booksFiredErrors = [];
    }, 50000);
    if (booksFiredErrors.includes(book)) return false;

    booksFiredErrors.push(book);
    return true;
}

function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}

let limitedImg;
let beta = false;

function getLimitedImg() {
    if (limitedImg) return limitedImg;
    const cnv =
        typeof OffscreenCanvas !== "undefined" ?
        new OffscreenCanvas(600, 400) :
        document.createElement("canvas");
    cnv.width = 600;
    cnv.height = 400;

    var ctx = cnv.getContext("2d");

    //border
    ctx.strokeStyle = "rgb(255, 0, 0)";
    ctx.lineWidth = 3;

    /** rounded rectangle */
    let x = 30,
        y = 30,
        width = 520,
        height = 50,
        radius = 20;
    if (beta) height = 320;
    radius = {
        tl: radius,
        tr: radius,
        br: radius,
        bl: radius,
    };

    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius.br,
        y + height
    );
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    ctx.stroke();
    /** end */

    //text
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    if (beta) {
        ctx.fillText("הנך משתמש בגרסת ה'בטא' של אוצר החכמה", 300, 130);
        ctx.fillText("בגרסה זו אין אפשרות לפתוח ספרים שאינם נכללים", 300, 170);
        ctx.fillText("בתכנה הבסיסית", 300, 210);
    } else ctx.fillText(VueInst.$t("driverErrors.noPackage"), 300, 60);

    //background
    ctx.fillStyle = "rgba(196, 176, 175, .3)";
    ctx.fill();

    limitedImg = {
        picture: cnv,
        webP: false,
        limited: true,
        width: 600,
        height: 400,
        imageMetaData: {
            height: 400,
            top: 0,
            width: 600,
        },
    };

    return limitedImg;
}