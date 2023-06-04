export const namespaced = true;

export const state = {
    showWin: false,
};

export const mutations = {
    //toggle visibily of personal ext popup
    SHOW_WIN(state, status) {
        state.showWin = status;
    },
};

export const actions = {
    setFindMmWin({
        commit
    }, mode) {
        commit("SHOW_WIN", mode);
    },
};

export const getters = {
    showFindMmWin(state, getters, rootState) {
        return state.showWin;
    },
};