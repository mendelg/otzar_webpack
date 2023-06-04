export const namespaced = true;
export const state = {
    showVKeyboard: false,
    vKeyBoardInputName: "",
    vKeyBoardInput: "",
};
export const mutations = {
    SHOW_VKB(state, payload) {
        state.showVKeyboard = payload;
    },
    SET_VKB_INPUTNAME(state, payload) {
        state.vKeyBoardInputName = payload;
    },
    SET_VKB_INPUT(state, payload) {
        state.vKeyBoardInput = payload;
    },
};
export const actions = {
    setKeyBoardDisplay({
        commit
    }, payload) {
        commit("SHOW_VKB", payload);
    },
    setKeyBoardInputName({
        commit
    }, payload) {
        commit("SET_VKB_INPUTNAME", payload);
    },
    setKeyBoardInput({
        commit
    }, payload) {
        commit("SET_VKB_INPUT", payload);
    },
};