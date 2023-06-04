export const namespaced = true;

export const state = {
    msg: {},
    show: false,
};

export const mutations = {
    SHOW(state, msg) {
        state.msg = msg;
        state.show = true;
    },
    REMOVE(state) {
        state.msg = {};
        state.show = false;
    },
};
export const actions = {
    show({
        commit
    }, msg) {
        commit("SHOW", msg);
    },
    remove({
        commit
    }) {
        commit("REMOVE");
    },
};