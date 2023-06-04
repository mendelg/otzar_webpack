import {
    ShasBooks,
    pagesDic
} from "@/services/mefo/shasService";
export const namespaced = true;

export const state = {
    ShasBooks,
};

export const getters = {
    getShasBooks(state) {
        return state.ShasBooks;
    },
    getBookPages(state, getters, rootState, rootGetters) {
        if (getters.getCurrentBook == -1) return null;
        let pages = [];
        let book = state.ShasBooks[getters.getCurrentBook];
        if (!book) return [];
        for (let i = book.firstPage; i <= book.count + book.firstPage; i += 2) {
            pages.push({
                title: pagesDic(book.firstPage, i),
                number: i,
            });
        }
        return pages;
    },
    getSelectedBookNumber(state, getters, rootState, rootGetters) {
        if (getters.getCurrentBook == -1) return null;
        return getters.getCurrentBook;
    },
    getSelectedBookName(state, getters, rootState, rootGetters) {
        if (getters.getCurrentBook == -1) return null;
        return state.ShasBooks[getters.getCurrentBook] ? .bookName || "";
    },
    getSelectedPageNumber(state, getters, rootState, rootGetters) {
        return getters.getCurrentPage;
    },
    getSelectedPage(state, getters, rootState, rootGetters) {
        let book = state.ShasBooks[getters.getCurrentBook];
        let page = getters.getCurrentPage - 1;
        if (!book || book == -1) return null;
        if (page % 2 != 0) page -= 1;
        return pagesDic(book.firstPage, page);
    },
    getCurrentBook(state, getters, rootState, rootGetters) {
        return rootGetters["tabsManager/getCurrentBook"];
    },
    getCurrentPage(state, getters, rootState, rootGetters) {
        return rootGetters["tabsManager/getCurrentPage"];
    },
    getSelectedSubPage(state, getters, rootState, rootGetters) {
        let page = getters.getCurrentPage + 1;
        if (page % 2 == 0) return 'ע"א';
        return 'ע"ב';
    },
};