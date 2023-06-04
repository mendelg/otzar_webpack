import store from "@/store/store.js";
import * as userBooksData from "@/services/userBooksData.js";
import {
    treeBooks,
    books
} from "@/store/modules/books.js";
import Vue from "@/main_app.js";
export const namespaced = true;

export const state = {
    favorites: [],
    favoriteChange: true,
};

export const mutations = {
    ADD_FAVORITE_BOOK(state, books) {
        books.forEach((bookid) => {
            let b = treeBooks.get(treeBooks.root, bookid);
            if (b != undefined) b.favorite = 1;
        });
        state.favoriteChange = !state.favoriteChange;
        store.dispatch("bookList/increaseFavCount");
        /*  books.forEach((r) => {
          state.favorites = state.favorites.filter(
            (book) => book.bookId !== r.bookId
          );
          state.favorites.unshift(r);
        }); */
    },
    DEL_FAVORITE_BOOK(state, {
        books
    }) {
        books.forEach((bookid) => {
            let b = treeBooks.get(treeBooks.root, bookid);
            if (b != undefined) b.favorite = 0;
        });
        state.favoriteChange = !state.favoriteChange;
        store.dispatch("bookList/increaseFavCount");
        /*   state.favorites = state.favorites.filter(
          (favorite) => books != favorite.bookId
        ); */
    },

    SET_FAVORITE_BOOKS(state, books) {
        books.forEach((bookid) => {
            let b = treeBooks.get(treeBooks.root, bookid.bookId);
            if (b != undefined) b.favorite = true;
        });
        state.favoriteChange = !state.favoriteChange;
        store.dispatch("bookList/increaseFavCount");
    },
    CLEAR_FAVORITE_BOOKS(state) {
        books.forEach((book) => {
            let b = treeBooks.get(treeBooks.root, book.id);
            if (b != undefined) b.favorite = 0;
        });
        state.favoriteChange = !state.favoriteChange;
        store.dispatch("bookList/increaseFavCount");
    },
};

export const actions = {
    async addFavoriteBook({
        commit,
        rootGetters,
        dispatch
    }, {
        books
    }) {
        await userBooksData.addToFavorites({
            books
        }).then((r) => {
            if (r.data.length > 0) {
                commit("ADD_FAVORITE_BOOK", books);
                dispatch("bookList/refreshFavBook", null, {
                    root: true,
                });
            } else {
                userBooksData.IPUserNoPersDataMsg();
            }
        });
    },
    clearFavoriteBooks({
        commit
    }) {
        return new Promise(function(resolve, reject) {
            commit("CLEAR_FAVORITE_BOOKS");
            resolve();
        });
    },
    setFavoriteBooks({
        commit
    }) {
        return new Promise(function(resolve, reject) {
            userBooksData
                .getUserFavoriteBooks()
                .then((r) => {
                    commit("SET_FAVORITE_BOOKS", r.data);
                    resolve(true);
                })
                .catch((error) => {
                    console.error(error);
                    reject(false);
                });
        });
    },
    async removeFavoriteBook({
        commit,
        rootGetters,
        dispatch
    }, {
        books
    }) {
        commit("DEL_FAVORITE_BOOK", {
            books
        });
        let rec = await userBooksData
            .removeFromFavorites({
                books
            })
            .then((r) => {});

        dispatch("bookList/refreshFavBook", null, {
            root: true,
        });
        return rec;
    },
    async delFavoriteBooks({
        commit,
        rootGetters,
        dispatch
    }, {
        books
    }) {
        commit("DEL_FAVORITE_BOOK", {
            books
        });

        dispatch("bookList/refreshFavBook", null, {
            root: true,
        });
    },
};

export const getters = {
    getFavoriteBooks(state) {
        return state.favorites;
    },
    getFavoriteBooksById: (state) => (id) => {
        let b = treeBooks.get(treeBooks.root, id);
        b !== undefined ? (b.favorite != undefined ? b.favorite : false) : false;

        //let x = state.favorites.find((f) => f.bookId == id);
        //if (x) return true;
        //return false;
    },
};