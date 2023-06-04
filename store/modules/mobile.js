export default {
    namespaced: true,
    state: {
        tab: "LIST",
    },
    actions: {
        setTab({
            commit
        }, tab) {
            commit("SET_TAB", tab);
        },
    },
    mutations: {
        SET_TAB(state, tab) {
            state.tab = tab;
        },
    },
};