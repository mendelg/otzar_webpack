import {
    Store
} from "vuex";
import store from "@/store/store.js";
import * as userBooksData from "@/services/userBooksData.js";

export const namespaced = true;

export const state = function() {
    return {
        recentBooks: [],
    };
};

export const mutations = {
    ADD_RECENT_BOOK(state, r) {
        state.recentBooks = state.recentBooks.filter(
            (recentBook) => recentBook.bookId !== r.bookId
        );
        state.recentBooks.unshift(r);
    },
    DEL_RECENT_BOOK(state, {
        id
    }) {
        state.recentBooks = state.recentBooks.filter((recent) => recent.id != id);
    },
    DEL_RECENT_BOOKS(state, books) {
        state.recentBooks = state.recentBooks.filter(
            (recent) => !books.includes(recent.bookId.toString())
        );
    },
    SET_RECENT_BOOKS(state, recentBooks) {
        state.recentBooks = recentBooks;
    },
};

export const actions = {
    async addRecentBook({
        commit
    }, {
        bookId,
        pageId
    }) {
        let rec = await userBooksData.addUpdateUserRecentBook({
            bookId,
            pageId
        });
        commit("ADD_RECENT_BOOK", rec.data);
        // .then(r => {
        //   commit("ADD_RECENT_BOOK", r.data);
        //  });
    },
    delRecentBook({
        commit
    }, {
        id
    }) {
        return userBooksData.deleteUserRecentBook(id).then((r) => {
            if (r.data > 0) commit("DEL_RECENT_BOOK", {
                id
            });
        });
    },

    removeRecentBooks({
        commit
    }, books) {
        commit("DEL_RECENT_BOOKS", books);
    },

    setRecentBooks({
        commit
    }) {
        return new Promise(function(resolve, reject) {
            userBooksData
                .getUserRecentBooks()
                .then((r) => {
                    commit("SET_RECENT_BOOKS", r.data);
                    resolve(true);
                })
                .catch((error) => {
                    console.error(error);
                    reject(false);
                });
        });
    },
};

export const getters = {
    getRecentBooks(state) {
        return state.recentBooks;
    },
    getRecentPage(state, {
        bookId
    }) {
        let books = state.recentBooks.filter((book) => book.bookId == bookId);
        return books.length > 0 ? books[0].pageId : 1;
    },
};