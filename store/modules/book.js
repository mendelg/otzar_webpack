import {
    fetchBookByID
} from "@/services/loadBooksDataFromServer.js";
//import { getAllData } from "@/services/bookData.js";

export const namespaced = true;

export const state = {
    currbook: {},
};
//mutations
export const mutations = {
    //set books
    SET_BOOK(state, payload) {
        state.currbook = payload;
    },
};
//actions
export const actions = {
    setBookByID({
        commit
    }, book) {
        return new Promise(function(resolve, reject) {
            //  getAllData(book).then((bookDetails) => {
            fetchBookByID(book).then((bookDetails) => {
                if (bookDetails == "") return;
                resolve(commit("SET_BOOK", bookDetails.bookInfo));
            });
        });
    },
    setBookItem({
        commit
    }, book) {
        return new Promise(function(resolve, reject) {
            resolve(commit("SET_BOOK", book));
        });
    },
};

//getters
export const getters = {
    getBook(state) {
        return state.currbook;
    },
};