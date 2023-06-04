export let customSortBooks = [];

export const namespaced = true;
import AVLTree from "@/utils/avl";
import {
    getCustomSortBooks
} from "@/services/customSorts.js";

export const state = {
    checkAll: false,
    /* sortBy: "ideal", */
    // checkBookList: new BTree(3),
    checkBookList: new AVLTree(),
};

import Vue from "vue";

export const mutations = {
    ADD_LIST_BOOKS(state, {
        id,
        checked
    }) {
        let x = this.getters["freeSearchBookList/getCurrentListIds"];
        x.forEach((item) => {
            if (item.book == id) item.checked = checked;
        });
    },
    REVERT_ALL_LIST(state) {
        let x = this.getters["freeSearchBookList/getCurrentListIds"];
        x.forEach((item) => {
            if (item.checked == undefined) item.checked = true;
            else item.checked = !item.checked;
        });
    },
    CHECK_ALL_LIST(state, checked) {
        let x = this.getters["freeSearchBookList/getCurrentListIds"];
        x.forEach((item) => {
            Vue.set(item, "checked", checked);
        });
    },
    /*   SORT_BY_LIST(state, sort) {
      state.sortBy = sort;
    }, */
};
export const actions = {
    async getCustomSortBooks({
        commit
    }, title) {
        customSortBooks = await getCustomSortBooks(title);
        try {
            customSortBooks.forEach((sortList, i, arr) => {
                let avlsortList = new AVLTree();
                sortList.forEach((e) => {
                    avlsortList.root = avlsortList.insert(avlsortList.root, e, e);
                });

                arr[i] = avlsortList;
            });
        } catch (ex) {
            console.error(ex.message);
            customSortBooks = [];
        }
    },
    addListBooksFree({
        commit
    }, {
        id,
        checked
    }) {
        commit("ADD_LIST_BOOKS", {
            id,
            checked
        });
    },
    checkAllListBooksFree({
        commit
    }, checked) {
        commit("CHECK_ALL_LIST", checked);
    },
    revertChecksFree({
        commit
    }) {
        commit("REVERT_ALL_LIST");
    },
    /* setSortByList({ commit, dispatch }, sort) {
      return new Promise((resolve, reject) => {
        if (sort.startsWith("custom_"))
          dispatch("getCustomSortBooks", sort.slice(7)).then(() => {
            //  if (customSortBooks.length == 0) sort = "ideal";
            commit("SORT_BY_LIST", sort);
            resolve();
          });
        else {
          commit("SORT_BY_LIST", sort);
          resolve();
        }
      });
    }, */
};
export const getters = {
    getListCheckBooksSpecData(state, getters, rootState, rootGetters) {
        let checkedBooks = getters.getListCheckBooksFree;
        let x = rootGetters["freeSearchBookList/getCurrentList"];
        let booksData = [];
        for (let i = 0; i < x.booksList.length; i++) {
            if (checkedBooks.includes(x.booksList[i].id.toString())) {
                const {
                    id,
                    page,
                    resultType,
                    result
                } = x.booksList[i];
                booksData.push({
                    book: id,
                    page,
                    resultType,
                    txt: result
                });
            }
        }
        return booksData;
    },
    getListCheckBooksIndex(state, getters, rootState, rootGetters) {
        let checkedBooks = getters.getListCheckBooksFree;
        let x = rootGetters["freeSearchBookList/getCurrentList"];
        let indexes = [];
        for (let i = 0; i < x.booksList.length; i++) {
            if (checkedBooks.includes(x.booksList[i].id.toString()))
                indexes.push(x.booksList[i].index);
        }
        return indexes;
        return checkedBooks.map((cb) => {
            let book = x.booksList.filter((b) => cb == b.id);
            return book[0].index;
        });
    },
    getListCheckBooksFree(state, getters, rootState, rootGetters) {
        let x = rootGetters["freeSearchBookList/getCheckedBooks"];
        return x;
    },
    hasCheckAllFree(state) {
        return state.checkAll;
    },
    hasCheckedTopFree(state) {
        if (state.checkBookList.length > 0 || state.checkAll) return true;
        return false;
    },
    cancelCheckFree(state) {
        if (state.checkBookList.length == 0 && !state.checkAll) return true;
        return false;
    },
    //central getter for books list that refer by the actions of the user to the required getter
    hasCheckFree: (state) => (id) => {
        if (state.checkBookList.length == 0) return false;
        let x = state.checkBookList.has(state.checkBookList.root, id);
        if (x) return true;
        return false;
    },
    /*   getSortBy(state) {
      return state.sortBy;
    }, */

    getLengthListCheckFree(state) {
        return state.checkBookList.length;
    },
};