import VueInst from "@/main_app.js";

export const namespaced = true;
import AVLTree from "@/utils/avl";

export const state = {
    checkBookList1: [],
    checkAll: false,
    checkProgress: false,
    sortBy: "",
    firstActive: false,
    firstFreeActive: false,
    cached: false,
};

export const mutations = {
    //get value true for creareFolder
    //param: createFolder

    ADD_LIST_BOOKS(state, id) {
        let hasId = state.checkBookList.has(state.checkBookList.root, id);
        if (state.checkBookList.length > 0 && hasId) {
            state.checkBookList = state.checkBookList.filter((id1) => id1 !== id);
        } else {
            state.checkBookList.set(state.checkBookList.root, id, id);
        }
    },
    REVERT_ALL_LIST(state) {
        let x = this.getters["bookList/getCurrentList"];
        x.forEach((item) => {
            let hasId = state.checkBookList.has(state.checkBookList.root, item.id);
            if (state.checkBookList.length > 0 && hasId) {
                state.checkBookList = state.checkBookList.filter(
                    (id1) => id1 != item.id
                );
            } else {
                state.checkBookList.set(state.checkBookList, item.id, item.id);
            }
        });
    },
    CHECK_ALL_LIST(state, checked) {
        if (checked) {
            state.checkAll = true;
            let x = this.getters["bookList/getCurrentList"];
            x.forEach((item) => {
                state.checkBookList.set(state.checkBookList.root, item.id);
            });
            // if (x.length > 80) state.checkBookList = x;
            // state.checkBookList = state.checkBookList.map(x => x.id);
        } else {
            state.checkAll = false;
            state.checkBookList = new AVLTree(); //.clear();
        }
        // ...mapGetters("bookList", ["getCurrentList"
    },
    SORT_BY_LIST(state, sort) {
        state.sortBy = sort;
    },
    SET_FIRST_ACTIVE(state, toggle) {
        state.firstActive = toggle;
    },
    SET_FIRST_FREE_ACTIVE(state, toggle) {
        state.firstFreeActive = toggle;
    },
};
export const actions = {
    //creare user folder
    //param: folder
    addListBooks({
        commit
    }, id) {
        commit("ADD_LIST_BOOKS", id);
    },
    checkAllListBooks({
        commit
    }, checked) {
        commit("CHECK_ALL_LIST", checked);
    },
    setSortByList({
        commit
    }, sort) {
        commit("SORT_BY_LIST", sort);
    },
    revertChecks({
        commit
    }) {
        commit("REVERT_ALL_LIST");
    },
    setFirstActive({
        commit
    }, toggle) {
        commit("SET_FIRST_ACTIVE", toggle);
    },
    setFirstFreeActive({
        commit
    }, toggle) {
        commit("SET_FIRST_FREE_ACTIVE", toggle);
    },
};
export const getters = {
    getListCheckBooks(state) {
        // return state.checkBookList;
        let x = [];
        state.checkBookList.forEachPair((v, k) => {
            // ???
            x.push(v);
        });
        return x;
    },
    hasCheckAll(state) {
        return state.checkAll;
    },
    hasCheckedTop(state) {
        if (state.checkBookList.length > 0 || state.checkAll) return true;
        return false;
    },
    cancelCheck(state) {
        if (state.checkBookList.length == 0 && !state.checkAll) return true;
        return false;
    },
    //central getter for books list that refer by the actions of the user to the required getter
    hasCheck: (state) => (id) => {
        if (state.checkBookList.length == 0) return false;
        let x = state.checkBookList.has(state.checkBookList.root, id);
        if (x) return true;
        return false;
    },
    getSortBy(state) {
        return state.sortBy || VueInst.userSettings.settings.sortBookList || "book";
    },
    getLengthListCheck(state) {
        return state.checkBookList.length;
    },
};