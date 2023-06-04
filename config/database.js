// import init from "@/config/init.js";
// const info = require("../../global.js");

const prod = false; //info.SERVER_MODE == "offline" ? false : true;
const allowAllIps = true;
let id = 0;
let port = location.port == "8080" ? 3000 : Number(location.port);
//only for online web
let host =
    prod || allowAllIps || location.host.includes("127.0.0") ?
    location.host.split(":")[0] :
    "127.0.0.2";
let postHost = "";
let http_prefix = location.protocol + "//";
const useMultiHosts = true;

// if (prod) {
//   host = "beta";
//   postHost = ".otzar.org";
//   http_prefix = "https://";
//   port = 443;
// }
// if (prod_dev) host = "app";
//port = 443;
//if (globalThis.SERVER_MODE== "offline") host = "work";
function setId() {
    id++;
    if (id >= 20) id = 1;
    return ""; //id;
}

function encrypt(key, plaintext) {
    let cyphertext = [];
    // Convert to hex to properly handle UTF8
    plaintext = Array.from(plaintext)
        .map(function(c) {
            if (c.charCodeAt(0) < 128)
                return c.charCodeAt(0).toString(16).padStart(2, "0");
            else return encodeURIComponent(c).replace(/\%/g, "").toLowerCase();
        })
        .join("");
    // Convert each hex to decimal
    plaintext = plaintext.match(/.{1,2}/g).map((x) => parseInt(x, 16));
    // Perform xor operation
    for (let i = 0; i < plaintext.length; i++) {
        cyphertext.push(plaintext[i] ^ key.charCodeAt(Math.floor(i % key.length)));
    }
    // Convert to hex
    cyphertext = cyphertext.map(function(x) {
        return x.toString(16).padStart(2, "0");
    });
    return cyphertext.join("");
}

// Super simple XOR decrypt function
function dc(key, cyphertext) {
    try {
        cyphertext = cyphertext.match(/.{1,2}/g).map((x) => parseInt(x, 16));
        let plaintext = [];
        for (let i = 0; i < cyphertext.length; i++) {
            plaintext.push(
                (cyphertext[i] ^ key.charCodeAt(Math.floor(i % key.length)))
                .toString(16)
                .padStart(2, "0")
            );
        }
        return decodeURIComponent(
            "%" +
            plaintext
            .join("")
            .match(/.{1,2}/g)
            .join("%")
        );
    } catch (e) {
        return false;
    }
}
let h = "42244016164d1b491e5856040d1217574049094b48574b14";
const data = {
    Host: host,
    Port: port,
    prod,
    Server: http_prefix + `${host + postHost}:${port}/`,
    ServerClean: http_prefix + `${host + postHost}/`,
    devClientServer: http_prefix + `${host + postHost}:8080/`,
    getServer(getFullProdAddr = false) {
        if (getFullProdAddr) return dc("*P4few4fj94hhf9843h9f89s", h);
        if (useMultiHosts)
            return (
                http_prefix + `${host + setId() + postHost}${port ? ":" + port : ""}/`
            );
        return http_prefix + `${host + postHost}${port ? ":" + port : ""}/`;
    },
    Forum: {
        topics: "api/forum",
    },
    BooksDB: {
        textBooks: "/txt",
        books: "api/books",
        /**@type {string} url - /bibliInfo  */
        bibliInfo: "/data/bibli",
        //reload booklist totally
        hardReload: "/hard-reload",
        //url get book in the request adding id
        book: "api/books/",
        userBook: "api/user/books",
        allData: "/data",
        pagesTable: "/table",
        compress: "/compress",
        pages: "/pages",
        page: "api/pages/",
        tsiyunim: "/tsiyunim",

        subjects: "/subjects",
        ocr: "/ocr",
        mareiMekomot: "/mmts",
        //url get request to get array of objects that has the "fake" ids of basic books and the "real" ids of the books
        //we use this to know what is the "real" bookid from basic books
        basicBooksIds: "api/categories/yesod",

        // urls of user's folder with the same path (to separate the names for the requests: POST, PATCH, DELETE)
        //url add folder
        userListAddFolder: "api/userlists",
        //url update folder
        userListUpdateFolder: "api/userlists",
        //url delete folder
        userListDeleteFolder: "api/userlists/",
        //url move folder
        userMoveFolder: "api/userlists/",
        //url get content in folder saved list in the request adding id
        getUserSavedList: "api/userlists/",
        //sending a GET request to the server to get a folder by user id
        userListGetFolders: "api/user/1/userlists",
        userFolderListAddBooks: "api/userlists/books",

        userFolderListDeleteBooks: "api/userlists/books/",
        wordAlt: "api/words/alternatives",
        FSwordAlt: "api/words/fs/alternatives",

        systemFoldersCategoriesType: "api/categorytypes",
        //url get system folder's books list in the request adding id
        systemFoldersBooksList: "api/categories/",

        systemFoldersMultipleBooksLists: "api/categories/subjects/filter",
        filter: "api/categories/filter",
        updateBook: "api/books/updates/last",
        updateWord: "api/words/updates/last",
        updateFSWord: "api/words/fs/updates/last",
        bookImages: "api/images",
        byPos: "/byPos",
        freeSearch: "api/freesearch",
        words: "/words",
        gzirim: "/gzirim",
        coords: "/coords",
        license: "api/license",
        noPrintBooks: "api/general/noPrintBooks",
        systemFonts: "api/general/fonts",
        createPdf: "api/general/createPdf",
    },
    UsersDB: {
        changePassword: "/changePassword",
        forgotPassword: "/forgotPassword",
        reset: "/reset",
        userBookDetails: "api/user/bookdetails",
        userReset: "api/user/factory-reset",
        recentBooks: "/recentbooks",
        favorites: "/favorites",
        /**@type {string} url - /api/user  */
        users: "api/user",
        settings: "/settings",
        login: "/login",
        logout: "/logout",
        tsiyuns: "/tsiyuns",
        altWords: "/altWords",
        book: "/book",
        userLists: "api/userlists",
        quickbutton: "/quickbutton",
        desktops: "/desktops",
        freeuser: "/freeuser",
        recent: "/recent",
        history: "api/history",
        historyType: "/type",
        personalComments: "/comments",
        personalKeys: "/maftechot",
        personalLinks: "/links",
        personalMarks: "/marks",
        sendEmail: "api/mail",
        customSorts: "api/customsorts",
        IP: "/ipUser",
        subUsers: "/subuser",
        permissions: "/permissions",
        /**@type {string} url - /pendingUser  */
        createPendingUser: "/pendingUser",
        /**@type {string} url - /createUserByGuid  */
        createUserByGuid: "/createUserByGuid",
        /**@type {string} url - /connectUser  */
        connectUser: "/connectUser",
        licenseInfo: "/license-info",
        actualizeDay: "/actualize-day",
        /**@type {string} url - /extraInfo  */
        extraInfo: "/extraInfo",
    },
    MefoDB: {
        shas: "api/mefo/shas",
        mefarshim: "api/mefo/mefarshim",
    },
    general: {
        openStore: "api/general/openOtzarStore",
        getofflineproducts: "api/general/getofflineproducts",
    },
};
export default data;