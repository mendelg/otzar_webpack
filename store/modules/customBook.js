import * as bookData from "@/services/bookData.js";

const Page = class {
    constructor(pageData) {
        this.type = pageData.type;
        this.id = pageData.id;
        // this.sys_id = pageData.sys_id || null; //בינתיים אין צורך, מתנהל בשרת ונוסף שם תמיד
        this.order = pageData.order;

        this.bookId = pageData.bookId;
        this.book = pageData.book || null;
        this.page = pageData.page || null;

        let thumbImg = pageData.thumbImg;

        /** @var {String} thumbImg dataURL */
        this.thumbImg =
            thumbImg.tagName === "CANVAS" ?
            thumbImg.toDataURL() :
            thumbImg.tagName === "IAMGE" ?
            thumbImg.src :
            thumbImg;

        this.image = pageData.image || null;

        this.searchResult = pageData.searchResult || {};

        this.html = pageData.html || "";
        this.linkBook = pageData.linkBook || -1;
        this.linkPage = pageData.linkPage || -1;
        this.linkBookName = pageData.linkBookName || "";
        this.isChecked = false;
    }
};

export const namespaced = true;

export const state = () => ({
    id: 0,
    name: "",
    author: {
        id: null,
        name: ""
    },
    comment: [],
    pages: [],
    tsiyunim: [],
    customTsiyunim: [],
    curPage: null,
    newImages: {},
});

export const getters = {
    lastOrder: (state) => {
        return Math.max(
            ...(state.pages.map((p) => p.order).length ?
                state.pages.map((p) => p.order) :
                [0])
        );
    },
    curOrder: (state) => {
        return state.curPage ? state.curPage.order : 0;
    },
    checkedPages: (state) => {
        return state.pages.filter((p) => p.isChecked === true);
    },
    sumPages: (state) => {
        return state.pages.length;
    },
};

export const mutations = {
    SET_ID(state, payload) {
        state.id = payload;
    },
    SET_NAME(state, bookName) {
        state.name = bookName;
    },
    SET_AUTHOR(state, author) {
        state.author = author;
    },
    SET_COMMENT(state, comment) {
        state.comment = comment;
    },
    SET_TSIYUNIM(state, tsiyunim) {
        state.tsiyunim = tsiyunim;
    },
    SET_CUSTOM_TSIYUNIM(state, customTsiyunim) {
        state.customTsiyunim = customTsiyunim;
    },
    /** @param {Page} page */
    ADD_PAGE(state, page) {
        state.pages.push(page);
    },
    EMPTY_PAGES(state) {
        state.pages = [];
        state.curPage = null;
    },

    /** @param {Array<Page>} pages */
    SET_PAGES(state, pages) {
        state.pages = pages;
    },
    SET_PAGE_ORDER(state, {
        pageId,
        order
    }) {
        state.pages.filter((p) => p.id === pageId)[0].order = order;
    },
    SET_PAGE_IMG(state, {
        page,
        img
    }) {
        state.pages.filter((p) => p.id === page.id)[0].image = img;
    },
    SORT_PAGES(state) {
        state.pages.sort((a, b) => a.order - b.order);
    },
    SET_CUR_PAGE(state, page) {
        state.curPage = page;
    },
    ADD_TSIYUN(state, tsiyun) {
        if (!state.tsiyunim.filter((t) => t.id === tsiyun.id).length)
            state.tsiyunim.push(tsiyun);
    },
    SET_NEW_IMAGE(state, page) {
        state.newImages[page.id] = page;
    },
    EMPTY_NEW_IMAGES(state) {
        state.newImages = {};
    },
    SET_IS_CHECKED(state, {
        page,
        checked
    }) {
        state.pages.filter((p) => p.id === page.id)[0].isChecked = checked;
    },
};

export const actions = {
    setId({
        commit
    }, payload) {
        commit("SET_ID", payload);
    },
    setBookName({
        commit
    }, bookName) {
        commit("SET_NAME", bookName);
    },
    setAuthor({
        commit
    }, author) {
        commit("SET_AUTHOR", author);
    },
    setComment({
        commit
    }, comment) {
        commit("SET_COMMENT", comment);
    },
    setTsiyunim({
        commit
    }, tsiyun) {
        commit("SET_TSIYUNIM", tsiyun);
    },
    setCustomTsiyunim({
        commit
    }, customTsiyunim) {
        commit("SET_CUSTOM_TSIYUNIM", customTsiyunim);
    },
    setBookPages({
        commit,
        dispatch
    }, pages) {
        commit("EMPTY_PAGES");
        pages.forEach((p) => dispatch("addPage", p));
    },
    addPage({
        commit
    }, pageData) {
        let page = new Page(pageData);
        commit("ADD_PAGE", page);
        return page;
    },

    //if the image stil not saved on server
    addImagesAsNews({
        commit
    }, page) {
        commit("SET_NEW_IMAGE", page);
    },

    emptyNewImages({
        commit
    }) {
        commit("EMPTY_NEW_IMAGES");
    },

    //for reorder pages   -- לעומת setBookPages שמייצר את האובייקטים מחדש
    setPages({
        commit
    }, pages) {
        commit("SET_PAGES", pages);
    },
    setPageOrder({
        commit
    }, {
        pageId,
        order
    }) {
        commit("SET_PAGE_ORDER", {
            pageId,
            order
        });
    },
    sortPages({
        commit
    }) {
        commit("SORT_PAGES");
    },
    reorderPages({
        dispatch,
        state
    }) {
        dispatch("createBook/setCurBookAsChanged", true, {
            root: true
        });
        dispatch("sortPages");
        for (let i = 0; i < state.pages.length; i++) {
            dispatch("setPageOrder", {
                pageId: state.pages[i].id,
                order: i + 1,
            });
        }
    },
    changePageOrder({
        dispatch
    }, {
        page,
        newOrder
    }) {
        dispatch("setPageOrder", {
            pageId: page.id,
            order: newOrder
        });
        dispatch("reorderPages");
    },
    setCurPage({
        commit
    }, page) {
        commit("SET_CUR_PAGE", page);
    },
    addNewPage({
        dispatch
    }, pageData) {
        let page = dispatch("addPage", pageData);
        dispatch("reorderPages");
        return page;
    },
    addTsiyun({
        commit
    }, tsiyun) {
        commit("ADD_TSIYUN", tsiyun);
    },
    createNewPageid({
        state
    }) {
        let ids = state.pages.map((p) => p.id).length ?
            state.pages.map((p) => p.id) :
            [0];
        return Math.max(...ids) + 1;
    },
    getPageById({
        state
    }, id) {
        return state.pages.filter((p) => p.id === id)[0];
    },
    getPageByOrder({
        state
    }, order) {
        return state.pages.filter((p) => p.order === order)[0];
    },
    deletePage({
        state,
        dispatch
    }, page) {
        state.pages = state.pages.filter((p) => p !== page);
        dispatch("setPages", state.pages);
        dispatch("reorderPages");
    },
    setPageImg({
        commit
    }, {
        page,
        img
    }) {
        commit("SET_PAGE_IMG", {
            page,
            img
        });
    },
    async getImage({
        dispatch
    }, page) {
        if (!page.image) {
            let imageData = await bookData
                .getImageAsDataUrl(page.bookId, page.id)
                .catch((err) => {
                    console.error(err);
                });
            dispatch("setPageImg", {
                page: page,
                img: imageData
            });
        }
        return page.image;
    },
    checkPage({
        commit
    }, {
        page,
        checked
    }) {
        commit("SET_IS_CHECKED", {
            page,
            checked
        });
    },
};