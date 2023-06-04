import store from "@/store/store.js";
export const namespaced = true;

export const state = {
    pages: [],
    currentPage: 0,
    currentResults: [],
    numGzirimInPage: 10,
};

export const mutations = {
    SET_NUM_IN_PAGE(state, num) {
        state.numGzirimInPage = num;
    },
    INIT_PAGES(state) {
        state.pages = [];
    },
};

export const getters = {
    //get results of current page
    getGzirim() {},
    getPages(state) {
        return state.pages;
    },
};

export const actions = {
    //create array of current pages
    createPagesArr() {
        let tempPages = [];

        let freeSearchResults = store.getters["freeSearchBookList/getCurrentList"];
        let currentBook = 0;

        let currentResult = 0;
        let count = 0;
        freeSearchResults.booksList.forEach((fsResult, index) => {
            currentResult = 0;
            if (index == 0) {
                currentBook = index;
                tempPages.push({
                    book: currentBook,
                    result: count
                });
            }
            if (state.numGzirimInPage - count >= fsResult.fs.results)
                count += fsResult.fs.results;
            else {
                while (currentResult < fsResult.fs.results) {
                    currentBook = index;
                    currentResult += state.numGzirimInPage - count;
                    tempPages.push({
                        book: currentBook,
                        result: currentResult
                    });
                    count = 0;
                }
                count = state.numGzirimInPage - (currentResult - fsResult.fs.results);
            }
        });
        state.pages = tempPages;
    },
    //set number of gzirim displayed in each page
    setGzirimInPage({
        commit
    }, num) {
        commit("SET_NUM_IN_PAGE", num);
    },
    //init pages
    initPages({
        commit
    }) {
        commit("INIT_PAGES");
    },
};