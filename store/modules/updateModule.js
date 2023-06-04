export default {
    namespaced: true,
    state: {
        tasks: [],
        show: false,
    },
    mutations: {
        ADD_ACTION(state, payload) {
            if (!state.tasks.find((a) => a.type == payload.type))
                state.tasks.push(payload);
        },
        DEL_ACTION(state, id) {
            state.tasks = state.tasks.filter((a) => a.id != id);
        },
        COMPLETE_ACTION(state, id) {
            const item = state.tasks.find((a) => a.id === id);
            if (item) item.status = "done";
        },
        ERR_ACTION(state, id) {
            const item = state.tasks.find((a) => a.id === id);
            if (item) item.status = "error";
        },
        CLEAN_DONE(state) {
            state.tasks = state.tasks.filter((a) => a.status != "done");
        },
    },
    actions: {
        addAction({
            commit
        }, payload) {
            payload.id = Date.now();
            payload.status = "pending";
            commit("ADD_ACTION", payload);
            return payload;
        },
        delAction({
            commit
        }, id) {
            commit("DEL_ACTION", id);
        },
        delAllDoneActions({
            commit,
            state
        }) {
            state.tasks.forEach((element) => {
                if (element.status == "done") commit("DEL_ACTION", element.id);
            });
        },
        completeAction({
            commit
        }, id) {
            commit("COMPLETE_ACTION", id);
        },
        errAction({
            commit
        }, id) {
            commit("ERR_ACTION", id);
        },
        cleanDone({
            commit
        }) {
            commit("CLEAN_DONE");
        },
    },
};