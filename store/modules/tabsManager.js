import store from "@/store/store.js";
import * as tabModule from "./_tab.js";
import {
    getAllData,
    getFSResultsPages,
    getUserTsiyunim,
    openBook,
} from "@/services/bookData.js";
import Vue from "vue";
import config from "@/config/general.js";
import {
    getPersonalAdditionsByBook
} from "@/services/loadUserPersonalExtensions";
import winBooksMgr from "@/services/book_win.js";
import {
    getWordsCoords
} from "@/services/freeSearch.js";
import {
    getMmts
} from "@/services/bookToolBoxMethods.js";
import * as mefo from "@/services/mefo/mefo.js";
import * as pako from "pako";
export const namespaced = true;

function realtabs() {
    return state.tabs.filter((e) => !String(e).startsWith("win_"));
}

const MAX_TABS = 40;
const MAX_WINS = 30;
const shasVilnaBooks = [
    173917, 173919, 173920, 173921, 173922, 173923, 173924, 173925, 173926,
    173927, 173928, 173929, 173930, 173931, 173932, 173933, 173934, 173935,
    173936, 173937, 176549, 176550, 176551, 176552, 176553, 176554, 176555,
    176556, 176557, 176558, 176559, 176562, 176563, 176564, 176565, 176566,
    176566,
];

export const state = {
    prevTabId: "",
    currentTabId: "",
    tabs: [],
    maxShown: 5,
    bookFit: "width",
    fullScreen: false,
    showBookLists: true,
    resizeToggle: false,
    splitterChange: false,
    initCropper: false,
    searchPage: "",
    scrollToFsResult: false,
    scrollToMefMask: false,
    pinnedTabs: {},
    showMagnifier: false,
    draggingTab: false,
    dragStarted: false,
    shownTabs: [],
    hiddenTabs: [],
    showHeadersTabId: null,
    userClick: false,
    showSpinner: false,
};

export const mutations = {
    PIN_TAB(state, {
        tabId,
        pin
    }) {
        if (pin) Vue.set(state.pinnedTabs, tabId, true);
        else Vue.delete(state.pinnedTabs, tabId);
    },
    TOGGLE_PIN_TAB(state, {
        tabId
    }) {
        if (!state.pinnedTabs[tabId]) Vue.set(state.pinnedTabs, tabId, true);
        else Vue.delete(state.pinnedTabs, tabId);
    },
    SET_SEARCH_PAGE(state, search) {
        state.searchPage = search;
    },
    INC_SEARCH_PAGE(state, search) {
        state.searchPage += search;
    },
    SET_SHOWN_HIDDEN_TABS(state) {
        state.shownTabs = [];
        state.hiddenTabs = [];
        let count = 0;
        let i;
        for (i = 0; i < state.tabs.length; i++) {
            let t = state.tabs[i];
            if (String(t).startsWith("win_")) continue;
            if (count < state.maxShown || state.maxShown == 0) {
                state.shownTabs.push(t);
                count++;
            } else {
                if (t != state.currentTabId && !state.pinnedTabs[t])
                    state.hiddenTabs.push(t);
                else {
                    //find the last tab that can be popped
                    let poppingTabs = state.shownTabs.filter(
                        (t) => t != state.currentTabId && !state.pinnedTabs[t]
                    );
                    if (poppingTabs.length == 0) {
                        if (t != state.currentTabId) state.hiddenTabs.push(t);
                        else {
                            let tab = state.shownTabs.pop();
                            state.shownTabs.push(t);
                            state.hiddenTabs.push(tab);
                        }
                    } else {
                        let tab = poppingTabs.pop();
                        var index = state.shownTabs.indexOf(tab);
                        if (index !== -1) {
                            state.shownTabs.splice(index, 1);
                        }
                        state.shownTabs.push(t);
                        state.hiddenTabs.push(tab);
                    }
                }
            }
        }
    },
    ADD_TAB(state, id) {
        state.tabs.push(id);
        return;
        //if too many tabs, move first tab to the end and push the new tab at the end of the shown tabs
        if (realtabs().length >= state.maxShown) {
            //get id of lans shown tab
            let count = 0;
            let idToSlice;
            state.tabs.forEach((t, i) => {
                if (!t.startsWith("win_")) count++;
                if (count == state.maxShown) {
                    idToSlice = i;

                    return;
                }
            });
            state.tabs.splice(idToSlice + 1, 0, id);
            let first = state.tabs.shift();
            state.tabs.push(first);
        } else state.tabs.push(id);
    },
    DEL_TAB(state, id) {
        let globalIndex = state.tabs.findIndex((t) => t == id);
        if (globalIndex === -1) return;

        let index = realtabs().findIndex((t) => t == id);

        if (id == state.currentTabId) {
            if (index > 0) state.currentTabId = realtabs()[index - 1];
            else if (realtabs().length > 1) state.currentTabId = realtabs()[1];
        }
        state.tabs.splice(globalIndex, 1);

        if (state.tabs.length == 0) {
            state.currentTabId = "";
        }

        //remove from shown and hidden arrays
        index = state.shownTabs.findIndex((t) => t == id);
        if (globalIndex > -1) state.shownTabs.splice(index, 1);

        index = state.hiddenTabs.findIndex((t) => t == id);
        if (globalIndex > -1) state.hiddenTabs.splice(index, 1);
    },
    GO_TO_NEXT_TAB(state) {
        let tabs = realtabs();
        if (tabs.length == 0) return;
        let currInx = tabs.indexOf(state.currentTabId);
        if (currInx == tabs.length - 1) state.currentTabId = tabs[0];
        else state.currentTabId = tabs[currInx + 1];

        let book = store.getters[`tabs/${state.currentTabId}/getBook`];
        let page = store.getters[`tabs/${state.currentTabId}/getPage`];

        openBook(book, page, state.currentTabId);
    },
    //set id of current tab
    SET_CURRENT_TABID(state, id) {
        // state.prevTabId = state.currentTabId;
        state.currentTabId = id;
    },
    MOVE_TAB(state, payLoad) {
        let toIndex;
        if (payLoad.toId) toIndex = state.tabs.indexOf(payLoad.toId);
        else toIndex = payLoad.toIndex;
        let index = state.tabs.indexOf(payLoad.id);
        if (index !== -1) state.tabs.splice(index, 1);
        state.tabs.splice(toIndex, 0, payLoad.id);
    },
    //set max tabs to show open - accorrding to place on screen
    SET_MAXSHOWN(state, {
        max
    }) {
        state.maxShown = max;
    },
    SET_BOOK_FIT(state, {
        fit
    }) {
        state.bookFit = fit;
    },
    ADD_USER_TSIYUN(state, r) {
        state.userTsiyunim.unshift(r);
    },
    DEL_USER_TSIYUN(state, {
        id
    }) {
        state.userTsiyunim = state.userTsiyunim.filter((tsiyun) => tsiyun.id != id);
    },
    SET_FULL_SCREEN(state) {
        state.fullScreen = !state.fullScreen;
    },

    TOGGLE_SHOW_BOOKLISTS(state, show) {
        if (show == undefined) state.showBookLists = !state.showBookLists;
        else state.showBookLists = show;
    },

    SET_SPLITTER_CHANGE(state) {
        state.splitterChange = !state.splitterChange;
    },
    SET_INIT_CROPPER(state) {
        state.initCropper = !state.initCropper;
    },

    SET_TOGGLE_RESIZE(state) {
        state.resizeToggle = !state.resizeToggle;
    },
};

export const actions = {
    async reloadMefSections({
        dispatch,
        getters
    }, {
        bookId,
        tabId
    }) {
        let sv = getters["isShasVilna"](bookId);
        if (sv) {
            const rects = await mefo.getPageRects(bookId);
            let mefoSecs = pako.inflate(rects.data, {
                to: "string"
            });
            mefoSecs = JSON.parse(mefoSecs);
            let keys = Object.keys(mefoSecs);
            //remove gilyon hashas
            if (keys[0]) {
                mefoSecs[keys[0]] = mefoSecs[keys[0]].filter((a) => a.type != "mf3");
            }
            dispatch(`tabs/${tabId}/setShasSections`, mefoSecs, {
                root: true,
            });
        }
    },
    removeAllWindows({
        commit,
        state,
        dispatch,
        getters
    }) {
        let tabsToDel = [];
        let openTabs = getters["getOpenBooks"];
        for (let i = 0; i < openTabs.length; i++) {
            let tab = openTabs[i];
            tabsToDel.push(tab);
        }
        tabsToDel.forEach((tab) => dispatch("delTab", tab));
    },
    async addTab({
        commit,
        state,
        dispatch,
        getters
    }, bookData) {
        //close welcome win
        if (!bookData.tabId.toString().startsWith("win_"))
            dispatch("welcome/closewindow", null, {
                root: true
            });
        return new Promise(async function(resolve, reject) {
            let tabs = state.tabs;
            let tabId = bookData.tabId.toString();
            //if tab does not exist, add it

            if (!tabs.includes(tabId)) {
                const overflow = tabId.startsWith("win_") ?
                    getters["winBooksOverflow"] :
                    getters["tabsOverflow"];
                if (overflow) {
                    winBooksMgr.tabsOverflowWarning(tabId.startsWith("win_"));
                    return;
                }
                store.registerModule(["tabs", tabId], tabModule);
            }
            let tabBook = store.getters[`tabs/${tabId}/getBook`];
            //set tab data only if it is a different book
            if (tabBook != bookData.book)
                store.dispatch(
                    `tabs/${tabId}/setTabData`, {
                        id: tabId,
                        book: bookData.book,
                        page: bookData.page,
                        title: bookData.title,
                        scrollPosition: bookData.scrollPosition,
                        drawData: bookData.drawData,
                        override: bookData.override,
                        tsiyunim: bookData.tsiyunim,
                        pages: bookData.pages,
                        personalAdditions: {
                            comments: [],
                            keys: [],
                            markers: [],
                            links: [],
                        },
                        userTsiyuns: bookData.userTsiyuns,
                        scrollTo: bookData.page,
                        winWidth: bookData.width ? bookData.width : 500,
                        winHeight: bookData.height ? bookData.height : 500,
                        volumes: bookData.volumes ? bookData.volumes : false,
                        masks: bookData ? .masks ? bookData ? .masks : [],
                        //pageHeight: 1600,
                    }, {
                        root: true
                    }
                );

            //anyway set it to current

            if (!tabs.includes(tabId)) {
                commit("ADD_TAB", tabId);
            }
            if (!getters.isWindow(tabId)) {
                dispatch("setCurrentTabId", tabId);
            }
            //  commit("SET_CURRENT_TABID", tabId);
            resolve(true);
        });
    },
    delTab({
        commit,
        state,
        dispatch,
        getters,
        rootState
    }, id) {
        //send close tab action
        globalThis.__v8_wasm_ofs.bookclose(rootState.tabs[id].book);
        dispatch(`tabs/${id}/closeTabEvent`, null, {
            root: true
        });

        commit("DEL_TAB", id);

        store.unregisterModule(["tabs", id]);

        let hidden = getters.isHidden(state.currentTabId);
        if (hidden)
            dispatch("moveTabTo", {
                id: state.currentTabId,
                toIndex: state.maxShown - 1,
            });
        //clear search in book txt if no books are open
        if (state.tabs.length == 0) {
            store.state.freeSearch.searchInBookTxt = "";
        }
    },
    async setCurrentTabId({
        dispatch,
        commit,
        state,
        getters
    }, id) {
        commit("SET_CURRENT_TABID", id);
        commit("SET_SHOWN_HIDDEN_TABS");

        let hidden = getters.isHidden(id);
        if (hidden) {
            let count = 0;
            let idToSlice = -1,
                pinIdToSlice = -1;

            state.tabs.forEach((t, i) => {
                if (!String(t).startsWith("win_")) count++;
                if (count == state.maxShown) {
                    if (!store.state.tabs[t].pinned) {
                        idToSlice = i;

                        return;
                    } else pinIdToSlice = i;
                }
            });
            if (idToSlice == -1) idToSlice = pinIdToSlice;
            await dispatch("moveTabTo", {
                id,
                toIndex: idToSlice + 1,
            });

            dispatch("moveTabTo", {
                id: realtabs()[0],
                toIndex: getters.getAllTabs.length,
            });
        }
    },
    pinTab({
        commit,
        dispatch
    }, {
        tabId,
        pin
    }) {
        commit("PIN_TAB", {
            tabId,
            pin
        });
        dispatch(`tabs/${tabId}/setPin`, pin, {
            root: true
        });
    },
    togglePinTab({
        commit,
        dispatch
    }, {
        tabId
    }) {
        commit("TOGGLE_PIN_TAB", {
            tabId
        });
        dispatch(`tabs/${tabId}/togglePin`, null, {
            root: true
        });
    },
    setPageToScrollTo({
        dispatch
    }, page) {
        return new Promise(function(resolve, reject) {
            dispatch("setCurrentScrollTo", {
                page
            });
            resolve();
        });
    },
    async scrollToInitPage({
        dispatch,
        rootState
    }, {
        bookData,
        moreData
    }) {
        let tabId = bookData.tabId;
        if (
            bookData.drawData ? .fs ? .fs != "0" &&
            bookData.drawData ? .fs ? .fs != undefined
        ) {
            await getFSResultsPages(bookData.drawData, moreData.pages, bookData.book);
            rootState.tabs[bookData.tabId].react++;

            let page;
            let fsPage = moreData.pages.filter((page) => page.words != undefined);
            if (fsPage.length > 0 && bookData.page <= 1)
                page = fsPage[0].position ? fsPage[0].position : fsPage[0].id;
            else page = bookData.page;
            dispatch(`tabs/${tabId}/setScrollTo`, page, {
                root: true
            });
        } else if (String(bookData.page).startsWith("P")) {
            let pId, pKey;
            if (String(bookData.page).startsWith("PID_")) {
                pId = String(bookData.page).slice(4);
                pKey = "name";
            } else {
                pId = String(bookData.page).slice(1);
                pKey = "id";
            }
            let currPage = moreData.pages.filter(
                (page) => String(page[pKey]) == String(pId)
            );
            if (currPage) {
                dispatch(`tabs/${tabId}/setPage`, currPage[0].position, {
                    root: true,
                });
                dispatch(`tabs/${tabId}/setScrollTo`, currPage[0].position, {
                    root: true,
                });
            }
        }
    },
    async sortTsiyunimForSY({
        getters
    }, {
        tsiyunim,
        book
    }) {
        try {
            //if SY book, remove SY tsiyunim and sort

            let isSY = false;
            let SY = store.getters[`books/getBasicBooks`];

            let SYBook = SY.find((s) => s == book);
            isSY = SYBook;

            let SYTsiyun = null;
            if (!SYBook) {
                SYTsiyun = tsiyunim.find((t) => t.catBook == book);
            }
            if (!SYBook && !SYTsiyun) return;
            tsiyunim.forEach((t, i) => {
                t.index = i;
                t.type = 1;
            });
            tsiyunim.sort((a, b) =>
                a.page > b.page ? 1 : a.page < b.page ? -1 : a.index > b.index ? 1 : -1
            );
        } catch (ex) {}
    },
    async setBook({
        dispatch,
        commit,
        getters
    }, bookData) {
        // return new Promise(function(resolve, reject) {
        //close details window
        store.dispatch("bookPopups/closeBookDetails");
        let tabBook = store.getters[`${bookData.tabId}/getBook`];

        await dispatch("addTab", bookData);

        let tabId = bookData.tabId;
        let allTabs = getters.getAllTabs;

        //if it is an empty tab
        if (bookData.book == -1) return true;

        let moreData;
        try {
            if (bookData.pages && bookData.pages.length > 0) return;
            if (!store.state[`tabs`][`${tabId}`].book) return;
            moreData = await getAllData(bookData.book, tabId);
            await dispatch(`tabs/${tabId}/setLicense`, moreData.bookInfo ? .license, {
                root: true,
            });
            try {
                if (!config.isCustomBook(bookData.book) &&
                    !config.isPDFCustomBook(bookData.book)
                ) {
                    sortPages(moreData.pages);
                    await dispatch("sortTsiyunimForSY", {
                        tsiyunim: moreData.tsiyunim,
                        book: bookData.book,
                    });
                }
            } catch {}

            //set scroll to page
            let page = 1;

            if (!String(bookData.page).startsWith("P") &&
                (bookData.drawData ? .fs ? .fs == undefined ||
                    bookData.drawData ? .fs ? .fs == "0")
            ) {
                page = bookData.page;

                //if current tab and search in tsiyun is active (has value in book serach input) then go to tsiyun
                if (tabId == state.currentTabId) {
                    if (store.state.bookList.tsiyunSearch != "") {
                        //go to page of tsiyun
                        let search = moreData.tsiyunim.filter(
                            (t) => t.title.indexOf(store.state.bookList.tsiyunSearch) >= 0
                        );
                        if (search[0]) page = search[0].page;
                    }
                }
            } else page = -1;

            dispatch(`tabs/${tabId}/setTsiyunim`, moreData, {
                root: true,
            });
            await dispatch(`tabs/${tabId}/setScrollTo`, page, {
                root: true,
            });

            await dispatch(`tabs/${tabId}/setPages`, moreData, {
                root: true,
            });

            dispatch(`scrollToInitPage`, {
                bookData,
                moreData
            });

            let userTsiyuns = await getUserTsiyunim(bookData.book);

            userTsiyuns.forEach((t) => {
                try {
                    t.page = moreData.pages.filter((p) => p.id == t.pageId)[0].position;
                } catch {}
            });
            try {
                userTsiyuns.sort((t1, t2) => t1.page - t2.page);
            } catch {}
            //.then((userTsiyuns) => {
            dispatch(`tabs/${tabId}/setUserTsiyuns`, userTsiyuns, {
                root: true,
            });
            //get personal additions, first check if already exists in state
            let additions =
                store.getters["personalAdditionsTabs/getPersonalAdditions"][
                    bookData.book
                ];
            if (!additions)
                additions = await getPersonalAdditionsByBook(bookData.book);
            dispatch(
                `personalAdditionsTabs/setPersonalAdditions`, {
                    bookId: bookData.book,
                    personalAdditions: additions
                }, {
                    root: true,
                }
            );

            let sv = getters["isShasVilna"](bookData.book);
            if (sv) {
                const rects = await mefo.getPageRects(bookData.book);
                moreData.mefo = pako.inflate(rects.data, {
                    to: "string"
                });
                moreData.mefo = JSON.parse(moreData.mefo);
                let keys = Object.keys(moreData.mefo);
                //remove gilyon hashas
                if (keys[0]) {
                    moreData.mefo[keys[0]] = moreData.mefo[keys[0]].filter(
                        (a) => a.type != "mf3"
                    );
                    globalThis.AAAAA = moreData.mefo[keys[0]];
                }
                dispatch(`tabs/${tabId}/setShasSections`, moreData.mefo, {
                    root: true,
                });

                dispatch(`pinTab`, {
                    tabId,
                    pin: true
                });

                //moreData.mm = [];

                //set MEF title
                /*  if (!String(tabId).startsWith("win_"))
                  dispatch(`tabs/${tabId}/setTitle`, getMasechetName(bookData.title), {
                    root: true,
                  }); */
            } else
                dispatch(`tabs/${tabId}/setShasSections`, null, {
                    root: true,
                });

            dispatch(`tabs/${tabId}/setBookMM`, moreData.mm, {
                root: true,
            });

            //for tests - Don't delete
            // getMmts(bookData.book).then((mmts) => {
            //   dispatch(`${tabId}/setBookMM`, mmts.data, {
            //     root: true,
            //   });
            // });

            return true;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getTabData({
        dispatch
    }, id) {
        return dispatch("[id]/getTabData", null, {
            root: true,
        });
    },

    async moveTabTo({
        commit
    }, payLoad) {
        return;
        await commit("MOVE_TAB", payLoad);
    },
    goToNextTab({
        commit,
        getters,
        state,
        dispatch
    }) {
        commit("GO_TO_NEXT_TAB");
        commit("SET_SHOWN_HIDDEN_TABS");
        let hidden = getters.isHidden(state.currentTabId);

        if (hidden)
            dispatch("moveTabTo", {
                id: realtabs()[0],
                toIndex: state.tabs.length - 1,
            });
    },
    //set maximum tabs to show open
    setMaxShown({
        commit
    }, max) {
        commit("SET_MAXSHOWN", {
            max,
        });
        commit("SET_SHOWN_HIDDEN_TABS");
    },
    setCurrentTabUserTsiyuns({
        state,
        dispatch
    }, {
        userTsiyuns
    }) {
        dispatch(state.currentTabId + "/setUserTsiyuns", userTsiyuns, {
            root: true,
        });
    },

    setCurrentTabPages({
        state,
        dispatch
    }, {
        pages
    }) {
        return new Promise(function(resolve, reject) {
            dispatch(
                state.currentTabId + "/setPages", {
                    pages
                }, {
                    root: true,
                }
            ).then((r) => resolve(true));
        });
    },

    setCurrentTabTsiyunim({
        state,
        dispatch
    }, {
        tsiyunim
    }) {
        dispatch(
            state.currentTabId + "/setTsiyunim", {
                tsiyunim
            }, {
                root: true,
            }
        );
    },

    addUserTsiyun({
        dispatch
    }, {
        bookId,
        pageId,
        title,
        tabId,
        page
    }) {
        return new Promise(function(resolve, reject) {
            dispatch(
                "tabs/" + tabId + "/addUserTsiyun", {
                    bookId,
                    pageId,
                    title,
                    page
                }, {
                    root: true,
                }
            ).then((r) => resolve(true));
        });
    },
    delUserTsiyun({
        dispatch
    }, {
        id
    }) {
        dispatch(
            "tabs/" + state.currentTabId + "/delUserTsiyun", {
                id,
            }, {
                root: true,
            }
        );
    },
    setCurrentTabPage({
        state,
        dispatch
    }, {
        page
    }) {
        dispatch("tabs/" + state.currentTabId + "/setPage", page, {
            root: true,
        });
    },
    setCurrentScrollTo({
        state,
        dispatch
    }, data) {
        return new Promise(function(resolve, reject) {
            if (state.currentTabId == "") resolve("");
            else
                dispatch("tabs/" + state.currentTabId + "/setScrollTo", data, {
                    root: true,
                }).then(() => resolve());
        });
    },
    incScrollTo({
        state,
        dispatch
    }, {
        inc
    }) {
        dispatch("tabs/" + state.currentTabId + "/incScrollTo", inc, {
            root: true,
        });
    },
    setPageHeight({
        state,
        dispatch
    }, {
        pageHeight
    }) {
        dispatch("tabs/" + state.currentTabId + "/setPageHeight", pageHeight, {
            root: true,
        });
    },
    setActivePage({
        state,
        dispatch
    }, {
        pos
    }) {
        dispatch("tabs/" + state.currentTabId + "/setActivePage", pos, {
            root: true,
        });
    },
    setActiveTsiyun({
        state,
        dispatch
    }, {
        pos
    }) {
        dispatch("tabs/" + state.currentTabId + "/setActiveTsiyun", pos, {
            root: true,
        });
    },
    setActiveUserTsiyun({
        state,
        dispatch
    }, {
        pos
    }) {
        dispatch("tabs/" + state.currentTabId + "/setActiveUserTsiyun", pos, {
            root: true,
        });
    },
    setBookFit({
        commit
    }, fit) {
        commit("SET_BOOK_FIT", {
            fit,
        });
    },
    setZoom({
        dispatch
    }, zoom) {
        dispatch(
            "tabs/" + state.currentTabId + "/setZoom", {
                zoom
            }, {
                root: true,
            }
        );
    },
    showSidebar({
        state
    }) {
        state.showBookLists = true;
    },
    toggleShowBookLists({
        commit
    }, show) {
        commit("TOGGLE_SHOW_BOOKLISTS", show);
    },
    toggleFullScreen({
        commit
    }) {
        commit("SET_FULL_SCREEN");
    },

    toggleSplitter({
        commit
    }) {
        commit("SET_SPLITTER_CHANGE");
    },
    initCropper({
        commit
    }) {
        commit("SET_INIT_CROPPER");
    },
    setResizeToggle({
        commit
    }) {
        commit("SET_TOGGLE_RESIZE");
    },
    setSearchPage({
        commit
    }, search) {
        commit("SET_SEARCH_PAGE", search);
    },
    addToSearchPage({
        commit
    }, search) {
        commit("INC_SEARCH_PAGE", search);
    },
};

export const getters = {
    getShownTabs(state) {
        return state.shownTabs;
    },
    getHiddenTabs(state) {
        return state.hiddenTabs;
    },
    isShasVilna: (state) => (book) => {
        return shasVilnaBooks.includes(Number(book));
    },
    isCurrentTabPinned(state) {
        return state.pinnedTabs[state.currentTabId] != undefined;
    },
    pinnedTabs(state) {
        return state.pinnedTabs;
    },
    isHidden: (state) => (id) => {
        return state.maxShown == 0 ?
            false :
            realtabs().indexOf(id) >= state.maxShown ?
            true :
            false;
    },
    getSearchPage(state) {
        return state.searchPage;
    },
    fullScreen(state) {
        return state.fullScreen;
    },
    showBookLists(state) {
        return state.showBookLists;
    },
    getActivePage(state, getters, rootState, rootGetters) {
        if (state.currentTabId == "") return -1;
        let tabData = rootState[state.currentTabId].activePage;
        return tabData;
    },
    getActiveTab(state, getters, rootState, rootGetters) {
        if (state.currentTabId == "") return -1;
        let tabData = rootState.tabs[state.currentTabId];
        return tabData;
    },
    getActiveTsiyun(state, getters, rootState, rootGetters) {
        if (state.currentTabId == "") return -1;
        let tabData = rootState[state.currentTabId].activeTsiyun;
        return tabData;
    },
    getActiveUserTsiyun(state, getters, rootState, rootGetters) {
        if (state.currentTabId == "") return -1;
        let tabData = rootState[state.currentTabId].activeUserTsiyun;
        return tabData;
    },
    getCurrentScrollTo(state, getters, rootState, rootGetters) {
        if (state.currentTabId == "") return -1;
        let tabData = rootGetters["tabs/" + state.currentTabId + "/getTabData"];
        return tabData.scrollTo;
    },
    getAllTabs(state) {
        return state.tabs;
    },
    getTabs(state) {
        return realtabs();
    },
    getWinTabs(state) {
        return state.tabs.filter((t) => t.startsWith("win_"));
    },
    tabsOverflow(state, getters) {
        return realtabs().length > MAX_TABS - 1;
    },
    winBooksOverflow(state, getters) {
        return getters["getWinTabs"].length > MAX_WINS - 1;
    },
    getOpenBooks() {
        return state.tabs.filter((e) => String(e).startsWith("win_"));
    },
    getMaxShown(state) {
        return state.maxShown;
    },
    getBookFit(state) {
        return state.bookFit;
    },
    getTsiyunim(state, getters, rootState, rootGetters) {
        if (state.currentTabId == "") return [];
        let tabData = rootGetters["tabs/" + state.currentTabId + "/getTabData"];
        return tabData.tsiyunim;
    },
    getPages(state, getters, rootState, rootGetters) {
        try {
            if (state.currentTabId == "") return [];
            let tabData = rootGetters["tabs/" + state.currentTabId + "/getTabData"];

            return tabData.pages;
        } catch (ex) {
            console.error(ex);
            return [];
        }
    },
    getFsResults(state, getters, rootState, rootGetters) {
        if (state.currentTabId == "") return [];
        let tabData = rootGetters["tabs/" + state.currentTabId + "/getTabData"];

        return tabData.pages.filter((p) => p.words);
    },
    getUserTsiyuns(state, getters, rootState, rootGetters) {
        if (state.currentTabId == "") return [];
        let tabData = rootGetters["tabs/" + state.currentTabId + "/getTabData"];
        return tabData.usertsiyuns;
    },
    refreshUserTsiyuns(state, getters, rootState, rootGetters) {
        if (state.currentTabId == "") return [];
        let tabData = rootGetters["tabs/" + state.currentTabId + "/getTabData"];
        return tabData.usertsiyuns;
    },
    getTabById: (state, getters, rootState, rootGetters) => (id) => {
        if (id == "") return -1;
        let tabData = rootGetters["tabs/" + id + "/getTabData"];
        return tabData;
    },
    getCurrentPage(state, getters, rootState, rootGetters) {
        if (state.currentTabId == "") return -1;
        let tabData = rootGetters["tabs/" + state.currentTabId + "/getTabData"];
        return tabData.page;
    },
    getCurrentPageDBID(state, getters, rootState, rootGetters) {
        if (state.currentTabId == "") return -1;
        let tabData =
            rootGetters["tabs/" + state.currentTabId + "/getCurrentPageDBId"];
        return tabData.id;
    },
    getCurrentPageLetter(state, getters, rootState, rootGetters) {
        if (state.currentTabId == "") return -1;
        let tabData =
            rootGetters["tabs/" + state.currentTabId + "/getCurrentPageDBId"];
        return tabData.letter != "" ? tabData.letter : tabData.position;
    },
    getCurrentBook(state, getters) {
        let tabData = getters.getCurrentTabData;

        return tabData == -1 ? tabData : tabData.book;
    },
    getCurrentTabData(state, getters, rootState, rootGetters) {
        if (state.currentTabId == "") return -1;
        let tabData = rootGetters["tabs/" + state.currentTabId + "/getTabData"];
        if (tabData == undefined) return -1;
        return tabData;
    },
    getWordsCoords:
        (state, getters, rootState, rootGetters) =>
        (page, webP = false) => {
            return new Promise(function(resolve, reject) {
                if (state.currentTabId == "") return -1;
                let results = {};

                getWordsCoords({
                        bookId: page.bookId,
                        pageId: page.id,
                        words: page.words,
                        margin: page.pagedata[0].margin,
                        webP,
                    })
                    .then((result) => {
                        results = result.data;
                        if (results == "") reject("no pg1");
                        resolve(results);
                    })
                    .catch(() => resolve(""));
            });
        },
    isWindow: (state) => (id) => {
        return typeof id == "string" && String(id).startsWith("win_");
    },
};

function sortPages(pages) {
    try {
        //check if need to sort pages
        let found = pages.findIndex((p) => p.name == "10");
        /* 
        different logic
        for (let i = 0; i < pages.length && !found; i++) {
          let pageId = pages[i].name;
          if (isNaN(pageId) || pageId.startsWith("0")) found = true;
        } */

        if (found >= 0) {
            pages.sort((a, b) => (parseInt(a.name) > parseInt(b.name) ? 1 : -1));
            pages.forEach((p, i) => {
                p.position = i + 1;
                //ignore PAGE LETTER because some are corrupted
                p.pagedata[0].letter = "";
            });
        }
    } catch (ex) {
        console.log("error sorting pages", ex);
    }
}

/* function getMasechetName(title) {
  let masechet = title.split("-");
  if (masechet[1]) {
    masechet = masechet[1]
      .split("/")[0]
      .trim()
      .substr(masechet[1].trim().indexOf(" ") + 1)
      .trim();

    return masechet;
  }
  return title;
} */