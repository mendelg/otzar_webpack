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
    showWin({
        commit
    }, mode) {
        commit("SHOW_WIN", mode);
    },
};

export const getters = {
    showImportDataWin(state, getters, rootState) {
        let settingsShow = rootState.user.settings.showImportOldDataWin;
        if (
            (settingsShow == undefined || settingsShow == null) &&
            state.showWin == null
        )
            return true;
        else if (state.showWin == null) return settingsShow == 1;
        else return state.showWin;
    },
};