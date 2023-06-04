export default {
    namespaced: true,
    state: {
        commentsShow: false,
        keysShow: false,
        marksShow: false,
        linksShow: false,
    },
    actions: {
        setShow({
            commit
        }, payload) {
            commit("SET_SHOW", payload);
        },
    },
    mutations: {
        SET_SHOW(state, payload) {
            if (payload.type && typeof payload.show == "boolean") {
                if (state.hasOwnProperty(payload.type)) {
                    state[payload.type] = payload.show;
                }
            }
        },
    },
};