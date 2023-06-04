import Vue from "vue";

export const namespaced = true;

export const state = {
    visible: false,
    show: "add-tsiyun",
    grid: {
        classes: "",
        position: {
            top: 0,
            left: "center",
            offset: false,
        },
    },
    tabId: "",
};

export const mutations = {
    //set current tabId if needed
    SET_TABID(state, id) {
        state.tabId = id;
    },
    //set visibily of popup
    SET_VISIBLE(state) {
        state.visible = true;
    },
    //set invisibily of popup
    SET_INVISIBLE(state) {
        state.visible = false;
    },
    //toggle invisibily of popup
    TOGGLE_VISIBLE(state) {
        state.visible = !state.visible;
    },
    //set the slot to show
    SET_SHOW(state, {
        show
    }) {
        state.show = show;
    },
    SET_GRID(state, grid) {
        state.grid = grid;
    },
    RESET_GRID(state) {
        (state.grid.classes = ""),
        (state.grid.position = {
            top: 0,
            left: "center",
        });
    },
};

export const actions = {
    //set current tabid if needed
    setTabId({
        commit
    }, id) {
        commit("SET_TABID", id);
    },
    //set visibily of popup
    setVisible({
        commit
    }) {
        commit("SET_VISIBLE", null);
    },
    //set invisibily of popup
    setInvisible({
        commit,
        dispatch
    }) {
        commit("SET_INVISIBLE", null);
        dispatch("resetGrid");
    },
    //TOGGLE invisibily of popup
    toggleVisible({
        commit,
        dispatch,
        state
    }) {
        if (state.show) dispatch("resetGrid");
        commit("TOGGLE_VISIBLE", null);
    },
    //set the slot to show
    setSlotShow({
        commit
    }, show) {
        commit("SET_SHOW", {
            show,
        });
    },
    //set the slot to show
    setGrid({
        commit
    }, grid) {
        commit("SET_GRID", grid);
    },
    resetGrid({
        commit
    }) {
        commit("RESET_GRID");
    },
};