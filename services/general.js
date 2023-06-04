import {
    Axios
} from "./_axios";
import init from "@/config/init.js";
import * as advLocalStorage from "localforage";

let fonts;
export async function getSystemFonts() {
    let url = init.getServer() + init.BooksDB.systemFonts;
    fonts = await Axios.get(url);
}

export function systemFonts() {
    return fonts;
}

/** @returns {Buffer} */
export async function htmlToPng(html, width, height) {
    return Axios.post(
            init.getServer() + "api/general/htmlToPng/", {
                html,
                width,
                height
            }, {
                responseType: "arraybuffer"
            }
        )
        .then((response) => {
            let img = Buffer.from(response.data, "binary");
            return Promise.resolve(img);
        })
        .catch(function(error) {
            return Promise.reject(error);
        });
}

export async function createPdf(socket, data, filename = "") {
    socket.emit("createPdf", {
        data,
    });
}

export async function stopCreatePdf(socket) {
    socket.emit("stopCreatePdf", {});
}

export async function launchApp(app) {
    Axios.post(init.getServer() + "api/general/launchApp/", {
        app
    });
}

export async function getGimatriaMatches(words, options) {
    try {
        let matches = await Axios.post(`${init.getServer()}api/general/gimatria`, {
            words,
            options,
        });
        return matches.data;
    } catch (ex) {
        console.log(ex);
        return false;
    }
}

/* export async function clearLocalStorage() {
  await advLocalStorage.removeItem("inxBooks");
  await advLocalStorage.removeItem("books");

  localStorage.clear();
} */