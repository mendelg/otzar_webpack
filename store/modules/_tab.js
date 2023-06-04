import store from "@/store/store.js";
import Vue from "vue";
import * as userTsiyun from "@/services/userTsiyuns.js";
import {
    getFSResultsPages,
    getBookName
} from "@/services/bookData.js";
import {
    treeBooks
} from "@/store/modules/books.js";
import {
    getBookPermission,
    permissionsEnum,
    getBookLicenseData,
} from "@/services/license";
import mef from "@/services/mefotzar";
const mefData = Object.values(mef);
const mefSectionListData = new Map();
export const namespaced = true;

export const state = function() {
    ////////WARNING --- THIS MAY FAIL IN VUE 3 AND STILL CONSUME MEMORY
    return {
        id: "",
        title: "",
        alwaysShow: false,
        customTitle: "",
        book: 0,
        page: 0,
        override: false,
        fitToWidth: true,
        zoom: 100,
        scrollPosition: 0,
        drawData: {
            rects: {},
            fs: {}
        },
        userTsiyunim: [],
        personalAdditions: {
            comments: [],
            keys: [],
            markers: [],
            links: []
        },
        scrollTo: 1,
        pageHeight: 0,
        activeTsiyun: 0,
        activeUserTsiyun: 0,
        activePage: 0,
        resize: false,
        bookFit: "width",
        tempPage: 0,
        stopPrinting: false,
        winWidth: document.body.clientWidth * 0.95,
        winHeight: document.body.clientWidth * 0.95,
        minimize: false,
        txtBook: false,
        openFs: false,
        fsFinished: false,
        fsChange: 0,
        manualClickPage: 0,
        addingLink: false,
        firstLink: null,
        secondLink: null,
        fsTotal: 0,
        editExtens: false,
        itemEdit: {},
        openEditor: false,
        SHAS_SECTIONS: null,
        SHAS_SECTION_LIST_ID: null,
        shasSecSelected: [],
        pinned: false,
        mefFirstPage: 0,
        mefLastPage: 0,
        masks: [],
        tabWidth: 0,
        showMask: true,
        imageEdit: {
            blur: 0,
            brightness: 100,
            contrast: 100,
            dropshadow: 0,
            grayscale: 0,
            huerotate: 0,
            invert: 0,
            opacity: 0,
            saturate: 0,
            sepia: 0,
            enable: false,
            changed: 0,
        },
        license: [],
        showEmptyPage: false,
        react: 0,
    };
};

export const mutations = {
    CLEAR_TAB(state) {
        state.pages = [];
        state.userTsiyunim = [];
        state.tsiyunim = [];
        state.personalAdditions = {
            comments: [],
            keys: [],
            markers: [],
            links: [],
        };
    },
    SET_ROTATE_PAGE(state, value) {
        try {
            let rotateDegrees = state.pages[value].rotate ?
                state.pages[value].rotate + 90 :
                90;
            if (rotateDegrees == 360) rotateDegrees = 0;
            Vue.delete(state.pages[value], "rotate");
            Vue.set(state.pages[value], "rotate", rotateDegrees);
        } catch (ex) {
            console.log("cannot rotate", ex);
        }
    },
    SET_PIN(state, value) {
        state.pinned = value;
    },
    TOGGLE_PIN(state) {
        state.pinned = !state.pinned;
    },
    SET_FS_DATA(state, fs) {
        Vue.set(state.drawData, "fs", fs);
    },
    OPEN_FS(state, val) {
        state.openFs = val;
    },
    SET_CUSTOM_TITLE(state, title) {
        Vue.set(state, "customTitle", title);
    },
    SET_TITLE(state, title) {
        Vue.set(state, "title", title);
    },
    SET_TXT_BOOK(state, value) {
        state.txtBook = value;
    },
    SET_BOOK_FIT(state, {
        fit
    }) {
        state.bookFit = fit;
    },
    TRIGGER_RESIZE(state) {
        state.resize = !state.resize;
    },
    ADD_TAB(state, tabData) {
        state.id = tabData.id;
        state.book = tabData.book;
        state.page = tabData.page;
        state.title = tabData.title;
        state.scrollPosition = tabData.scrollPosition;
        state.override = tabData.override;
        state.drawData = tabData.drawData;
        state.tsiyunim = tabData.tsiyunim;
        state.pages = tabData.pages;
        state.userTsiyunim = tabData.userTsiyuns;
        state.personalAdditions = tabData.personalAdditions;
        state.pageHeight = tabData.pageHeight;
        state.winHeight = tabData.winHeight;
        state.winWidth = tabData.winWidth;
        state.volumes = tabData.volumes;
        state.masks = tabData.masks;
        if (state.SHAS_SECTION_LIST_ID) {
            mefSectionListData.delete(state.SHAS_SECTION_LIST_ID);
            state.SHAS_SECTION_LIST_ID = null;
        }
    },
    SET_OVERRIDE(state, override) {
        state.override = override;
    },
    SET_TSIYUNIM(state, tsiyunim) {
        state.react++;
        state.tsiyunim = tsiyunim;
    },
    SET_PAGES(state, pages) {
        state.react++;
        state.pages = pages;
    },
    SET_BOOK(state, book) {
        state.book = book;
    },
    SET_BOOK_MMTS(state, mmts) {
        if (mmts && mmts.length > 0) mmts[0] = 0; //TEMP avoid mm in first page
        state.MM = mmts;
    },
    SET_SHAS_SECTIONS(state, sections) {
        // state.SHAS_SECTIONS = sections;
        if (state.SHAS_SECTION_LIST_ID)
            mefSectionListData.delete(state.SHAS_SECTION_LIST_ID);
        if (!sections) {
            state.SHAS_SECTION_LIST_ID = null;
            return;
        }
        state.SHAS_SECTION_LIST_ID = Math.random(1 % 1000000);
        mefSectionListData.set(state.SHAS_SECTION_LIST_ID, sections);
        let masData = mefData.find((m) => m.bookid == state.book);
        if (masData && masData.firstPage) {
            state.mefFirstPage = masData.firstPage + 1;
            state.mefLastPage = masData.firstPage + masData.count + 1;
        }
        // state.mefFirstPage =
        //   mefData.find((m) => m.bookid == state.book)?.firstPage + 1 || 0;
    },
    SET_SHAS_SECTION_SELECTED(state, payload) {
        if (payload.add) state.shasSecSelected.push(payload.section);
        else {
            state.shasSecSelected = [payload.section];
        }
    },
    SET_PAGE(state, page) {
        state.page = page;
    },
    SET_USER_TSIYUNS(state, userTsiyuns) {
        state.react++;
        state.userTsiyunim = userTsiyuns;
    },
    ADD_USER_TSIYUN(state, r) {
        state.userTsiyunim.push(r);
        state.userTsiyunim.sort((a, b) => (a.page > b.page ? 1 : -1));
    },
    UPD_USER_TSIYUN(state, r) {
        try {
            state.userTsiyunim.find((t) => t.id === r.id).title = r.title;
        } catch (ex) {}
    },
    DEL_USER_TSIYUN(state, {
        id
    }) {
        state.userTsiyunim = state.userTsiyunim.filter((tsiyun) => tsiyun.id != id);
    },
    SET_SCROLLTO(state, page) {
        state.scrollTo = page;
    },
    INC_SCROLLTO(state, inc) {
        state.scrollTo = state.page + inc;
    },
    SET_PAGE_HEIGTH(state, pageHeight) {
        state.pageHeight = pageHeight;
    },
    SET_LICENSE(state, license) {
        if (!license) license = [];

        //check if this book has MEF license
        let bk = store.getters["books/getBookbyId"](state.book, true);
        if (bk) {
            let bookPermissions = bk.permissions;
            if (bookPermissions & permissionsEnum.MEF_OTZAR.value) {
                license.push({
                    id: 12,
                    title: "MEF_OTZAR"
                });
            }
        }
        state.license = license;
    },
    SET_ACTIVE_PAGE(state, pos) {
        state.activePage = pos;
    },
    SET_ACTIVE_TSIYUN(state, pos) {
        state.activeTsiyun = pos;
    },
    SET_ACTIVE_USER_TSIYUN(state, pos) {
        state.activeUserTsiyun = pos;
    },
    SET_ZOOM(state, zoom) {
        state.zoom = zoom;
    },
    ADD_RECT(state, data) {
        let rects = state.drawData.rects;
        if (!rects) rects = [];
        rects = rects.filter((r) => r.page != data.page);
        rects.push(data);
        Vue.set(state.drawData, "rects", rects);
    },
};

export const actions = {
    closeTabEvent({
        state
    }) {
        if (state.SHAS_SECTION_LIST_ID && mef[state.book]) {
            mefSectionListData.delete(state.SHAS_SECTION_LIST_ID);
        }
    },
    clearTab({
        commit
    }) {
        commit("CLEAR_TAB");
    },
    setRotatePage({
        commit
    }, page) {
        commit("SET_ROTATE_PAGE", page);
    },
    setPin({
        commit
    }, value) {
        commit("SET_PIN", value);
    },
    togglePin({
        commit
    }) {
        commit("TOGGLE_PIN");
    },
    setCustomTitle({
        commit
    }, title) {
        commit("SET_CUSTOM_TITLE", title);
    },
    setTitle({
        commit
    }, title) {
        commit("SET_TITLE", title);
    },
    setTxtBook({
        commit
    }, value) {
        commit("SET_TXT_BOOK", value);
    },
    setBookFit({
        commit
    }, fit) {
        commit("SET_BOOK_FIT", {
            fit,
        });
    },
    openFs({
        commit
    }, val) {
        commit("OPEN_FS", val);
    },
    triggerResize({
        commit
    }) {
        commit("TRIGGER_RESIZE");
    },
    setZoom({
        commit
    }, {
        zoom
    }) {
        commit("SET_ZOOM", zoom);
    },
    setTabData({
        commit
    }, tabData) {
        commit("ADD_TAB", tabData);
    },
    setOverride({
        commit
    }, override) {
        commit("SET_OVERRIDE", override);
    },
    setTsiyunim({
        commit
    }, payload) {
        let tsiyunim = payload && payload.tsiyunim ? payload.tsiyunim : [];
        commit("SET_TSIYUNIM", tsiyunim);
    },
    setPages({
        commit
    }, payload) {
        let pages = payload && payload.pages ? payload.pages : [];
        return new Promise(function(resolve, reject) {
            commit("SET_PAGES", pages);
            resolve(true);
        });
    },
    setPage({
        commit
    }, page) {
        commit("SET_PAGE", page);
    },
    setBook({
        commit
    }, book) {
        commit("SET_BOOK", book);
    },
    setBookMM({
        commit
    }, mmts) {
        commit("SET_BOOK_MMTS", mmts);
    },
    setShasSections({
        commit
    }, sections) {
        commit("SET_SHAS_SECTIONS", sections);
    },
    setShasSecSelected({
        commit
    }, payload) {
        commit("SET_SHAS_SECTION_SELECTED", payload);
    },
    setUserTsiyuns({
        commit
    }, userTsiyuns) {
        commit("SET_USER_TSIYUNS", userTsiyuns);
    },

    setScrollTo({
        commit
    }, page) {
        return new Promise(function(resolve, reject) {
            commit("SET_SCROLLTO", page);
            resolve();
        });
    },
    incScrollTo({
        commit
    }, inc) {
        commit("INC_SCROLLTO", inc);
    },
    setPageHeight({
        commit
    }, pageHeight) {
        commit("SET_PAGE_HEIGTH", pageHeight);
    },
    setLicense({
        commit
    }, license) {
        return new Promise((res, rej) => {
            commit("SET_LICENSE", license);
            res();
        });
    },
    setActivePage({
        commit
    }, pos) {
        commit("SET_ACTIVE_PAGE", pos);
    },
    setActiveTsiyun({
        commit
    }, pos) {
        commit("SET_ACTIVE_TSIYUN", pos);
    },
    setActiveUserTsiyun({
        commit
    }, pos) {
        commit("SET_ACTIVE_USER_TSIYUN", pos);
    },
    addUserTsiyun({
        commit
    }, {
        bookId,
        pageId,
        title,
        page
    }) {
        return new Promise(function(resolve, reject) {
            userTsiyun.addUserTsiyun({
                bookId,
                pageId,
                title,
                page
            }).then((r) => {
                commit("ADD_USER_TSIYUN", { ...r.data,
                    page
                });
                resolve(true);
            });
        });
    },
    updateUserTsiyun({
        commit
    }, {
        id,
        title,
        page
    }) {
        return new Promise(function(resolve, reject) {
            userTsiyun.updateUserTsiyun(id, title).then((r) => {
                commit("UPD_USER_TSIYUN", { ...r.data,
                    page
                });
                resolve(true);
            });
        });
    },
    delUserTsiyun({
        commit
    }, {
        id
    }) {
        return userTsiyun.deleteUserTsiyun(id).then((r) => {
            if (r.data > 0) commit("DEL_USER_TSIYUN", {
                id
            });
        });
    },
    setMinimize({
        state
    }, mode) {
        state.minimize = mode;
    },
    toggleMinimize({
        state
    }) {
        state.minimize = !state.minimize;
    },
    setRects({
        commit
    }, {
        page,
        rect
    }) {
        commit("ADD_RECT", {
            page,
            rect
        });
    },
    refreshFS({
        dispatch,
        state,
        commit
    }, fsData) {
        if (fsData ? .fs != undefined) {
            commit("SET_FS_DATA", fsData);
            state.pages.forEach((page) => {
                Vue.delete(page, "words");
            });
            state.fsChange++;
            if (fsData ? .fs != "0") {
                let _vm = this;
                getFSResultsPages({
                    fs: fsData
                }, state.pages, state.book).then((p) => {
                    let fsPage = state.pages.filter((page) => page.words != undefined);

                    if (
                        state.page != -1 &&
                        fsPage.find((p) => p.position == state.page)
                    ) {
                        dispatch(`setScrollTo`, state.page);
                        //  Vue.$nextTick(() => {
                        state.fsChange++;
                        //   });
                    } else if (fsPage.length > 0) {
                        dispatch(`setScrollTo`, {
                            page: fsPage[0].position,
                            offset: 0, //offset should be top of first result
                        });
                    }
                });
            }
        }
    },
};

export const getters = {
    getMefoSectionsList(state) {
        return (id) => mefSectionListData.get(id);
    },
    getBookLicense(state) {
        return state.license || [];
    },
    isMefShas(state) {
        return state.SHAS_SECTION_LIST_ID;
    },
    getZoom(state) {
        return state.zoom;
    },
    maxFreePages(state, getters, rootState) {
        let isPackageBook = packages.includes(
            getters["getBookPermission"].bookPermissions
        );

        //temp deny all pages on OZ VEHADAR books besides first one
        let OZBook =
            getters["getBookPermission"].bookPermissions ==
            permissionsEnum["OZ"].value; //256;
        if (OZBook) return 1;

        return isPackageBook || rootState.user.userType == "GUEST" ?
            globalThis.DEV_ALLOWED_PAGES_PACKAGE :
            globalThis.DEV_ALLOWED_PAGES_BASIC;
    },
    getBookPermission(state) {
        return getBookLicenseData(state.license);
    },
    isBookAllowedToUser(state, getters, rootState, rootGetters) {
        if (globalThis.SERVER_MODE == "offline") return true;
        let allowed = false;
        let mefConnection = rootGetters["user/hasMefConnection"];
        let otzarConnection = rootGetters["user/hasOtzarConnection"];

        let bookPermissions = getters["getBookPermission"].bookPermissions;
        /* 
        //good for online users but not for disk users
        if (
          (bookPermissions & permissionsEnum.OVADIA.value) ==
          permissionsEnum.OVADIA.value
        )
          return true; */
        allowed = bookPermissions & rootState.user.permissions;

        if (!otzarConnection) {
            if (
                bookPermissions & permissionsEnum.MEF_OTZAR.value &&
                bookPermissions & rootState.user.permissions
            )
                allowed = true;
            else if (
                bookPermissions & permissionsEnum.GENERAL.value ||
                bookPermissions & permissionsEnum.SCHOOL.value
            )
                allowed = false;
        }

        return allowed;
    },
    bookPermissionsData(state, getters, rootState) {
        return getters["getBookPermission"].bookPermissionsData;
    },
    OZBook(state, getters) {
        return (
            getters["getBookPermission"].bookPermissions ==
            permissionsEnum["OZ"].value
        ); //256;
    },
    getOpenEditor(state) {
        return state.openEditor;
    },
    getUserTsiyuns(state) {
        return state.userTsiyunim;
    },
    getTabData(state) {
        let tabData = {};
        tabData.id = state.id;
        tabData.book = state.book;
        tabData.page = state.page;
        tabData.title = state.title;
        tabData.scrollPosition = state.scrollPosition;
        tabData.drawData = state.drawData;
        tabData.override = state.override;
        tabData.pages = state.pages;
        tabData.tsiyunim = state.tsiyunim;
        tabData.usertsiyuns = state.userTsiyunim;
        tabData.personalAdditions = state.personalAdditions;
        tabData.pageHeight = state.pageHeight;
        tabData.scrollTo = state.scrollTo;
        tabData.customTitle = state.customTitle;
        tabData.pinned = state.pinned;
        return tabData;
    },
    getPages(state) {
        let x = state.react;
        return state.pages;
    },
    getTsiyunim(state) {
        let x = state.react;
        return state.tsiyunim;
    },
    getUserTsiyuns(state) {
        let x = state.react;
        return state.userTsiyunim;
    },
    isfirstTab(state) {
        return store.getters["tabsManager/getTabs"].indexOf(state.id) == 0;
    },
    getCurrentPageDBId(state) {
        return state.pages[state.page - 1];
    },
    getBook(state) {
        return state.book;
    },
    getPage(state) {
        return state.page;
    },
    getBookFit(state) {
        return state.bookFit;
    },
    getBookNameAndAuthor(state) {
        let b = treeBooks.get(treeBooks.root, state.book);
        if (!b) return "";
        return getBookName(b.name, b.volume, true) + " / " + b.mainAuthorName;
    },
    bookInFavorites(state, getters, rootState, rootGetters) {
        let b = treeBooks.get(treeBooks.root, state.book);
        return b != undefined ? b.favorite : false;
        //  let favorites = rootGetters["userFavoriteBooks/getFavoriteBooks"];
        // let book = state.book;

        // favorites = favorites.filter((favorite) => favorite.bookId == book);
        // return favorites.length > 0;
    },
    hasFsResults(state) {
        return (
            state.drawData.fs ? .fs != undefined &&
            state.drawData.fs ? .fs != "" &&
            state.drawData.fs ? .fs != "0"
        );
    },
};

const packages = [
    0b1000, 0b10000, 0b100000, 0b1000000, 0b10000000, 0b100000000, 0b1000000000,
    0b1000000000000, 0b10000000000000, 0b100000000000000, 0b1000000000000000000,
];