const {
    state
} = require("./systemFolders");

let tm = null;

function checkRefreshState(count) {
    if (state.count === count && state.status === "preparing") {
        state.count = 0;
        state.status = "error";
    }
}

export default {
    namespaced: true,
    state: {
        count: 0,
        status: "done",
    },
    mutations: {
        SET_STATUS(state, payload) {
            if (payload === "preparing") {
                state.count++;
                //  tm = setTimeout(checkRefreshState(state.count), 10000);
            } else if (payload === "ready") {
                state.count--;
                if (state.count <= 0) state.status = payload;
                return;
            }
            state.status = payload;

            // if (state.count == 1 && payload === "ready") state.status = payload;
        },
    },
    actions: {
        setStatus({
            commit
        }, payload) {
            commit("SET_STATUS", payload);
        },
    },
    getters: {
        getStatus(state) {
            return state.status;
        },
    },
};