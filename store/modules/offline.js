export const namespaced = true;

export const state = {
    licence: {}
};
export const mutations = {
    SET_LICENCE(state, payload) {
        state.licence = payload;
    },
};
export const actions = {
    setLicence({
        commit
    }, payload) {
        commit("SET_LICENCE", payload);
    },
};
export const getters = {
    version(state) {
        return state.licence.otzarVer;
    },
};