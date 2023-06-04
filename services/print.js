import {
    getMultipleImages
} from "./bookData.js";
import init from "@/config/init.js";
import {
    Axios
} from "@/services/_axios";
import store from "@/store/store";
import Vue from "@/main_app.js";
import encrypt from "./encryption";
import ImageProccessor from "./ImageProccessor";
const {
    createMuPdf
} = require("@/utils/wasm_pdf/index.js");
const getjsPdf = () =>
    import ("jspdf");
let stopPrint = false;
let commentsPoints = [];
export function stopPrinting() {
    stopPrint = true;
}

function getComments(i, tabId, bookId) {
    commentsPoints = [];
    let comments = getCommentsOnPage(i, tabId, bookId);
    if (comments.length > 0) {
        let commentsStr = "";

        //sort comments from top to bottom and right to left
        /*   comments.sort((a, b) => {
          if (a.y > b.y) return 1;
          if (a.y < b.y) return -1;
          if (a.x > b.x) return -1;
          else return 1;
        }); */
        let lines = [];

        comments.forEach((comm, index) => {
            let str = ". " + comm.data.replace(/<\/p>/g, "&nbsp;</p>");
            lines.push(wrap_dir("ltr", String(index + 1)));
            lines.push(wrap_dir("rtl", str));

            commentsPoints.push({
                x: comm.x,
                y: comm.y
            });
            // commentsStr += str; //String(index + 1) + ". " + str.getHTMLText() + "  ";
        });
        commentsStr = lines.join(" ").getHTMLText();
        commentsStr = wrap_dir("rtl", commentsStr);

        return {
            comments,
            commentsStr
        };
    }
}

function wrap_dir(dir, str) {
    if (dir === "rtl") return "\u202B" + str + "\u202C";
    return "\u202A" + str + "\u202C";
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(" ");
    var line = "";

    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + " ";
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + " ";
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

//show print window
export function startPrint(tabId) {
    let book = store.state.tabs[tabId].book;
    let txtBook = store.state.tabs[tabId].txtBook;
    if (txtBook) {
        const params = [
            "height=" + (screen.height * 80) / 100,
            "width=" + (screen.width * 80) / 100,
        ].join(",");

        var mywindow = window.open("print.html#", "_blank", params);
        mywindow.moveTo(0, 0);
        mywindow.document.title = document.title + "_" + book;

        mywindow.onload = () => {
            let content = document.createElement("div");
            content.style.padding = "10px";
            content.innerHTML = document.getElementById("the-book" + tabId).innerHTML;
            let footer = document.createElement("div");
            footer.innerHTML = Vue.$t(
                `bookPrint.${Vue.appMode.online() ? "printByWeb" : "printByOtzar"}`
            );
            mywindow.document.body.appendChild(content);
            mywindow.document.body.appendChild(footer);
            mywindow.onafterprint = mywindow.close;
            mywindow.print();
        };

        return false;
    }
    if (allowedToPrint(book)) return true;
    else {
        const notification = {
            type: "error",
            message: Vue.$t("bookPrint.noPrintMsg"),
            timeout: 2000,
            setting: {
                grid: "icon",
                nameIcon: "icon-print",
                position: "center",
            },
        };
        Vue.$notify(notification);
        return false;
    }
}

//send socket to start printing
export async function sendPrintSocket({
    bookId,
    fromPage,
    toPage,
    pagesArr,
    bookName,
    header,
    wComments,
    wMarkers,
    tabId,
    pdf = false,
    socket,
    drawFs = true,
    printCode = "",
    copies = 1,
}) {
    if (!allowedToPrint(bookId)) return false;
    store.state.progressWindow.currentPage = 0;

    let subUserId = store.state.user.subUserId;
    let data = {
        bookId,
        fromPage,
        toPage,
        drawFs,
        pagesArr,
        bookName,
        header,
        wComments,
        wMarkers,
        tabId,
        pdf,
        printCode,
        subUserId,
        copies,
    };
    socket.emit("printBook", {
        data,
    });
}
export async function printImage(img) {
    let marginB = 5,
        mTop = 25,
        mBottom = 15,
        mLeft = 25,
        mRight = 25;
    let pdfName = "אוצר החכמה" + ".pdf";
    pdfName = pdfName.replace(/[/\\?%*:|"<>]/g, "-");
    let jsPDF = await getjsPdf();
    jsPDF = jsPDF.default;
    var doc = new jsPDF("p", "px", "a4", true, 16, 1.0, ["px_scaling"]);

    var pageWidth = doc.internal.pageSize.getWidth();
    var pageHeight = doc.internal.pageSize.getHeight();

    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    let imgRat = img.height / img.width;
    let clientWidth = Math.min(pageWidth - mLeft - mRight, img.width);
    let clientHeight = clientWidth * imgRat;

    let pageRat = (pageHeight - mTop) / clientWidth;

    if (imgRat > pageRat) {
        clientHeight = Math.min(pageHeight, img.height) - mTop;
        clientWidth = clientHeight / imgRat;
    }

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height);
    //DISABLE FOR TEST
    const oldOtzarPrinter = true;
    if (oldOtzarPrinter && globalThis.ELECTRON_ENV) {
        let pagesTable = Buffer.alloc(8 + 4);
        pagesTable.writeInt32LE(1, 0);
        pagesTable.writeInt32LE(0, 4);
        let imageBuffer = await ImageProccessor.canvasToBlob(canvas);
        imageBuffer = await imageBuffer.arrayBuffer();
        imageBuffer = new Uint8Array(imageBuffer);
        let imageLength = imageBuffer.length;
        const keys = [34534, 234462, 56434];
        encrypt(imageBuffer, keys, 150);
        pagesTable.writeInt32LE(imageLength, 8);
        imageBuffer = Buffer.concat([
            Buffer.from(pagesTable),
            Buffer.from(imageBuffer),
        ]);
        const blobData = new Blob([imageBuffer]);
        const urlFile = URL.createObjectURL(blobData);
        const filename = `p-${Date.now()}_1`;
        let anchor = document.createElement("a");
        anchor.download = filename + ".pf";
        anchor.href = urlFile;
        anchor.click();
        setTimeout(() => {
            URL.revokeObjectURL(urlFile);
        }, 0);
    } else {
        doc.addImage(
            canvas, //.toDataURL("image/jpeg", 1.0),
            "PNG",
            mLeft,
            mTop,
            clientWidth,
            clientHeight,
            "",
            "FAST"
        );

        let w = document.body.clientWidth * (80 / 100),
            h = document.body.clientHeight * (80 / 100);
        let left = document.body.clientWidth / 2 - w / 2;
        let top = document.body.clientHeight / 2 - h / 2;
        let options =
            "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
            `${w}, height=${h}, top=${top}, left=${left}`;

        let win = window.open(doc.output("bloburl"), pdfName, options);
        if (!win) return "popupsNotAllowed";
        else win.print();
    }
}

//print book to pdf
export async function printBook({
    bookId,
    fromPage,
    toPage,
    pagesArr,
    bookName,
    header,
    wComments,
    wMarkers,
    tabId,
    pdf = false,
    drawFs = true,
    results,
    small = false,
    copies = 1,
}) {
    const printToPrinterOfflineMode = globalThis.SERVER_MODE != "online" && !pdf;
    const printToPDFOfflineMode = globalThis.SERVER_MODE != "online" && pdf;

    let pdfimgs = [];

    let markers = [];

    if (wMarkers) {
        store.state.personalAdditionsTabs.personalAdditions[bookId];
        if (markers) markers = markers.markers;
    }

    let my = null;
    const byteArray = [112, 114, 105, 110, 116, 46, 104, 116, 109, 108];
    const bytesString = String.fromCharCode(...byteArray);
    if (printToPrinterOfflineMode) my = window.open(bytesString);

    const drawData = async function() {
        fromPage = Number(fromPage);
        toPage = Number(toPage);
        let imgList = [];
        store.state.progressWindow.numPages = toPage - fromPage + 1;
        let imagesBuffer = null;
        let numImages = toPage - fromPage + 1;
        let pagesTable = Buffer.alloc(numImages * 8 + 4);
        imgList.push(null);
        let pagesPos = 0;
        let pagesStart = 0;
        pagesTable.writeInt32LE(numImages, pagesPos);
        pagesPos += 4;

        let imgs = [];
        let img;
        let comments = "";
        let marginB = 5,
            mTop = 25,
            mBottom = 15,
            mLeft = 25,
            mRight = 25,
            footerHeight = 100;
        let pdfName =
            "אוצר החכמה_" +
            bookName +
            "_" +
            (fromPage === toPage ? fromPage : fromPage + "_" + toPage) +
            ".pdf";
        pdfName = pdfName.replace(/[/\\?%*:|"<>]/g, "-");

        let jsPDF = null,
            doc = null;

        if (printToPDFOfflineMode) {
            jsPDF = await getjsPdf();
            jsPDF = jsPDF.default;
            doc = new jsPDF("p", "px", "a4", true, 16, 1.0, ["px_scaling"]);
        }

        var pageWidth = printToPDFOfflineMode ?
            doc.internal.pageSize.getWidth() :
            446;
        var pageHeight = printToPDFOfflineMode ?
            doc.internal.pageSize.getHeight() :
            631;

        let printArea = {
            width: pageWidth - mRight - mLeft,
            height: pageHeight - mTop - mBottom,
        };

        let counter = 0;
        imgs = await getMultipleImages(
            results,
            bookId,
            "",
            printToPDFOfflineMode || printToPrinterOfflineMode ? true : false
        );

        store.state.progressWindow.currentPage = 0;
        for (let i = 0; i < imgs.length; i++) {
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            canvas.setAttribute("dir", "rtl");
            //ctx.textAlign = "right";
            ctx.font = "50px David";
            store.state.progressWindow.currentPage++;

            if (stopPrint) {
                stopPrint = false;
                return;
            }
            img = imgs[i];
            if (img.imageMetaData.error == true) continue;

            //get image
            try {
                /*  img = await getImageObject(bookId, pagesArr[i - 1].name, "", true, {
        zoom: 1000,
      }); */ //third param means it is for printing

                let originWidth = img.imageMetaData.width || img.width;
                let originHeight = img.imageMetaData.height || img.height;
                let webP = img.imageMetaData.PDF || false;

                await drawFsMarks(
                    img.picture,
                    pagesArr[i + fromPage - 1],
                    originWidth,
                    originHeight,
                    webP,
                    drawFs
                );

                await drawMarkers(
                    img.picture,
                    i + fromPage,
                    originWidth,
                    originHeight,
                    webP,
                    wMarkers,
                    markers
                );

                img = img.picture;

                //add stamps every third page

                if (counter % 3 === 0)
                    await ImageProccessor.addStamps(img, store.state.user.clientId || "");

                counter++;

                canvas.width = printArea.width * 6;
                canvas.height = printArea.height * 6;

                let imageArea = {
                    width: canvas.width,
                    height: canvas.height
                };
                let fontSize = canvas.width / 50;
                let commentsHeight = 0,
                    headerHeight = 0;
                if (header) {
                    headerHeight = fontSize + 50;
                    //canvas.height += headerHeight;
                    imageArea.height -= headerHeight;
                }

                //add place for footer
                imageArea.height -= footerHeight;
                //canvas.height += footerHeight;

                //add comments
                comments = [];
                let commentsStr = "";
                ctx.font = `${fontSize}px David`;
                if (wComments) {
                    let coms = getComments(i + parseInt(fromPage), tabId, bookId);
                    if (coms) {
                        comments = coms.comments;
                        commentsStr = coms.commentsStr;
                        let commentsWidth = ctx.measureText(commentsStr).width;
                        let lines = commentsWidth / canvas.width;
                        lines = Math.ceil(lines);
                        commentsHeight = lines * fontSize + 20;
                        //canvas.height += commentsHeight;
                        imageArea.height -= commentsHeight;
                    }
                }

                let marginLeft = 0;

                let imgCtx = img.getContext("2d");
                comments.forEach((comm, index) => {
                    let x = comm.x;
                    let y = comm.y;

                    imgCtx.font = "30px David";
                    imgCtx.fillText(String(index + 1), x, y);
                });

                let ratio = 1;
                let rat2 = img.width / originWidth;
                if (webP) {
                    ratio = originWidth / 3000;
                }

                ratio *= rat2;

                commentsPoints.forEach((c, i) => {
                    imgCtx.fillText(String(i + 1), c.x * ratio, c.y * ratio);
                });

                ctx.font = `${fontSize}px David`;
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                //draw line
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(0, canvas.height - commentsHeight + fontSize);
                ctx.lineTo(canvas.width, canvas.height - commentsHeight + fontSize);
                ctx.stroke();

                //draw comments
                ctx.textAlign = "right";
                ctx.fillStyle = "#000000";
                wrapText(
                    ctx,
                    commentsStr,
                    canvas.width - mRight,
                    canvas.height - commentsHeight - footerHeight + fontSize,
                    canvas.width - mRight - mLeft,
                    fontSize
                );

                ctx.font = `${fontSize}px David`;

                //add header
                if (header) {
                    ctx.textAlign = "right";
                    ctx.fillStyle = "#000000";
                    ctx.fillText(header, canvas.width - mRight, fontSize + 20);
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(0, fontSize + 40);
                    ctx.lineTo(canvas.width, fontSize + 40);
                    ctx.stroke();
                }
                //put page footer
                let footer = Vue.$t(
                    `bookPrint.${Vue.appMode.online() ? "printByWeb" : "printByOtzar"}`
                );
                let pageStr =
                    " (" + Vue.$t("general.page") + " " + (i + fromPage) + ")";
                let str = bookName + pageStr + " " + (store.state.user.clientId || "");

                ctx.textAlign = "right";
                ctx.fillText(str, canvas.width - mRight, canvas.height - 30);
                ctx.textAlign = "left";
                ctx.fillText(footer, 0, canvas.height - 30);

                //calculate image size
                let imageWidth = 0,
                    imageHeight = 0;
                let imageRat = img.height / img.width;
                if (img.width < imageArea.width) {
                    if (img.height > imageArea.height) {
                        imageHeight = imageArea.height;
                        imageWidth = imageHeight / imageRat;
                    } else {
                        if (img.width < 500) {
                            imageWidth = img.width;
                            imageHeight = img.height;
                        } else {
                            if (imageArea.width * imageRat > imageArea.height) {
                                imageHeight = imageArea.height;
                                imageWidth = imageHeight / imageRat;
                            } else {
                                imageWidth = imageArea.width;
                                imageHeight = imageWidth * imageRat;
                            }
                        }
                    }
                    marginLeft = (imageArea.width - imageWidth) / 2;
                } else {
                    if (imageArea.width * imageRat > imageArea.height) {
                        imageHeight = imageArea.height;
                        imageWidth = imageHeight / imageRat;
                    } else {
                        imageWidth = imageArea.width;
                        imageHeight = imageWidth * imageRat;
                    }
                    marginLeft = (imageArea.width - imageWidth) / 2;
                }

                ctx.drawImage(img, marginLeft, headerHeight, imageWidth, imageHeight);
                const newWay = true;
                if (newWay || pdf || globalThis.SERVER_MODE == "online") {
                    //exporting to PDF on client side is limited (currently to 20 pages )

                    if (printToPrinterOfflineMode) {
                        my.document.body.appendChild(canvas);
                    } else {
                        if (printToPDFOfflineMode && i > 0) doc.addPage();

                        let imageType = "JPG";
                        let image = null; // canvas.toDataURL("image/jpeg", 1.0);
                        const fn = async () => {
                            return new Promise((res, rej) => {
                                canvas.toBlob(function(blob) {
                                    const reader = new FileReader();
                                    reader.readAsArrayBuffer(blob);
                                    reader.onloadend = function() {
                                        const uint8Array = new Uint8Array(reader.result);
                                        // do something with the Uint8Array
                                        res(uint8Array);
                                    };
                                }, "image/png");
                            });
                        };
                        image = await fn();
                        if (small) {
                            imageType = "PNG";
                            image = canvas;
                        }

                        if (printToPDFOfflineMode)
                            doc.addImage(
                                image,
                                imageType,
                                mLeft,
                                mTop,
                                pageWidth - mLeft - mRight,
                                pageHeight - mTop * 2,
                                "",
                                "FAST"
                            );
                        else pdfimgs.push(image);
                    }
                } else {
                    let imageBuffer = await ImageProccessor.canvasToBlob(canvas);
                    imageBuffer = await imageBuffer.arrayBuffer();
                    imageBuffer = new Uint8Array(imageBuffer);
                    let imageLength = imageBuffer.length;
                    pagesTable.writeInt32LE(pagesStart, pagesPos);
                    pagesPos += 4;
                    pagesTable.writeInt32LE(imageLength, pagesPos);
                    pagesStart += imageLength;
                    pagesPos += 4;
                    const keys = [34534, 234462, 56434];
                    encrypt(imageBuffer, keys, 150);
                    imgList.push(Buffer.from(imageBuffer));
                }
            } catch (ex) {
                console.error("error getting page ", i, ex);
            }
        }
        //console.timeEnd("ii");
        if (stopPrint) {
            stopPrint = false;
            return;
        }

        if (globalThis.SERVER_MODE === "online") {
            let mupdf = await createMuPdf();
            globalThis.__v8_wasm_ofs.get_img = (id, page) => {
                let buff = pdfimgs.at(page);
                const size = Buffer.alloc(4);
                size.writeInt32LE(buff.byteLength, 0);
                const concatenatedArray = new Uint8Array(buff.length + size.length);

                concatenatedArray.set(size);
                concatenatedArray.set(buff, size.length);

                return concatenatedArray;
            };

            const printId = Math.floor(Math.random() * 1000) + 1;

            let pdfdata = await mupdf.createPdf(printId, pdfimgs.length);
            const uint8Array = pdfdata; // replace with your own Uint8Array

            const blob = new Blob([uint8Array.data], {
                type: pdf ? "application/octet-stream" : "application/pdf",
            }); // create a blob from the Uint8Array

            if (pdf) {
                let url = null;

                if (printToPDFOfflineMode) {
                    const blobData = doc.output("blob");
                    url = URL.createObjectURL(blobData);
                } else url = URL.createObjectURL(blob); // create a URL for the blob

                const link = document.createElement("a"); // create a link element
                link.href = url; // set the link's href attribute to the URL
                link.download = pdfName; // set the download filename
                link.click(); // simulate a click on the link to trigger the download
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                }, 0);
                link.remove();

                // const blobData = doc.output("blob");
                // const anchor = document.createElement("a");
                // const urlFile = URL.createObjectURL(blobData);
                // anchor.download = pdfName;
                // anchor.href = urlFile;
                // anchor.click();
                // setTimeout(() => {
                //   URL.revokeObjectURL(urlFile);
                // }, 0);
                // anchor.remove();
            } else {
                let w = document.body.clientWidth * (80 / 100),
                    h = document.body.clientHeight * (80 / 100);
                let left = document.body.clientWidth / 2 - w / 2;
                let top = document.body.clientHeight / 2 - h / 2;
                let options =
                    "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
                    `${w}, height=${h}, top=${top}, left=${left}`;
                let url = URL.createObjectURL(blob);
                // let win = window.open(doc.output("bloburl"), pdfName, options);
                let win = window.open(url, pdfName, options);

                // my.print();

                if (!win) {
                    return "popupsNotAllowed";
                } else win.print();
            }
        } else if (!pdf) {
            const printerOptions = {
                deviceName: globalThis._printer,
                copies: globalThis._printCopies,
            };
            delete globalThis._printCopies;
            delete globalThis._printer;
            const event = new CustomEvent("ready_to_print", {
                detail: {
                    printerOptions
                },
            });

            my.dispatchEvent(event);
            // my.print();
            // const blobData = doc.output("arraybuffer");
            // globalThis.SEND_PRINT_JOB({
            //   data: blobData,
            // });
            // URL.revokeObjectURL(url);
            // imgList[0] = Buffer.from(pagesTable);
            // let allData = Buffer.concat(imgList);
            // const blobData = new Blob([allData]);
            // const urlFile = URL.createObjectURL(blobData);
            // const filename = `p-${Date.now()}_${imgs.length}`;
            // let anchor = document.createElement("a");
            // anchor.download = filename + ".pf";
            // anchor.href = urlFile;
            // anchor.click();
            // setTimeout(() => {
            //   URL.revokeObjectURL(urlFile);
            // }, 0);
        } else {
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
    };

    if (printToPrinterOfflineMode) my.onload = drawData;
    else await drawData();
    return;
}

function openInWindow(data, winTitle, options) {
    var win = open("", winTitle, options),
        iframe = document.createElement("iframe"),
        title = document.createElement("title");
    // file = new Blob([data], { type: 'application/pdf' }),
    // fileUrl = URL.createObjectURL(file);

    title.appendChild(document.createTextNode(winTitle));

    iframe.src = data;
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.style.border = "none";

    win.document.head.appendChild(title);
    win.document.body.appendChild(iframe);
    win.document.body.style.margin = 0;
}

export function getIdialImgSize(imgWidth, imgHeight, pageWidth, pageHeight) {
    let imgRat = imgHeight / imgWidth;
    let pageRat = pageHeight / pageWidth;

    if (pageRat >= imgRat)
        return {
            width: pageWidth,
            height: imgHeight * (pageWidth / imgWidth)
        };
    else
        return {
            height: pageHeight,
            width: imgWidth * (pageHeight / imgHeight)
        };
}

function getCommentsOnPage(page, tabId, bookId) {
    if (tabId == null) tabId = store.state.tabsManager.currentTabId;
    let pages = store.getters[`tabs/${tabId}/getPages`];
    let pageId = pages[page - 1].id;

    let c =
        store.getters[`personalAdditionsTabs/getPersonalAdditions`][bookId]
        .comments;

    return !c ? [] : c.filter((com) => com.pageId == pageId);
}

export function allowedToPrint(book) {
    let a =
        init.BooksData.noPrintBooks.includes(book.toString()) ||
        init.BooksData.noPrintBooks.length == 0 ?
        false :
        true;
    return a;
}

export function getUserPrintInfo(bookId, printCode) {
    return Axios.get(`/api/user/print/${bookId}/${printCode}`)
        .then((e) => {
            return Promise.resolve(e.data);
        })
        .catch((err) => {
            console.error(err);
            return Promise.reject(err);
        });
}

export function getPrintCodeLeft(printCode) {
    return Axios.get(`/api/user/printcode/${printCode}`)
        .then((e) => {
            return Promise.resolve(e.data);
        })
        .catch((err) => {
            console.error(err);
            return Promise.reject(err);
        });
}

async function drawMarkers(
    img,
    pageId,
    originWidth,
    originHeight,
    webP,
    wMarkers,
    markers
) {
    if (!wMarkers) return;
    let ctx1 = img.getContext("2d");
    let pageMarkers = markers ? markers.filter((m) => m.position == pageId) : [];

    let ratio = 1;
    let rat2 = img.width / originWidth;
    if (webP) {
        ratio = originWidth / 3000;
    }

    for (let p of pageMarkers) {
        let x = parseInt(p.x * ratio * rat2);
        let y = parseInt(p.y * ratio) * rat2;
        let w = parseInt(p.width * ratio * rat2);
        let h = parseInt(p.height * ratio * rat2);

        ctx1.beginPath();
        ctx1.rect(x, y, w, h);
        ctx1.stroke();
    }
}

async function drawFsMarks(img, page, originWidth, originHeight, webP, drawFs) {
    if (!page.words || !drawFs) return;
    /* let originWidth = this.origWidth;
  let originHeight = this.origHeight;

  let ratio = this.imgWidth / originWidth;
  if (this.$refs.img) {
    ratio = this.$refs.img.height / img.height;
  }
*/
    //draw freesearch marks
    let ctx = img.getContext("2d");
    //ctx.globalCompositeOperation = "xor";
    try {
        let coords = await store.getters["tabsManager/getWordsCoords"](page, webP);
        if (coords == "") return;

        let fsDraw = getCanvasCoords(
            originWidth,
            originHeight,
            coords[0],
            img,
            webP
        );

        fsDraw.forEach((fs, i) => {
            // ctx.fillStyle = "rgba(255, 255, 35, 0.32)";
            //ctx.fillStyle = "green";
            /*   ctx.lineWidth = "1";
            ctx.strokeStyle = "black";
            ctx.beginPath();
            ctx.rect(fs.x - 2, fs.y - 2, fs.w + 4, fs.h + 4);
            ctx.stroke(); */

            drawRect(ctx, fs.x - 8, fs.y - 8, fs.w + 16, fs.h + 16);
        });
        // ctx.globalCompositeOperation = "source-over";
    } catch (ex) {
        console.error(ex);
        return "";
    }
}

function getCanvasCoords(imgWidth, imgHeight, coords, img, webP) {
    try {
        let ratio = 1;
        let rat2 = img.width / imgWidth;
        if (webP) {
            ratio = imgWidth / 3000;
            //imH = (imgHeight * 3000) / imgWidth;
            // imW = 3000;
        }
        let _this = this;
        return coords.map((coord) => ({
            x: parseInt(coord.left * ratio * rat2), // * (_this.actualW / imW)) + _this.paddingLeft,
            y: parseInt(coord.top * ratio) * rat2, // * (_this.actualH / imH)),
            w: parseInt(coord.width * ratio * rat2), // * (_this.actualW / imW)),
            h: parseInt(coord.height * ratio * rat2), //* (_this.actualH / imH)),
        }));
    } catch (ex) {
        console.log(ex);
        return [];
    }
}

function drawRect(ctx, x, y, w, h) {
    ctx.fillStyle = "rgb(220,220,220, 0.3)";
    ctx.fillRect(x, y, w, h);
}

Object.assign(String.prototype, {
    reverse() {
        return this.split("").reverse().join("");
    },
});

Object.assign(String.prototype, {
    getHTMLText() {
        var element = document.createElement("p");
        element.innerHTML = this;
        var text = element.innerText || element.textContent;
        return text;
    },
});