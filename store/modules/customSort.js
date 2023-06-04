import * as customSorts from "@/services/customSorts.js";
export const namespaced = true;

export const state = {
    showCustomSort: false,
    selected: {},
    current: null,
    currentSystem: null,
    currentSort: {
        id: 0,
        title: "סדר הדורות",
        details: [{
                detailTitle: 'מקרא וחז"ל',
                profilable: "category",
                profilableId: 75422,
                position: 1,
            },
            {
                detailTitle: "ראשונים וקדמונים",
                profilable: "category",
                profilableId: 75423,
                position: 2,
            },
            {
                detailTitle: 'אחרונים ש-ת"ר',
                profilable: "category",
                profilableId: 75424,
                position: 3,
            },
            {
                detailTitle: 'אחרונים ת"ר -ת"ש',
                profilable: "category",
                profilableId: 75425,
                position: 4,
            },
            {
                detailTitle: "אחרוני זמנינו",
                profilable: "category",
                profilableId: 75426,
                position: 5,
            },
        ],
    },
    sederAdorot: {
        id: 0,
        title: "סדר הדורות",
        details: [{
                detailTitle: 'מקרא וחז"ל',
                profilable: "category",
                profilableId: 75422,
                position: 1,
            },
            {
                detailTitle: "ראשונים וקדמונים",
                profilable: "category",
                profilableId: 75423,
                position: 2,
            },
            {
                detailTitle: 'אחרונים ש-ת"ר',
                profilable: "category",
                profilableId: 75424,
                position: 3,
            },
            {
                detailTitle: 'אחרונים ת"ר -ת"ש',
                profilable: "category",
                profilableId: 75425,
                position: 4,
            },
            {
                detailTitle: "אחרוני זמנינו",
                profilable: "category",
                profilableId: 75426,
                position: 5,
            },
        ],
    },
    customSorts: [{
        id: 1,
        detailTitle: "מכון+קוק",
        details: [{
                title: "מכון ירושלים",
                profilable: "category",
                profilableId: 75428,
                position: 1,
            },
            {
                title: "222",
                profilable: "category",
                profilableId: 75429,
                position: 2,
            },
        ],
    }, ],
    hasChanges: false,
};

export const mutations = {
    SHOW_WIN(state) {
        state.showCustomSort = true;
    },
    HIDE_WIN(state) {
        state.showCustomSort = false;
    },
    SET_CURRENT(state, folder) {
        state.current = folder;
    },
    ADD_TO_LIST(state, payload) {
        let item = {};
        let x = state.customSorts.find((t) => t.title == state.currentSort.title)
            .details[payload.newIndex];
        item.detailTitle = x.title;
        if (payload.from == 1) {
            item.profilable = "category";
        } else {
            item.profilable = "list";
        }
        item.profilableId = x.id;

        item.position = payload.newIndex + 1;
        // state.customSorts.find((t) => t.title == state.currentSort.title).details[
        //   payload.newIndex
        // ] = item;
        let a = state.customSorts.find((t) => t.title == state.currentSort.title)
            .details;
        a.splice(payload.newIndex, 1, item);

        state.hasChanges = true;

        // x.details[payload.newIndex] = payload.item;
    },
    ADD_TO_LIST_BY_ARROW(state, item) {
        state.customSorts
            .find((t) => t.title == state.currentSort.title)
            .details.push(item);
        state.hasChanges = true;
    },
    SET_SYSTEM_CURRENT(state, folder) {
        state.currentSystem = folder;
        state.hasChanges = true;
    },
    RESET_ALL(state) {
        state.selected = {};
        state.current = null;
        state.currentSystem = null;
        state.currentSort = state.sederAdorot;
        state.hasChanges = false;
    },
    SET_SORT(state, sort) {
        state.currentSort = sort;
    },
    SET_CUSTOM_SORT_BOOKS(state, list) {
        state.customSorts = list;
    },
    async ADD_NEW_SORT(state, sort) {
        let arr = [];
        // let data = await customSorts.saveCustomSort({
        //   title: sort,
        //   details: arr,
        // });
        // state.customSorts = data.data;
        state.customSorts.push({
            title: sort,
            details: arr
        });
        state.currentSort = {
            title: sort,
            details: arr
        };
        state.hasChanges = true;
    },
    async UPDATE_SORT(state, payload) {
        if (state.currentSort.id == 0) return;
        let arr = state.currentSort.details;
        let newDetails = {
            position: state.currentSort.details.length + 1,
            profilable: payload.profilable,
            profilableId: payload.item,
        };
        arr.push(newDetails);
        let data = await customSorts.saveCustomSort({
            title: state.currentSort.title,
            details: arr,
        });
        if (data) state.customSorts = data.data;
        state.hasChanges = true;
    },
    async SET_DEFAULT(state) {
        let data = await customSorts.saveAllCustomSorts(state.customSorts);
        state.customSorts = data.data;
        state.hasChanges = false;
        let currentSort = state.currentSort.title;
        if (currentSort == "סדר הדורות") currentSort = "profile";

        await customSorts.setDefaultCustomSort(currentSort);
    },
    async RESET_DEFAULT(state) {
        await customSorts.setDefaultCustomSort("profile");
    },
    async SORT_NOW(state) {
        let data = await customSorts.saveAllCustomSorts(state.customSorts);
        state.customSorts = data.data;
        state.hasChanges = false;
        let currentSort = state.currentSort.title;
        if (currentSort == "סדר הדורות") currentSort = "profile";
        else currentSort = currentSort;
        await customSorts.sortNow(currentSort);
    },
    async DELETE_SORT(state, title) {
        // let data = await customSorts.delCustomSort(title);
        // if (data) state.customSorts = data.data;
        let i = state.customSorts.findIndex((t) => t.title == title);
        state.customSorts.splice(i, 1);
        state.hasChanges = true;
    },
    async SAVE_LIST_SORT(state) {
        let data = await customSorts.saveAllCustomSorts(state.customSorts);
        state.customSorts = data.data;
        state.hasChanges = false;
    },
    DELETE_FILE_FROM_SORET(state, item) {
        let a = state.customSorts.find((t) => t.title == state.currentSort.title)
            .details;
        a.splice(item.position - 1, 1);
        state.hasChanges = true;

        state.currentSort.details.forEach((element, i) => {
            element.position = i + 1;
        });
        a = state.currentSort;
    },
    SORT_CURRENT_LIST(state) {
        state.currentSort.details.forEach((element, i) => {
            element.position = i + 1;
        });
    },
};

export const actions = {
    setCustomSortBooks({
        commit
    }) {
        return new Promise(function(resolve, reject) {
            customSorts
                .getCustomSorts()
                .then((r) => {
                    commit("SET_CUSTOM_SORT_BOOKS", r.data);
                    resolve(true);
                })
                .catch((error) => {
                    console.error(error);
                    reject(false);
                });
        });
    },
    updateSort({
        commit
    }, payload) {
        commit("UPDATE_SORT", payload);
    },
    showCustomSort({
        commit
    }) {
        commit("SHOW_WIN");
    },
    hideCustomSort({
        commit
    }) {
        commit("HIDE_WIN");
    },
    setCurrent({
        commit
    }, folder) {
        commit("SET_CURRENT", folder);
    },
    addItemToList({
        commit
    }, payload) {
        commit("ADD_TO_LIST", payload);
    },
    addItemToListByArrow({
        commit
    }, payload) {
        commit("ADD_TO_LIST_BY_ARROW", payload);
    },
    setSystemCurrent({
        commit
    }, folder) {
        commit("SET_SYSTEM_CURRENT", folder);
    },
    resetAll({
        commit
    }, state) {
        commit("RESET_ALL");
    },
    setSort({
        commit
    }, sort) {
        commit("SET_SORT", sort);
    },
    addSort({
        commit
    }, sort) {
        commit("ADD_NEW_SORT", sort);
    },
    setDefault({
        commit
    }) {
        commit("SET_DEFAULT");
    },
    sortNow({
        commit
    }) {
        commit("SORT_NOW");
    },
    resetDefault({
        commit
    }) {
        commit("RESET_DEFAULT");
    },
    delCustomSort({
        commit
    }, title) {
        commit("DELETE_SORT", title);
    },
    saveListSort({
        commit
    }) {
        commit("SAVE_LIST_SORT");
    },
    deleteFileFromSort({
        commit
    }, item) {
        commit("DELETE_FILE_FROM_SORET", item);
    },
    sortList({
        commit
    }) {
        commit("SORT_CURRENT_LIST");
    },
};
export const getters = {
    getFolders(state, getters, rootState, rootGetters) {
        return rootState.userFolders.folders[0].next;
    },
    getCurrentFolders(state, getters, rootState, rootGetters) {
        if (state.current)
            if (state.current.next.length > 0) return state.current.next;
            else return state.current.parent.next;
        return getters["getFolders"];
    },
    getSystemFolders(state, getters, rootState, rootGetters) {
        return rootGetters["systemFolders/getSystemFolders"];
    },
    getCurrentSystem(state, getters, rootState, rootGetters) {
        if (state.currentSystem)
            if (state.currentSystem.next.length > 0) return state.currentSystem.next;
            else return state.currentSystem.parent.next;
        return getters["getSystemFolders"].next;
    },
    getTitleFolder(state, parent) {
        getParent(parent);
        if (state.current)
            if (state.current.next.length > 0) return state.current.title;
            else return state.current.parent.title;
        return getters["getFolders"].title;
    },
    getTitleSystemFolder(state) {
        if (state.currentSystem)
            if (state.currentSystem.next.length > 0) return state.currentSystem.title;
            else return state.currentSystem.parent.title;
        return getters["getSystemFolders"].title;
    },
};