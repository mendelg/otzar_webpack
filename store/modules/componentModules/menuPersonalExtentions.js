//menuPersonalExtentions
import * as loadUserPersonalExtensions from "@/services/loadUserPersonalExtensions.js";
import * as books from "@/store/modules/books.js";
import * as userPersonalExtensions from "@/store/modules/userPersonalExtensions.js";

//userPersonalExtensions
export const namespaced = true;
export const state = {
    sortListType: "date",
    //menu
    checkedItemsIdInList: [],
};
export const mutations = {
    //menu
    SET_SORT_TYPE(state, sortListType) {
        state.sortListType = sortListType;
    },
    //menu
    ADD_CHECKED_ITEM(state, id) {
        state.checkedItemsIdInList.push(id);
    },
    //menu
    CHECK_ALL_COMMENTS_LIST_ITEMS(state, rootState) {
        state.checkedItemsIdInList = [];
        rootState.userPersonalExtensions.userCommentsList.forEach((hl) => {
            state.checkedItemsIdInList.push(hl.id);
        });
    },
    //menu
    CHECK_ALL_KEYS_LIST_ITEMS(state, rootState) {
        state.checkedItemsIdInList = [];
        rootState.userPersonalExtensions.userKeysList.forEach((hl) => {
            state.checkedItemsIdInList.push(hl.id);
        });
    },
    //menu
    CHECK_ALL_MARKS_LIST_ITEMS(state, rootState) {
        state.checkedItemsIdInList = [];
        rootState.userPersonalExtensions.userMarkersList.forEach((hl) => {
            state.checkedItemsIdInList.push(hl.id);
        });
    },
    CHECK_ALL_LINKS_LIST_ITEMS(state, rootState) {
        state.checkedItemsIdInList = [];
        rootState.userPersonalExtensions.userLinksList.forEach((hl) => {
            state.checkedItemsIdInList.push(hl.id);
        });
    },
    //menu
    UN_CHECK_ALL_LIST_ITEMS(state) {
        state.checkedItemsIdInList = [];
    },
    //menu
    DELETE_CHECKED_ITEM(state, itemId) {
        state.checkedItemsIdInList = state.checkedItemsIdInList.filter(
            (id) => id !== itemId
        );
    },
};
export const actions = {
    //menu
    setSortType({
        commit
    }, sortListType) {
        return new Promise((res, rej) => {
            commit("SET_SORT_TYPE", sortListType);
            res();
        });
    },
    //menu
    checkedItem({
        commit
    }, itemId) {
        if (state.checkedItemsIdInList.length > 0) {
            if (state.checkedItemsIdInList.find((id) => id == itemId)) {
                return commit("DELETE_CHECKED_ITEM", itemId);
            }
        }
        commit("ADD_CHECKED_ITEM", itemId);
    },
    //menu
    checkAllItemsInList({
        commit,
        rootState
    }, payload) {
        if (payload.hasCheckAll) {
            if (payload.listType == "comment")
                commit("CHECK_ALL_COMMENTS_LIST_ITEMS", rootState);
            else if (payload.listType == "key")
                commit("CHECK_ALL_KEYS_LIST_ITEMS", rootState);
            else if (payload.listType == "marker")
                commit("CHECK_ALL_MARKS_LIST_ITEMS", rootState);
            else if (payload.listType == "link")
                commit("CHECK_ALL_LINKS_LIST_ITEMS", rootState);
        } else commit("UN_CHECK_ALL_LIST_ITEMS");
    },
    //menu
    deleteCheckedItemsList({
        dispatch,
        commit,
        rootState
    }, listType) {
        if (listType == "comment") {
            let commentsList = rootState.userPersonalExtensions.userCommentsList;
            commentsList.forEach((c) => {
                if (state.checkedItemsIdInList.find((id) => id == c.id)) {
                    dispatch("userPersonalExtensions/deleteUserComment", c.id, {
                        root: true,
                    });
                }
            });
        } else if (listType == "key") {
            rootState.userPersonalExtensions.userKeysList.forEach((k) => {
                if (state.checkedItemsIdInList.find((id) => id == k.id))
                    dispatch("userPersonalExtensions/deleteUserKey", k.id, {
                        root: true,
                    });
            });
        } else if (listType == "marker") {
            rootState.userPersonalExtensions.userMarkersList.forEach((m) => {
                if (state.checkedItemsIdInList.find((id) => id == m.id))
                    dispatch("userPersonalExtensions/deleteUserMarker", m.id, {
                        root: true,
                    });
            });
        } else if (listType == "link") {
            rootState.userPersonalExtensions.userLinksList.forEach((m) => {
                if (state.checkedItemsIdInList.find((id) => id == m.id))
                    dispatch("userPersonalExtensions/deleteUserLink", m.id, {
                        root: true,
                    });
            });
        }
        commit("UN_CHECK_ALL_LIST_ITEMS");
    },
};
//menu
export const getters = {
    getUserCommentsList(state, getters, rootState) {
        let commentsList = rootState.userPersonalExtensions.userCommentsList;
        /*  if (state.sortListType == "date") {
          commentsList.sort(function(a, b) {
            return new Date(b.created) - new Date(a.created);
          });
        }
        if (state.sortListType == "bookName") {
          commentsList.sort((a, b) => (a.bookName > b.bookName ? 1 : -1));
        } */
        return commentsList;
    },
    getUserKeysList(state, getters, rootState) {
        let keysList = rootState.userPersonalExtensions.userKeysList;
        /* if (state.sortListType == "date") {
          keysList.sort(function(a, b) {
            return new Date(b.created) - new Date(a.created);
          });
        }
        if (state.sortListType == "bookName") {
          keysList.sort((a, b) => (a.bookName > b.bookName ? 1 : -1));
        }
        if (state.sortListType == "key") {
          keysList.sort((a, b) => (a.key > b.key ? 1 : -1));
        } */
        return keysList;
    },
    getUserMarkersList(state, getters, rootState) {
        let markersList = rootState.userPersonalExtensions.userMarkersList;
        /*  if (state.sortListType == "date") {
          markersList.sort(function(a, b) {
            return new Date(b.created) - new Date(a.created);
          });
        }
        if (state.sortListType == "bookName") {
          markersList.sort((a, b) => (a.bookName > b.bookName ? 1 : -1));
        } */
        return markersList;
    },
    getUserLinksList(state, getters, rootState) {
        let linksList = rootState.userPersonalExtensions.userLinksList;
        /*  if (state.sortListType == "date") {
          linksList.sort(function(a, b) {
            return new Date(b.created) - new Date(a.created);
          });
        }
        if (state.sortListType == "bookName") {
          linksList.sort((a, b) => (a.bookName > b.bookName ? 1 : -1));
        } */
        return linksList;
    },
    getListCheckedIds(state) {
        return state.checkedItemsIdInList;
    },
    getSortList(state) {
        return state.sortListType;
    },
};