export const namespaced = true;

import * as customBook from "@/store/modules/customBook.js";
export const modules = {
    customBook
};

export const state = {
    showCreate: false,
    currAction: "",
    drawOcr: false,
    ocrToolOutput: {},
    openScreenView: false,
    bookIdForOpen: null,
    displayScreenOpen: true,
    saveImagesProgress: {
        max: 0,
        val: 0
    },
    isCurBookChanged: false,
};

export const mutations = {
    //set visibily of popup
    SET_VISIBLE(state) {
        state.showCreate = true;
    },
    SET_CLOSE(state) {
        state.showCreate = false;
    },
    SET_ACTION(state, txt) {
        state.currAction = txt;
    },
    SET_NON_DISPLAY_SCREEN(state) {
        state.displayScreenOpen = false;
    },
    CLOSE_OPEN_SCREEN(state, toggle) {
        state.openScreenView = toggle;
    },
    RESET_ALL(state) {
        state.showCreate = false;
        state.currAction = "current";
        state.openScreenView = false;
    },
    SET_OCR_ACTION(state, active) {
        state.drawOcr = active;
    },
    SET_OCR_OUTPUT(state, output) {
        state.ocrToolOutput = output;
    },
    SET_SAVE_IMG_PROGRESS(state, {
        max,
        val
    }) {
        state.saveImagesProgress = {
            max,
            val
        };
    },
    SET_CUR_BOOK_AS_CHENGED(state, val) {
        state.isCurBookChanged = val;
    },
    SET_BOOK_FOR_OPEN(state, bookId = null) {
        state.bookIdForOpen = bookId;
    },
};

export const actions = {
    setOcrOutput({
        commit
    }, output) {
        commit("SET_OCR_OUTPUT", output);
    },
    //set visibily of popup
    showCreate({
        commit
    }) {
        commit("SET_VISIBLE", null);
    },
    setclosePopup({
        commit
    }) {
        commit("SET_CLOSE", null);
        commit("RESET_ALL");
    },
    setAction({
        commit
    }, txt) {
        commit("SET_ACTION", txt);
    },
    setOcrAction({
        commit
    }, active) {
        commit("SET_OCR_ACTION", active);
    },
    setNonDisplayScreenOpen({
        commit
    }) {
        commit("SET_NON_DISPLAY_SCREEN", null);
    },
    closeOpenScreen({
        commit
    }, toggle) {
        commit("CLOSE_OPEN_SCREEN", toggle);
    },
    setSaveImgsProgress({
        commit
    }, {
        max,
        val
    }) {
        commit("SET_SAVE_IMG_PROGRESS", {
            max,
            val
        });
    },
    setCurBookAsChanged({
        commit
    }, payload) {
        commit("SET_CUR_BOOK_AS_CHENGED", payload);
    },
    seBookForOpen({
        commit
    }, bookId) {
        commit("SET_BOOK_FOR_OPEN", bookId);
    },
};
export const getters = {
    // return selected action
    getAction(state) {
        return state.currAction;
    },

    getDrawOcrAction(state) {
        return state.drawOcr === true && state.currAction === "ocr";
    },

    // if openScreen Window is view
    showOpenScreen(state) {
        return state.openScreenView;
    },

    //show each opening of the window
    displayOpenScreen(state) {
        return state.displayScreenOpen;
    },

    getBookForOpen(state) {
        return state.bookIdForOpen;
    },
};