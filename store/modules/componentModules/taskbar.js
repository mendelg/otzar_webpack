export default {
    namespaced: true,
    state: {
        items: [],
        topItem: "",
    },
    mutations: {
        ADD_ITEM(state, item) {
            state.items.push(item);
        },
        DEL_ITEM(state, id) {
            state.items = state.items.filter((e) => e.id !== id);
        },
        SET_ITEM(state, {
            id,
            mode
        }) {
            for (let i = 0; i < state.items.length; i++) {
                if (state.items[i].id == id) {
                    state.items[i].mode = mode;
                    break;
                }
            }
        },
        TOGGLE_ITEM(state, id) {
            for (let i = 0; i < state.items.length; i++) {
                if (state.items[i].id == id) {
                    state.items[i].mode = !state.items[i].mode;
                    break;
                }
            }
        },
        SET_ITEM_CONTENT(state, {
            id,
            content
        }) {
            for (let i = 0; i < state.items.length; i++) {
                if (state.items[i].id == id) {
                    state.items[i].content = content;
                    break;
                }
            }
        },
        SET_TOP_ITEM(state, id) {
            state.topItem = id;
        },
        MINI_ALL(state) {
            for (let i = 0; i < state.items.length; i++) {
                state.items[i].mode = false;
            }
        },
        OPEN_ALL(state) {
            for (let i = 0; i < state.items.length; i++) {
                state.items[i].mode = true;
            }
        },
    },
    actions: {
        addItem({
            commit
        }, item) {
            commit("ADD_ITEM", item);
        },
        setItemMode({
            commit
        }, payload) {
            commit("SET_ITEM", payload);
        },
        minimizeAll({
            commit
        }) {
            commit("MINI_ALL");
        },
        openAll({
            commit
        }) {
            commit("OPEN_ALL");
        },
        toggleItemMode({
            commit,
            state
        }, id) {
            if (!state.items.filter((e) => e.id == id)[0].mode)
                commit("TOGGLE_ITEM", id);
            else {
                if (state.topItem == id) commit("TOGGLE_ITEM", id);
                else commit("SET_TOP_ITEM", id);
            }
        },
        setItemContent({
            commit
        }, payload) {
            commit("SET_ITEM_CONTENT", payload);
        },
        removeItem({
            commit
        }, id) {
            commit("DEL_ITEM", id);
        },
        setTopItem({
            commit
        }, id) {
            commit("SET_TOP_ITEM", id);
        },
    },
    getters: {
        hasOpenItem(state) {
            return state.items.filter((i) => i.mode).length > 0;
        },
    },
};