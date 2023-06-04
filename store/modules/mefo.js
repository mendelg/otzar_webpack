export default {
    namespaced: true,
    state: {
        enable: true,
        showMefoArea: false,
        kickout: false,
        no_space: false,
        connected: false,
        loading: false,
        currentShasSectionId: -1,
        currentShasId: -1,
        showMefPurchaseMsg: true,
    },
    mutations: {
        SET_SHOW_MEF_PURCHASE_MESSAGE(state, show) {
            state.showMefPurchaseMsg = show;
        },
        SET_SHOW_MEFO_AREA(state, show) {
            state.showMefoArea = show;
        },
        SET_MEFO_ENABLE(state, v) {
            state.enable = v;
        },
        SET_KICKOUT(state, v) {
            state.kickout = v;
            if (v) state.connected = false;
        },
        SET_CONNECTED(state, v) {
            state.connected = v;
        },
        SET_NO_SPACE(state, v) {
            state.no_space = v;
            if (v) state.connected = false;
        },
        SET_LOADING(state, v) {
            state.loading = v;
        },
        SET_CURRENT_SHAS_SECTION_ID(state, id) {
            state.currentShasSectionId = id;
        },
        SET_CURRENT_SHAS_ID(state, bookId) {
            state.currentShasId = bookId;
        },
    },
    actions: {
        setShowMefPurchaseMsg({
            commit
        }, show) {
            commit("SET_SHOW_MEF_PURCHASE_MESSAGE", show);
        },
        setLoading({
            commit
        }, v) {
            commit("SET_LOADING", v);
        },
        setShowMefoArea({
            commit
        }, show) {
            commit("SET_SHOW_MEFO_AREA", show);
        },
        setKickOut({
            commit
        }, v) {
            commit("SET_KICKOUT", v);
        },
        setNoSpace({
            commit
        }, v) {
            commit("SET_NO_SPACE", v);
        },
        setMefoEnable({
            commit
        }, v) {
            commit("SET_MEFO_ENABLE", v);
        },
        setConnected({
            commit
        }, v) {
            commit("SET_CONNECTED", v);
        },
        setCurrentShasSectionId({
            commit
        }, id) {
            commit("SET_CONNECTED", id);
        },
        setCurrentShasId({
            commit
        }, bookId) {
            commit("SET_CURRENT_SHAS_ID", bookId);
        },
    },
    getters: {
        showMefPurchaseMsg(state) {
            return state.showMefPurchaseMsg;
        },
    },
};