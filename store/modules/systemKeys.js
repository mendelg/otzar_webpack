export const namespaced = true;

export const state = {
    showKeys: false,
};

export const mutations = {
    SHOW_KEYS(state) {
        state.showKeys = true;
    },
    HIDE_KEYS(state) {
        state.showKeys = false;
    },
};

export const actions = {
    setShowKeys({
        commit
    }) {
        commit("SHOW_KEYS");
    },
    setCloseKeys({
        commit
    }) {
        commit("HIDE_KEYS");
    },
};
export const getters = {
    curOrder: (state) => {
        return state.curPage ? state.curPage.order : 0;
    },
};