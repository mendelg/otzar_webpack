export default {
    namespaced: true,
    state: {
        show: false,
        currentMenu: "",
        currentBookSelected: 0,
        showPurchaseMsg: true,
        /*      for editing book details  */
    },
    actions: {
        openMenu({
            commit
        }) {
            commit("SET_SHOW", true);
        },
        closeMenu({
            commit
        }) {
            commit("SET_SHOW", false);
        },
        openAt({
            commit
        }, payload) {
            commit("SET_CURRENT_MENU", payload);
            commit("SET_SHOW", true);
        },
        resetMenu({
            commit
        }) {
            commit("RESET_MENU");
        },
    },
    mutations: {
        SET_SHOW(state, mode) {
            state.show = mode;
        },
        RESET_MENU(state, mode) {
            state.currentMenu = "";
        },
        SET_CURRENT_MENU(state, menu) {
            state.currentMenu = menu;
        },
    },
};