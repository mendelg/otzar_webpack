globalThis.CLIENT_SIDE = true;
// globalThis.testbooks = async () => {
//   let a = document.createElement("a");
//   const axios = require("./services/_axios");
//   const openBook = require("./services/bookData.js");
//   let books = require("./lst");
//   books = books.default;
//   let doneBooks = await axios.Axios.get("/api/general/dones-book");

//   doneBooks = doneBooks.data.split("\r\n");

//   doneBooks = doneBooks.map((a) => Number(a));
//   let bad = [85927, 85928, 85929, 85932];
//   books = books.filter((a) => {
//     if (bad.includes(a) || doneBooks.includes(a)) return false;
//     return true;
//   });

//   const scrollto = async () => {
//     try {
//       for (const book of books) {
//         openBook.openBook(book, 1);
//         await new Promise((r) => setTimeout(r, 6000));
//         await axios.Axios.get("/api/general/add-book?book=" + book);
//         await new Promise((r) => setTimeout(r, 1));
//         //save last book
//         try {
//           var container = document.querySelector(".scroller.wide-scroll");

//           var canvas = container.querySelector("canvas");
//           var url = canvas.toDataURL("image/jpeg");

//           a.href = url;
//           a.download = book + "-book.jpg";
//           a.click();
//         } catch (ex) {
//           console.error(ex);
//         }
//       }
//     } catch (ex) {
//       console.error(ex);
//     }
//   };
//   scrollto();
// };
function startMainApp() {
    const app = require("./main_app");
}

function startBootProcess() {
    const app = require("./main_boot");
}

function startServerWaiting() {
    const app = require("./main_net");
}

//override console.error and log for electron
function initLoggers() {
    try {
        if (!globalThis.ELECTRON_ENV) return;
        var _error = console.error;
        var _log = console.log;
        console.error = function(errMessage) {
            if (globalThis.ELECTRON_ENV)
                globalThis.LOG_EXCEPTION(errMessage, "client-side");
            _error.apply(console, arguments);
        };

        console.log = function(errMessage) {
            if (globalThis.ELECTRON_ENV)
                globalThis.LOG_ERROR(errMessage, "client-side");
            _log.apply(console, arguments);
        };
    } catch (ex) {
        console.log("error in init loggers");
        console.error(ex);
    }
}
initLoggers();

if (window.location.href.endsWith("startBootProcess")) startBootProcess();
else if (window.location.href.endsWith("startNetworkServerProcess"))
    startServerWaiting();
else {
    if (globalThis.ELECTRON_ENV)
        window.addEventListener("ready_ui", startMainApp, {
            capture: true
        });
    else startMainApp();
}