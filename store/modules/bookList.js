import Vue from "vue";
import VueInst from "@/main_app.js";
import store from "@/store/store";
import * as altWordHelper from "@/helper/altWordHelper.js";
import txtIndexerLib from "@/utils/indexer";
//bookListSortedByBook;
import {
    books as bookListSortedByBook
} from "@/store/modules/books.js";
import {
    bookListSortedByAuthor,
    bookListSortedByYear,
} from "@/store/modules/books.js";
import {
    treeBooks
} from "@/store/modules/books.js";
import * as userFoldersData from "@/services/userFoldersData.js";
import * as loadSystemFoldersFromServer from "@/services/loadSystemFoldersFromServer.js";
import * as history from "@/services/history.js";
import {
    getBookName
} from "@/services/bookData.js";

const Hebcal = require("hebcal");
export const namespaced = true;
const uuidv1 = require("uuid/v1");
//last books result from search in some cases we want and can to
//loop through it instead of looping all books
export let lastBookResults = [];
//the lastBookResults depands in lastTxtSearch
export let lastTxtSearch = "";
export let isSystemBooksList = [];
export let indexData;
export function setIsSystemBooksList(data) {
    isSystemBooksList = data;
}
//arrray of books ids
export let booksids = [];
export let systemBooksMultipleLists = [];

export function setUserListBooksIds(ids) {
    booksids = ids;
}
//all books
export let allBooks = [];

function bookVolume(volume) {
    let parts = volume.split("-");
    return parts.length > 1 || volume.indexOf("<") == 0 ?
        " " + volume :
        " - " + volume;
}

function bookYears(book) {
    let yearFrom = book.fromyear;
    let yearTo = book.toyear;
    return yearFrom == yearTo ? yearTo : yearFrom + " - " + yearTo;
}

let booksChecked = {};
let booksOpenVols = {};
let cacheCounter = 0;
let currentListReactCache = null;
let currentListDataCache = null;

function checkCacheForGCList(data) {
    let useCache = true;
    if (!currentListDataCache) return false;
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        if (data[keys[i]] != currentListReactCache[keys[i]]) {
            useCache = false;
            break;
        }
    }
    return useCache;
}

const catInfo = {
    YesodBooks: 1,
    Mefarshim: 2,
    Noshim: 3,
    Mahagarim: 4,
    TextBooks: 5,
};
export function clearSortedBooks() {
    bookListSortedByBook = [];
}

function isBooksLevel(catId, level) {
    switch (catId) {
        case catInfo.YesodBooks:
            return false;
        case catInfo.Mefarshim:
            return level > 1;
        case catInfo.Noshim:
            return level > 1;
        case catInfo.TextBooks:
            return true;
        case catInfo.Mahagarim:
            return level > 1;
    }
}

//state
export const state = {
    searchByIds: false,
    dontScroll: false,
    pinChecks: true,
    setFocusInInput: 0,
    hiddenBooks: 0,
    refreshOpenVols: false,
    refreshNewList: false,
    pageAfterLoad: false,
    refreshBooksChecked: false,
    refreshSystemList: false,
    initBook: 0,
    initIndex: -1,
    showHiddenBooks: false,
    currentListLength: 0,
    favChanged: 0,
    authorBooksList: [],
    //use to trigger the getcurrentlist
    refreshListTrigger: false,
    //books list from system folder
    systemBooksList: [],
    //check if there is system list
    //we send from serve the responde in here
    //if we got answer that means there is a list

    //books multiple lists of system folder

    basicBooksPriority: 1,
    //arrray of books ids
    booksids: [],
    //booksOpenVols: {},
    showHide: false,
    openVols: false,

    bookSelectedContex: {
        checked: false,
        book: null,
    },
    checkedBooksCount: 0,
    favoriteCheckBooksCount: 0,
    //will be setted and when getbooks will be called, the search...
    textSearch: "",
    textSearchSettings: "",
    currentHideBooksCount: 0,
    //text sea
    booksListTextSearch: "",
    idBook: "",
    arrBooks: "",
    needUpdate: false,
    TxtSearch: "",
    sortBooksBy: 0,
    //user's history of his lasts actions
    historyUsersActions: {
        //the current action in history will be synchronized with the data to kn
        current: 1,
        isAddedToHistory: false,
        //array of all user's action
        data: [{
            //types:"ALL", "SEARCH", "SAVED_LIST", "SYSTEM_LIST","AUTHOR_LIST"
            type: "ALL",
            content: "",
        }, ],
    },
    //a list of books that will be called for actions- not in use for now
    bookList: {
        //title
        //parentid
        //booksid[bookId]
        //type- will saved like a folder with books
    },
    tempHistory: {
        count: 0,
        actionsList: [],
    },
    active: 0,
    triggerScrollToTop: 0,
    doNotFocus: false,
    tsiyunSearch: "",
};

//mutations
export const mutations = {
    RESET_USER_ACTION_LIST(state) {
        state.historyUsersActions = {
            //the current action in history will be synchronized with the data to kn
            current: 1,
            isAddedToHistory: false,
            //array of all user's action
            data: [{
                //types:"ALL", "SEARCH", "SAVED_LIST", "SYSTEM_LIST","AUTHOR_LIST"
                type: "ALL",
                content: "",
            }, ],
        };
    },
    UPD_CURR_LIST_INX(state, data) {
        state.historyUsersActions.data[data.listId - 1].lastActive = data.index;
        //update history in db (ignore unsuitable function name)
        history.setSearchHistoryPin({
            lastActive: data.index,
            id: state.historyUsersActions.data[data.listId - 1].historyId,
        });
    },
    SET_DO_NOT_FOCUS(state, mode) {
        state.doNotFocus = mode;
    },
    SET_SHOW_HIDDEN_BOOKS(state, mode) {
        state.showHiddenBooks = mode;
    },
    SET_ADDED_TO_HISTORY(state, value) {
        state.historyUsersActions.isAddedToHistory = value;
    },
    SET_PIN_CHECKS(state, mode) {
        state.pinChecks = mode;
    },
    SET_PIN(state, {
        id,
        pin
    }) {
        state.pinChecks = true;
        let data = state.historyUsersActions.data.find((h) => h.historyId == id);
        if (data) {
            if (pin == undefined) data.pin = !data.pin;
            else data.pin = pin;
        }
    },
    SET_LAST_PIN_TO(state, val) {
        state.historyUsersActions.data[
            state.historyUsersActions.current - 1
        ].pin = val;
    },
    TOGGLE_OPENVOLS(state) {
        state.openVols = !state.openVols;
        if (!state.openVols) booksOpenVols = {};

        state.refreshOpenVols = !state.refreshOpenVols;
    },
    SET_OPENVOLS(state, value) {
        state.openVols = value;
        if (!state.openVols) booksOpenVols = {};
        state.refreshOpenVols = !state.refreshOpenVols;
    },
    TOGGLE_OPEN_VOL(state, book) {
        booksOpenVols[book] == undefined ?
            (booksOpenVols[book] = true) :
            delete booksOpenVols[book];

        state.refreshOpenVols = !state.refreshOpenVols;
    },
    SET_OPEN_VOL_SAFE(state, payload) {
        const isOpen = booksOpenVols[payload.book] != undefined;
        if (payload.mode == "open" && !isOpen) {
            booksOpenVols[payload.book] = true;
            state.refreshOpenVols = !state.refreshOpenVols;
        } else if (payload.mode == "close" && isOpen) {
            delete booksOpenVols[payload.book];
            state.refreshOpenVols = !state.refreshOpenVols;
        }
    },
    INCREASE_CACHE_COUNT(state) {
        cacheCounter++;
    },
    SET_OPEN_VOL(state, {
        book,
        value
    }) {
        value ? (booksOpenVols[book] = true) : delete booksOpenVols[book];

        state.refreshOpenVols = !state.refreshOpenVols;
    },
    RESET_OPEN_VOLS(state) {
        booksOpenVols = {};
        state.refreshOpenVols = !state.refreshOpenVols;
    },
    SET_ACTIVE(state) {
        state.active = state.active + 1;
    },
    TRIGGER_LIST_RELOAD(state) {
        state.refreshListTrigger = !state.refreshListTrigger;
    },
    /**
     * add to temp array of history user action
     * @param {Object} payload -the data of action
     */
    ADD_TEMP_HISTORY(state, payload) {
        state.tempHistory.actionsList.push(payload);
    },
    /**
     * delete from temp array of history user action
     * @param {Number} id -the id of the action to delete
     */
    DELETE_TEMP_HISTORY(state, id) {
        state.tempHistory.actionsList = state.tempHistory.actionsList.filter(
            (a) => a.id != id
        );
        state.tempHistory.count--;
    },
    /**
     * reset temp array of actions
     */
    RESET_TEMP_HISTORY(state) {
        state.tempHistory.actionsList = [];
        state.tempHistory.count = 0;
    },
    /**
     * increase counter from temp of history
     */
    INCREASE_TEMP_HISTORY_COUNTER(state) {
        state.tempHistory.count++;
    },
    /**
     *  decrease counter from temp of history
     */
    DECREASE_TEMP_HISTORY_COUNTER(state) {
        state.tempHistory.count--;
    },
    /**
     * reset text search
     */
    RESET_TEXT_SEARCH(state) {
        state.textSearch = "";
    },
    /**
     * reset book list text search
     */
    RESET_BOOKS_LIST_TEXT_SEARCH(state) {
        state.booksListTextSearch = "";
    },
    /**
     * adding user's action
     * @param {Object} listData -the data of action
     */
    ADD_USER_ACTION_TO_HISTORY(state, listData) {
        let curr = state.historyUsersActions.current;
        state.historyUsersActions.isAddedToHistory = false;
        state.historyUsersActions.current++;
        listData._id = uuidv1();
        //insert new user action in the current place in the array
        state.historyUsersActions.data.splice(curr, 0, {
            //type, content, booksids
            //type of list, can be: all books "ALL", search result "SEARCH", user's saved list "SAVED_LIST"
            //the use of this variable varies by type: when type="ALL" - the content will be ampty,
            //when type="SEARCH" - the content will set text search=content
            //when type="SAVED_LIST" - the component sent type="SAVED_LIST" the content that is the name of saved list
            ...listData,
        });
    },
    ADD_USER_ACTION(state, listData) {
        listData._id = uuidv1();
        state.historyUsersActions.data.push(listData);
    },
    //called when user will go to his forword history
    GO_FORWORD(state) {
        //changin current place
        state.historyUsersActions.isAddedToHistory = false;
    },
    FORWORD_CURRENT(state) {
        state.historyUsersActions.current++;
    },
    SET_CURRENT(state, id) {
        state.historyUsersActions.current = id;
    },
    //called when user will go to his last history result
    GO_BACK(state) {
        //changin current place

        state.historyUsersActions.isAddedToHistory = false;
    },
    BACK_CURRENT(state) {
        state.historyUsersActions.current--;
    },
    //set the text search to apdate list books of search result
    SET_SEARCH_TO(state, txtSearch) {
        state.textSearch = txtSearch;
        //when the search is changin set isAddedToHistory to true so we can add actions user
        state.historyUsersActions.isAddedToHistory = true;
    },
    //SET_SETTINGS_SEARCH_TO
    SET_SETTINGS_SEARCH_TO(state, textSearchSettings) {
        state.textSearchSettings = textSearchSettings;
    },
    SET_BOOKS_LIST_SEARCH_TO(state, txtSearch) {
        state.booksListTextSearch = txtSearch;
    },
    CREATE_SYSTEM_MULTIPLE_LISTS(state) {
        systemBooksMultipleLists = systemBooksMultipleLists.concat(
            state.systemBooksList
        );
        state.refreshSystemList = !state.refreshSystemList;
    },
    RESET_SYSTEM_MULTIPLE_LISTS(state) {
        systemBooksMultipleLists = [];
        state.refreshSystemList = !state.refreshSystemList;
    },
    DELETE_USER_LIST_BOOKS_IDS(state, listIds) {
        listIds.forEach(
            (id) => (state.booksids = state.booksids.filter((bids) => bids != id))
        );
    },
    REFRESH_CHECKS(state) {
        booksChecked = {};
        state.checkedBooksCount = 0;
        state.refreshBooksChecked = !state.refreshBooksChecked;
    },
    SET_BOOKIDS(state, books) {
        state.booksids = books;
        booksChecked = {};

        state.booksids.forEach((b, i) => {
            booksChecked[b.book] = false;
        });
        state.checkedBooksCount = 0;
        state.refreshBooksChecked = !state.refreshBooksChecked;
    },
    //remove books from list
    REMOVE_BOOKS(state, books) {
        books.forEach((b) => {
            if (booksChecked[b]) state.checkedBooksCount--;
            delete booksChecked[b];
            state.booksids = state.booksids.filter((book) => book.book != b);
        });

        state.refreshBooksChecked = !state.refreshBooksChecked;
    },
    //check\uncheck book
    CHECK_BOOK(state, {
        book,
        check
    }) {
        booksChecked[book] = check;
        check ? state.checkedBooksCount++ : state.checkedBooksCount--;
        state.refreshBooksChecked = !state.refreshBooksChecked;
    },
    TOGGLE_CHECK_BOOK(state, {
        book
    }) {
        if (booksChecked[book]) {
            state.checkedBooksCount--;
            delete booksChecked[book];
        } else {
            state.checkedBooksCount++;
            booksChecked[book] = true;
        }

        state.refreshBooksChecked = !state.refreshBooksChecked;
    },
    //check\uncheck all books
    CHECK_ALL_BOOKS(state, {
        check,
        search,
        books
    }) {
        if (check) {
            books.forEach((b) => {
                booksChecked[b] = check;
            });
            state.checkedBooksCount = books.length;
        } else {
            booksChecked = {};
            state.checkedBooksCount = 0;
        }
        state.refreshBooksChecked = !state.refreshBooksChecked;
    },
    //revert checks
    REVERT_CHECKS(state, {
        books
    }) {
        let count = 0;
        books.forEach((b) => {
            if (booksChecked[b]) delete booksChecked[b];
            else {
                booksChecked[b] = true;
                count++;
            }
        });

        state.checkedBooksCount = count;
        state.refreshBooksChecked = !state.refreshBooksChecked;

        /* 
        Object.keys(booksChecked).forEach(function(key, index) {
          let check = booksChecked[key];
          !check ? state.checkedBooksCount++ : state.checkedBooksCount--;
          booksChecked[key] = !check;
        });
        state.refreshBooksChecked = !state.refreshBooksChecked; */
    },
    SET_SELECTED_CONTEX(state, book) {
        Vue.set(state.bookSelectedContex, "checked", true);
        Vue.set(state.bookSelectedContex, "book", book);
        // state.bookSelectedContex.checked = true;
        // state.bookSelectedContex.book = book;
    },
    RESET_SELECTED_CONTEX(state) {
        state.bookSelectedContex.checked = false;
        // state.bookSelectedContex.book = null;
    },
};
//actions
export const actions = {
    resetUserActionsList({
        commit
    }) {
        return new Promise((resolve) => {
            commit("RESET_USER_ACTION_LIST");
            resolve();
        });
    },
    updateCurrentListLastIndex({
        commit
    }, data) {
        commit("UPD_CURR_LIST_INX", data);
    },
    setDoNotFocus({
        commit
    }, mode) {
        commit("SET_DO_NOT_FOCUS", mode);
    },
    async refreshHiddenList({
        commit,
        state,
        dispatch,
        getters
    }) {
        let ids = bookListSortedByBook.filter((a) => a._hide).map((a) => a.id);
        commit("SET_BOOKIDS", ids);
        commit("TRIGGER_LIST_RELOAD");
    },
    increaseCacheCount({
        commit
    }) {
        commit("INCREASE_CACHE_COUNT");
    },
    increaseFavCount({
        commit,
        state
    }) {
        state.favChanged++;
    },
    getBooksIdCurrentList({
        getters
    }) {
        let books = [];
        if (
            state.historyUsersActions.data[state.historyUsersActions.current - 1]
            .type == "AUTHOR_LIST" &&
            state.textSearch == ""
        )
            books = getters.getAuthorListOfBooks();

        if (
            state.historyUsersActions.data[state.historyUsersActions.current - 1]
            .type == "SIDRA_LIST" &&
            state.textSearch == ""
        ) {
            books = getters.getBooksBySidraId();
        }

        if (
            state.historyUsersActions.data[state.historyUsersActions.current - 1]
            .type == "SAVED_LIST" &&
            state.textSearch == ""
        )
            books = getters.getSavedListOfBooks();

        if (
            state.historyUsersActions.data[state.historyUsersActions.current - 1]
            .type == "SYSTEM_LIST" &&
            state.textSearch == ""
        ) {
            books = getters.getSystemListOfBooks();
        }

        //SYSTEM_MULTIPLE_LISTS
        if (
            state.historyUsersActions.data[state.historyUsersActions.current - 1]
            .type == "SYSTEM_MULTIPLE_LISTS" &&
            state.textSearch == ""
        )
            books = getters.getSystemMultipleListOfBooks();

        //CUSTOM_LIST
        if (
            (state.historyUsersActions.data[state.historyUsersActions.current - 1]
                .type == "CUSTOM_LIST" ||
                state.historyUsersActions.data[state.historyUsersActions.current - 1]
                .type == "HIDDEN_LIST") &&
            state.textSearch == ""
        )
            books = getters.getCustomList();

        //  RECENT_BOOKS
        if (
            state.historyUsersActions.data[state.historyUsersActions.current - 1]
            .type == "RECENT_BOOKS" &&
            state.textSearch == ""
        )
            books = getters.getCustomList();
        //search
        if (
            state.textSearch != "" ||
            state.historyUsersActions.data[state.historyUsersActions.current - 1]
            .type == "SEARCH" ||
            state.historyUsersActions.data[state.historyUsersActions.current - 1]
            .type == "ALL"
        )
            books = getters.getBooks();

        books = books
            .filter((b) => (b.special ? b.book._show : b._show))
            .map((b) => (b.special ? b.book.id : b.id));
        return books;
    },
    setAddedToHistory({
        commit
    }, value) {
        return new Promise((resolve) => {
            resolve(commit("SET_ADDED_TO_HISTORY", value));
        });
    },
    setPin({
        commit
    }, {
        id,
        pin
    }) {
        commit("SET_PIN", {
            id,
            pin
        });
    },
    async revertChecks({
        commit,
        dispatch
    }) {
        let books = await dispatch("getBooksIdCurrentList");
        commit("REVERT_CHECKS", {
            books
        });
    },
    toggleShowVols({
        commit
    }) {
        commit("TOGGLE_OPENVOLS");
    },
    setShowVols({
        commit
    }, value) {
        commit("SET_OPENVOLS", value);
    },
    setVolumes({
        commit
    }, {
        book,
        value
    }) {
        return new Promise((resolve, reject) => {
            commit("SET_OPEN_VOL", {
                book,
                value
            });
            resolve();
        });
    },
    toggleOpenVols({
        commit
    }, book) {
        return new Promise((resolve, reject) => {
            commit("TOGGLE_OPEN_VOL", book);
            resolve();
        });
    },
    setOpenVols({
        commit
    }, payload) {
        commit("SET_OPEN_VOL_SAFE", payload);
    },
    resetOpenVols({
        commit
    }) {
        commit("RESET_OPEN_VOLS");
    },
    addHistoryToActionList({
        commit
    }) {
        let history = this.getters["userSearchHistory/getUserSearchHistoryByType"]([
            "book",
            "list",
        ]);
        history.forEach((item) => {
            let listData = {
                content: item.info,
                historyId: item.id,
                pin: item.pin,
                created: item.historyDate,
                lastActive: item.lastActive,
            };
            let type = "";
            try {
                item.listType = parseInt(item.listType);
            } catch {}
            if (item.type == "book") type = "SEARCH";
            else {
                switch (item.listType) {
                    case 1:
                        type = "SYSTEM_LIST";
                        listData.listId = JSON.parse(item.listId);
                        break;
                    case 2:
                        type = "SAVED_LIST";
                        listData.listId = JSON.parse(item.listId);
                        break;
                    case 3:
                        type = "SYSTEM_MULTIPLE_LISTS";
                        listData.groups = JSON.parse(item.listId);
                        break;
                    case 4:
                        type = "CUSTOM_LIST";
                        listData.ids = JSON.parse(item.listId);
                        break;
                    case 5:
                        type = "RECENT_BOOKS";
                        break;
                    case 6:
                        type = "AUTHOR_LIST";
                        listData.data = JSON.parse(item.listId);
                        break;
                }
            }
            listData.type = type;
            commit("ADD_USER_ACTION", listData);
        });
    },
    async checkAllBooks({
        commit,
        getters,
        dispatch
    }, {
        check,
        search
    }) {
        //let books = getters.getCurrentList();
        let books = await dispatch("getBooksIdCurrentList");

        commit("CHECK_ALL_BOOKS", {
            check,
            search,
            books
        });
    },
    async checkBooks({
        commit,
        getters,
        dispatch
    }, {
        check,
        books
    }) {
        commit("CHECK_ALL_BOOKS", {
            check,
            search: "",
            books
        });
    },
    setLastPinTo({
        commit
    }, val = 0) {
        commit("SET_LAST_PIN_TO", val);
    },
    checkBook({
        commit
    }, {
        book,
        check
    }) {
        commit("CHECK_BOOK", {
            book,
            check
        });
    },
    toggleCheck({
        commit
    }, {
        book
    }) {
        commit("TOGGLE_CHECK_BOOK", {
            book
        });
    },
    setActive({
        commit
    }) {
        commit("SET_ACTIVE");
    },
    deleteUserListBooksIds({
        commit,
        rootState
    }, folder) {
        let ids = folder.books;
        commit("DELETE_USER_LIST_BOOKS_IDS", ids);
        rootState.booksChanged++;
    },
    toggleSearchMode() {
        state.searchByIds = !state.searchByIds;
    },
    /**
     * calles the mutation SET_SEARCH_TO
     * @param {String} txtSearch -to set text search
     */
    setSearchTo({
        commit
    }, txtSearch) {
        commit("SET_SEARCH_TO", txtSearch);
    },
    setSettingsSearchTo({
        commit
    }, textSearchSettings) {
        commit("SET_SETTINGS_SEARCH_TO", textSearchSettings);
    },
    setShowHiddenBooks({
        commit
    }, mode) {
        commit("SET_SHOW_HIDDEN_BOOKS", mode);
        // commit("INCREASE_CACHE_COUNT");
    },
    //textSearchSettings
    /**
     * calles the mutation SET_BOOKS_LIST_SEARCH_TO
     * @param {String} txtSearch -to set text search of book list
     */
    setBooksListSearchTo({
        commit
    }, txtSearch) {
        commit("SET_BOOKS_LIST_SEARCH_TO", txtSearch);
        if (txtSearch != "") commit("INCREASE_CACHE_COUNT");
    },
    async refreshFavBook({
        commit,
        state,
        dispatch,
        getters
    }, listData) {
        //sedin to server get request to get the list of books of saved list

        let current = getters.getDataOfCurrentList;
        if (
            (current.data.content === "מועדפים" ||
                current.data.content === "favorites") &&
            current.data.id
        ) {
            await userFoldersData.getUserSavedList(current.data.id);
            commit("SET_BOOKIDS", booksids);
            commit("TRIGGER_LIST_RELOAD");
        }
    },

    /**
     * calles the mutation ADD_USER_ACTION_TO_HISTORY
     * @param {Object} listData  - to add a user's action
     */
    async addUserActionToHistory({
            commit,
            state,
            dispatch,
            rootGetters
        },
        listData
    ) {
        listData.lastIndex = -1;
        let sameLst = false;
        if (listData.type !== "SEARCH") {
            //reset open volumes
            booksOpenVols = {};
            state.refreshOpenVols = !state.refreshOpenVols;
            commit("SET_SHOW_HIDDEN_BOOKS", false);
            commit("REFRESH_CHECKS");
        }
        //if the type is all and text search is not empty
        if (listData.type === "ALL") {
            //if the current action in history is not = "ALL" add to user's actions
            if (
                state.historyUsersActions.data[state.historyUsersActions.current - 1]
                .type != "ALL"
            )
                //anyway, reset text search
                commit("RESET_TEXT_SEARCH");
            //RESET_BOOKS_LIST_TEXT_SEARCH
            commit("RESET_BOOKS_LIST_TEXT_SEARCH");
        } else if (listData.type === "AUTHOR_LIST") {
            //get the curr user action to compare
            let curr =
                state.historyUsersActions.data[state.historyUsersActions.current - 1];
            //if the curr type equel to the the data type
            if (curr.type == listData.type) {
                //and if its the same list id of books step out from addin and return
                if (curr.content == listData.content) sameLst = true;
            }

            /* 
     Sara : why are we checking against next one?
     let forword =  
        state.historyUsersActions.data[state.historyUsersActions.current];
      if (forword != undefined || forword != null) {
        if (forword && forword.type == listData.type) {
          //and if its the same list id of books step out from addin and return
          if (forword.content == listData.content) sameLst = true;
        }
      } */

            //commit("RESET_TEXT_SEARCH");

            let data = {
                type: "list",
                data: listData.content,
                listId: JSON.stringify(listData.data),
                listType: 6,
            };

            history.saveSearchToHistory({
                data
            }).then((id) => {
                let item = {};
                item.infoId = id.data.id;
                item.historyId = id.data.history[0].id;
                item.historyDate = new Date();
                item.info = id.data.data;
                item.list = id.data.list;
                item.pin = 0;
                item.type = "list";
                item.data = id.data.listId;
                store.dispatch("userSearchHistory/addHistoryItem", item);
                listData.id = id.data.id;
                listData.pin = id.data.pin;
                listData.created = item.historyDate;
                listData.historyId = item.historyId;

                commit("ADD_USER_ACTION_TO_HISTORY", listData);

                Vue.nextTick(() => {
                    commit("RESET_TEXT_SEARCH");
                });
            });

            //than add the action to user's actions
            //commit("ADD_USER_ACTION_TO_HISTORY", listData);
        } else if (listData.type == "SIDRA_LIST") {
            //get the curr user action to compare
            let curr =
                state.historyUsersActions.data[state.historyUsersActions.current - 1];
            //if the curr type equel to the the data type
            if (curr.type == listData.type) {
                //and if its the same list id of books step out from addin and return
                if (curr.content == listData.content) sameLst = true;
            }

            commit("RESET_TEXT_SEARCH");
            let data = {
                type: "list",
                data: listData.content,
                listId: JSON.stringify(0),
                listType: 7,
            };

            history.saveSearchToHistory({
                data
            }).then((id) => {
                let item = {};
                item.infoId = id.data.id;
                item.historyId = id.data.history[0].id;
                item.historyDate = new Date();
                item.info = id.data.data;
                item.list = id.data.list;
                item.pin = 0;
                item.type = "list";
                store.dispatch("userSearchHistory/addHistoryItem", item);
                listData.id = id.data.id;
                listData.pin = id.data.pin;
                listData.created = item.historyDate;
                listData.historyId = item.historyId;

                commit("ADD_USER_ACTION_TO_HISTORY", listData);
            });

            //than add the action to user's actions
            //commit("ADD_USER_ACTION_TO_HISTORY", listData);
        }
        //if the action is SAVED_LIST
        else if (listData.type === "SAVED_LIST") {
            //get the curr user action to compare
            let curr =
                state.historyUsersActions.data[state.historyUsersActions.current - 1];
            //if the curr type equel to the the data type
            if (curr.type == listData.type) {
                //and if its the same list id of books step out from addin and return
                if (curr.id == listData.id) sameLst = true;
            }

            /* 
Sara : why are we checking against next one?
      let forword =
        state.historyUsersActions.data[state.historyUsersActions.current];
      if (forword != undefined || forword != null) {
        if (forword && forword.type == listData.type) {
          //and if its the same list id of books step out from addin and return
          if (forword.id == listData.id) sameLst = true;
        }
      } */

            if (!sameLst) {
                //sedin to server get request to get the list of books of saved list
                await userFoldersData.getUserSavedList(listData.id);

                commit("SET_BOOKIDS", booksids);

                // state.booksids = booksids;
                //RESET_USER_SAVED_LIST_BOOKS_IDS
                //commit("SET_USER_SAVED_LIST_BOOKS_IDS", booksIds);
                //than reset text search
                commit("RESET_TEXT_SEARCH");

                commit("RESET_BOOKS_LIST_TEXT_SEARCH");
                //than add the action to user's actions\

                //add to history
                let data = {
                    type: "list",
                    //  data: listData.id,
                    listType: 2,
                    data: listData.content,
                    listId: JSON.stringify(listData.id),
                };

                history.saveSearchToHistory({
                    data
                }).then((id) => {
                    let item = {};
                    item.infoId = id.data.id;
                    item.historyId = id.data.history[0].id;
                    item.historyDate = new Date();
                    item.info = id.data.data;
                    item.list = id.data.list;
                    item.pin = 0;
                    item.type = "list";
                    item.listId = data.listId;
                    store.dispatch("userSearchHistory/addHistoryItem", item);
                    listData.id = listData.id;
                    listData.pin = id.data.pin;
                    listData.created = item.historyDate;
                    listData.historyId = item.historyId;

                    commit("ADD_USER_ACTION_TO_HISTORY", listData);
                });
            }
        }
        //recent books
        else if (listData.type === "RECENT_BOOKS") {
            //get the curr user action to compare
            /*     let curr =
        state.historyUsersActions.data[state.historyUsersActions.current - 1];
      //if the curr type equel to the the data type
      if (curr.type == listData.type) {
        //and if its the same list id of books step out from addin and return
        if (curr.id == listData.id) sameLst = true;
      }
 */
            /* 
Sara : why are we checking against next one?
      let forword =
        state.historyUsersActions.data[state.historyUsersActions.current];
      if (forword != undefined || forword != null) {
        if (forword && forword.type == listData.type) {
          //and if its the same list id of books step out from addin and return
          if (forword.id == listData.id) sameLst = true;
        }
      } */
            //sedin to server get request to get the list of books of saved list
            //await userFoldersData.getUserSavedList(listData.id);
            let recentBooks = rootGetters["userRecentBooks/getRecentBooks"];

            commit("SET_BOOKIDS", [...recentBooks.map((a) => a.bookId)]);

            // state.booksids = booksids;
            //RESET_USER_SAVED_LIST_BOOKS_IDS
            //commit("SET_USER_SAVED_LIST_BOOKS_IDS", booksIds);
            //than reset text search
            commit("RESET_TEXT_SEARCH");

            commit("RESET_BOOKS_LIST_TEXT_SEARCH");
            //than add the action to user's actions

            let data = {
                type: "list",
                data: listData.content,
                listId: JSON.stringify(listData.id),
                listType: 5,
            };
            // if (!sameLst)   dont check samelist in recent books
            history.saveSearchToHistory({
                data
            }).then((id) => {
                let item = {};
                item.infoId = id.data.id;
                item.historyId = id.data.history[0].id;
                item.historyDate = new Date();
                item.info = id.data.data;
                item.list = id.data.list;
                item.pin = 0;
                item.type = "list";
                item.listId = data.listId;
                store.dispatch("userSearchHistory/addHistoryItem", item);
                listData.id = id.data.id;
                listData.pin = id.data.pin;
                listData.created = item.historyDate;
                listData.historyId = item.historyId;
                commit("ADD_USER_ACTION_TO_HISTORY", listData);
            });
            //  if (!sameLst) commit("ADD_USER_ACTION_TO_HISTORY", listData);
        }

        //SYSTEM_LIST
        else if (listData.type === "SYSTEM_LIST") {
            commit("INCREASE_CACHE_COUNT");
            //get the curr user action to compare
            let curr =
                state.historyUsersActions.data[state.historyUsersActions.current - 1];

            //if the curr type equel to the the data type
            if (curr.type == listData.type) {
                //and if its the same list id of books step out from addin and return
                if (curr.id == listData.id) return;
            }
            /* 
     Sara : why are we checking against next one?
      let forword = 
        state.historyUsersActions.data[state.historyUsersActions.current];
      if (forword != undefined || forword != null) {
        if (forword && forword.type == listData.type) {
          //and if its the same list id of books step out from addin and return
          if (forword.id == listData.id) return;
        }
      } */
            //in system folders sometime takes time 'till the respond comes back with the books list
            //then if another action comes right after and the respond comes before the
            //first one and the order of user history actions wont be in the right order
            //to solve the problem i sended, before the request to the server, commit to
            //the mutation ADD_TEMP_HISTORY to store the action in a temp array to follow
            //what comes first
            commit("ADD_TEMP_HISTORY", listData);
            //then sedin to server get request to get the list of books of
            //system list witch can takes time

            loadSystemFoldersFromServer
                .getSystemFoldersBooksIdListById(listData.id)
                .then(() => {
                    //after we increase the counter to know that the response came
                    commit("INCREASE_TEMP_HISTORY_COUNTER");
                    //if we didnt get a list, witch means that there's no books on this system folder
                    if (
                        isSystemBooksList == undefined ||
                        isSystemBooksList == null ||
                        isSystemBooksList.length < 2
                    ) {
                        isSystemBooksList = [];
                        //send the mutation DELETE_TEMP_HISTORY to delete the action from the
                        //temp actions array and return

                        // remove from history only if it is an empty result on main levels
                        if (!isBooksLevel(listData.categoryTypeId, listData.level))
                            return commit("DELETE_TEMP_HISTORY", listData.id);
                    }
                    //if the action is the last one(witch means we wont that)
                    if (
                        state.tempHistory.actionsList[
                            state.tempHistory.actionsList.length - 1
                        ].id == listData.id
                    ) {
                        //insert the temp list to the systemBooksList to get the books

                        state.systemBooksList = isSystemBooksList;

                        //than reset the temp list
                        isSystemBooksList = [];
                    }
                    //if the temp array equels to the counter- witch means we got back all
                    //response from server
                    if (state.tempHistory.actionsList.length == state.tempHistory.count) {
                        //loop trough temp actions array
                        for (let i = 0; state.tempHistory.actionsList.length > i; i++) {
                            //and send to the mutation ADD_USER_ACTION_TO_HISTORY to add action

                            let listData = state.tempHistory.actionsList[i];
                            //add to history
                            let data = {
                                type: "list",
                                listType: 1,
                                data: listData.content,
                                listId: JSON.stringify(listData.id),
                            };

                            history.saveSearchToHistory({
                                data
                            }).then((id) => {
                                let item = {};
                                item.infoId = id.data.id;
                                item.historyId = id.data.history[0].id;
                                item.historyDate = new Date();
                                item.info = id.data.data;
                                item.list = id.data.list;
                                item.pin = 0;
                                item.type = "list";
                                item.listId = data.listId;
                                store.dispatch("userSearchHistory/addHistoryItem", item);
                                listData.historyId = id.data.history[0].id;
                                listData.pin = id.data.pin;
                                listData.created = new Date();
                                commit("ADD_USER_ACTION_TO_HISTORY", listData);
                            });

                            /*   commit(
                              "ADD_USER_ACTION_TO_HISTORY",
                              state.tempHistory.actionsList[i]
                            ); */
                        }
                        //then reset temp actions array
                        commit("RESET_TEMP_HISTORY");
                    }

                    // reset text search
                    commit("RESET_TEXT_SEARCH");

                    commit("RESET_BOOKS_LIST_TEXT_SEARCH");
                    // add the action to user's actions
                });
        }

        //payload:type="SYSTEM_MULTIPLE_LISTS", group1:[], group2:[]
        else if (listData.type === "SYSTEM_MULTIPLE_LISTS") {
            //get the curr user action to compare
            let curr =
                state.historyUsersActions.data[state.historyUsersActions.current - 1];
            //if the curr type equel to the the data type
            if (curr.type == listData.type)
                if (JSON.stringify(curr.groups) == JSON.stringify(listData.groups))
                    //and if its the same lists ids of books step out from addin and return
                    return;

            /*   
Sara : why are we checking against next one?
let forword =
        state.historyUsersActions.data[state.historyUsersActions.current];

      if (forword && forword.type == listData.type) {
        //and if its the same lists ids of books step out from addin and return
        if (
          forword.groups.group1.length === listData.groups.group1.length &&
          curr.groups.group1.sort().every(function(value, index) {
            return value === listData.groups.group1.sort()[index];
          }) &&
          forword.groups.group2.length === listData.groups.group2.length &&
          forword.groups.group2.sort().every(function(value, index) {
            return value === listData.groups.group2.sort()[index];
          })
        )
          return;
      }

      if (forword && forword.type == listData.type) {
        //and if its the same lists ids of books step out from addin and return
        if (
          forword.groups.group1.length === listData.groups.group1.length &&
          curr.groups.group1.sort().every(function(value, index) {
            return value === listData.groups.group1.sort()[index];
          }) &&
          forword.groups.group2.length === listData.groups.group2.length &&
          forword.groups.group2.sort().every(function(value, index) {
            return value === listData.groups.group2.sort()[index];
          })
        )
          return;
      } */
            commit("RESET_SYSTEM_MULTIPLE_LISTS");
            //sedin to server get request to get the list of books of system list
            await loadSystemFoldersFromServer.getSystemFoldersMultipleBooksLists(
                listData.groups
            );

            //even if its empty we want that the user will know that
            //the filter that he wanted on multiple lists doesn't have result
            systemBooksMultipleLists = isSystemBooksList;

            state.refreshSystemList = !state.refreshSystemList;
            isSystemBooksList = [];

            // reset text search
            commit("RESET_TEXT_SEARCH");

            commit("RESET_BOOKS_LIST_TEXT_SEARCH");
            // add the action to user's actions

            if (!sameLst) {
                //add to history
                let data = {
                    type: "list",
                    data: listData.content,
                    listId: JSON.stringify(listData.groups),
                    listType: 3,
                };

                history.saveSearchToHistory({
                    data
                }).then((id) => {
                    let item = {};
                    item.infoId = id.data.id;
                    item.historyId =
                        id.data.history != undefined ? id.data.history[0].id : 0;
                    item.historyDate = new Date();
                    item.info = id.data.data;
                    item.list = id.data.list;
                    item.pin = 0;
                    item.type = "list";
                    item.listId = data.listId;
                    store.dispatch("userSearchHistory/addHistoryItem", item);
                    listData.id = id.data.id;
                    listData.pin = id.data.pin;
                    listData.created = item.historyDate;
                    listData.historyId = item.historyId;
                    commit("ADD_USER_ACTION_TO_HISTORY", listData);
                });
                commit("INCREASE_CACHE_COUNT");
                // commit("ADD_USER_ACTION_TO_HISTORY", listData);
            }
        }

        //add custom list
        else if (
            listData.type === "CUSTOM_LIST" ||
            listData.type === "HIDDEN_LIST"
        ) {
            //we dont check for the same list as before
            commit("SET_BOOKIDS", listData.ids);
            commit("TRIGGER_LIST_RELOAD");
            commit("RESET_TEXT_SEARCH");
            if (listData.type === "HIDDEN_LIST")
                commit("SET_SHOW_HIDDEN_BOOKS", true);
            commit("RESET_BOOKS_LIST_TEXT_SEARCH");

            let data = {
                type: "list",
                data: listData.content,
                listId: JSON.stringify(listData.ids),
                listType: 4,
            };

            history.saveSearchToHistory({
                data
            }).then((id) => {
                let item = {};
                item.infoId = id.data.id;
                item.historyId = id.data.history[0].id;
                item.historyDate = new Date();
                item.info = id.data.data;
                item.list = id.data.list;
                item.pin = 0;
                item.type = "list";
                store.dispatch("userSearchHistory/addHistoryItem", item);
                listData.id = id.data.id;
                listData.pin = id.data.pin;
                listData.created = item.historyDate;
                listData.historyId = item.historyId;
                commit("ADD_USER_ACTION_TO_HISTORY", listData);
            });

            //commit("ADD_USER_ACTION_TO_HISTORY", listData);
        }

        if (listData.type === "SEARCH") {
            //if isAddedToHistory is true witch means that the
            if (state.historyUsersActions.isAddedToHistory) {
                //if the action was adding from search result-

                //get the curr user action to compare
                let curr =
                    state.historyUsersActions.data[state.historyUsersActions.current - 1];
                //if the curr type equel to the the data type
                if (curr.type == "SEARCH") {
                    //and if its the same list id of books step out from addin and return
                    if (curr.content == state.textSearch) return;
                }

                state.dontScroll = true;

                /*
       
       Sara : why are we checking against next one?
       
       let forword =
          state.historyUsersActions.data[state.historyUsersActions.current];
        if (forword != undefined || forword != null) {
          if (forword.type == "SEARCH") {
            //and if its the same list id of books step out from addin and return
            if (forword.content == state.textSearch) return;
          }
        } */
                //set content to text search
                listData.content = state.textSearch;
                commit("RESET_BOOKS_LIST_TEXT_SEARCH");
                //than add the action to user's actions

                let data = {
                    type: "book",
                    data: listData.content,
                    pin: listData.pin === true ? 1 : 0,
                };

                history.saveSearchToHistory({
                    data
                }).then((id) => {
                    let item = {};
                    item.infoId = id.data.id;
                    item.historyId = id.data.history[0].id;
                    item.historyDate = new Date();
                    item.info = id.data.data;
                    item.list = id.data.list;
                    item.pin = id.data.history[0].pin;
                    item.type = "book";
                    store.dispatch("userSearchHistory/addHistoryItem", item);
                    listData.id = id.data.id;
                    listData.pin = data.pin ? 1 : 0;
                    listData.created = item.historyDate;
                    listData.historyId = item.historyId;
                    commit("ADD_USER_ACTION_TO_HISTORY", listData);
                });
            }
        }
    },

    //calles the mutation GO_FORWORD
    async goForword({
        commit,
        state
    }) {
        //will commit the mutation just if the current hitory is not in the end of the array
        if (
            state.historyUsersActions.current < state.historyUsersActions.data.length
        ) {
            commit("FORWORD_CURRENT");
            let forwordData =
                state.historyUsersActions.data[state.historyUsersActions.current - 1];
            //if type="SEARCH" set the text search to the next search result
            if (forwordData.type == "SEARCH")
                commit("SET_SEARCH_TO", forwordData.content);
            if (forwordData.type == "ALL") {
                commit("RESET_BOOKS_LIST_TEXT_SEARCH");
                commit("RESET_TEXT_SEARCH");
            }
            if (forwordData.type == "SAVED_LIST") {
                await userFoldersData.getUserSavedList(forwordData.id);
                commit("SET_BOOKIDS", booksids);
                //  state.booksids = booksids;
                //RESET_USER_SAVED_LIST_BOOKS_IDS
                // commit("SET_USER_SAVED_LIST_BOOKS_IDS", booksIds);
                commit("RESET_BOOKS_LIST_TEXT_SEARCH");
                commit("RESET_TEXT_SEARCH");
            }
            if (forwordData.type == "SYSTEM_LIST") {
                await loadSystemFoldersFromServer
                    .getSystemFoldersBooksIdListById(forwordData.id)
                    .then(() => {
                        state.systemBooksList = isSystemBooksList;
                        isSystemBooksList = [];
                        commit("RESET_BOOKS_LIST_TEXT_SEARCH");
                        commit("RESET_TEXT_SEARCH");
                    });
            }
            if (forwordData.type == "SYSTEM_MULTIPLE_LISTS") {
                commit("RESET_SYSTEM_MULTIPLE_LISTS");
                //sedin to server get request to get the list of books of system list
                await loadSystemFoldersFromServer.getSystemFoldersMultipleBooksLists(
                    forwordData.groups
                );
                //if there were no data or if its undefined step out from addin and return
                systemBooksMultipleLists = isSystemBooksList;
                isSystemBooksList = [];
                state.refreshSystemList = !state.refreshSystemList;
                commit("RESET_BOOKS_LIST_TEXT_SEARCH");
                commit("RESET_TEXT_SEARCH");
            }
            if (forwordData.type == "AUTHOR_LIST") {
                commit("RESET_TEXT_SEARCH");
            }

            commit("GO_FORWORD");
        }
    },
    //calles the mutation GO_FORWORD
    async goToHistory({
        commit,
        state,
        rootGetters,
        getters
    }, {
        id,
        listData
    }) {
        if (id == state.historyUsersActions.current) state.triggerScrollToTop++;
        commit("SET_PIN_CHECKS", true);
        state.historyUsersActions.isAddedToHistory = false;
        commit("REFRESH_CHECKS");
        commit("SET_SHOW_HIDDEN_BOOKS", false);
        let forwordData;
        if (id == -1) {
            //came from history in menu, need to add item to useractions
            forwordData = listData;
        } else forwordData = state.historyUsersActions.data[id - 1];
        //update historydate to now

        history
            .updateSearchHistoryDate({
                id: forwordData.historyId
            })
            .then((history) => {
                forwordData.historyDate = new Date();
            });
        //if type="SEARCH" set the text search to the next search result
        if (forwordData.type == "SEARCH")
            commit("SET_SEARCH_TO", forwordData.content);
        if (forwordData.type == "ALL") {
            commit("RESET_BOOKS_LIST_TEXT_SEARCH");
            commit("RESET_TEXT_SEARCH");
        }
        if (
            forwordData.type == "HIDDEN_LIST" ||
            (forwordData.type == "CUSTOM_LIST" &&
                (forwordData.content == "מוסתרים" || forwordData.content == "hidden"))
        ) {
            console.log(forwordData.type);
            const booksids = getters.getAllHiddenBooks();
            console.log(booksids);
            commit("SET_SHOW_HIDDEN_BOOKS", true);
            commit("SET_BOOKIDS", booksids);
            commit("RESET_BOOKS_LIST_TEXT_SEARCH");
            commit("RESET_TEXT_SEARCH");
        }
        if (forwordData.type == "SAVED_LIST") {
            await userFoldersData.getUserSavedList(forwordData.listId);
            commit("SET_BOOKIDS", booksids);
            //  state.booksids = booksids;
            //RESET_USER_SAVED_LIST_BOOKS_IDS
            // commit("SET_USER_SAVED_LIST_BOOKS_IDS", booksIds);
            commit("RESET_BOOKS_LIST_TEXT_SEARCH");
            commit("RESET_TEXT_SEARCH");
        }
        if (forwordData.type == "SYSTEM_LIST") {
            await loadSystemFoldersFromServer.getSystemFoldersBooksIdListById(
                forwordData.listId
            );

            state.systemBooksList = isSystemBooksList;
            isSystemBooksList = [];
            commit("RESET_BOOKS_LIST_TEXT_SEARCH");
            commit("RESET_TEXT_SEARCH");
        }
        if (forwordData.type == "SYSTEM_MULTIPLE_LISTS") {
            commit("RESET_SYSTEM_MULTIPLE_LISTS");
            //sedin to server get request to get the list of books of system list
            await loadSystemFoldersFromServer.getSystemFoldersMultipleBooksLists(
                forwordData.groups
            );

            //if there were no data or if its undefined step out from addin and return
            systemBooksMultipleLists = isSystemBooksList;
            isSystemBooksList = [];
            state.refreshSystemList = !state.refreshSystemList;
            commit("RESET_BOOKS_LIST_TEXT_SEARCH");
            commit("RESET_TEXT_SEARCH");
        }
        if (forwordData.type == "AUTHOR_LIST") {
            commit("RESET_TEXT_SEARCH");
        } else if (forwordData.type == "HIDDEN_LIST") {
            commit("RESET_TEXT_SEARCH");
        }
        if (forwordData.type == "RECENT_BOOKS") {
            let recentBooks = rootGetters["userRecentBooks/getRecentBooks"];
            commit("SET_BOOKIDS", [...recentBooks.map((a) => a.bookId)]);
        }
        if (forwordData.type == "CUSTOM_LIST") {
            commit("SET_BOOKIDS", forwordData.ids);
            commit("RESET_TEXT_SEARCH");
        }

        // commit("RESET_TEXT_SEARCH");
        if (id == -1) commit("ADD_USER_ACTION_TO_HISTORY", forwordData);
        else commit("SET_CURRENT", id);
        // commit("GO_FORWORD");
    },
    setShowHide({
        state
    }, val) {
        state.showHide = val;
    },
    //calles the mutation GO_BACK
    async goBack({
        commit,
        state
    }) {
        //will commit the mutation just if the current hitory is not at the start of the array
        if (state.historyUsersActions.current > 1) {
            commit("BACK_CURRENT");
            let backwordData =
                state.historyUsersActions.data[state.historyUsersActions.current - 1];
            if (backwordData == undefined || backwordData == null) {
                return;
            }
            //if type="SEARCH" set the text search to the pre search result
            if (backwordData.type == "SEARCH")
                commit("SET_SEARCH_TO", backwordData.content);
            if (backwordData.type == "ALL") {
                commit("RESET_BOOKS_LIST_TEXT_SEARCH");
                commit("RESET_TEXT_SEARCH");
            }
            if (backwordData.type == "SAVED_LIST") {
                await userFoldersData.getUserSavedList(backwordData.id);
                //state.booksids = booksids;
                commit("SET_BOOKIDS", booksids);
                //RESET_USER_SAVED_LIST_BOOKS_IDS
                //commit("SET_USER_SAVED_LIST_BOOKS_IDS", booksIds);
                commit("RESET_BOOKS_LIST_TEXT_SEARCH");
                commit("RESET_TEXT_SEARCH");
            }
            if (backwordData.type == "SYSTEM_LIST") {
                await loadSystemFoldersFromServer
                    .getSystemFoldersBooksIdListById(backwordData.id)
                    .then(() => {
                        state.systemBooksList = isSystemBooksList;
                        isSystemBooksList = [];
                        commit("RESET_BOOKS_LIST_TEXT_SEARCH");
                        commit("RESET_TEXT_SEARCH");
                    });
            }
            if (backwordData.type == "SYSTEM_MULTIPLE_LISTS") {
                commit("RESET_SYSTEM_MULTIPLE_LISTS");
                //sedin to server get request to get the list of books of system list
                await loadSystemFoldersFromServer.getSystemFoldersMultipleBooksLists(
                    backwordData.groups
                );
                //if there were no data or if its undefined step out from addin and return
                systemBooksMultipleLists = isSystemBooksList;
                isSystemBooksList = [];
                state.refreshSystemList = !state.refreshSystemList;
                commit("RESET_BOOKS_LIST_TEXT_SEARCH");
                commit("RESET_TEXT_SEARCH");
            }
            if (backwordData.type == "AUTHOR_LIST") {
                commit("RESET_TEXT_SEARCH");
            }
            commit("GO_BACK");
        }
    },
    createIndex({}, data) {
        // return new Promise((res, rej) => {
        //   try {
        //     indexData = txtIndexerLib.createIndex(data, {
        //       properties: [
        //         { prop: "name", level: 7 },
        //         "volume",
        //         { prop: "addnames", level: 1, type: "ObjectArray", keys: ["name"] },
        //         { prop: "authors", level: 1, type: "ObjectArray", keys: ["name"] },
        //         { prop: "places", level: 1, type: "ObjectArray", keys: ["name"] },
        //       ],
        //     });
        //     res();
        //   } catch (err) {
        //     throw err;
        //   }
        // });
    },
    setSelectedContex({
        commit
    }, book) {
        commit("SET_SELECTED_CONTEX", book);
    },
    resetSelectedContex({
        commit
    }) {
        commit("RESET_SELECTED_CONTEX");
    },
};
export const getters = {
    getDoNotFocus(state) {
        return state.doNotFocus;
    },
    getFavoriteCheckBooksCount(state) {
        return state.favoriteCheckBooksCount;
    },
    getHiddenBooksLength(state, getters, rootState) {
        let react = rootState.booksChanged;
        return state.currentHideBooksCount;
    },
    getOpenVolumes(state) {
        let react = state.refreshOpenVols;
        return booksOpenVols;
    },
    getBookListHistory(state) {
        let history = state.historyUsersActions.data.filter((l) => l.type != "ALL");

        history = history.map((h, i) => {
            return {
                title: h.content,
                index: i + 2,
                pin: h.pin,
                //id: h.id,
                created: h.created,
                historyId: h.historyId,
                listId: h.historyId,
                _id: h._id,
                lastActive: h.lastActive,
            };
        });
        history.sort((a, b) => {
            if (a.pin < b.pin) return 1;
            if (a.pin > b.pin) return -1;
            if (a.created < b.created) return 1;
            if (a.created > b.created) return -1;
            return -1;
        });
        return history;
    },
    getAllHiddenBooks: (state) => () => {
        return bookListSortedByBook.filter((a) => a._hide).map((a) => a.id);
    },
    getCurrentListType(state) {
        return state.historyUsersActions.data[state.historyUsersActions.current - 1]
            .type;
    },
    getTextSearchInput(state) {
        return state.textSearch;
    },
    getBooksListTextSearchInput(state) {
        return state.booksListTextSearch;
    },
    getLengthOfCurrentList: (state, getters) => () => {
        //let lst = getters.getCurrentList();
        //let num = lst.filter((b) => b._show && !b._hide).length;

        //return num;
        return state.currentListLength;
    },
    getDataOfCurrentList(state, getters) {
        let current = state.historyUsersActions.current;
        // let lst = getters.getCurrentList().length;

        let data = state.historyUsersActions.data[current - 1];
        let currentData = {
            current,
            data,
        };

        return currentData;
    },
    getNameListBook(state) {
        if (!state.textSearch)
            return state.historyUsersActions.data[
                state.historyUsersActions.current - 1
            ].content;
        return state.textSearch;
    },
    getBooksCheckedInfo: (state, getters) => (closesdarot = false) => {
        let books = getters.getCurrentList.filter(
            (book) => booksChecked[book.special ? book.book.id : book.id]
        );
        let finalBooks = [];

        if (closesdarot) {
            let bookVolumes = new Map();
            let mainVols = new Set();
            if (
                state.historyUsersActions.data[state.historyUsersActions.current - 1]
                .type != "ALL"
            ) {
                books.forEach((book) => {
                    if (book.special) book = book.book;

                    if (book.mainVolume) {
                        if (book.mainVolume == book.id) {
                            mainVols.add(book.id);
                            let vols = bookVolumes.get(book.id);
                            if (vols) vols++;
                            else vols = 1;
                            bookVolumes.set(book.id, vols);
                        } else {
                            let vols = bookVolumes.get(book.mainVolume);
                            if (vols) vols++;
                            else vols = 1;
                            bookVolumes.set(book.mainVolume, vols);
                        }
                    }
                });
            }

            books.forEach((book) => {
                if (book.special) book = book.book;

                if (
                    state.historyUsersActions.data[state.historyUsersActions.current - 1]
                    .type != "ALL"
                ) {
                    let crachim = bookVolumes.get(book.id);

                    if (crachim) book.volumesNum = crachim;
                } else book.volumesNum = book.volumes_length;
            });

            books = books.filter((book) => {
                if (book.special) book = book.book;
                return (
                    book.mainVolume === book.id ||
                    book.mainVolume === null ||
                    booksOpenVols[book.mainVolume] ||
                    !mainVols.has(book.mainVolume)
                );
            });

            books = books.filter((book) => {
                if (book.special) book = book.book;

                return !book._hide || VueInst.userSettings.settings.enableHidden == "0";
            });

            let mainVol = null;
            books.forEach((book) => {
                if (book.special) book = book.book;
                if (book.volumesNum || !book.mainVolume) {
                    finalBooks.push(book);
                    mainVol = book.mainVolume;
                } else {
                    if (mainVol != book.mainVolume) {
                        mainVol = book.mainVolume;
                        let crachim = bookVolumes.get(mainVol);

                        if (crachim) book.volumesNum = crachim;
                        else book.volumesNum = book.volumes_length;

                        finalBooks.push(book);
                    }
                }
            });
        } else {
            books = books.filter((book) => {
                if (book.special) book = book.book;

                return !book._hide;
            });

            finalBooks = books;
        }

        return finalBooks.map((book) => {
            if (book.special) book = book.book;

            let name =
                book.volumesNum > 1 && closesdarot ?
                getBookName(book.name, book.volume) +
                " - " +
                book.volumesNum + // book.volumes_length +
                " כרכים" :
                getBookName(book.name, book.volume, true);
            return {
                book: book.id,
                name,
                author: book.mainAuthorName,
                places: book.places,
                years: bookYears(book),
            };
        });
    },
    //central getter for books list that refer by the actions of the user to the required getter
    getCurrentList(state, getters, rootState) {
        // getCurrentListToMem: (state, getters) => () => {
        //state.historyUsersActions.current = 1;
        // let curr = state.historyUsersActions.current - 1;
        // let currntDt = state.historyUsersActions.data[curr];
        //to follow active stare changes
        const mode = state.searchByIds;
        const listType =
            state.historyUsersActions.data[state.historyUsersActions.current - 1]
            .type;
        const categoryType =
            state.historyUsersActions.data[state.historyUsersActions.current - 1]
            .categoryTypeId;
        let trigger = rootState.triggerBooksGetter;
        let trigger2 = rootState.booksChanged;
        const itemInfo =
            state.historyUsersActions.data[state.historyUsersActions.current - 1];
        const listId =
            state.historyUsersActions.data[state.historyUsersActions.current - 1].id;
        const activeList = state.active;
        const sortSetting = VueInst.userSettings.settings.sortBookList;
        const txtSearch = state.textSearch.trim();
        const searchIn = state.booksListTextSearch;
        const currentList = state.historyUsersActions.current;
        //here all react data we should ignore the cache (and set new one)
        let cacheConfig = {
            cacheCounter,
            listType,
            activeList,
            sortSetting,
            txtSearch,
            searchIn,
            currentList,
            trigger,
            trigger2,
            mode,
        };
        //if we still in loading process then just return empty array
        if (rootState.loader.loaders.length) return [];

        if (
            listType == "SAVED_LIST" ||
            listType == "CUSTOM_LIST" ||
            listType == "SYSTEM_LIST"
        ) {
            //temp for now
            if (itemInfo.content == "מועדפים" || itemInfo.content == "favorites") {
                state.favChanged++;
                cacheConfig.favChanged = state.favChanged;
            }
            cacheConfig.listId = listId;
        }
        //check we have the data in the cache
        const cached = checkCacheForGCList(cacheConfig);
        if (cached) {
            let enableHide = VueInst.userSettings.settings.enableHidden != "0";
            state.currentListLength = currentListDataCache.filter((b) => {
                return (
                    ((b.special ? b.book._hide == 0 : b._hide == 0) &&
                        (b.special ? b.book._show : b._show)) ||
                    state.showHiddenBooks ||
                    !enableHide
                );
            }).length;
            return currentListDataCache;
        }
        let x = [];
        if (listType == "SEARCH" && txtSearch == "") {
            //go to full list
            state.historyUsersActions.current = 1;
            x = getters.getBooks();

            //return x;
        }
        if (listType == "AUTHOR_LIST" && txtSearch == "") {
            x = getters.getAuthorListOfBooks();
            //return x;
        } else if (listType == "SIDRA_LIST" && txtSearch == "") {
            x = getters.getBooksBySidraId();

            //return x;
        } else if (listType == "SAVED_LIST" && txtSearch == "") {
            x = getters.getSavedListOfBooks();
            state.currentListLength = x.length;
            // return x;
        } else if (listType == "SYSTEM_LIST" && txtSearch == "") {
            x = getters.getSystemListOfBooks(categoryType === 4); //send true if maagarim for closing sdarot

            //return x;
        }
        //SYSTEM_MULTIPLE_LISTS
        else if (listType == "SYSTEM_MULTIPLE_LISTS" && txtSearch == "") {
            x = getters.getSystemMultipleListOfBooks();
        } else if (listType == "HIDDEN_LIST" && txtSearch == "") {
            x = getters.getCustomList();
        } else if (listType == "CUSTOM_LIST" && txtSearch == "") {
            x = getters.getCustomList();
        } else if (listType == "RECENT_BOOKS" && txtSearch == "") {
            x = getters.getCustomList();
        } else {
            x = getters.getBooks();
        }
        //now sort the books
        let sort;
        if (sortSetting) sort = sortSetting;
        else sort = "book";

        if (
            txtSearch == "" &&
            !(listType == "SEARCH" && txtSearch != "") &&
            !(listType == "ALL") &&
            listType != "RECENT_BOOKS"
        ) {
            if (sort == "book") {
                x.sort((fbook, sbook) => {
                    let a = fbook;
                    let b = sbook;
                    if (a.special) {
                        a = fbook.book;
                        b = sbook.book;
                    }

                    if (a.nameSort > b.nameSort) return 1;
                    if (a.nameSort < b.nameSort) return -1;

                    return -1;
                });
            } else if (sort == "author") {
                x.sort((fbook, sbook) => {
                    let a = fbook;
                    let b = sbook;
                    if (a.special) {
                        a = fbook.book;
                        b = sbook.book;
                    }

                    if (a.authorSort > b.authorSort) return 1;
                    if (a.authorSort < b.authorSort) return -1;

                    return -1;
                });
            } else if (sort == "year") {
                x.sort((fbook, sbook) => {
                    let a = fbook;
                    let b = sbook;
                    if (a.special) {
                        a = fbook.book;
                        b = sbook.book;
                    }
                    if (a.pubYearValue > b.pubYearValue) return 1;
                    if (a.pubYearValue < b.pubYearValue) return -1;

                    if (a.nameSort > b.nameSort) return 1;
                    if (a.nameSort < b.nameSort) return -1;
                    return -1;
                });
            }
        }
        /*  fullListCache = x;
          currentSort = sort;
        } */
        if (listType == "CUSTOM_LIST" && itemInfo.orderByPos) {
            x.sort((a, b) => a.SYPos - b.SYPos);
        }

        let enableHide = VueInst.userSettings.settings.enableHidden != "0";
        state.currentListLength = x.filter((b) => {
            return (
                ((b.special ? b.book._hide == 0 : b._hide == 0) &&
                    (b.special ? b.book._show : b._show)) ||
                state.showHiddenBooks ||
                !enableHide
            );
        }).length;

        let lst = x.filter((b) => {
            return (
                (b.special ? b.book._hide : b._hide) &&
                (b.special ? b.book._show : b._show)
            );
        });
        state.currentHideBooksCount = lst.length;
        //currentList = x;
        //state.refreshNewList = !state.refreshListTrigger;

        //cache the data
        currentListReactCache = cacheConfig;
        currentListDataCache = x;
        return x;
    },
    /* getAuthorListOfBooks: (state) => () => {
      let authorNames = state.historyUsersActions.data[
        state.historyUsersActions.current - 1
      ].content.split(" - ");
      const findByName = (lst, name) => {
        for (let i = 0; i < lst.authors_length; i++) {
          if (name.includes(lst[`authors_${i}_name`])) return true;
        }
        return false;
      };
      return bookListSortedByBook.filter((bk) => {
        return findByName(bk, authorNames);
      });
    }, */
    getAuthorListOfBooks: (state) => () => {
        let authorName =
            state.historyUsersActions.data[state.historyUsersActions.current - 1]
            .content;
        let authorIds =
            state.historyUsersActions.data[state.historyUsersActions.current - 1]
            .data;
        const findByName = (lst, name) => {
            for (let i = 0; i < lst.authors_length; i++) {
                if (lst[`authors_${i}_name`] === name) return true;
            }
            return false;
        };

        const findByAuthors = (lst, authors) => {
            for (let i = 0; i < lst.authors_length; i++) {
                if (authors.includes(lst[`authors_${i}_id`])) return true;
            }
            return false;
        };

        return bookListSortedByBook.filter((bk) => {
            return findByAuthors(bk, authorIds);
        });
    },
    getBooksBySidraId: (state) => () => {
        let mainVol =
            state.historyUsersActions.data[state.historyUsersActions.current - 1]
            .sidraId;

        let books = bookListSortedByBook.filter((bk) => {
            return bk.mainVolume == mainVol;
        });

        if (!books.length) {
            books = bookListSortedByBook.filter((bk) => {
                return bk.id == mainVol;
            });

            if (books.length) {
                mainVol = books[0].mainVolume;
                books = bookListSortedByBook.filter((bk) => {
                    return bk.mainVolume == mainVol;
                });
            }
        }

        return books;
    },
    getCustomList: (state) => () => {
        let testBooks = treeBooks;
        let idsArr = state.booksids;
        let booksList = [];
        idsArr.forEach((bookid) => {
            let b = testBooks.get(testBooks.root, bookid);
            if (b !== undefined && b._show) booksList.push(b);
        });
        if (
            state.booksListTextSearch == "" ||
            state.booksListTextSearch == undefined
        )
            return booksList;
        let listSearch = state.booksListTextSearch;
        return searchInList(listSearch, booksList);
    },
    getSystemMultipleListOfBooks: (state, getters, rootState) => () => {
        // let sysBooks = state.refreshSystemList;

        let testBooks = treeBooks;
        let systemBooksArr = systemBooksMultipleLists;
        let booksList = [];
        let page;
        systemBooksArr.filter((systemB, index) => {
            let b = testBooks.get(testBooks.root, systemB.bookId);

            //before push set i need to set the page data
            if (b !== undefined && b._show) {
                if (systemB.pageId !== 0) page = systemB.pageId;
                booksList.push({
                    book: b,
                    page: page,
                    id: b.id + " " + index,
                    mainVolume: b.mainVolume,
                    special: true,
                });
                //future maybe
                // if (systemB.pageId !== 0) b.dbPageId = systemB.pageId;
                // if (booksList.find((bb) => bb.id == b.id)) {
                // } else {
                // booksList.push(b);
                //  }
            }
        });

        booksList = [...new Set(booksList)];
        if (
            state.booksListTextSearch == "" ||
            state.booksListTextSearch == undefined
        )
            return booksList;
        return searchInList(state.booksListTextSearch, booksList);

        //return searchByTxt(state.booksListTextSearch);
        let listSearch = state.booksListTextSearch;
        listSearch = listSearch.replace(/\s*$/, "");
        let listAlt = altWordHelper.BuildSearchStrings(listSearch);
        let results = [];

        booksList.forEach((bk) => {
            let book = bk;
            if (book.special) book = bk.book;
            let priority = 0;
            listAlt.forEach((value) => {
                if (book.name.includes(value)) {
                    if (book.name == value) priority += 4;
                    else {
                        let n = book.name.indexOf(value);
                        if (n == 0) priority += 3;
                        else if (n == 1) priority += 2;
                        else priority += 1;
                    }
                }
                let bkAuth = book.mainAuthorName;
                if (bkAuth) {
                    if (bkAuth.includes(value)) {
                        if (bkAuth == value) priority += 4;
                        else {
                            let n = bkAuth.indexOf(value);
                            if (n == 0) priority += 3;
                            else if (n == 1) priority += 2;
                            else priority += 1;
                        }
                    }
                }
            });
            if (priority > 0) {
                let temp = book;
                let basicBids = rootState.books.basicBooksIds;
                if (basicBids.find((bb) => bb == temp.id))
                    priority = priority + state.basicBooksPriority;
                temp.priority = priority;
                results.push(temp);
            }
        });

        results.sort((a, b) =>
            a.priority > b.priority ? -1 : b.priority > a.priority ? 1 : 0
        );
        lastBookResults = results;
        return results;
    },
    getSystemListOfBooks: (state, getters, rootState) => (maagarim = false) => {
        let systemBooksArr = state.systemBooksList;
        let booksList = [];
        systemBooksArr.filter((systemB, index) => {
            let b = treeBooks.get(treeBooks.root, systemB.bookId);
            let page;
            //before push set i need to set the page data

            if (b !== undefined && b._show && !b.hide) {
                if (systemB.pageId !== 0) page = systemB.pageId;
                booksList.push({
                    book: b,
                    page: page,
                    id: b.id + " " + index,
                    mainVolume: b.mainVolume,
                    special: true,
                });
            }
        });

        if (maagarim) {
            let grouped = groupByMaagarim(booksList, (r) => r.mainVolume);

            grouped.forEach((v, k) => {
                if (k != null) {
                    let numVols = 0;
                    let mainVol = v.find((o) => o.numVols);
                    if (mainVol) {
                        numVols = mainVol.numVols;
                    }
                    v.forEach((element) => {
                        if (numVols == v.length) element.allVolumes = true;
                        else element.allVolumes = false;
                    });
                }
            });
        }
        if (
            state.booksListTextSearch == "" ||
            state.booksListTextSearch == undefined
        )
            return booksList;
        return searchInList(state.booksListTextSearch, booksList);
    },
    getSavedListOfBooks: (state, getters, rootState) => () => {
        let testBooks = treeBooks;
        let idsArr = state.booksids;
        let booksList = [];

        idsArr.forEach((bookid, index) => {
            let b = testBooks.get(testBooks.root, bookid);
            if (b !== undefined && b._show)
                booksList.push({
                    book: b,
                    id: b.id + " " + index,
                    mainVolume: b.mainVolume,
                    special: true,
                });
        });
        let grouped = groupByMaagarim(booksList, (r) => r.mainVolume);

        grouped.forEach((v, k) => {
            if (k != null) {
                let numVols = 0;
                let mainVol = v.find((o) => o.numVols);
                if (mainVol) {
                    numVols = mainVol.numVols;
                }
                v.forEach((element) => {
                    if (numVols == v.length) element.allVolumes = true;
                    else element.allVolumes = false;
                });
            }
        });

        if (
            state.booksListTextSearch == "" ||
            state.booksListTextSearch == undefined
        )
            return booksList;
        return searchInList(state.booksListTextSearch, booksList);
    },
    getAllBooksSorted() {
        let react = VueInst.$store.state.triggerBooksGetter;

        const sortSetting = VueInst.userSettings.settings.sortBookList;

        let sort = sortSetting ? (sort = sortSetting) : (sort = "book");
        return sort === "book" ?
            bookListSortedByBook :
            sort === "author" ?
            bookListSortedByAuthor :
            bookListSortedByYear;
    },
    getBooks: (state, getters, rootState, rootGetters) => () => {
        let isAdded = state.historyUsersActions.isAddedToHistory;
        // let booksUpdate=rootGetters[]
        let isUpdate = rootGetters["books/getBooksUpdateCount"];

        if (state.textSearch == "") {
            /* let booksList = [];
      books.books.forEach((b) => {
        if (b._show) booksList.push(b);
      });
 */
            //return booksList;
            return getters["getAllBooksSorted"];
        }
        let str = state.textSearch;
        //check if this is ids search or normal search
        if (state.searchByIds) {
            let ret = [];
            let txt = state.textSearch;
            let spl = ",";
            if (!txt.includes(",")) spl = " ";
            txt = txt.split(spl);
            txt.forEach((bid) => {
                bid = bid.replace(/\D/g, "");
                let bk = treeBooks.get(treeBooks.root, bid);
                if (!bk) return;
                ret.push({
                    allVolumes: true,
                    book: bk,
                    id: Number(bid),
                    special: true,
                });
            });
            console.log(ret);
            return ret;
        } else return searchByTxt(str, true, state);
    },
    getBooksForSettings: (state, getters, rootState, rootGetters) => () => {
        let isAdded = state.historyUsersActions.isAddedToHistory;
        // let booksUpdate=rootGetters[]
        let isUpdate = rootGetters["books/getBooksUpdateCount"];
        if (state.textSearchSettings == "") {
            return bookListSortedByBook;
        }
        let str = state.textSearchSettings;

        str = str.replace(/\s*$/, "");

        return searchByTxt(str, false, state);
        let results = [];

        // get list alternative words

        let words = altWordHelper.getSearchObject(str);
        let retData = txtIndexerLib.searchTinyIndex(words, indexData);

        retData.sort((a, b) => b.match - a.match);
        return retData.map((a) => a.item);
    },
    getChecksCount(state) {
        return state.checkedBooksCount;
    },
    getBooksCount(state) {
        return state.currentListLength;
    },
    getBooksChecked(state) {
        let x = state.refreshBooksChecked;
        return booksChecked;
    },
    getCheckedBooks(state, getters, rootState) {
        let checked = [];
        let x = state.refreshBooksChecked;
        x = rootState.userFavoriteBooks.favoriteChange;
        Object.keys(booksChecked).forEach(function(key, index) {
            let check = booksChecked[key];
            if (check) checked.push(key);
        });

        checked = checked.filter((book) => {
            book = treeBooks.get(treeBooks.root, parseInt(book));
            if (book.special) book = book.book;

            return (
                book._show &&
                (!book._hide || VueInst.userSettings.settings.enableHidden == "0")
            );
        });

        setTimeout(() => {
            let fav = checked.filter((b) => {
                b = treeBooks.get(treeBooks.root, parseInt(b));
                return !b.favorite === false;
            });

            state.favoriteCheckBooksCount = fav.length == checked.length ? 1 : 0;
        }, 10);

        return checked;
    },
    showVols(state) {
        return state.openVols;
    },
};

function searchInList(txtStr, list) {
    if (txtStr.length < 2) return list;
    let str = txtStr.replace(/[^0-9a-zA-Zא-ת\s"]/gi, " ");
    let words = [];
    if (str != "") words = altWordHelper.getSearchObject(str);

    let retData = txtIndexerLib.searchTinyIndex(words, {
        full_points: 1,
        score: {
            name: {
                score: 25,
                firstWordScore: 15,
                wordAtScore: 1,
                bit: 1,
                fullWordScore: 3,
                startWith: 2,
            },
            volume: {
                score: 1,
                bit: 2,
                firstWordScore: 1,
                wordAtScore: 1,
                fullWordScore: 3,
                startWith: 2,
            },
            addnames: {
                score: 1,
                bit: 3,
                firstWordScore: 1,
                wordAtScore: 1,
                fullWordScore: 3,
                startWith: 2,
            },
            authors: {
                score: 4,
                bit: 4,
                firstWordScore: 1,
                wordAtScore: 1,
                fullWordScore: 3,
                startWith: 2,
            },
            places: {
                score: 1,
                bit: 5,
                firstWordScore: 1,
                wordAtScore: 1,
                fullWordScore: 3,
                startWith: 2,
            },
        },
    });

    let res = {};
    retData.forEach((r) => {
        res[r.book] = true;
    });

    return list.filter((l) => res[l.special ? l.book.id : l.id]);
}

function searchByTxt(txtStr, special = false, state = null) {
    //manage advanced search
    let advancesPart = "";
    let advancedWords = [];
    let years = "";
    if (txtStr.indexOf("|") > -1) {
        advancesPart = txtStr.slice(txtStr.indexOf("|") + 1);
        if (advancesPart.indexOf("|") > -1) {
            advancesPart = advancesPart.slice(0, advancesPart.indexOf("|"));
            txtStr = "";
        }

        if (advancesPart != "") {
            let toSearch = {};
            advancesPart = advancesPart.split("&");
            advancesPart.forEach((part) => {
                if (part != "") {
                    part = part.split(":");
                    if (part[0] == "שנה") years = part[1];
                    else toSearch[part[0]] = part[1];
                }
            });
            advancedWords = altWordHelper.getSearchObjectWithSpecCols(toSearch);
        }
    }

    let str = txtStr.replace(/[^0-9a-zA-Zא-ת\s'\""]/gi, " ").trim();

    let tsiyunSearch = str.split("  ");
    if (tsiyunSearch[1]) {
        str = tsiyunSearch[0];
        if (state) state.tsiyunSearch = tsiyunSearch[1];
    } else if (state) state.tsiyunSearch = "";

    let wordsCount = str.split(" ").length;

    let words = [];
    if (str != "") words = altWordHelper.getSearchObject(str);

    let finalWords = [...words, ...advancedWords];
    let retData;
    let booksList = [];
    state.hiddenBooks = 0;
    let itemIsBook = true;
    if (finalWords.length > 0) {
        retData = txtIndexerLib.searchTinyIndex(finalWords, {
            full_points: 1,
            score: {
                name: {
                    score: 25,
                    firstWordScore: 15,
                    wordAtScore: 1,
                    bit: 1,
                    fullWordScore: 20,
                    startWith: 2,
                },
                volume: {
                    score: 1,
                    bit: 2,
                    firstWordScore: 1,
                    wordAtScore: 1,
                    fullWordScore: 3,
                    startWith: 2,
                },
                addnames: {
                    score: 1,
                    bit: 3,
                    firstWordScore: 1,
                    wordAtScore: 1,
                    fullWordScore: 3,
                    startWith: 2,
                },
                authors: {
                    score: 4,
                    bit: 4,
                    firstWordScore: 1,
                    wordAtScore: 1,
                    fullWordScore: 3,
                    startWith: 2,
                },
                places: {
                    score: 1,
                    bit: 5,
                    firstWordScore: 1,
                    wordAtScore: 1,
                    fullWordScore: 3,
                    startWith: 2,
                },
            },
        });
    } else {
        retData = bookListSortedByBook;
        itemIsBook = false;
    }
    if (itemIsBook) {
        retData.forEach((i) => {
            i.item = treeBooks.get(treeBooks.root, i.book);
        });
    }
    retData.forEach((ret) => {
        let i = itemIsBook ? ret : {
            item: ret
        };
        if (i.item === undefined) return;

        if (i.item._show) booksList.push(i);
        else state.hiddenBooks++;
    });

    //filter by years

    if (years != "") {
        booksList = filterByYears(years, booksList, finalWords.length == 0);
    }
    if (finalWords.length > 0) {
        let grouped = groupBy(booksList, (r) => r.item.mainVolume);
        grouped.forEach((v, k) => {
            if (k != null) {
                let maxMatch = Math.max.apply(
                    Math,
                    v.map(function(o) {
                        return o.match;
                    })
                );
                let numVols = 0;
                let bookMatch = 0;
                let mainVol = v.find((o) => o.numVols);
                if (mainVol) {
                    numVols = mainVol.numVols;
                    if (mainVol.bookMatchCount == wordsCount)
                        if (mainVol.item.name.indexOf(str) == 0) bookMatch++;
                }
                v.forEach((element) => {
                    element.match = maxMatch;
                    if (numVols == v.length) element.allVolumes = true;
                    else element.allVolumes = false;
                    element.bookNameMatch += bookMatch;
                });
            } else {
                v.forEach((element) => {
                    if (element.bookMatchCount == wordsCount)
                        if (element.item.name.indexOf(str) == 0) element.bookNameMatch++;
                });
            }
        });

        booksList.sort((a, b) => {
            if (a.bookNameMatch > b.bookNameMatch) return -1;
            if (a.bookNameMatch < b.bookNameMatch) return 1;

            if (a.bookMatchCount > b.bookMatchCount) return -1;
            if (a.bookMatchCount < b.bookMatchCount) return 1;

            if (a.match > b.match) return -1;
            if (a.match < b.match) return 1;

            if (a.item.nameSort > b.item.nameSort) return 1;
            if (a.item.nameSort < b.item.nameSort) return -1;

            return -1;
        });
        if (special) {
            return booksList.map((a, i) => {
                return {
                    id: i,
                    special: true,
                    allVolumes: a.allVolumes,
                    book: a.item,
                };
            });
        } else {
            return booksList.map((a) => a.item);
        }
    } else {
        let grouped = groupBy(booksList, (r) => r.item.mainVolume);

        grouped.forEach((v, k) => {
            if (k != null) {
                /* let maxMatch = Math.max.apply(
                  Math,
                  v.map(function(o) {
                    return o.match;
                  })
                ); */
                let numVols = 0;
                let bookMatch = 0;
                let mainVol = v.find((o) => o.numVols);
                if (mainVol) {
                    numVols = mainVol.numVols;
                    if (mainVol.bookMatchCount == wordsCount)
                        if (mainVol.item.name.indexOf(str) == 0) bookMatch++;
                }
                v.forEach((element) => {
                    // element.match = maxMatch;
                    if (numVols == v.length) element.allVolumes = true;
                    else element.allVolumes = false;
                    // element.bookNameMatch += bookMatch;
                });
            } else {
                /*  v.forEach((element) => {
                  if (element.bookMatchCount == wordsCount)
                    if (element.item.name.indexOf(str) == 0) element.bookNameMatch++;
                }); */
            }
        });

        booksList.sort((a, b) => {
            if (a.item.nameSort > b.item.nameSort) return 1;
            if (a.item.nameSort < b.item.nameSort) return -1;

            return -1;
        });

        if (special) {
            return booksList.map((a, i) => {
                return {
                    id: i,
                    special: true,
                    allVolumes: a.allVolumes,
                    book: a.item,
                };
            });
        } else {
            return booksList.map((a) => a.item);
        }
    }
}

function filterByYears(years, books, all = false) {
    years = years.split("-");
    let fromDate = 0;
    let todate = 0;
    fromDate = hebrewDateToGreg(years[0]);
    if (years.length > 1) todate = hebrewDateToGreg(years[1]);
    else todate = fromDate;

    if (all) {
        let b = books.filter((r) => {
            try {
                // return true;
                let fromYear = hebrewDateToGreg(r.item.fromyear);
                let toYear = hebrewDateToGreg(r.item.toyear);
                return (fromYear >= fromDate && fromYear <= todate) ||
                    (toYear >= fromDate && toYear <= todate) ?
                    true :
                    false;
            } catch (ex) {
                return false;
            }
        });
        return b;
    } else {
        let b = books.filter((r) => {
            try {
                let fromYear = hebrewDateToGreg(r.item.fromyear);
                let toYear = hebrewDateToGreg(r.item.toyear);
                return (fromYear >= fromDate && fromYear <= todate) ||
                    (toYear >= fromDate && toYear <= todate) ?
                    true :
                    false;
            } catch (ex) {
                return false;
            }
        });
        return b;
    }
}

function hebrewDateToGreg(date) {
    if (!isNaN(date)) return parseInt(date) + 3761;
    date = date
        .replace("ך", "כ")
        .replace("ף", "פ")
        .replace("ן", "נ")
        .replace("ם", "מ")
        .replace("ץ", "צ");
    let gregDate = Hebcal.gematriya(date);
    if (gregDate < 1000) gregDate += 5000;
    return gregDate;
}

function groupBy(list, keyGetter) {
    const map = new Map();

    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            if (item.item.id == key) item.numVols = item.item.volumes_length;
            map.set(key, [item]);
        } else {
            if (item.item.id == key) item.numVols = item.item.volumes_length;
            collection.push(item);
        }
    });
    return map;
}

function groupByMaagarim(list, keyGetter) {
    const map = new Map();

    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            if ((item.book ? .id || item.id) == key)
                item.numVols = item.book ? .volumes_length || item.volumes_length;
            map.set(key, [item]);
        } else {
            if ((item.book ? .id || item.id) == key)
                item.numVols = item.book ? .volumes_length || item.volumes_length;
            collection.push(item);
        }
    });
    return map;
}