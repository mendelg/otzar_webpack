import * as history from "@/services/history.js";
export const namespaced = true;
export const state = {
    //history type- types: "all", "free", "book"
    historyType: "all",
    //searches history list
    userSearchHistoryList: [],
    //checked ids of item from searches history list
    searchHistoryListChecked: [],
};
export const mutations = {
    /**
     * set history list type
     * @param {String} type -to set historyType
     */
    SET_HISTORY_TYPE(state, type) {
        //set the list type
        state.historyType = type;
        //cleare the checked ids of item from searches history list
        state.searchHistoryListChecked = [];
    },
    /**
     * set searches history list
     * @param {Array} historyList -to set userSearchHistoryList
     */
    SET_SEARCH_HISTORY_LIST(state, historyList) {
        state.userSearchHistoryList = historyList;
    },
    /**
     * add item to history list
     * @param {object} historyItem -to add to userSearchHistoryList
     */
    ADD_TO_SEARCH_HISTORY_LIST(state, historyItem) {
        state.userSearchHistoryList.unshift(historyItem);
    },
    /**
     * add checked search item id
     * @param {Number} searchId -to add id to searchHistoryListChecked list ids
     */
    ADD_CHECKED_SEARCH_ITEM(state, searchId) {
        state.searchHistoryListChecked.push(searchId);
    },
    /**
     * check all list's items ids
     */
    CHECK_ALL_SEARCH_LIST_ITEMS(state) {
        //cleare the checked ids of item from searches history list
        state.searchHistoryListChecked = [];
        //loop through userSearchHistoryList and push searches ids
        state.userSearchHistoryList.forEach((hl) => {
            state.searchHistoryListChecked.push(hl.id);
        });
    },
    /**
     * check list's items ids by list type
     */
    CHECK_ALL_SEARCH_LIST_ITEMS_BY_TYPE(state) {
        //cleare the checked ids of item from searches history list
        state.searchHistoryListChecked = [];
        //loop through userSearchHistoryList and push searches ids
        //if historyType list equels to the items search type
        state.userSearchHistoryList.forEach((hl) => {
            if (hl.type == state.historyType)
                state.searchHistoryListChecked.push(hl.id);
        });
    },
    /**
     * uncheck all list's items ids
     */
    UN_CHECK_ALL_SEARCH_LIST_ITEMS(state) {
        //cleare the checked ids of item from searches history list
        state.searchHistoryListChecked = [];
    },
    /**
     * delete checked id of item from checked ids list
     * @param {Number} searchId -to delete
     */
    DELETE_CHECKED_SEARCH_ITEM(state, searchId) {
        state.searchHistoryListChecked = state.searchHistoryListChecked.filter(
            (id) => id !== searchId
        );
    },
    /**
     * set pin item
     * @param {Object} data
     */
    SET_SEARCH_ITEM_PIN(state, data) {
        state.userSearchHistoryList.forEach((ul) => {
            if (ul.id == data.id) ul.pin = data.pin;
        });
    },
    /**
     * set checked pins items list
     * @param {Number} isPin
     */
    SET_SEARCH_ITEMS_PIN_LIST(state, isPin) {
        state.userSearchHistoryList.forEach((ul) => {
            if (state.searchHistoryListChecked.find((id) => id == ul.id))
                ul.pin = isPin;
        });
        //cleare the checked ids of item from searches history list
        state.searchHistoryListChecked = [];
    },
    /**
     * delete item from searches history list
     * @param {Number} id
     */
    DELETE_SEARCH_FROM_HISTORY(state, id) {
        state.userSearchHistoryList = state.userSearchHistoryList.filter(
            (sl) => sl.id != id
        );
    },
    /**
     * delete checked items from searches history list
     * @param {Number} id
     */
    DELETE_CHECKED_LIST_SEARCH(state) {
        state.userSearchHistoryList = state.userSearchHistoryList.filter(
            (sl) => !state.searchHistoryListChecked.find((id) => id == sl.id)
        );
        //cleare the checked ids of item from searches history list
        state.searchHistoryListChecked = [];
    },
    DELETE_ALL(state) {
        state.userSearchHistoryList = [];
        state.searchHistoryListChecked = [];
    },
    MOVE_ITEM(state, id) {
        let arrId = state.userSearchHistoryList.findIndex((h) => h.infoId == id);

        let cutOut = state.userSearchHistoryList.splice(arrId, 1)[0];
        state.userSearchHistoryList.splice(0, 0, cutOut);
    },
    SET_LAST_ACTIVE(state, payLoad) {
        let curr = state.userSearchHistoryList.find((h) => h.id == payLoad.listId);
        if (curr) curr.lastActive = payLoad.index;
    },
};
export const actions = {
    setLastActive({
        commit
    }, payLoad) {
        commit("SET_LAST_ACTIVE", payLoad);
    },
    /**
     * add history item to history list
     * @param {object} item -add to historyliste
     */
    addHistoryItem({
        commit
    }, item) {
        return new Promise((resolve, reject) => {
            commit("ADD_TO_SEARCH_HISTORY_LIST", item);
            resolve();
        });
    },
    /**
     * set history list type
     * @param {String} type -to set historyType
     */
    setHistoryType({
        commit
    }, type) {
        //commit mutation SET_HISTORY_TYPE to set the history list type
        commit("SET_HISTORY_TYPE", type);
    },
    /**
     * set history searches list
     */
    setSearchHistoryList({
        commit
    }) {
        return new Promise(function(resolve, reject) {
            history.getSearchHistory().then((historyList) => {
                historyList = historyList.filter((h) => h.info != null);
                historyList.forEach((hl) => {
                    hl.historyDate = new Date(hl.historyDate);
                });
                commit("SET_SEARCH_HISTORY_LIST", historyList);
                resolve();
            });
        });
    },
    checkedSearchItem({
        commit
    }, searchId) {
        if (state.searchHistoryListChecked.length > 0) {
            if (state.searchHistoryListChecked.find((id) => id == searchId)) {
                return commit("DELETE_CHECKED_SEARCH_ITEM", searchId);
            }
        }
        commit("ADD_CHECKED_SEARCH_ITEM", searchId);
    },
    setSearchItemPin({
        commit
    }, data) {
        history.setSearchHistoryPin(data);
        commit("SET_SEARCH_ITEM_PIN", data);
    },
    deleteSearchFromHistory({
        commit
    }, id) {
        return new Promise(async (resolve, reject) => {
            await history.deleteSearchFromHistory(id);
            commit("DELETE_SEARCH_FROM_HISTORY", id);
            resolve();
        });
    },
    checkAllListSearch({
        commit
    }, hasCheckAll) {
        if (hasCheckAll && state.historyType == "all")
            commit("CHECK_ALL_SEARCH_LIST_ITEMS");
        else if (hasCheckAll && state.historyType !== "all")
            commit("CHECK_ALL_SEARCH_LIST_ITEMS_BY_TYPE");
        else commit("UN_CHECK_ALL_SEARCH_LIST_ITEMS");
    },
    setSearchItemPinList({
        commit
    }, isPin) {
        state.userSearchHistoryList.forEach((ul) => {
            if (state.searchHistoryListChecked.find((id) => id == ul.id)) {
                let data = {
                    id: ul.id,
                    pin: isPin,
                };
                history.setSearchHistoryPin(data);
            }
        });
        commit("SET_SEARCH_ITEMS_PIN_LIST", isPin);
    },
    async deleteCheckedListSearch({
        commit
    }, item) {
        if (item === -1) {
            //delete all the history
            await history.deleteSearchFromHistory(item);
            commit("DELETE_ALL");
        } else {
            for (let i = 0; i < state.userSearchHistoryList.length; i++) {
                let ul = state.userSearchHistoryList[i];
                if (state.searchHistoryListChecked.find((id) => id == ul.id)) {
                    await history.deleteSearchFromHistory(ul.id);
                }
            }

            commit("DELETE_CHECKED_LIST_SEARCH");
        }
    },
    moveItemToBeginning({
        commit
    }, id) {
        return new Promise((resolve, reject) => {
            commit("MOVE_ITEM", id);
            resolve();
        });
    },
};
export const getters = {
    getUserSearchHistory(state) {
        let searchHistoryList = [];
        state.userSearchHistoryList.forEach((sl) => {
            if (sl.type == state.historyType || state.historyType == "all")
                searchHistoryList.push(sl);
        });
        searchHistoryList.sort(function(a, b) {
            return new Date(b.historyDate) - new Date(a.historyDate);
        });

        return searchHistoryList;
    },
    //get history by type (free or book)
    getUserSearchHistoryByType: (state) => (type) => {
        let searchHistoryList = [];
        searchHistoryList = state.userSearchHistoryList.filter((sl) =>
            type.includes(sl.type)
        );
        searchHistoryList.sort(function(a, b) {
            return new Date(b.historyDate) - new Date(a.historyDate);
        });

        return searchHistoryList;
    },
    getSearchHistoryListChecked(state) {
        return state.searchHistoryListChecked;
    },
    getCurrentHistoryLastActive(state, getters, rootState) {
        let currHistory = state.userSearchHistoryList.find(
            (history) => history.id == rootState.freeSearchBookList.currentHistoryId
        );
        if (currHistory) return currHistory.lastActive;
        else return 0;
    },
};