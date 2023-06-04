export const namespaced = true;

export const state = {
    visibleWelcome: true,
};

export const mutations = {
    //set visibily of popup
    SET_VISIBLE(state) {
        state.visibleWelcome = true;
    },
    SET_CLOSE(state) {
        state.visibleWelcome = false;
    },
};

export const actions = {
    //set visibily of popup

    visible({
        commit
    }) {
        commit("SET_VISIBLE", null);
    },
    closewindow({
        commit
    }) {
        commit("SET_CLOSE");
    },
};