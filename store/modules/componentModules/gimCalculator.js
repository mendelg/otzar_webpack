export const namespaced = true;

export const state = {
    visible: false,
};

export const mutations = {
    //set visibily of popup
    SET_VISIBLE(state) {
        state.visible = true;
    },
    SET_CLOSE(state) {
        state.visible = false;
    },
};

export const actions = {
    //set visibily of popup
    setVisible({
        commit
    }) {
        commit("SET_VISIBLE", null);
    },
    setclosePopup({
        commit
    }) {
        commit("SET_CLOSE", null);
    },
};