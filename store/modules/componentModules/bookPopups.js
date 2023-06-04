export const namespaced = true;

export const state = {
    bookDetailsVisibility: false,
    personalExtVisibility: false,
    printBookVisibility: false,
    OCREnabled: false,
    enableGrab: true,
    bookDetailsFromListBook: false,
    tempId: null,
    OCRResultsVisible: false,
};

export const mutations = {
    //toggle visibily of personal ext popup
    TOGGLE_PERSONAL_EXT_VISIBLE(state) {
        state.personalExtVisibility = !state.personalExtVisibility;
    },
    //toggle visibily of book details popup
    TOGGLE_BOOKDETAILS_VISIBLE(state) {
        state.bookDetailsVisibility = !state.bookDetailsVisibility;
    },
    //toggle visibily of print book popup
    TOGGLE_PRINTBOOK_VISIBLE(state) {
        state.printBookVisibility = !state.printBookVisibility;
    },
    //close book details popup
    CLOSE_BOOKDETAILS(state) {
        state.bookDetailsVisibility = false;
        state.bookDetailsFromListBook = false;
    },
    //close PERSONAL EXT popup
    CLOSE_PERSONAL_EXT(state) {
        state.personalExtVisibility = false;
    },
    //close book popup
    CLOSE_PRINTBOOK(state) {
        state.printBookVisibility = false;
    },
    //set OCR enable
    OCR_ENABLE(state, {
        enable
    }) {
        state.OCREnabled = enable;
    },
    TOGGLE_OCR_ENABLE(state) {
        state.OCREnabled = !state.OCREnabled;
    },

    SHOW_BOOKDETAILS_VISIBLE(state, id) {
        state.tempId = id;
        state.bookDetailsVisibility = true;

        state.bookDetailsFromListBook = true;
    },

    SET_GRAB_MODE(state, mode) {
        state.enableGrab = mode;
    },
};

export const actions = {
    setGrab({
        commit
    }, mode) {
        commit("SET_GRAB_MODE", mode);
    },
    //TOGGLE visibily of print popup
    togglePrintBookVisible({
        commit
    }) {
        commit("TOGGLE_PRINTBOOK_VISIBLE", null);
    },
    //TOGGLE visibily of details popup
    toggleBookDetailsVisible({
        commit
    }) {
        commit("TOGGLE_BOOKDETAILS_VISIBLE", null);
    },
    //CLOSE print popup
    closePrintBook({
        commit
    }) {
        commit("CLOSE_PRINTBOOK", null);
    },
    //TOGGLE visibily of PERSONAL EXT popup
    togglePersonalExtVisible({
        commit
    }) {
        commit("TOGGLE_PERSONAL_EXT_VISIBLE", null);
    },
    //CLOSE PERSONAL EXT popup
    closePersonalExt({
        commit
    }) {
        commit("CLOSE_PERSONAL_EXT", null);
    },
    //close details popup
    closeBookDetails({
        commit
    }) {
        commit("CLOSE_BOOKDETAILS", null);
    },
    //set OCR enable
    setOCREnable({
        commit
    }, enable) {
        commit("OCR_ENABLE", {
            enable
        });
    },
    //TOGGLE OCR enable
    toggleOCREnable({
        commit
    }) {
        commit("TOGGLE_OCR_ENABLE");
    },

    showBookDetailsVisible({
        commit
    }, id) {
        commit("SHOW_BOOKDETAILS_VISIBLE", id);
    },
};
export const getters = {
    getSelectBookDetails(state) {
        return state.tempId;
    },
};