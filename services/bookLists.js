import store from "@/store/store";
import {
    createPdf,
    stopCreatePdf
} from "./general.js";
import {
    deflate
} from "pako";
import VueInst from "@/main_app.js";
import {
    getSocket
} from "@/main_app";
import * as advLocalStorage from "localforage";
import {
    getAllBooksSubjects
} from "@/services/bookData.js";
let progTm = null;

function stopListExport() {
    const socket = getSocket();
    stopCreatePdf(socket);
    store.state.progressWindow.show = false;
    store.state.progressWindow.bottomMessage = "";
}
//print checked results from list
export async function printResultsList(
    type,
    closesdarot = false,
    list = "free"
) {
    store.state.progressWindow.title =
        type === "pdf" ?
        VueInst.$t("progressWindow.exportPDFBookList") :
        VueInst.$t("progressWindow.exportExcelBookList");

    store.state.progressWindow.topMessage = "טוען את רשימת הספרים";
    //store.state.progressWindow.bottomMessage = "אוסף נתונים...";
    store.state.progressWindow.stopFunc = stopListExport;
    store.state.progressWindow.show = true;
    VueInst.$nextTick(() => {
        let data;
        let search = "",
            filename = "";
        if (list == "free") {
            data = store.getters["freeSearchBookList/getBooksCheckedInfo"]();
            search = store.getters["freeSearchBookList/getFSListName"];
            search =
                search != "" ?
                search :
                store.getters["freeSearchBookList/getFinalTextSearch"];

            filename = VueInst.$t("fsresults.header") + " " + search;
        } else {
            search = store.getters["bookList/getNameListBook"];
            data = store.getters["bookList/getBooksCheckedInfo"](closesdarot);
            filename =
                VueInst.$t("exportResults.bookListResultsHeader") + " " + search;
        }

        filename = filename.replace(/[/\\?%*:|"<>]/g, "-");
        if (data.length === 0) {
            VueInst.$notify({
                type: "error",
                message: VueInst.$t("general.noBooks"),
                timeout: 2000,
            });
            store.state.progressWindow.show = false;
            return;
        }
        if (type == "excel") printResultsToExcel(data, search, filename, list);
        else if (type == "pdf") printResultsToPdf(data, search, filename, list);

        if (type == "excel") {
            VueInst.$notify({
                type: "success",
                message: VueInst.$t("general.successSavedList"), //רשימת הספרים נשמרה בהצלחה
                timeout: 2000,
            });
            store.state.progressWindow.show = false;
        }
    });
}

async function printResultsToExcel(data, search, filename, list = "free") {
    let endLine = "\r\n";
    //prepare string for excel
    let str = "";
    if (list == "free") {
        //freesearch list
        str = VueInst.$t("general.title") + endLine;

        str +=
            VueInst.$t("freeSearchResults.resultsSearchForWord") +
            search +
            endLine +
            endLine;
        str += VueInst.$t("freeSearchResults.nameBookAndNumResults") + endLine;
        data.forEach((d, i) => {
            store.state.progressWindow.topMessage = d.name + " / " + d.author;
            store.state.progressWindow.percent = (i / data.length) * 100;
            let bookName =
                '"' +
                d.name.replace(/"/g, '""') +
                " : " +
                d.author.replace(/"/g, '""') +
                '"' +
                "," +
                d.numResults.toString() +
                endLine;
            /*   d.numResults
                ? d.numResults.toString()
                : "" + endLine; */

            str += bookName;
        });
    } else {
        //get subjects
        let subjects = await advLocalStorage.getItem("booksSubjects");
        if (!subjects) {
            subjects = await getAllBooksSubjects();
            await advLocalStorage.setItem("booksSubjects", subjects);
        }

        data.forEach((d, i) => {
            d.subjects = subjects[d.book] || "";
        });

        let headers =
            "מספר ספר, שם ספר, שם מחבר, מקום הדפסה, שנת הדפסה, נושאים, קישור, LINK";
        str += headers + endLine;
        data.forEach((d, i) => {
            store.state.progressWindow.percent = (i / data.length) * 100;
            store.state.progressWindow.topMessage = d.name + " / " + d.author;
            // let subs = subjects[d.book] ? subjects[d.book] : "";
            let booklink = `CONCAT("https://tablet.otzar.org/",CHAR(35),"/book/${d.book}/p/-1/t/1/fs/0/start/0/end/0/c")`;
            if (d.name.includes("כרכים"))
                booklink = `CONCAT("https://tablet.otzar.org/",CHAR(35),"/exKotar/${d.book}")`;
            let link =
                `=HYPERLINK(${booklink}` + ',"' + d.name.replace(/"/g, '""""') + '")';

            let line =
                d.book +
                ',"' +
                d.name.replace(/"/g, '""') +
                '","' +
                d.author.replace(/"/g, '""') +
                '","' +
                d.places.replace(/"/g, '""') +
                '","' +
                d.years.replace(/"/g, '""') +
                '","' +
                d.subjects.replace(/"/g, '""') +
                '","' +
                link.replace(/"/g, '""') +
                '","=' +
                booklink.replace(/"/g, '""') +
                '"' +
                endLine;
            str += line;
        });
    }

    let anchor = document.createElement("a");
    anchor.download = filename + ".csv";

    anchor.href = "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(str);
    anchor.click();
    store.state.progressWindow.show = false;
}

function downloadAsHtml(html, fileName = "list.html") {
    const blob = new Blob([html], {
        type: "text/html"
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
}

function printResultsToPdf(books, search, filename, list = "free") {
    let htmlData = [];
    let sliceSize = 130000;
    for (let i = 0; i < books.length; i += sliceSize) {
        store.state.progressWindow.percent = Math.round((i / books.length) * 100);

        let str = `<html>
<head>
<meta http-equiv="Content-type" content="text/html; charset=utf-8" /><meta charset="UTF-8" />
</head>
<body>`;
        if (i == 0) {
            str += `<style>
table, th, td {
  border-bottom: 1px solid black;
  height:25px;
  font-size:18px;
}
caption{
     padding: 30px;
    font-size: 25px;
    font-weight: 600;
}
tr:nth-child(even){background-color: #f2f2f2;}
th , td{
  border: 1px solid #ddd;
  padding: 4px;
}
table {width:100%;}
</style><div style="direction:rtl"><table>
  <caption>${VueInst.$t("general.title")} - ${
        (list == "free"
          ? VueInst.$t("freeSearchResults.resultsSearchForWord")
          : VueInst.$t("exportResults.bookListResultsHeader")) +
        " - " +
        search
      }</caption>
        <tr><th></th><th>שם הספר</th><th>הרב המחבר</th><th>שנת הדפסה</th><th>מקום הדפסה</th></tr>`;
        }
        books.slice(i, i + sliceSize).forEach((d, index) => {
            str += `<tr><td>
         ${index + sliceSize * i + 1}. 
       </td><td>${d.name}</td><td>${d.author}</td><td>${d.years}</td><td>${
        d.places
      }</td></tr>`;
        });
        str += `</table>`;
        /*  if (i == 0)
          str +=
            '<h2 style="padding-right: 16px">' +
            VueInst.$t("general.title") +
            "</h2>" +
            '<h2 style="padding-right: 20px; border-bottom: 1px solid #d0d0d0">' +
            '<span style="color: rgb(99, 99, 99)">' +
            (list == "free"
              ? VueInst.$t("freeSearchResults.resultsSearchForWord")
              : VueInst.$t("exportResults.bookListResultsHeader")) +
            " ";
        search;

        "</span>" + "</h2>";
        str += "<ol style='list-style-type: none;'>";
        books.slice(i, i + sliceSize).forEach((d, index) => {
          str +=
            '<li style="font-size:16px;border-bottom: 1px solid #d0d0d0; padding: 5px">' +
            ' <span style="font-weight: bold">' +
            d.name +
            " / </span>";
          str +=
            d.author +
            (list == "free"
              ? d.numResults
                ? " (" + d.numResults + ")"
                : ""
              : "") +
            "</li>";
        });
        str += "</ol>"; */

        if (i == 0) str += "</div></BODY></HTML>";

        htmlData.push(str);

        i += sliceSize;
    }
    /*  if (window.location.host.includes("2.67")) {
      let html = htmlData.join("");
      downloadAsHtml(html);
    } */

    htmlData = deflate(JSON.stringify(htmlData), {
        to: "string",
    });
    store.state.progressWindow.topMessage = "מייצר קובץ, אנא המתן...";
    store.state.progressWindow.percent = 0;
    progTm = setTimeout(() => {
        progress();
    }, 500);
    const socket = getSocket();
    createPdf(socket, {
        data: htmlData
    });
}

function progress() {
    store.state.progressWindow.percent += 10;

    if (store.state.progressWindow.percent > 100) {
        store.state.progressWindow.hideProg = true;
        VueInst.$nextTick(() => {
            store.state.progressWindow.percent = 0;
            VueInst.$nextTick(() => {
                store.state.progressWindow.hideProg = false;
            });
        });
    }
    if (store.state.progressWindow.show) progTm = setTimeout(progress, 500);
}

export function stopExport() {
    clearTimeout(progTm);
    exporting = false;
}

export function stopProcessBar() {
    clearTimeout(progTm);
}

export const printPreview = (
    data,
    pdfName = "רשימת ספרים",
    print = false,
    type = "application/pdf",
    copies = 1
) => {
    if (!data) {
        VueInst.$notify({
            type: "error",
            message: print ?
                VueInst.$t("general.printError") :
                VueInst.$t("general.errorSavedList"),
            timeout: 2000,
        });
        return;
    }
    let blobURL;
    let blob = null;
    if (type == "URL") blobURL = data;
    else {
        blob = b64toBlob(data, type);
        blobURL = URL.createObjectURL(blob);
    }
    if (print) {
        let printWindow = window.open(blobURL);
        for (let i = 0; i < copies; i++) printWindow.print();
    } else {
        if (type == "URL" && globalThis.SERVER_MODE == "online") {
            let win = window.open(blobURL);
            if (!win) return "popupsNotAllowed";
        } else {
            let anchor = document.createElement("a");
            anchor.download = pdfName;
            anchor.href = blobURL;
            anchor.target = "_blank";
            anchor.click();
        }
    }
    if (type != "URL") {
        setTimeout(() => {
            URL.revokeObjectURL(blobURL);
        }, 0);
        blob = null;
    }
};

//method which converts base64 to binary
function decodeBase64WithNonBase64Characters(base64EncodedContent) {
    const CHUNK_SIZE = 512; // choose a chunk size that is divisible by 4
    const chunks = [];
    for (let i = 0; i < base64EncodedContent.length; i += CHUNK_SIZE) {
        chunks.push(base64EncodedContent.slice(i, i + CHUNK_SIZE));
    }
    const decodedChunks = chunks.map((chunk) => window.atob(chunk));
    return decodedChunks.join("");
}

const b64toBlob = (content, contentType) => {
    contentType = contentType || "";
    const sliceSize = 512;
    // method which converts base64 to binary
    const byteCharacters = decodeBase64WithNonBase64Characters(content);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {
        type: contentType,
    }); // statement which creates the blob
    return blob;
};