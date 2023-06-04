import {
    Axios
} from "./_axios";
import init from "@/config/init.js";
import store from "@/store/store";
import {
    saveSearchToHistory
} from "./history.js";
import {
    openBook,
    getImageObject,
    getBookSubjects
} from "./bookData.js";
import {
    freeSearchErrors
} from "./errorsInfo.js";
import Vue from "vue";
import onlineHelper from "@/services/onlineStations";
import {
    getSocket
} from "@/main_app";
import {
    startBook,
    createNewPage,
    saveBook
} from "./createCustomBook.js";

let hebFont = null;
const hebFontImport = () =>
    import ("../../public/hebFont.js");
import VueInst from "@/main_app.js";
import {
    getIdialImgSize
} from "./print.js";
import customBook from "./customBook";

const getjsPdf = () =>
    import ("jspdf");
let pgInterval;
let exporting = false;

//clear free search input
export function clear() {
    store.dispatch("freeSearch/setSearchString", "");
    store.dispatch("freeSearchBookList/setInputTxt", "");
}

//finish free search
export function listenFinishedFreeSearch(socket) {
    return new Promise((resolve, reject) => {
        socket.on(
            "finishedFreeSearch",
            function({
                results,
                fs,
                historyId,
                error,
                total,
                book,
                tabId,
                historyMainId,
            }) {
                resolve();

                store.state.freeSearch.inBook = false;

                let status = 0;
                let notification = {};
                let isError = false;
                let errorMessage = "";

                //check if recieved error
                if (error != "") {
                    isError = true;
                    errorMessage = error;
                    status = 1;
                }
                if (errorMessage.indexOf("ECONN") > -1)
                    results.errorCode = globalThis.IS_BOOK_APP ?
                    globalThis.IS_BOOK_APP() ?
                    7 :
                    6 :
                    6;

                if (results.errorCode != undefined) {
                    isError = true;
                    errorMessage = freeSearchErrors[results.errorCode];
                    status = results.status;
                }
                if (status == 10) {
                    isError = true;
                    errorMessage = freeSearchErrors[results.errorCode];
                }
                if (fs == "") {
                    if (results.errorCode != undefined)
                        errorMessage = freeSearchErrors[results.errorCode];
                    isError = true;
                }

                if (isError) {
                    notification = {
                        type: "error",
                        message: errorMessage,

                        timeout: 3000,
                    };

                    Vue.notify(notification);
                    if (!book) {
                        store.dispatch("freeSearch/setSearching", false);
                        clearInterval(pgInterval);
                        fs == "special" ?
                            (store.state.freeSearchBookList.resultsType = "special") :
                            (store.state.freeSearchBookList.resultsType = "classic");

                        if (fs != "special") {
                            store.dispatch("freeSearchBookList/setResultBooks", []);
                            store.state.freeSearchBookList.totalResults = 0;
                        }
                    }
                    if (book) store.state.tabs[tabId].fsFinished = true;
                    return;
                }
                if (book) {
                    store.state.tabs[tabId].fsFinished = true;
                    store.state.tabs[tabId].fsTotal = total;
                    if (results.length == 0) {
                        notification = {
                            type: "error",
                            message: VueInst.$t("general.noFindResults"),
                            timeout: 2000,
                        };

                        Vue.notify(notification);
                    } else {
                        openBook(results[0].book, store.state.tabs[tabId].page, tabId, {
                            fs,
                            start: results[0].start,
                            end: results[0].end,
                        });
                    }
                    return;
                }

                store.state.freeSearchBookList.finalTextSearch =
                    store.state.freeSearchBookList.textSearch;
                let searchTxt = store.getters["freeSearchBookList/getTextInput"];
                store.dispatch("freeSearchBookList/setCurrentFsName", fs).then(() => {
                    store.state.freeSearchBookList.totalResults = total;

                    store.dispatch("freeSearchBookList/setCurrentFilter", 0);

                    store.state.freeSearchBookList.hideBookLists = true;

                    let listType =
                        store.getters["freeSearchBookList/getFreeSearchSearchInType"];
                    //save to history
                    let booksToSearch =
                        store.getters["freeSearchBookList/getBooksToSearchIn"];
                    //create buffer of books to send to search server and to save in history
                    let pos = 0;
                    let booksBuffer;

                    if (fs == "special") booksBuffer = "special";
                    else {
                        if (booksToSearch.id) booksBuffer = JSON.stringify(booksToSearch);
                        else {
                            booksBuffer = Buffer.alloc(booksToSearch.length * 12);
                            booksToSearch.forEach((book) => {
                                booksBuffer.writeInt32LE(book, pos);
                                pos += 12;
                            });
                        }
                    }
                    //if not from history , save to history

                    if (historyId == 0) {
                        let data = {
                            data: searchTxt,
                            type: "free",
                            list: listType,
                            filename: fs,
                            books: booksBuffer,
                        };
                        saveSearchToHistory({
                            data
                        }).then((id) => {
                            store.state.freeSearchBookList.currentHistoryId =
                                id.data.history[0].id;
                            store.state.freeSearchBookList.currentHistoryLastActive = 0;

                            fs == "special" ?
                                (store.state.freeSearchBookList.resultsType = "special") :
                                (store.state.freeSearchBookList.resultsType = "classic");
                            store
                                .dispatch("freeSearchBookList/setResultBooks", results)
                                .then(() => {
                                    //stop progress bar
                                    store.dispatch("freeSearch/setSearching", false);
                                    clearInterval(pgInterval);
                                });
                            var currentdate = new Date();
                            let item = {};
                            item.infoId = id.data.id;
                            item.id = id.data.history[0].id;
                            item.historyDate = currentdate;
                            item.info = id.data.data;
                            item.listType = id.data.list;

                            item.pin = 0;
                            item.type = "free";
                            /*  store
                            .dispatch("userSearchHistory/addHistoryItem", item)
                            .then(() => {
                              store.getters["userSearchHistory/getUserSearchHistoryByType"]([
                                "free",
                              ]);
                            }); */

                            store.dispatch("userSearchHistory/setSearchHistoryList");
                        });
                    }
                    //if is from history , move item to begining
                    else {
                        store.state.freeSearchBookList.currentHistoryId = historyMainId;
                        store.state.freeSearchBookList.currentHistoryLastActive =
                            store.getters["userSearchHistory/getCurrentHistoryLastActive"];

                        fs == "special" ?
                            (store.state.freeSearchBookList.resultsType = "special") :
                            (store.state.freeSearchBookList.resultsType = "classic");
                        store
                            .dispatch("freeSearchBookList/setResultBooks", results)
                            .then(() => {
                                //stop progress bar
                                store.dispatch("freeSearch/setSearching", false);
                                clearInterval(pgInterval);
                            });
                        /*  store.dispatch("freeSearchBookList/addUserActionToHistory", {
      type: "SEARCH",
      content: searchTxt,
      historyId: historyMainId,
    }); */
                        store
                            .dispatch("userSearchHistory/moveItemToBeginning", history)
                            .then(() => {
                                store.getters["userSearchHistory/getUserSearchHistoryByType"]([
                                    "free",
                                ]);
                            });
                    }
                });
            }
        );
    });
}

//get coords of words
export function getWordsCoords({
    bookId,
    pageId,
    words,
    margin,
    webP
}) {
    let url = init.getServer() + init.BooksDB.freeSearch + init.BooksDB.coords;
    return Axios.post(url, {
        bookId,
        pageId,
        words,
        margin,
        webP,
    });
}

export function setSearchType(type) {
    store.state.freeSearch.searchType = type;
}

let freeSearchSocket = null;
export function stopFreeSearch() {
    freeSearchSocket.emit("stopFreesearch");
}
export function doFreeSearch(
    search,
    booksToSearch = [],
    historyId = 0,
    book = false,
    tabId = null,
    historyMainId = 0
) {
    //reset online timer on each freesearch
    onlineHelper.startOnlineTimer();
    store.state.tabsManager.scrollToFsResult = true;
    if (Array.isArray(booksToSearch)) booksToSearch = [...new Set(booksToSearch)];
    if (search == "") return;
    return new Promise(function(resolve, reject) {
        let booksBuffer = null;
        let searchType = store.state.freeSearch.searchType;
        //tsiyunim and maftechot search
        if (searchType == "special") {
            store.dispatch("freeSearchBookList/setCurrentFSListName", "");

            store.dispatch("freeSearch/setSearchProgress", 0);
            let currProg = 0;
            pgInterval = setInterval(() => {
                currProg += 10;

                store.dispatch("freeSearch/setSearchProgress", currProg);
            }, 1);
            // store.dispatch("freeSearch/setSearchString", search);
            store.dispatch("freeSearch/setSearching", true);
            // store.dispatch("freeSearchBookList/setSearchTxt", search);

            store.dispatch("freeSearchBooklistComp/checkAllListBooksFree", false);

            store.dispatch("freeSearchBookList/showFreeSearchList");
            store.dispatch("freeSearchBookList/setSearchTxt", search);
            // search = store.getters["freeSearch/getSearchWordsForSearch"];
        } else {
            //classic search
            //create buffer of books to send to search server and to save in history
            let pos = 0;

            if (!Array.isArray(booksToSearch)) booksBuffer = booksToSearch;
            else {
                booksBuffer = Buffer.alloc(booksToSearch.length * 12);
                booksToSearch.forEach((book) => {
                    booksBuffer.writeInt32LE(book, pos);
                    pos += 12;
                });
            }
            if (!book) {
                //close advanced popup
                store.dispatch("freeSearchBookList/setCurrentFSListName", "");
                store.dispatch("freeSearch/setShowAdvPopup", false);
                store.dispatch("freeSearch/setSearchProgress", 0);
                let currProg = 0;
                pgInterval = setInterval(() => {
                    currProg += 10;

                    store.dispatch("freeSearch/setSearchProgress", currProg);
                }, 1);

                store.dispatch("freeSearch/setSearchString", search);
                store.dispatch("freeSearch/setSearching", true);
                store.dispatch("freeSearchBookList/setSearchTxt", search);

                store.dispatch("freeSearchBooklistComp/checkAllListBooksFree", false);

                store.dispatch("freeSearchBookList/showFreeSearchList");
                search = store.getters["freeSearch/getSearchWordsForSearch"];
            } else search = store.getters["freeSearch/getSearchWords1"](search);
        }

        //do free search
        if (freeSearchSocket == null) {
            freeSearchSocket = getSocket();
            listenFinishedFreeSearch(freeSearchSocket, book, tabId, searchType);
        }
        freeSearchSocket.emit("freesearch", {
            txt: JSON.stringify(search), //this.searchText,
            books: booksBuffer,
            historyId,
            searchType,
            book,
            tabId,
            userId: store.getters["user/getUserId"],
            historyMainId,
        });
        /*     listenFinishedFreeSearch(freeSearchSocket, book, tabId, searchType).then(
          () => {
            resolve();
          }
        ); */
    });
}

export async function getBooksToSearchIn() {
    let listType = "";
    let booksToSearch = [];
    let searchInType = store.getters["freeSearchBookList/getSearchInType"];
    let searchEnum = store.state.freeSearch.enumSearchInType;
    if (searchInType >= searchEnum.custom) {
        booksToSearch = store.getters["freeSearchBookList/getBooksToSearchIn"];
        listType = "custom";
    } else {
        switch (searchInType) {
            case searchEnum.all:
                booksToSearch = [];
                await store.dispatch(
                    "freeSearchBookList/setBooksToSearchIn",
                    booksToSearch
                );

                break;

            case searchEnum.selected:
                let checkedBooks1 = store.getters["bookList/getCheckedBooks"];
                let checkedBooks2 = store.getters["freeSearchBookList/getCheckedBooks"];
                booksToSearch = Array.from(
                    new Set(checkedBooks1.concat(checkedBooks2))
                );
                await store.dispatch(
                    "freeSearchBookList/setBooksToSearchIn",
                    booksToSearch
                );
                listType = "selected";
                break;

            case searchEnum.inMeforesh:
                //get books of current list
                let catId =
                    store.getters["bookList/getDataOfCurrentList"].data.id ||
                    store.getters["bookList/getDataOfCurrentList"].data.listId;
                // let list = store.getters["bookList/getCurrentList"];
                // list = list.map((book) => book.id);
                booksToSearch = {
                    meforesh: true,
                    id: catId
                };
                //booksToSearch = list;
                await store.dispatch(
                    "freeSearchBookList/setBooksToSearchIn",
                    booksToSearch
                );
                listType = "mef";
                break;

            case searchEnum.browse:
                booksToSearch = store.getters["freeSearchBookList/getBooksToSearchIn"];
                listType = "browse";
                break;

            case searchEnum.currentList:
                booksToSearch = await store.dispatch(
                    "bookList/getBooksIdCurrentList",
                    null
                );
                await store.dispatch(
                    "freeSearchBookList/setBooksToSearchIn",
                    booksToSearch
                );
                listType = "currentList";
                break;
            case searchEnum.tsiyunim:
                listType = "special";
                booksToSearch = [];
                break;

            default:
                booksToSearch = store.getters["freeSearchBookList/getBooksToSearchIn"];
                if (!booksToSearch) {
                    booksToSearch = [];
                    await store.dispatch(
                        "freeSearchBookList/setBooksToSearchIn",
                        booksToSearch
                    );
                }
        }
    }
    await store.dispatch(
        "freeSearchBookList/setFreeSearchSearchInType",
        listType
    );
    return booksToSearch;
}
const params = ["height=" + screen.height, "width=" + screen.width].join(",");
let currentTop = 0;
let firstPage = true;
let currentPage = 0;
export async function createCustomBookFromResults() {
    let data = store.getters["freeSearchBookList/getBooksCheckedInfo"]();
    console.log(data);
}
export async function exportFsResults(
    gzirim = false,
    customBook = false,
    customBookName = ""
) {
    let pdfNum = 1;
    const maxResInBook = 40;
    firstPage = true;
    store.state.progressWindow.bottomMessage = VueInst.$t(
        "bookPrint.FsPDFLimited"
    ).replace("%NUM%", maxResInBook);
    if (customBook)
        store.state.progressWindow.title = VueInst.$t("createBook.creatMineBook");
    else
        store.state.progressWindow.title = VueInst.$t(
            "actionBook.exportSelectedResults"
        );
    store.state.progressWindow.stopFunc = stopExport;
    return new Promise(async function(resolve, reject) {
        try {
            let jsPDF = null;
            if (!customBook) {
                jsPDF = await getjsPdf();
                jsPDF = jsPDF.default;
                var filename = VueInst.$t("fsresults.header") + " " + search;
                filename = filename.replace(/[/\\?%*:|"<>]/g, "-");
                var doc = new jsPDF("p", "pt", "a4");
                var width = doc.internal.pageSize.getWidth();
                var height = doc.internal.pageSize.getHeight();
                if (!hebFont) {
                    hebFont = await hebFontImport();
                    hebFont = hebFont.default;
                }
                doc.addFileToVFS("ahronbd.ttf", hebFont());
                doc.addFont("ahronbd.ttf", "Arial", "normal");
                doc.setFont("Arial");
                doc.setFontSize(12);
            } else {
                startBook(customBookName);
            }

            exporting = true;
            let search = store.getters["freeSearchBookList/getTextSearch"];
            let fsId = store.state.freeSearchBookList.currentFsName;

            //loop through selected results, stop if user stopped
            let data = store.getters["freeSearchBookList/getBooksCheckedInfo"]();
            currentTop = 5;

            for (let i = 0; i < data.length && exporting; i++) {
                if (!exporting) break;
                let pageInBook = 0;

                store.state.progressWindow.topMessage =
                    data[i].name + " / " + data[i].author;
                store.state.freeSearch.currentResultExporting = data[i];
                /*  let percent = (100 / data.length) * (i + 1);

      store.state.freeSearch.currentPercentExporting = percent; */
                let results = await getGzirimData(
                    fsId,
                    data[i].start,
                    data[i].end,
                    data[i].numResults,
                    data[i].book
                );

                let words;
                const bundleSize = 50;
                let bundleCount = Math.ceil(results.length / bundleSize);
                let x = 0;
                for (
                    let j = 0; j <= results.length && pageInBook <= maxResInBook; j += bundleSize
                ) {
                    if (!exporting) break;
                    let percent = ((i + 1) / data.length) * ((x + 1) / bundleCount) * 100; // (100 / data.length) * i + (100 / bundleCount) * (x + 1);
                    store.state.progressWindow.percent = percent;
                    if (pageInBook >= maxResInBook) {
                        continue;
                    }
                    //  store.state.freeSearch.currentPercentExporting = percent;
                    words = await getCoordsForGzirim(
                        results.slice(j, j + bundleSize),
                        data[i].book, !gzirim
                    );
                    let numPages = Object.keys(words).length;

                    pageInBook += numPages;

                    if (pageInBook >= maxResInBook) {
                        Object.keys(words).forEach((key, i) => {
                            if (i >= numPages - (pageInBook - maxResInBook))
                                delete words[key];
                        });
                    }

                    // words = words.slice(0, numPages - (pageInBook - maxResInBook));

                    if (!customBook && currentPage > 20) {
                        if (globalThis.SERVER_MODE == "online")
                            window.open(doc.output("bloburl"));
                        else {
                            let pdfName = "אוצר החכמה_" + pdfNum;
                            pdfNum++;
                            const blobData = doc.output("blob");
                            const urlFile = URL.createObjectURL(blobData);
                            let anchor = document.createElement("a");
                            anchor.download = pdfName;
                            anchor.href = urlFile;
                            anchor.click();
                            setTimeout(() => {
                                URL.revokeObjectURL(urlFile);
                            }, 0);
                        }

                        doc = new jsPDF("p", "pt", "a4");
                        doc.addFileToVFS("ahronbd.ttf", hebFont());
                        doc.addFont("ahronbd.ttf", "Arial", "normal");
                        doc.setFont("Arial");
                        doc.setFontSize(12);
                        currentPage = 0;
                        firstPage = true;
                    }
                    await addToPdf(
                        doc,
                        words,
                        data[i].book,
                        width,
                        height,
                        data[i].name + " / " + data[i].author,
                        gzirim,
                        customBook
                    );
                    x++;
                }

                /* results = await getCoordsForGzirim(results, data[i].book, !gzirim);

      //if (i > 0) doc.addPage();
      await addToPdf(
        doc,
        results,
        data[i].book,
        width,
        height,
        data[i].name + " / " + data[i].author,
        gzirim
      ); */
            }

            if (globalThis.SERVER_MODE == "online")
                window.open(doc.output("bloburl"));
            else {
                if (!customBook) {
                    let pdfName = "אוצר החכמה_" + pdfNum;
                    pdfNum++;
                    const blobData = doc.output("blob");
                    const urlFile = URL.createObjectURL(blobData);
                    let anchor = document.createElement("a");
                    anchor.download = pdfName;
                    anchor.href = urlFile;
                    anchor.click();
                    setTimeout(() => {
                        URL.revokeObjectURL(urlFile);
                    }, 0);
                } else {
                    saveBook();
                }
            }
            // doc.output("dataurlnewwindow");
            exporting = false;
            resolve(exporting);
        } catch (ex) {
            reject(ex);
        }
    });
}

async function addToPdf(
    pdfDoc,
    results,
    book,
    width,
    height,
    bookName,
    gzirim,
    customBook
) {
    let mTop = 10,
        mBottom = 40,
        mLeft = 10,
        mRight = 10;

    if (gzirim) {
        for (let i = 0; i < results.length; i++) {
            if (!exporting) break;
            !firstPage ? pdfDoc.addPage() : (firstPage = false);
            currentPage++;
            let result = results[i];
            //draw image
            store.state.progressWindow.percent += 5;
            if (store.state.progressWindow.percent > 100)
                store.state.progressWindow.percent = 0;
            let img;

            try {
                img = await getImageObject(
                    book,
                    result.pageId,
                    "",
                    true, {},
                    null,
                    result.pageId
                ); //third param means it is for printing
            } catch (ex) {
                // alert(ex);
            }

            let canv = drawGzir(img, result.coords, width);

            let size = getIdialImgSize(
                canv.width,
                canv.height,
                width - mRight - mLeft,
                height - mTop - mBottom
            );
            let center = (width - size.width) / 2;
            pdfDoc.addImage(
                canv,
                "PNG",
                center + mRight,
                currentTop,
                size.width,
                size.height,
                undefined,
                "FAST"
            );
            let text =
                bookName +
                " " +
                VueInst.$t("general.page") +
                " " +
                result.page +
                " } " +
                VueInst.$t(
                    `bookPrint.${
            VueInst.appMode.online() ? "printByWeb" : "printByOtzar"
          }`
                ) +
                " {";
            var dim = pdfDoc.getTextDimensions(text);
            pdfDoc.text(text.reverse(), 0, currentTop + canv.height + 8);
            pdfDoc.setLineWidth(0.2);
            pdfDoc.line(
                5,
                currentTop + canv.height + 13,
                width - 5,
                currentTop + canv.height + 13
            );

            currentTop += canv.height + 15;
            if (currentTop >= height - mBottom) {
                pdfDoc.addPage();
                currentTop = mTop;
            }
        }
    } else {
        let pages = Object.keys(results);

        for (let i = 0; i < pages.length; i++) {
            if (!customBook) !firstPage ? pdfDoc.addPage() : (firstPage = false);
            currentPage++;
            let page = pages[i];
            let coords = results[page].coords;
            //draw image
            let img;
            try {
                img = await getImageObject(book, page, "", true, {}, null, page); //third param means it is for printing
            } catch (ex) {
                //  alert(ex);
            }
            if (img == "") return;

            if (img == "") return;
            store.state.progressWindow.percent += 5;

            if (store.state.progressWindow.percent > 100) {
                store.state.progressWindow.hideProg = true;
                VueInst.$nextTick(() => {
                    store.state.progressWindow.percent = 0;
                    VueInst.$nextTick(() => {
                        store.state.progressWindow.hideProg = false;
                    });
                });
            }
            let pageImg = img.picture;

            let canvas = document.createElement("canvas");
            let canvasCtx = canvas.getContext("2d");
            // canvas.width = width - mLeft - mRight;
            // canvas.height = height - mTop - mBottom;
            canvas.width = pageImg.width - mLeft - mRight;
            canvas.height = pageImg.height - mTop - mBottom;
            let originWidth = img.width;
            let originHeight = img.height;

            let canvasWRatio = canvas.width / originWidth;
            let canvasHRatio = canvas.height / originHeight;

            let ow = img.imageMetaData.width || pageImg.width;
            let oh = img.imageMetaData.height || pageImg.height;

            if (img.imageMetaData.PDF) {
                oh *= 3000 / ow;
                ow = 3000;
            }
            pageImg.getContext("2d").globalCompositeOperation = "multiply";
            var rat = pageImg.width / ow;
            coords.forEach((c) => {
                pageImg.getContext("2d").fillStyle = "rgba(255,255,0)";
                pageImg
                    .getContext("2d")
                    .fillRect(c.left * rat, c.top * rat, c.width * rat, c.height * rat);
            });

            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

            canvasCtx.drawImage(
                pageImg,
                0,
                0,
                originWidth,
                originHeight,
                0,
                0,
                canvas.width,
                canvas.height
            );

            if (img.webP) {
                originHeight *= 3000 / originWidth;
                originWidth = 3000;

                canvasWRatio = canvas.width / originWidth;
                canvasHRatio = canvas.height / originHeight;
            }

            let size = getIdialImgSize(
                img.width,
                img.height,
                width - mRight - mLeft,
                height - mTop - mBottom
            );

            let center = (width - size.width) / 2;
            if (!customBook) {
                pdfDoc.addImage(
                    canvas,
                    "PNG",
                    center,
                    10,
                    size.width,
                    size.height,
                    undefined,
                    "FAST"
                );
                let text =
                    bookName +
                    " " +
                    VueInst.$t("general.page") +
                    " " +
                    results[page].page +
                    " } " +
                    VueInst.$t(
                        `bookPrint.${
              VueInst.appMode.online() ? "printByWeb" : "printByOtzar"
            }`
                    ) +
                    " {";

                pdfDoc.text(text.reverse(), 5, height - 12);
                pdfDoc.setLineWidth(0.2);
                pdfDoc.line(5, height - 22, width - 5, height - 22);
            } else {
                canvasCtx.textAlign = "right";
                canvasCtx.fillStyle = "black";
                canvasCtx.font = "16px Arial";
                canvasCtx.fillText(
                    bookName +
                    " " +
                    VueInst.$t("general.page") +
                    " " +
                    results[page].page,
                    canvas.width - 30,
                    canvas.height - 2
                );

                await createNewPage({
                    image: canvas.toDataURL(),
                    type: "image",
                    linkBook: book,
                    linkPage: results[page].pageSysId,
                    linkBookName: bookName,
                });
            }
        }
    }
}

function drawGzir(pageImg, coords, pageWidth, full = false) {
    let img = pageImg.picture;
    if (img == "") return;

    //get highest word
    let max = coords.reduce(function(prev, current) {
        return prev.top > current.top ? prev : current;
    });
    let canvas = document.createElement("canvas");
    let canvasCtx = canvas.getContext("2d");
    canvas.width = pageWidth - 10;
    let originWidth = img.width;
    let originHeight = img.height;

    let canvasWRatio = canvas.width / originWidth;
    let canvasFullHeight = originHeight * canvasWRatio;
    let canvasHRatio = canvasFullHeight / originHeight;

    let top = 0,
        ctop = 0;
    let height = originHeight;

    top = max.top;
    ctop = max.top - 100;
    height = canvas.height / canvasHRatio;

    if (pageImg.webP) {
        top *= originHeight / ((originHeight * 3000) / originWidth);
    }
    top -= 100;

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    canvasCtx.drawImage(
        img,
        0,
        top,
        originWidth,
        height,
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (pageImg.webP) {
        originHeight *= 3000 / originWidth;
        originWidth = 3000;

        canvasWRatio = canvas.width / originWidth;
        canvasFullHeight = originHeight * canvasWRatio;
        canvasHRatio = canvasFullHeight / originHeight;
    }
    canvasCtx.globalCompositeOperation = "multiply";
    coords.forEach((c) => {
        canvasCtx.fillStyle = "rgba(255,255,0)";
        canvasCtx.fillRect(
            c.left * canvasWRatio,
            (c.top - ctop) * canvasHRatio,
            c.width * canvasWRatio,
            c.height * canvasHRatio
        );
    });

    return canvas;
}

function resultsInGroups(fsResults, resultsLength) {
    let results = [];
    // if (this.dontLoadGzirim) return results;
    if (fsResults == undefined) return results;
    let numResults = Math.floor(fsResults.length / resultsLength);
    let tempArr = [];
    fsResults.forEach((g, i) => {
        if (i % numResults == 0) {
            if (tempArr.length > 0) {
                results.push(tempArr);
            }
            tempArr = [];
            tempArr.push(g);
        } else tempArr.push(g);
    });
    if (tempArr.length > 0) results.push(tempArr);

    return results;
}

export function stopExport() {
    exporting = false;
    currentPage = 0;
    store.state.progressWindow.topMessage = "הפעולה בעצירה";
}

//get words for gzirim from server
export function getGzirimData(id, start, end, numResults, bookId) {
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

//get page and coords of words for gzirim from server
export function getCoordsForGzirim(words, bookId, groupByPages = false) {
    return new Promise(function(resolve, reject) {
        let url =
            init.getServer() +
            init.BooksDB.freeSearch +
            init.BooksDB.gzirim +
            "/coords/" +
            JSON.stringify(words) +
            "/" +
            bookId;
        groupByPages ? (url += "?groupByPages=true") : (url += "");
        Axios.get(url).then((coords) => {
            resolve(coords.data);
        });
    });
}

export async function getSubjects(books) {
    let subjects = await getBookSubjects(books);
    if (subjects.data.length == 0) return "";
    let bookSubs = {};
    subjects.data.forEach((subs) => {
        let allSubjects = subs.categories;
        let mainSubjects = allSubjects.filter((cat) => cat.level == 1);
        let subStr = mainSubjects.map((sub) => sub.title);
        subStr = subStr.join(", ");
        bookSubs[subs.id] = subStr;
    });

    return bookSubs;
}

Object.assign(String.prototype, {
    reverse() {
        return this.split("").reverse().join("");
    },
});
const isHebrew = (text) => {
    return text.search(/[\u0590-\u05FF]/) >= 0;
};