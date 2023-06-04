import {
    inflate
} from "pako";
import * as altWordHelper from "@/helper/altWordHelper.js";
import init from "@/config/init.js";
import VueInst from "@/main_app.js";
import config from "@/config/general.js";
// import convertFromOtzarCode from "../../utils/hebDecompress";
import * as loadBooksDataFromServer from "@/services/loadBooksDataFromServer.js";
import * as userBooksData from "@/services/userBooksData.js";
import * as bookData from "@/services/bookData.js";
import * as systemFolders from "@/store/modules/systemFolders.js";
import * as userFolders from "@/store/modules/userFolders.js";
import * as userSettingsData from "@/services/userSettingsData.js";
import AVLTree from "../../utils/avl";
import bookszip from "../../utils/bookzip";
import bookzip from "../../utils/bookzip";
import * as advLocalStorage from "localforage";
import {
    Axios
} from "@/services/_axios";
import indexer from "../../utils/indexer";
import Vue from "vue";

export let bookListSortedByAuthor = [];
export let bookListSortedByYear = [];
let onlyNoBt = new Set();
const bookAuthors = (book) => {
    let authlen = book.authors_length;
    let ret = [];
    for (let i = 0; i < authlen; i++) {
        const name = book[`authors_${i}_name`];
        ret.push(name);
    }
    return ret;
};

function arrayCompare(_arr1, _arr2) {
    if (!Array.isArray(_arr1) ||
        !Array.isArray(_arr2) ||
        _arr1.length !== _arr2.length
    ) {
        return false;
    }

    // .concat() to not mutate arguments
    const arr1 = _arr1.concat().sort();
    const arr2 = _arr2.concat().sort();

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
}

export let treeBooks = new AVLTree();
export let fullTreeBooks = new AVLTree();
export let treeBooksNA = new AVLTree();
// let idLst=new AVLTree();
export const namespaced = true;

export let lastTxtSearch = "";

// let bookArrayBuf = null;
let booksCompressStartIn = 0;
let booksCompress = null;
let booksCompressNA = null;
export const inxData = null;
let allStrs = "";
let allStrsNA = "";
export let fullBooks = [];
export let basicBooks = [];

export let books = [];
export let booksNA = [];
export let hiddenChanges = 0;

export const state = {
    //set last date of update from server
    lastUpdateProgress: Date,
    //system ids: folders ids and the books ids
    systemBasicBooksIds: [],
    //array of just the basic books ids
    basicBooksIds: [],
    //book updated to truck the updated books (vuex listen to the state for changes)
    booksHideOrShowChanged: 0,
    booksUpdated: 0,
    isActiveStore: false,
    activeStore: {
        title: "",
        id: 0,
        type: "", //system , multiple , user
        isRegStore: false,
    },
    idBook: "",
    arrBooks: "",
    needUpdate: false,
    visitedPages: {},
};
//mutations
export const mutations = {
    //set books
    SET_BOOKS(state, payload) {
        console.log("start decompressing");
        let bookArrayBuf = payload.bin.buffer;
        booksCompress = new DataView(bookArrayBuf);

        let dataSize = booksCompress.getInt32(0, true);
        let tableSize = booksCompress.getInt32(4, true);
        let wordsize = booksCompress.getInt32(8, true);
        let tablStartAt = dataSize + 12;
        let tableEndAt = dataSize + 12 + tableSize;
        let tablePointer = tablStartAt;
        //
        treeBooks = new AVLTree();
        let counter = 0;
        books = [];

        console.time("books");

        //if we already have the bks object then just load them
        let booksOriginal = payload.bk_originals;

        if (booksOriginal && booksOriginal.length) {
            booksOriginal.forEach((book) => {
                let bk = createProxy(book);
                treeBooks.root = treeBooks.insert(treeBooks.root, book.id, bk);
                books[counter] = bk;
                counter++;
            });
        } else {
            payload.rootState.loader.slowLoading = true;
            booksOriginal = [];
            while (tablePointer < tableEndAt) {
                let bookid = booksCompress.getInt32(tablePointer, true);
                tablePointer += 4;
                let location = booksCompress.getInt32(tablePointer, true);
                tablePointer += 4;

                // let bk = getBookbyLocation(location + 12, bookArrayBuf);
                let bkOriginal = getDecompressBk(location + 12, bookArrayBuf);
                booksOriginal.push(bkOriginal);
                let bk = createProxy(bkOriginal);
                treeBooks.root = treeBooks.insert(treeBooks.root, bookid, bk);
                books[counter] = bk;
                counter++;
            }
            advLocalStorage.setItem("bk_originals", booksOriginal);
            // advLocalStorage.setItem("avltree_bks", treeBooks);
        }

        console.timeEnd("books");
        console.time("books string");
        console.log("start string handler");
        let strView = new DataView(bookArrayBuf, 12 + dataSize + tableSize);
        let txtDecode = new TextDecoder();
        allStrs = txtDecode.decode(strView);
        strView = null;
        txtDecode = null;
        bookArrayBuf = null;
        booksCompress = null;
        console.timeEnd("books string");
        console.time("sort");

        //set basic books position

        state.basicBooksIds.forEach((b, i) => {
            let book = treeBooks.get(treeBooks.root, b);
            if (book) book.SYPos = i + 1;
        });

        //prepare cached sorted lists
        console.log("start sorting");
        let bkNameSort = new Array(books.length);
        let bkAuthSort = new Array(books.length);
        let bkYearSort = new Array(books.length);
        books.forEach((b) => {
            bkNameSort[b.nameSort] = b;
            bkAuthSort[b.authorSort] = b;
            bkYearSort[b.pubYearValue] = b;
        });

        //remove empty elements
        books = bkNameSort.filter(function(el) {
            return el != null;
        });
        bookListSortedByAuthor = bkAuthSort.filter(function(el) {
            return el != null;
        });
        bookListSortedByYear = bkYearSort.filter(function(el) {
            return el != null;
        });

        console.timeEnd("sort");
        console.log("done decomporess & sort");
        //
        // books.forEach((e) => {
        //   // treeBooks.set(e.id, e);
        //   treeBooks.root = treeBooks.insert(treeBooks.root, e.id, e);
        // });
        // state.booksUpdated++;

        //now do the same for NA books
        console.log("start decompressing NA");
        let bookArrayBufNA = payload.binNA.buffer;
        booksCompressNA = new DataView(bookArrayBufNA);

        dataSize = booksCompressNA.getInt32(0, true);
        tableSize = booksCompressNA.getInt32(4, true);
        wordsize = booksCompressNA.getInt32(8, true);
        tablStartAt = dataSize + 12;
        tableEndAt = dataSize + 12 + tableSize;
        tablePointer = tablStartAt;
        //
        treeBooksNA = new AVLTree();
        counter = 0;
        booksNA = [];

        console.time("books NA");

        //if we already have the bks object then just load them
        let booksOriginalNA = payload.bk_originalsNA;
        if (booksOriginalNA && booksOriginalNA.length) {
            booksOriginalNA.forEach((book) => {
                let bk = createProxy(book);
                treeBooksNA.root = treeBooksNA.insert(treeBooksNA.root, book.id, bk);
                booksNA[counter] = bk;
                counter++;
            });
        } else {
            payload.rootState.loader.slowLoading = true;
            booksOriginalNA = [];
            while (tablePointer < tableEndAt) {
                let bookid = booksCompressNA.getInt32(tablePointer, true);
                tablePointer += 4;
                let location = booksCompressNA.getInt32(tablePointer, true);
                tablePointer += 4;

                // let bk = getBookbyLocation(location + 12, bookArrayBuf);
                let bkOriginal = getDecompressBk(location + 12, bookArrayBufNA);
                booksOriginalNA.push(bkOriginal);
                let bk = createProxy(bkOriginal);
                treeBooksNA.root = treeBooksNA.insert(treeBooksNA.root, bookid, bk);
                booksNA[counter] = bk;
                counter++;
            }
            advLocalStorage.setItem("bk_originals_NA", booksOriginalNA);
            // advLocalStorage.setItem("avltree_bks", treeBooks);
        }

        console.timeEnd("books NA");
        console.time("books string NA");
        console.log("start string handler");
        let strViewNA = new DataView(bookArrayBufNA, 12 + dataSize + tableSize);
        let txtDecodeNA = new TextDecoder();
        allStrsNA = txtDecodeNA.decode(strViewNA);
        strViewNA = null;
        txtDecodeNA = null;
        bookArrayBufNA = null;
        booksCompressNA = null;
        console.timeEnd("books string NA");
    },
    SET_ID_TO(state, txtId) {
        state.idBook = txtId;
    },
    //set last books apdate
    //param:update
    SET_LAST_BOOKS_UPDATE(state, update) {
        state.lastUpdateProgress = update;
    },
    SET_BOOK_DATA(state, book) {
        //treeBooks.get(bookid) = book;
        // treeBooks.set(book.id, book, true);
        treeBooks.insert(treeBooks.root, book.id, book);
    },
    RESET_BOOK_DATA(state, book) {
        //treeBooks.get(bookid) = book;
        // treeBooks.set(book.id, book, true);
        //treeBooks.root = treeBooks.insert(treeBooks.root, book.id, book);
        userBooksData.deletUserBookDetails(book.id);
    },
    SET_BOOK_DETAILS(state, book) {
        userBooksData.setBookOriginalDetails(book);
    },
    //setActiveStoreTitle
    SET_ACTIVE_STORE_DATA(state, activeStoreData) {
        state.activeStore.id = activeStoreData.id;
        state.activeStore.type = activeStoreData.type;
        state.activeStore.isRegStore = activeStoreData.isRegStore;
    },
    SET_VISITED_PAGE(state, {
        book,
        page
    }) {
        let b = state.visitedPages[book] || [];
        if (!b.includes(page)) Vue.set(state.visitedPages, book, [...b, page]);
    },
};
//actions
export const actions = {
    setVisitedPage({
        commit
    }, {
        book,
        page
    }) {
        commit("SET_VISITED_PAGE", {
            book,
            page
        });
    },
    setHiddenBooks({
        rootState,
        dispatch
    }, list) {
        if (list === undefined) {
            //set hidden books from settings
            list = VueInst.userSettings.settings.hiddenBooks ?
                VueInst.userSettings.settings.hiddenBooks :
                [];
            if (typeof list == "string") list = JSON.parse(list);
            else list = [];
        }
        list.forEach((id) => {
            let b = treeBooks.get(treeBooks.root, Number(id));
            if (b) b._hide = 1;
        });
        rootState.booksChanged++;
        dispatch("bookList/setShowHide", true, {
            root: true,
        });
        dispatch(
            "bookList/checkBooks", {
                check: false,
                books: list
            }, {
                root: true,
            }
        );
    },
    unsetHiddenBooks({
        rootState,
        dispatch
    }, list) {
        list.forEach((id) => {
            let b = treeBooks.get(treeBooks.root, Number(id));
            if (b) b._hide = 0;
        });
        rootState.booksChanged++;
        dispatch("bookList/setShowHide", true, {
            root: true,
        });
        dispatch("bookList/refreshHiddenList", true, {
            root: true,
        });
    },
    hideBooks({
        rootState,
        dispatch
    }) {
        books.forEach((b) => {
            if (b._inHide) b._hide = 1;
        });
        rootState.booksChanged++;
        dispatch("bookList/setShowHide", false, {
            root: true,
        });
    },
    resetHiddenBooks({
        rootState,
        dispatch
    }) {
        books.forEach((b) => {
            if (b._inHide) b._hide = 0;
        });
        rootState.booksChanged++;
        dispatch("bookList/setShowHide", true, {
            root: true,
        });
    },
    async setBookDetails({
        commit
    }, bookDetails) {
        let changeBookDetails = {
            bookId: bookDetails.bookId,
            modifications: {},
        };
        let book = treeBooks.get(treeBooks.root, bookDetails.bookId);

        function clon(val) {
            return JSON.parse(JSON.stringify(val));
        }

        let originData = {
            name: book.name,
            fromyear: clon(book.fromyear),
            places: clon(book.places),
        };

        if (bookDetails.modifications.add_name.length != book.addnames_length)
            changeBookDetails.modifications.add_name =
            bookDetails.modifications.add_name;
        else {
            let tempAddNameArray = [];
            for (let i = 0; i < book.addnames_length; i++) {
                tempAddNameArray.push(clon(book[`addnames_${i}_name`]));
            }
            if (!arrayCompare(bookDetails.modifications.add_name, tempAddNameArray)) {
                changeBookDetails.modifications.add_name =
                    bookDetails.modifications.add_name;
            }
        }

        if (bookDetails.modifications.add_author.length != book.authors_length - 1)
            changeBookDetails.modifications.add_author =
            bookDetails.modifications.add_author;
        else {
            let tempAddAuthorArray = [];
            for (let i = 1; i < book.authors_length; i++) {
                tempAddAuthorArray.push(clon(book[`authors_${i}_name`]));
            }
            if (!arrayCompare(bookDetails.modifications.add_name, tempAddAuthorArray)) {
                changeBookDetails.modifications.add_author =
                    bookDetails.modifications.add_author;
            }
        }

        if (
            book.name !== bookDetails.modifications.name &&
            bookDetails.modifications.name !== ""
        ) {
            changeBookDetails.modifications.name = bookDetails.modifications.name;
        }
        if (
            book.authors_0_name !== bookDetails.modifications.author &&
            bookDetails.modifications.author !== ""
        ) {
            changeBookDetails.modifications.author = bookDetails.modifications.author;
        }
        if (
            book.fromyear !== bookDetails.modifications.year &&
            bookDetails.modifications.year !== ""
        ) {
            changeBookDetails.modifications.year = bookDetails.modifications.year;
        }
        if (
            book.places !== bookDetails.modifications.place &&
            bookDetails.modifications.place !== ""
        ) {
            changeBookDetails.modifications.place = bookDetails.modifications.place;
        }

        //avoid save to server when fnction called from "loadBooksToMemory" function
        if (!bookDetails.loadedFromServer) {
            commit("SET_BOOK_DETAILS", changeBookDetails);
        }
        commit("SET_BOOK_DATA", book);
    },
    setBookData({
        commit
    }, book) {
        commit("SET_BOOK_DATA", book);
    },
    resetBookData({
        commit
    }, book) {
        commit("RESET_BOOK_DATA", book);
    },
    async removeNBT({
        rootState
    }) {
        if (!books.length) return;
        if (globalThis.SERVER_MODE == "online") {
            const noBt =
                (rootState.user.permissions & config.licensePackages.NO_BT) ==
                config.licensePackages.NO_BT || rootState.user.permissions == 0;
            let listToRemove = await Axios.get("/api/books/nbt");
            if (listToRemove.data) {
                listToRemove = new Set(listToRemove.data);
                books
                    .filter((a) => listToRemove.has(a.id))
                    .forEach((a) => onlyNoBt.add({
                        id: a.id,
                        bk: a
                    }));
            }

            if (noBt) {
                //add
                let onlyNoBtArr = [...onlyNoBt];
                books = books.concat(onlyNoBtArr.map((a) => a.bk));
                books = [...new Set(books)];
                onlyNoBt.forEach((bkData) => {
                    treeBooks.root.set(bkData.id.toString(), bkData.bk);
                });
            } else {
                let onlyNoBtArr = [...onlyNoBt];
                let onlyNoBtIds = new Set(onlyNoBtArr.map((a) => a.id));
                books = books.filter((a) => !onlyNoBtIds.has(a.id));

                onlyNoBt.forEach((bkData) => {
                    treeBooks.root.delete(bkData.id.toString());
                });
            }
            rootState.triggerBooksGetter++;
        }
    },
    //call the mutation SET_BOOKS
    async setBooks({
        commit,
        dispatch,
        rootState
    }, {
        uncompressData,
        uncompressDataNA
    }) {
        const bks = await advLocalStorage.getItem("bk_originals");
        const avl_bks = await advLocalStorage.getItem("avltree_bks");

        const bksNA = await advLocalStorage.getItem("bk_originals_NA");
        const avl_bksNA = await advLocalStorage.getItem("avltree_bks_NA");

        const payload = {
            bin: uncompressData,
            binNA: uncompressDataNA,
            bk_originals: bks,
            avl_bks,
            bk_originalsNA: bksNA,
            avl_bksNA,
            rootState,
        };
        commit("SET_BOOKS", payload);
        await dispatch("removeNBT");
        //build the index
        if (globalThis.DEV_CREATE_SEARCH_BOOKS_INDEX) {
            dispatch("bookList/createIndex", uncompressData, {
                root: true,
            });
        }
    },

    //call the mutation SET_ID_TO
    setIdTo({
        commit
    }, txtId) {
        commit("SET_ID_TO", txtId);
    },
    //call the mutation SET_ARR_TO
    setArrTo({
        commit
    }, array) {
        commit("SET_ARR_TO", array);
    },
    //call the mutation SET_LAST_BOOKS_UPDATE
    //param:update
    setLastBooksUpdate({
        commit
    }, update) {
        commit("SET_LAST_BOOKS_UPDATE", update);
    },
    //load data when the page is up, calls the actions:
    //-loadBooksToMemory
    //-loadWordAltTomemory
    //-loadBasicBooksTomemory
    loadBooksAndOthers({
        dispatch
    }) {
        let promise = new Promise(async (resolve, reject) => {
            if (!window._mobile) {}
            if (globalThis.DEV_LOAD_BOOKS) await dispatch("loadBooksToMemory");
            await dispatch("loadWordAltTomemory");
            await dispatch("loadFSWordAltTomemory");
            if (!window._mobile) await dispatch("loadBasicBooksTomemory");

            await loadIndexData();

            resolve();
        });
        return promise;
    },
    async loadIndexData(loadToMem = false) {
        return loadIndexData(loadToMem);
    },
    freeIndexMemory() {
        return freeIndexMemory();
    },
    //load all books data
    async loadBooksToMemory({
        dispatch,
        rootState
    }) {
        // //load first user books
        //  let userBooks = await getUserBooks();
        //checks for update from server
        let update = await altWordHelper.checkForBooksUpdate();
        //store the compress books data in localStorage by the var' "books"
        // let compressData = null;
        let uncompressData = null;
        let uncompressDataNA = null;

        // if (globalThis.DEV_COMPRESS_HEBREW && globalThis.DEV_COMPRESS)
        // alert("c");

        if (!update) {
            uncompressData = await advLocalStorage.getItem("books_decompressed");
            uncompressDataNA = await advLocalStorage.getItem("books_decompressed_NA");
            // compressData = await advLocalStorage.getItem("books");
        }
        //if there is update

        if (
            globalThis._NEEDSREFRESH ||
            update ||
            !uncompressData ||
            !uncompressDataNA
        ) {
            rootState.loader.slowLoading = true;
            //fetch the updated books from server
            try {
                await advLocalStorage.removeItem("inxBooks");
                await advLocalStorage.removeItem("books");
                await advLocalStorage.removeItem("bk_originals");
                await advLocalStorage.removeItem("books_decompressed");
                await advLocalStorage.removeItem("inxBooksNA");

                await advLocalStorage.removeItem("bk_originals_NA");
                await advLocalStorage.removeItem("books_decompressed_NA");

                let compressData, compressDataNA;
                compressData = await loadBooksDataFromServer.fetchBooks();
                let NABooks = true;
                compressDataNA = await loadBooksDataFromServer.fetchBooks(NABooks);

                /* 
                better way !!!!!
                const data = await loadBooksDataFromServer.fetchBooksBoth();
                compressData = data.booksData;
                compressDataNA = data.booksDataNA; //await loadBooksDataFromServer.fetchBooks(NABooks);
                */

                loadBooksDataFromServer.booksUpdated();
                // if (globalThis.DEV_COMPRESS_HEBREW && globalThis.DEV_COMPRESS) {
                // localStorage.setItem("books", compressData);

                uncompressData = inflate(compressData);
                uncompressDataNA = inflate(compressDataNA);
                // advLocalStorage.setItem("books", compressData);
                advLocalStorage.setItem("books_decompressed", uncompressData);
                advLocalStorage.setItem("books_decompressed_NA", uncompressDataNA);
                compressData = null;
                compressDataNA = null;

                if (globalThis.SET_NEEDSREFRESH) globalThis.SET_NEEDSREFRESH(false);
            } catch (error) {
                throw error;
            }
        }
        console.log("start decompressing bin data");
        //uncompress books data
        //  uncompressData = compressData;
        // if (globalThis.DEV_COMPRESS) {

        // uncompressData = inflate(compressData);

        // alert(t1 - t0);
        // }
        // compressData = null;
        //decode otzarcode
        //  if (globalThis.DEV_COMPRESS_HEBREW)
        //    uncompressData = convertFromOtzarCode(uncompressData);

        //  if (globalThis.DEV_COMPRESS) uncompressData = JSON.parse(uncompressData);
        //maybe for dev
        // let uncompressData = window.allbooks;

        advLocalStorage.setItem("books_decompressed_NA", uncompressDataNA);
        dispatch("setBooks", {
            uncompressData,
            uncompressDataNA
        });

        await loadBooksDataFromServer.fetchNPBooks();

        //if user license is chabad set activestore to chabad
        if (
            globalThis.SERVER_MODE == "online" &&
            rootState.user.permissions === 8
        ) {
            dispatch("folders/setChabadActiveStore", null, {
                root: true
            });
        }
    },
    //load alternative worlds
    async loadWordAltTomemory() {
        //checks for update from server
        let update = await altWordHelper.checkForWordAltUpdate();
        //store the compress alt  data in localStorage by the var' "books"
        let uncompressData;
        let compressData = await advLocalStorage.getItem("wordAlt");

        //if there is update
        if (update || !compressData) {
            //fetch the updated alt words from server
            compressData = await loadBooksDataFromServer.fetchWordsAlt();
            uncompressData = inflate(compressData, {
                to: "string",
            });
            uncompressData = JSON.parse(uncompressData);
            advLocalStorage.setItem("wordAlt", uncompressData);
        } else uncompressData = compressData;
        // compressData = await advLocalStorage.getItem("wordAlt");

        // uncompressData = convertFromOtzarCode(uncompressData);

        init.BooksData.wordAlt = uncompressData;
    },
    //load fs alternative words
    async loadFSWordAltTomemory() {
        // let url = init.Server + init.BooksDB.FSwordAlt;

        // let otzarCache = await caches.open("otzar");

        //checks for update from server
        let update = await altWordHelper.checkForFSWordAltUpdate();

        //store the compress alt  data in localStorage by the var' "books"
        // let compressData = localStorage.getItem("FSwordAlt");
        let compressData = await advLocalStorage.getItem("fs-alt-words"); //otzarCache.match(url);
        let uncompressData;
        //if there is update
        if (update || compressData == undefined) {
            //fetch the updated alt words from server
            compressData = await loadBooksDataFromServer.fetchFSWordsAlt();
            // compressData = await otzarCache.match(url);
            let data = inflate(compressData, {
                to: "string",
            });
            ///compressData = localStorage.getItem("FSwordAlt");
            // response = convertFromOtzarCode(response);
            uncompressData = JSON.parse(data);
            await advLocalStorage.setItem("fs-alt-words", uncompressData);
        } else uncompressData = compressData;
        // let response = await compressData.text();

        init.BooksData.FSwordAlt = uncompressData;
    },
    //load basic books to localStorage and to basicBooks in this module
    async loadBasicBooksTomemory() {
        //get the basic books from local
        basicBooks = JSON.parse(localStorage.getItem("basicBooks"));
        //if there is no books in local
        if (!basicBooks) {
            //get the basic books from server (in fetchBasicBooks we insert the basic books to local)
            await loadBooksDataFromServer.fetchBasicBooks();
            //and then get the basic books from local to basicBooks
            basicBooks = JSON.parse(localStorage.getItem("basicBooks"));
        }
    },
    //load data of books and others
    //call the action "loadBooksAndOthers"
    loadData({
        dispatch
    }) {
        dispatch("loadBooksAndOthers");
    },
    setActiveStore({
        commit,
        state,
        rootState
    }, idsArr) {
        books.forEach((bk) => (bk._show = false));
        idsArr.forEach((bookid) => {
            let b = treeBooks.get(treeBooks.root, bookid);
            if (b !== undefined) b._show = true;
        });
        rootState.booksChanged++;
    },
    resetActiveStore({
        commit,
        dispatch,
        rootState
    }) {
        books.forEach((bk) => (bk._show = true));
        state.isActiveStore = false;
        // commit("SET_BOOKS", fullBooks);
        // fullBooks = [];
        // fullTreeBooks = new AVLTree();
        if (state.activeStore.isRegStore) {
            let settingKey = "activeStore";
            userSettingsData.deleteUserSetting(settingKey);
        }
        let payload = {
            id: 0,
            type: "",
            isRegStore: false,
        };
        commit("SET_ACTIVE_STORE_DATA", payload);
        dispatch("bookList/setActive", null, {
            root: true,
        });
        rootState.booksChanged++;
        dispatch("freeSearchBookList/refreshCurrentList", null, {
            root: true,
        });
    },
    setActiveStoreData({
        commit,
        dispatch
    }, activeStoreData) {
        //postUserSetting

        if (activeStoreData.isRegStore) {
            let key = "activeStore";
            let value = {
                id: activeStoreData.id,
                type: activeStoreData.type,
            };
            value = JSON.stringify(value);
            let settingKey = "activeStore";
            userSettingsData.postUserSetting({
                key,
                value
            });
        }
        commit("SET_ACTIVE_STORE_DATA", activeStoreData);
        dispatch("bookList/setActive", null, {
            root: true,
        });
    },
};

//getters
export const getters = {
    getBasicBooks(state) {
        return state.basicBooksIds;
    },
    getActiveStoreTitle(state) {
        let activeStoreTitle = "";
        let data = [];
        let folders = [];
        if (state.activeStore.type == "system") {
            folders = systemFolders.flattenFolders(data);
        } else if (state.activeStore.type == "user") {
            folders = userFolders.flattenFolders(data);
        }

        if (folders.length > 0) {
            let folder = folders.find((f) => f.id == state.activeStore.id);
            if (!folder) activeStoreTitle = "?";
            else activeStoreTitle = folder.title;
        }

        return activeStoreTitle;
    },
    getLengthOfActiveStoreBooks(state, getters, rootState) {
        let react = rootState.booksChanged;
        return books.filter((b) => b._show).length;
    },
    //not in use!!!!
    getBasicFolderBookById(state) {
        return (id) => {
            let bookid = loadBooksDataFromServer.getSystemFoldersBookById(id);
            return bookid;
        };
    },
    //getter to follow the updated books (vuex listen to changes from state)
    getBooksUpdateCount(state) {
        return state.booksUpdated;
    },
    getPageById: (state) => (pageId) => {
        return bookData.getPageById(pageId);
        //getPageById
    },
    //get system basic book from it's system folder
    //param: system folder id

    getSystemBasicBookByFolderId(state, getters) {
        return (id) => {
            //find the system folder that contain folder id and book id
            let bookId = state.systemBasicBooksIds.find((sBook) => sBook.id == id);
            //insert  the book id
            bookId = bookId.books[0].id;
            //call the getter getBookbyId that returns the book
            let basicBook = getters.getBookbyId(bookId);
            //return basic book

            return basicBook || {};
        };
    },
    //get book by its id
    getBookbyId: (state) => getBookbyId,
    // getBooksByListId(...booksid) {
    //   // let arr = state.arrBooks
    //   return books.filter(books => {
    //     return books.find(b => b.id === booksid);
    //   });
    // },
    getBookByNameBook(bookName) {
        return books.filter((books) => {
            return books.find((b) => b.name === bookName);
        });
    },
    // check
    getBooksByAuthor(authorName) {
        return books.filter((books) => {
            return books.authors.find((a) => a.name === authorName);
        });
    },
    //
    getVolumeByIdBook(bookid) {
        let item = books.find((books) => books.id === bookid);
        if (!item) return null;
        return item.volume;
    },

    getAllVolumesById(bookid) {
        //find book by id
        let volumeMain = books.find((books) => books.id === bookid);
        // check if book exist
        if (!volumeMain) return null;
        // check if there are additional volumes
        if (!volumeMain.volumeId.length > 0) return null;
        // get volumeId of first volume in the sidra
        volumeMain = volumeMain.volumeId[0].mainVolume;
        //check if varibal 'mainVolume' exit
        if (!volumeMain) return null;
        //get array all books in the sidra
        let a = books.filter((books) => {
            if (!books.volumeId.length > 0) return false;
            return books.volumeId[0].mainVolume === volumeMain;
        });
        return a;
    },

    //Returns true if additional volumes exist for the book
    hasVolumeToBook(bookid) {
        let id = state.idBook;
        let item = books.find((books) => books.id === bookid);
        if (!item) return null;
        return item.volumeId.length > 0;
    },
};

export function getBookbyId(bookid, getNA = true) {
    const bid = Number(bookid);
    let bk = treeBooks.get(treeBooks.root, bid);
    if (!bk && getNA) {
        bk = treeBooksNA.get(treeBooksNA.root, bid);
        if (bk) bk.NA = true;
    }

    return bk;
}

function getDecompressBk(location, bookArrayBuf) {
    try {
        let bk = bookszip.decompressItem(bookArrayBuf, location);
        return bk;
    } catch (err) {
        throw err;
    }
}

function createProxy(bk) {
    try {
        return new Proxy(bk, bkHandler);
    } catch (err) {
        throw err;
    }
}
// export its was export but idk why
// function getBookbyLocation(location, bookArrayBuf) {
//   try {
//     let bk = bookszip.decompressItem(bookArrayBuf, location);
//     let bkProxy = new Proxy(bk, bkHandler);

//     // //
//     return bkProxy;
//     // return bk;
//   } catch (err) {
//     throw err;
//   }
// }
const BookPropInfo = {
    mainVolume: {
        onEmpty: null,
        bit: 0
    },
    position: {
        onEmpty: null,
        bit: 1
    },
    id: {
        onEmpty: null,
        bit: 2
    },
    name: {
        onEmpty: "",
        bit: 3
    },
    volume: {
        onEmpty: "",
        bit: 4
    },
    authors_length: {
        onEmpty: 0,
        bit: 5
    },
    permissions: {
        onEmpty: 0,
        bit: 6
    },
    addnames_length: {
        onEmpty: 0,
        bit: 7
    },
    places: {
        onEmpty: "",
        bit: 8
    },
    toyear: {
        onEmpty: "",
        bit: 9
    },
    fromyear: {
        onEmpty: "",
        bit: 10
    },
    volumes_length: {
        onEmpty: 0,
        bit: 12
    },
    moredata: {
        onEmpty: 0,
        bit: 13
    },
};
const BookPropInfoStartWith = ["authors_", "addnames_", "volumes_"];
const getString = (val, NAStr = false) => {
    if (typeof val == "string") return val;
    let realVal = val;

    realVal = ~realVal;
    let stringSize = realVal & 0xff;
    let stringAt = realVal >> 8;

    let realStr = allStrs.substr(stringAt, stringSize);
    if (NAStr) realStr = allStrsNA.substr(stringAt, stringSize);
    return realStr;
};
const bkHandler = {
    get(target, prop, reciver) {
        //check for active store
        // let show = Reflect.get(target, "_show", reciver);
        // if (!show) return undefined;
        const bookinfo = Reflect.get(target, "_bookinfo", reciver);
        const info = BookPropInfo[prop];

        if (prop === "permissions") {
            return target["permissions"];
        } else if (prop === "_show") {
            return bookinfo & 1;
        } else if (prop === "favorite") {
            return bookinfo & 8;
        } else if (prop === "_hide") {
            return bookinfo & 2;
        } else if (prop === "_inHide") {
            return bookinfo & 4;
        } else if (prop === "dor") {
            return target["moredata"] & 255;

            //new way of period
            /*  let authors = target["authors_length"];
            let period = 0;

            for (let i = 0; i < authors; i++) {
              const vl = target["authors_" + i + "_period"];
              if (vl) {
                period = period | (1 << (vl - 1));
              }
            }

            return period; */
        } else if (prop == "isSidra") {
            return target["moredata"] & 512;
        } else if (prop == "isText") {
            return target["moredata"] & 1024;
        } else if (prop == "removed") {
            return target["moredata"] & 2048;
        } else if (prop === "mainAuthorName") {
            let authors = target["authors_length"];
            let names = [];

            for (let i = 0; i < authors; i++) {
                if (target["authors_" + i + "_authorTypeId"] == 1) {
                    const vl = getString(target["authors_" + i + "_name"]);
                    //return vl;
                    names.push(vl);
                }
            }
            return names.join(" - ");
            return "";
        } else if (prop === "mainAuthorId") {
            let authorsIds = target["authors_length"];
            let names = [];
            for (let i = 0; i < authorsIds; i++) {
                if (target["authors_" + i + "_authorTypeId"] == 1) {
                    const vl = target["authors_" + i + "_id"];
                    //return vl;
                    names.push(vl);
                }
            }
            return names;

            let authors = target["authors_length"];
            for (let i = 0; i < authors; i++) {
                if (target["authors_" + i + "_authorTypeId"] == 1) {
                    return target["authors_" + i + "_id"];
                }
            }

            return null;
        } else if (prop === "subBooks") {
            let subBooksCount = target["subbooks_length"];
            let subs = {};
            for (let i = 0; i < subBooksCount; i++) {
                subs[target["subbooks_" + i + "_id"]] = {
                    name: target["subbooks_" + i + "_name"],
                    author: target["subbooks_" + i + "_author"],
                    dor: target["subbooks_" + i + "_dor"],
                };
            }
            return subs;
        }
        //if the flag is 0 then just return the onEmpty
        if (info && !bookzip.getBit(target._flag, info.bit)) {
            return info.onEmpty;
        }
        //get the real value
        let val = Reflect.get(target, prop, reciver);

        //this is actually a string info
        if (val < 0) {
            // let realVal = val;

            // realVal = ~realVal;
            // let stringSize = realVal & 0xff;
            // let stringAt = realVal >> 8;

            // let realStr = allStrs.substr(stringAt, stringSize);

            // return realStr;

            return getString(val);
        } else if (val != undefined) return val;
        else {}
        return val;
    },
    set(target, prop, value, reciver) {
        let oldVal = Reflect.get(target, "_bookinfo", reciver);
        let val = value;
        if (prop === "_show") {
            value ? (val = setBit(oldVal, 0)) : (val = clearBit(oldVal, 0));
            return Reflect.set(target, "_bookinfo", val, reciver);
        } else if (prop === "favorite") {
            value ? (val = setBit(oldVal, 3)) : (val = clearBit(oldVal, 3));
            return Reflect.set(target, "_bookinfo", val, reciver);
        } else if (prop === "_hide") {
            value ? (val = setBit(oldVal, 1)) : (val = clearBit(oldVal, 1));
            return Reflect.set(target, "_bookinfo", val, reciver);
        } else if (prop === "_inHide") {
            value ? (val = setBit(oldVal, 2)) : (val = clearBit(oldVal, 2));
            return Reflect.set(target, "_bookinfo", val, reciver);
        }
        return Reflect.set(target, prop, value, reciver);
    },
};

function clearBit(number, bitPosition) {
    const mask = ~(1 << bitPosition);
    return number & mask;
}

function setBit(number, bitPosition) {
    return number | (1 << bitPosition);
}

function freeIndexMemory() {
    //indexer.freeIndexMemory();
}
async function loadIndexData(loadInxToMem = false) {
    console.time("create inx");
    console.time("load inx");
    let cacheInx = await advLocalStorage.getItem("inxBooks");
    console.timeEnd("load inx");
    let data;
    if (!cacheInx) {
        data = await Axios.get("/api/books/index");
        data = data.data;
        let uncompressData = inflate(data);
        let arrBuff = uncompressData.buffer;
        indexer.createTinyIndex(arrBuff, null, "inxBooks", loadInxToMem);
        arrBuff = null;
    } else {
        console.log("used cached index");
        // data = cacheInx;
        indexer.createTinyIndex(null, cacheInx, "inxBooks", loadInxToMem);
    }

    console.timeEnd("create inx");
}