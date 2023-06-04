import {
    treeBooks
} from "@/store/modules/books.js";
import {
    getUserFreeSearchSavedList,
    userFreeSearchListDeleteBooks,
} from "@/services/userFoldersData.js";
import {
    getGzirimData
} from "@/services/freeSearch.js";
import AVLTree from "@/utils/avl";
import VueInst from "@/main_app.js";

import {
    getCustomSortBooks
} from "@/services/customSorts.js";
import {
    getBookName
} from "../../services/bookData";
import * as history from "@/services/history.js";
export let customSortBooks = [];

export const namespaced = true;
let booksIds = [];
let currentList = [];
let booksChecked = {};
let booksIndexChecked = {};
let currListData = [];
let currListCahceObj = {};

function checkCacheForGCList(data) {
    let useCache = true;
    if (!currListCahceObj) return false;
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        if (data[keys[i]] != currListCahceObj[keys[i]]) {
            useCache = false;
            break;
        }
    }
    return useCache;
}

export const state = {
    searchInTxt: "",
    setFocusInInput: 0,
    dontLoadGzirim: false,
    gzirimMode: false,
    dontScroll: false,
    searchNumWords: 0,
    freeSearchHistory: [],
    active: false,
    currentListLength: 0,
    currentHistoryId: 0,
    currentHistoryLastActive: 0,
    booksIdsRefresh: true,
    booksCheckedRefresh: true,
    checkedBooksCount: 0,
    favoriteCheckBooksCount: 0,
    currentFsName: "",
    totalResults: 0,
    currentFsSavedList: "",
    textSearch: "",
    finalTextSearch: "",
    textInput: "",
    searchInBooks: [],
    prevSearchInBooks: [],
    searchInType: undefined,
    prevSearchInType: 1,
    sortBooksBy: 0,
    savedListName: "",
    sortResults: [],
    currentFilter: 0,
    currentSearchInType: "",
    showSortResults: false,
    showList: false,
    historyUsersActions: {
        //the current action in history will be synchronized with the data to kn
        current: 1,
        isAddedToHistory: false,
        //array of all user's action
        data: [{
            type: "ALL",
            content: "",
        }, ],
    },
    dorot: [
        'מקרא וחז"ל',
        "ראשונים וקדמונים",
        'אחרונים ש-ת"ר',
        'אחרונים ת"ר -ת"ש',
        "אחרוני זמנינו",
        "אחרים",
    ],
    sortBy: "ideal",
    resultsType: "classic" /* classic, special   */ ,
    hideBookLists: false,
    customListAdded: false,
    listFromSearchIn: false,
};

export const mutations = {
    UPD_CURR_LIST_INX(state, data) {
        state.currentHistoryLastActive = data.index;
        //update history in db (ignore unsuitable function name)
        history.setSearchHistoryPin({
            lastActive: data.index,
            id: state.currentHistoryId,
        });
    },
    TOGGLE_CUSTOM_ADDED(state) {
        state.customListAdded = !state.customListAdded;
    },
    REFRESH_CURRENT_LIST(state, {
        hide
    }) {
        currentList = [];
        //reset list according to hidden books \ active maagar\ filter by dor
        let allBooks = treeBooks;

        const showHide = hide;
        const enableHide = VueInst.userSettings.settings.enableHidden != "0";

        booksIds.forEach((bookid, i) => {
            let book = allBooks.get(allBooks.root, bookid.book);
            if (book == undefined) return;
            if (!book._show) return;
            if (!showHide && enableHide && book._hide) return;

            if (
                state.searchInBooks != "" &&
                !(
                    book.name.includes(state.searchInBooks) ||
                    book.mainAuthorName.includes(state.searchInBooks)
                )
            )
                return;

            //filter hidden books
            // if (book._show && !book._hide) {
            /* NEW WAY PERIOD
             if (
              (state.currentFilter > 0 &&
                (book.dor & (1 << (state.currentFilter - 1))) > 0) ||
              (book.dor == 0 && state.currentFilter == 6) ||
              state.currentFilter == 0
            )  */
            if (
                (state.currentFilter > 0 && book.dor == state.currentFilter) ||
                (book.dor == 0 && state.currentFilter == 6) ||
                state.currentFilter == 0
            ) {
                book.index = i;
                if (state.currentFsName != "")
                    book.fs = {
                        fs: state.currentFsName,
                        start: bookid.start,
                        end: bookid.end,
                        results: bookid.results,
                        matches: bookid.matchesNum,
                        rate: bookid.rate,
                        gzirim: bookid.gzirim != undefined ? bookid.gzirim : false,
                        bookref: bookid,
                        /*  gzirimData:
                            bookid.gzirimData != undefined ? bookid.gzirimData : {}, */
                    };
                /*           let author = book.mainAuthorName;

                  if (author == undefined) author = "";
                  else author = author.name; */

                currentList.push(book);
            }
            // }
        });

        state.currentListLength = currentList.length;
        booksChecked = {};
        state.checkedBooksCount = 0;
        state.booksIdsRefresh = !state.booksIdsRefresh;
        state.booksCheckedRefresh = !state.booksCheckedRefresh;
    },
    REFRESH_LIST(state) {
        state.booksIdsRefresh = !state.booksIdsRefresh;
    },
    REFRESH_CHECKS(state) {
        booksChecked = {};
        state.checkedBooksCount = 0;
        state.booksCheckedRefresh = !state.booksCheckedRefresh;
    },
    SORT_BY_LIST(state, sort) {
        state.sortBy = sort;
    },
    SET_GZIRIM_DATA(state, index) {
        //get data for gzirim

        getGzirimData(
            state.currentFsName,
            booksIds[index].start,
            booksIds[index].end,
            booksIds[index].results,
            booksIds[index].book
        ).then((data) => {
            booksIds[index].gzirimData = data;
            state.dontScroll = true;
            state.booksIdsRefresh = !state.booksIdsRefresh;
        });
    },
    SET_GZIRIM_SHOW(state, show) {
        /*  currentList.forEach((b) => {
          b.gzirim = show;
        }); */

        if (show) {
            state.dontLoadGzirim = true;
        }
        state.gzirimMode = show;
        booksIds.forEach((b) => {
            b.gzirim = show;
        });

        if (!show) state.booksIdsRefresh = !state.booksIdsRefresh;
        //state.booksIdsRefresh = !state.booksIdsRefresh;
    },
    TOGGLE_GZIRIM(state, index) {
        let gzirim = booksIds[index].gzirim ? booksIds[index].gzirim : false;
        booksIds[index].gzirim = !gzirim;

        state.booksIdsRefresh = !state.booksIdsRefresh;
    },
    SET_SORT_RESULTS(state, results) {
        state.sortResults = results;
    },
    SET_SEARCH_NUM_WORDS(state, num) {
        state.searchNumWords = num;
    },
    SET_FSLIST_NAME(state, name) {
        state.currentFsSavedList = name;
    },
    SET_FSNAME(state, name) {
        state.currentFsName = name;
    },
    SET_HISTORY(state, history) {
        state.freeSearchHistory = history;
    },
    /**
     * set the text for freesearch
     * @param {Object} txt -the text to search
     */
    SET_SEARCHTXT(state, {
        txt
    }) {
        state.textSearch = txt;
    },
    SET_INPUTTXT(state, {
        txt
    }) {
        state.textInput = txt;
    },
    /**
     * array of book ids to search in
     * @param {Object} books - array of book ids to search in
     */
    SET_BOOKS_TO_SEARCH_IN(state, {
        books
    }) {
        state.searchInBooks = books;
    },
    SET_PREV_BOOKS_TO_SEARCH_IN(state, books) {
        state.prevSearchInBooks = books;
    },
    RESET_BOOKS_TO_SEARCH_IN(state) {
        state.searchInBooks = state.prevSearchInBooks;
    },
    /**
     * array of the result book ids
     * @param {Object} books - array of result book ids
     */
    SET_RESULT_BOOKS(state, {
        books
    }) {
        state.currentFilter = 0;
        currentList = [];
        booksIds = books;
    },
    SET_CURRENT_LIST(state, {
        hide
    }) {
        const showHide = hide;
        const enableHide = VueInst.userSettings.settings.enableHidden != "0";

        let sortResults = [0, 0, 0, 0, 0, 0];
        let allBooks = treeBooks;

        booksIds.forEach((bookid, i) => {
            let b = allBooks.get(allBooks.root, bookid.book);
            if (b == undefined) return;
            /*
    NEW WAY PERIOD
     if (
        (showHide || !enableHide || (enableHide && b._hide === 0)) &&
        b._show
      ) {
        if (!b.dor) sortResults[5]++;
        else {
          for (let i = 1; i <= 5; i++) {
            let flag = 1 << (i - 1);
            if ((b.dor & flag) == flag) sortResults[i - 1]++;
          }
        }
      } */
            if ((showHide || !enableHide || (enableHide && b._hide === 0)) && b._show)
                sortResults[b.dor - 1]++;
            b.index = i;

            if (state.currentFsName != "") {
                if (state.currentFsName == "special") {
                    currentList.push({
                        book: b,
                        position: bookid.position,
                        special: true,
                        result: bookid.txt,
                        page: bookid.page,
                        id: b.id,
                        mainVolume: b.mainVolume,
                        resultType: bookid.resultType,
                    });
                } else {
                    b.fs = {
                        fs: state.currentFsName,
                        start: bookid.start,
                        end: bookid.end,
                        results: bookid.results,
                        matches: bookid.matchesNum,
                        rate: bookid.rate,
                        gzirim: bookid.gzirim != undefined ? bookid.gzirim : false,
                        bookref: bookid,
                    };
                    currentList.push(b);
                }
            }
        });

        state.sortResults = sortResults.map((r, i) => {
            return {
                type: "category",
                id: i + 1,
                num: r,
                title: state.dorot[i]
            };
        });
    },
    DO_SORT(state, sort) {
        if (sort.startsWith("custom_")) {
            try {
                currentList.forEach((c) => {
                    c.sortValue = 9999;
                });
                currentList.forEach((book, index, arr) => {
                    customSortBooks.forEach((sort, sortIndex) => {
                        let bookid = sort.get(sort.root, book.id);
                        if (bookid) {
                            if (arr[index].sortValue == 9999) {
                                arr[index].sortValue = sortIndex + 1;
                            }
                        }
                    });
                });
            } catch (ex) {
                console.error(ex.message);
            }

            //first sort by sys sort
            currentList.sort((fbook, sbook) => {
                let a = fbook;
                let b = sbook;
                /* if (a.special) {
                  a = fbook.book;
                  b = sbook.book;
                } */
                //new way sort
                if (a.sortValue < b.sortValue) return -1; //a come first
                if (a.sortValue > b.sortValue) return 1;
                if (a.nameSort < b.nameSort) return -1; //a come first
                if (a.nameSort > b.nameSort) return 1;

                return -1;
            });

            //then sort by custom - result will be up
            // currentList.sort((fbook, sbook) => {
            //   let a = fbook;
            //   let b = sbook;
            //   if (a.special) {
            //     a = fbook.book;
            //     b = sbook.book;
            //   }
            //   if (a.sortValue < b.sortValue) return -1; //a come first
            //   if (a.sortValue > b.sortValue) return 1;
            //   return -1;
            // });
        } else
            switch (sort) {
                case "ideal":
                    {
                        currentList.sort((fbook, sbook) => {
                            let a = fbook;
                            let b = sbook;
                            if (a.special) {
                                a = fbook.book;
                                b = sbook.book;
                            }
                            if (a.fs.rate < b.fs.rate) return -1; //a come first
                            if (a.fs.rate > b.fs.rate) return 1;

                            if (a.fs.matches > b.fs.matches) return -1; // a come first
                            if (a.fs.matches < b.fs.matches) return 1;

                            if (a.fs.results > b.fs.results) return -1; // a come first
                            if (a.fs.results < b.fs.results) return 1;

                            //new way sort
                            if (a.nameSort > b.nameSort) return 1;
                            if (a.nameSort < b.nameSort) return -1;
                            // if (a.name > b.name) return 1;
                            // if (a.name < b.name) return -1;

                            // if (a.mainAuthorName > b.mainAuthorName) return 1;
                            // if (a.mainAuthorName < b.mainAuthorName) return -1;

                            // if (a.mainVolume > b.mainVolume) return 1;
                            // if (a.mainVolume < b.mainVolume) return -1;

                            // if (a.position > b.position) return 1;
                            // if (a.position < b.position) return -1;
                            return -1;
                        });

                        break;
                    }
                case "profile":
                    {
                        currentList.sort((fbook, sbook) => {
                            let a = fbook;
                            let b = sbook;
                            if (a.special) {
                                a = fbook.book;
                                b = sbook.book;
                            }
                            /*  NEW WAY PERIOD
                            if (a.dor == 0) return 1;
                            if (b.dor == 0) return -1; */

                            if (a.dor > b.dor) return 1;
                            if (a.dor < b.dor) return -1;
                            //new way sort
                            if (a.nameSort > b.nameSort) return 1;
                            if (a.nameSort < b.nameSort) return -1;
                            // if (a.name > b.name) return 1;
                            // if (a.name < b.name) return -1;

                            // if (a.mainAuthorName > b.mainAuthorName) return 1;
                            // if (a.mainAuthorName < b.mainAuthorName) return -1;

                            // if (a.mainVolume > b.mainVolume) return 1;
                            // if (a.mainVolume < b.mainVolume) return -1;

                            // if (a.position > b.position) return 1;
                            // if (a.position < b.position) return -1;

                            return -1;
                        });
                        break;
                    }
                case "rate":
                    {
                        currentList.sort((fbook, sbook) => {
                            let a = fbook;
                            let b = sbook;
                            if (a.special) {
                                a = fbook.book;
                                b = sbook.book;
                            }
                            if (a.fs.rate < b.fs.rate) return -1; // a come first
                            if (a.fs.rate > b.fs.rate) return 1;
                            //new way sort
                            if (a.nameSort > b.nameSort) return 1;
                            if (a.nameSort < b.nameSort) return -1;
                            // if (a.name > b.name) return 1;
                            // if (a.name < b.name) return -1;

                            return -1;
                        });
                        break;
                    }
                case "results":
                    {
                        currentList.sort((fbook, sbook) => {
                            let a = fbook;
                            let b = sbook;
                            if (a.special) {
                                a = fbook.book;
                                b = sbook.book;
                            }
                            if (a.fs.results < b.fs.results) return 1;
                            if (a.fs.results > b.fs.results) return -1;
                            //new way sort
                            if (a.nameSort > b.nameSort) return 1;
                            if (a.nameSort < b.nameSort) return -1;
                            // if (a.name > b.name) return 1;
                            // if (a.name < b.name) return -1;

                            return -1;
                        });
                        break;
                    }
                case "book":
                    {
                        currentList.sort((fbook, sbook) => {
                            let a = fbook;
                            let b = sbook;
                            if (a.special) {
                                a = fbook.book;
                                b = sbook.book;
                            }

                            if (a.name > b.name) return 1;
                            if (a.name < b.name) return -1;

                            if (a.mainVolume > b.mainVolume) return 1;
                            if (a.mainVolume < b.mainVolume) return -1;
                            if (fbook.special && fbook.position) {
                                if (fbook.position > sbook.position) return 1;
                                if (fbook.position < sbook.position) return -1;
                            }
                            if (a.position > b.position) return 1;
                            if (a.position < b.position) return -1;

                            return a.mainAuthorName > b.mainAuthorName ? 1 : -1;
                        });
                        break;
                    }
                case "author":
                    {
                        currentList.sort((fbook, sbook) => {
                            let a = fbook;
                            let b = sbook;
                            if (a.special) {
                                a = fbook.book;
                                b = sbook.book;
                            }
                            if (a.authorSort > b.authorSort) return 1;
                            if (a.authorSort < b.authorSort) return -1;
                            // if (a.mainAuthorName < b.mainAuthorName) {
                            //   return -1;
                            // }
                            // if (a.mainAuthorName > b.mainAuthorName) {
                            //   return 1;
                            // }

                            // if (a.name > b.name) return 1;
                            // if (a.name < b.name) return -1;

                            // if (a.mainVolume > b.mainVolume) return 1;
                            // if (a.mainVolume < b.mainVolume) return -1;

                            // if (a.position > b.position) return 1;
                            // if (a.position < b.position) return -1;
                            return 0;
                        });
                        break;
                    }
            }

        /*  let tempBookdIds = [];
        currentList.forEach((b, i) => {
          b.index = i;
          tempBookdIds.push(b.fs.bookref);
        });
        booksIds = tempBookdIds; */
        //commit("REFRESH_LIST");
    },
    /*  SET_RESULT_BOOKS2(state, { books }) {
      state.currentFilter = 0;
      currentList = [];

      booksIds = books;
      //set sorted list with all data on books
      let sortResults = [0, 0, 0, 0, 0, 0];
      let allBooks = treeBooks;
      booksIds.forEach((bookid, i) => {
        let book = allBooks.get(allBooks.root, bookid.book);
        if (book == undefined) return;
        debugger;
        if (!book.dor) sortResults[5]++;
        else {
          for (let i = 1; i <= 5; i++) {
            let flag = 1 << (i - 1);
            if ((book.dor & flag) == flag) sortResults[i - 1]++;
          }
        }

        //sortResults[book.dor - 1]++;
        // bookid.dor = book.dor;
        book.index = i;
        if (state.currentFsName != "")
          book.fs = {
            fs: state.currentFsName,
            start: bookid.start,
            end: bookid.end,
            results: bookid.results,
            matches: bookid.matchesNum,
            rate: bookid.rate,
            gzirim: bookid.gzirim != undefined ? bookid.gzirim : false,
            bookref: bookid,
          };

        currentList.push(book);
      });
    }, */

    /*   SET_RESULT_BOOKS1(state, { books, hide }) {
      const showHide = hide;
      const enableHide = VueInst.userSettings.settings.enableHidden != "0";

      state.currentFilter = 0;
      currentList = [];
      let sortResults = [0, 0, 0, 0, 0, 0];
      booksIds = books;
      //set sorted list with all data on books
      let allBooks = treeBooks;
      booksIds.forEach((bookid, i) => {
        let book = allBooks.get(allBooks.root, bookid.book);

        if (book == undefined) return;
        if (!book._show) return;
        if (!showHide && enableHide && book._hide) return;

        if (
          state.searchInBooks != "" &&
          !(
            book.name.includes(state.searchInBooks) ||
            book.mainAuthorName.includes(state.searchInBooks)
          )
        )
          return;
        debugger;
        if (!book.dor) sortResults[5]++;
        else {
          for (let i = 1; i <= 5; i++) {
            let flag = 1 << (i - 1);
            if ((book.dor & flag) == flag) sortResults[i - 1]++;
          }
        }

        //sortResults[book.dor - 1]++;
        bookid.dor = book.dor;
        //filter by current filter
        if (
          (state.currentFilter > 0 &&
            (book.dor & (1 >> (state.currentFilter + 1))) > 0) ||
          (book.dor == 0 && state.currentFilter == 6) ||
          state.currentFilter == 0
        ) {
          book.index = i;
          if (state.currentFsName != "")
            book.fs = {
              fs: state.currentFsName,
              start: bookid.start,
              end: bookid.end,
              results: bookid.results,
              matches: bookid.matchesNum,
              rate: bookid.rate,
              gzirim: bookid.gzirim != undefined ? bookid.gzirim : false,
              bookref: bookid,
            };

          currentList.push(book);
        }

        // }
      });

      state.currentListLength = currentList.length;
      state.sortResults = sortResults.map((r, i) => {
        return { type: "category", id: i + 1, num: r, title: state.dorot[i] };
      });

      booksChecked = {};

      state.checkedBooksCount = 0;
      state.booksIdsRefresh = !state.booksIdsRefresh;
      state.booksCheckedRefresh = !state.booksCheckedRefresh;
    }, */
    //remove books from list
    REMOVE_BOOKS(state, books) {
        books.forEach((b) => {
            if (booksChecked[b]) state.checkedBooksCount--;
            delete booksChecked[b];
        });
        booksIds = booksIds.filter((book) => !books.includes(book.book.toString()));
        currentList = currentList.filter(
            (book) => !books.includes(book.id.toString())
        );

        state.booksIdsRefresh = !state.booksIdsRefresh;
        state.booksCheckedRefresh = !state.booksCheckedRefresh;
    },
    //check\uncheck book
    CHECK_BOOK(state, {
        book,
        check
    }) {
        booksChecked[book] = check;
        state.booksCheckedRefresh = !state.booksCheckedRefresh;
        check ? state.checkedBooksCount++ : state.checkedBooksCount--;
    },
    TOGGLE_CHECK_BOOK(state, {
        book
    }) {
        if (booksChecked[book]) {
            state.checkedBooksCount--;
            delete booksChecked[book];
        } else {
            state.checkedBooksCount++;
            booksChecked[book] = true;
        }
        state.booksCheckedRefresh = !state.booksCheckedRefresh;
        //  state.refreshBooksChecked = !state.refreshBooksChecked;
    },
    //check\uncheck all books
    CHECK_ALL_BOOKS(state, {
        check,
        search,
        books
    }) {
        if (!check) booksChecked = {};
        else
            books.booksList.forEach((b) => {
                booksChecked[b.id] = check;
            });
        state.booksCheckedRefresh = !state.booksCheckedRefresh;

        check
            ?
            (state.checkedBooksCount = books.booksList.length) :
            (state.checkedBooksCount = 0);
    },
    //revert checks
    REVERT_CHECKS(state, {
        books
    }) {
        let count = 0;
        books.booksList.forEach((b) => {
            if (booksChecked[b.id]) delete booksChecked[b.id];
            else {
                booksChecked[b.id] = true;
                count++;
            }
        });

        state.checkedBooksCount = count;
        state.booksCheckedRefresh = !state.booksCheckedRefresh;
    },
    /**
     * toggle visibility of filter results popup
     */
    TOGGLE_SHOW_RESULTS_POPUP(state) {
        state.showSortResults = !state.showSortResults;
    },
    /**
     * close filter results popup
     */
    CLOSE_RESULTS_POPUP(state) {
        state.showSortResults = false;
    },
    SET_CURRENT_FILTER(state, {
        id
    }) {
        state.currentFilter = id;
    },
    TOGGLE_SHOW_FREESEARCH_LIST(state) {
        state.showList = !state.showList;
    },
    SHOW_FREESEARCH_LIST(state) {
        state.showList = true;
    },
    HIDE_FREESEARCH_LIST(state) {
        state.showList = false;
    },
    SET_ACTIVE(state, {
        active
    }) {
        state.active = active;
    },
    SET_SEARCHIN_TYPE(state, type) {
        state.searchInType = type;
    },
    SET_PREV_SEARCHIN_TYPE(state, type) {
        state.prevSearchInType = type;
    },
    SET_SAVEDLIST_NAME(state, {
        name
    }) {
        state.savedListName = name;
    },
    SET_CURRENTSEARCHIN_TYPE(state, type) {
        state.currentSearchInType = type;
    },
    ADD_USER_ACTION_TO_HISTORY(state, listData) {
        let curr = state.historyUsersActions.current;
        state.historyUsersActions.isAddedToHistory = false;
        state.historyUsersActions.current++;
        //insert new user action in the current place in the array
        state.historyUsersActions.data.splice(curr, 0, {
            ...listData,
        });
    },
};

export const actions = {
    updateCurrentListLastIndex({
        commit
    }, data) {
        commit("UPD_CURR_LIST_INX", data);
    },
    toggleCustomAdded({
        commit
    }) {
        commit("TOGGLE_CUSTOM_ADDED");
    },
    refreshCurrentList({
        commit,
        dispatch,
        state,
        rootState
    }) {
        commit("REFRESH_CURRENT_LIST", {
            hide: rootState.bookList.showHiddenBooks,
        });
        // dispatch("setSortByList", state.sortBy);
    },
    doSort({
        commit
    }, sort) {
        commit("DO_SORT", sort);
        commit("REFRESH_LIST");
    },
    setSortByList({
        commit,
        dispatch
    }, sort) {
        return new Promise((resolve, reject) => {
            if (sort.startsWith("custom_"))
                dispatch("getCustomSortBooks", sort.slice(7)).then(() => {
                    //  if (customSortBooks.length == 0) sort = "ideal";
                    commit("SORT_BY_LIST", sort);
                    //now sort
                    dispatch("doSort", sort);
                    //  commit("REFRESH_LIST");
                    resolve();
                });
            else {
                commit("SORT_BY_LIST", sort);
                //now sort
                dispatch("doSort", sort);
                // commit("REFRESH_LIST");
                resolve();
            }
        });
    },
    async getCustomSortBooks({
        commit
    }, title) {
        customSortBooks = await getCustomSortBooks(title);
        try {
            customSortBooks.forEach((sortList, i, arr) => {
                let avlsortList = new AVLTree();
                sortList.forEach((e) => {
                    avlsortList.root = avlsortList.insert(avlsortList.root, e, e);
                });

                arr[i] = avlsortList;
            });
        } catch (ex) {
            console.error(ex.message);
            customSortBooks = [];
        }
    },
    async addUserActionToHistory({
        commit,
        state,
        dispatch
    }, listData) {
        //if the action is SAVED_LIST
        if (listData.type === "SAVED_LIST") {
            //get the curr user action to compare
            let curr =
                state.historyUsersActions.data[state.historyUsersActions.current - 1];
            //if the curr type equal to the the data type
            /*  if (curr.type == listData.type) {
              //and if its the same list id of books step out from addin and return
              if (curr.id == listData.id) return;
            } */
            /* let forword =
              state.historyUsersActions.data[state.historyUsersActions.current];
            if (forword != undefined || forword != null) {
              if (forword.type == listData.type) {
                //and if its the same list id of books step out from addin and return
                if (forword.id == listData.id) return;
              }
            } */
            //sedin to server get request to get the list of books of saved list
            dispatch("setCurrentFSListName", listData.content);
            await getUserFreeSearchSavedList(listData.id);
            // commit("SET_BOOKIDS", booksids);

            //than add the action to user's actions
            commit("ADD_USER_ACTION_TO_HISTORY", listData);
        }
        //SEARCH
        if (listData.type === "SEARCH") {
            //get the curr user action to compare
            let curr =
                state.historyUsersActions.data[state.historyUsersActions.current - 1];

            //if the curr type equel to the the data type
            if (curr.type == listData.type) {
                //and if its the same list id of books step out from addin and return
                if (curr.content == listData.content) return;
            }
            let forword =
                state.historyUsersActions.data[state.historyUsersActions.current];
            if (forword != undefined || forword != null) {
                if (forword.type == listData.type) {
                    //and if its the same list id of books step out from addin and return
                    if (forword.content == listData.content) return;
                }
            }
            //set content to text search
            listData.content = state.textSearch;
            //than add the action to user's actions
            commit("ADD_USER_ACTION_TO_HISTORY", listData);
            let data = {
                type: "free",
                data: listData.content,
            };
            //history.saveSearchToHistory({ data });
        }
    },

    /*   setSortResults({ commit }, results) {
      commit("SET_SORT_RESULTS", results);
    }, */
    setSearchNumWords({
        commit
    }, num) {
        commit("SET_SEARCH_NUM_WORDS", num);
    },
    setCurrentFsName({
        commit
    }, name) {
        return new Promise(function(resolve, reject) {
            commit("SET_FSNAME", name);
            resolve();
        });
    },
    setCurrentFSListName({
        commit
    }, name) {
        commit("SET_FSLIST_NAME", name);
    },

    setFreeSearchHistory({
        commit
    }) {
        let freeSearchesHistory = this.getters[
            "userSearchHistory/getUserSearchHistoryByType"
        ](["free"]);
        freeSearchesHistory = freeSearchesHistory.map((r) => {
            return {
                id: r.id,
                data: r.info
            };
        });
        commit("SET_HISTORY", freeSearchesHistory);
    },
    /**
     * calles the mutation SET_SEARCHTXT
     * @param {String} txtSearch -to set text search
     */
    setSearchTxt({
        commit
    }, txt) {
        commit("SET_SEARCHTXT", {
            txt
        });
    },
    setInputTxt({
        commit
    }, txt) {
        commit("SET_INPUTTXT", {
            txt
        });
    },
    /**
     * calles the mutation SET_BOOKS_TO_SEARCH_IN
     * @param {String} books -to set books to search in
     */
    setBooksToSearchIn({
        commit
    }, books) {
        try {
            books.sort((a, b) => a - b);
        } catch (ex) {}
        commit("SET_BOOKS_TO_SEARCH_IN", {
            books
        });
    },
    setPrevBooksToSearchIn({
        commit,
        state
    }) {
        commit("SET_PREV_BOOKS_TO_SEARCH_IN", state.searchInBooks);
    },
    resetBooksToSearchIn({
        commit,
        state
    }) {
        commit("RESET_BOOKS_TO_SEARCH_IN");
    },

    setSearchInType({
        commit
    }, type) {
        commit("SET_SEARCHIN_TYPE", type);
    },
    setPrevSearchInType({
        commit
    }, type) {
        commit("SET_PREV_SEARCHIN_TYPE", type);
    },
    //set results books. fires list.
    setResultBooks({
        commit,
        dispatch,
        rootState,
        state
    }, books) {
        return new Promise(async function(resolve, reject) {
            state.hideBookLists = true;
            let defaultSort = VueInst.userSettings.settings.defaultCustomSort;
            if (state.resultsType !== "classic") defaultSort = "book";
            if (defaultSort === undefined || defaultSort === "")
                defaultSort = "ideal";
            if (defaultSort.startsWith("custom_"))
                await dispatch("getCustomSortBooks", defaultSort.slice(7));
            commit("SORT_BY_LIST", defaultSort);
            commit("SET_RESULT_BOOKS", {
                books
            });
            state.hideBookLists = false;

            commit("SET_CURRENT_LIST", {
                hide: rootState.bookList.showHiddenBooks
            });
            commit("DO_SORT", state.sortBy);

            commit("REFRESH_CHECKS");
            commit("REFRESH_LIST");

            resolve();
            /* dispatch("setSortByList", defaultSort).then(() => {
              // dispatch("sortBooks",defaultSort).then(()=> resolve()
              resolve();
            }); */
        });
    },
    //remove books from list
    async removeBooks({
        commit
    }, {
        books,
        booksIndex,
        fsData
    }) {
        if (
            fsData.id !== "special" ||
            (fsData.id === "special" && fsData.type === "list")
        )
            await userFreeSearchListDeleteBooks({
                books: booksIndex,
                fsData,
            });
        commit("REMOVE_BOOKS", books);
    },
    //save books to user list
    saveFsList({
        commit
    }, books) {
        // commit("REMOVE_BOOKS", books);
    },
    checkAllBooks({
        commit,
        getters
    }, {
        check,
        search
    }) {
        let books = getters.getCurrentList;
        commit("CHECK_ALL_BOOKS", {
            check,
            search,
            books
        });
    },
    toggleCheck({
        commit
    }, {
        book
    }) {
        commit("TOGGLE_CHECK_BOOK", {
            book
        });
    },
    checkBook({
        commit
    }, {
        book,
        check
    }) {
        commit("CHECK_BOOK", {
            book,
            check
        });
    },
    revertChecks({
        commit,
        getters
    }) {
        let books = getters.getCurrentList;

        commit("REVERT_CHECKS", {
            books
        });
    },
    /**
     * calles the mutation TOGGLE_SHOW_RESULTS_POPUP
     */
    toggleShowResultsPopup({
        commit
    }) {
        commit("TOGGLE_SHOW_RESULTS_POPUP");
    },
    toggleShowFreeSearchList({
        commit
    }) {
        commit("TOGGLE_SHOW_FREESEARCH_LIST");
    },
    showFreeSearchList({
        commit
    }) {
        commit("SHOW_FREESEARCH_LIST");
    },
    hideFreeSearchList({
        commit
    }) {
        commit("HIDE_FREESEARCH_LIST");
    },

    /**
     * calles the mutation CLOSE_RESULTS_POPUP
     */
    closeResultsPopup({
        commit
    }) {
        commit("CLOSE_RESULTS_POPUP");
    },
    setCurrentFilter({
        commit,
        rootState,
        state,
        dispatch
    }, id) {
        commit("SET_CURRENT_FILTER", {
            id
        });
        /* commit("REFRESH_CURRENT_LIST", {
          hide: rootState.bookList.showHiddenBooks,
        }); */
        /*  dispatch("setSortByList", state.sortBy).then(() => {
          rootState.booksChanged++;
        }); */
    },
    setFreeSearchListActive({
        commit
    }, active) {
        commit("SET_ACTIVE", {
            active
        });
    },
    setSavedListName({
        commit
    }, name) {
        commit("SET_SAVEDLIST_NAME", {
            name
        });
    },
    setFreeSearchSearchInType({
        commit
    }, type) {
        commit("SET_CURRENTSEARCHIN_TYPE", type);
    },
    toggleGzirim({
        commit,
        rootState
    }, index) {
        commit("TOGGLE_GZIRIM", index);
    },
    setGzirim({
        commit,
        rootState
    }, show) {
        commit("SET_GZIRIM_SHOW", show);
    },
    setGzirimData({
        commit
    }, index) {
        commit("SET_GZIRIM_DATA", index);
    },
};

export const getters = {
    getResultsType(state) {
        return state.resultsType;
    },
    getHideBookLists(state) {
        return state.hideBookLists;
    },
    getFavoriteCheckBooksCount(state) {
        return state.favoriteCheckBooksCount;
    },
    getSortBy(state) {
        return state.sortBy;
    },
    getSearchInType(state) {
        return state.searchInType;
    },
    getPrevSearchInType(state) {
        return state.prevSearchInType;
    },
    isSavedList(state) {
        return state.currentFsSavedList != "";
    },
    getFSListName(state) {
        return state.currentFsSavedList;
    },
    getFreeSearchSearchInType(state) {
        return state.currentSearchInType;
    },
    getCurrentFilterNumResults(state) {
        if (state.sortResults.length == 0) return -1;
        if (state.currentFilter == 0) return -1;
        return state.sortResults[state.currentFilter - 1].num;
    },
    getCurrentFilterName(state) {
        if (state.sortResults.length == 0) return "";
        if (state.currentFilter == 0) return "";

        return state.sortResults[state.currentFilter - 1].title;
    },
    getSearchNumWords(state) {
        return state.searchNumWords;
    },
    getBooksToSearchIn(state) {
        return state.searchInBooks;
    },
    getSavedListName(state) {
        return state.savedListName;
    },
    getfreeSearchHistory(state) {
        return state.freeSearchHistory;
    },
    getShowResultsPopup(state) {
        return state.showSortResults;
    },
    isCurrentFilter: (state) => (id) => {
        return state.currentFilter == id;
    },
    getSortResults(state) {
        return state.sortResults;
    },
    getTextSearch(state) {
        return state.textSearch;
    },
    getFinalTextSearch(state) {
        return state.finalTextSearch;
    },
    getTextInput(state) {
        return state.textInput;
    },
    getDataOfCurrentList(state) {
        return {
            current: state.currentHistoryId,
            currentLastActive: state.currentHistoryLastActive,
        };
        let current = state.historyUsersActions.current;
        let length = state.historyUsersActions.data.length;
        let content = state.historyUsersActions.data[current - 1].content;
        let type = state.historyUsersActions.data[current - 1].type;
        let currentData = {
            current,
            length,
            content,
            type,
            historyId: state.historyUsersActions.data[current - 1].historyId,
        };

        return currentData;
    },
    getChecksCount(state) {
        return state.checkedBooksCount;
    },
    getBooksCount(state) {
        return booksIds.length;
    },
    getCheckedBooks(state, getter, rootState) {
        let x = rootState.userFavoriteBooks.favoriteChange;
        let checked = [];
        Object.keys(booksChecked).forEach(function(key, index) {
            let check = booksChecked[key];
            if (check) checked.push(key);
        });

        let fav = checked.filter((b) => {
            b = treeBooks.get(treeBooks.root, parseInt(b));
            return !b.favorite === false;
        });

        state.favoriteCheckBooksCount = fav.length == checked.length ? 1 : 0;

        state.booksCheckedRefresh = !state.booksCheckedRefresh;
        return checked;
    },
    getCurrentListIds(state) {
        const retAagin = state.booksIdsRefresh;
        return booksIds;
    },
    getBooksChecked(state) {
        let refresh = state.booksCheckedRefresh;
        return booksChecked;
    },
    getBooksCheckedInfo: (state) => () => {
        let books = currentList.filter((book) => booksChecked[book.id]);

        return books.map((book) => {
            let b = book.special ? book.book : book;
            return {
                book: b.id,
                numResults: b.fs ? b.fs.results : 0,
                start: b.fs ? b.fs.start : 0,
                end: b.fs ? b.fs.end : 0,
                name: getBookName(b.name, b.volume, true),
                author: b.mainAuthorName,
                places: b.places,
                years: bookYears(b),
            };
        });
    },
    getCurrentList(state, getters, rootState) {
        let react = state.booksIdsRefresh;
        react = rootState.booksChanged;

        const showHide = rootState.bookList.showHiddenBooks;
        const enableHide = VueInst.userSettings.settings.enableHidden != "0";

        let cacheObj = {
            booksRef: state.booksIdsRefresh,
            booksChanged: rootState.booksChanged,
            txtSearch: state.searchInTxt,
            showHide: rootState.bookList.showHiddenBooks,
            enableHide,
            currentFilter: state.currentFilter,
        };

        const cached = checkCacheForGCList(cacheObj);

        if (cached) return {
            booksList: currListData
        };

        let list = currentList.filter((item) => {
            let book;
            item.special ? (book = item.book) : (book = item);
            if (!book._show) return false;
            if (!showHide && enableHide && book._hide) return false;

            if (
                state.searchInTxt != "" &&
                !(
                    book.name.includes(state.searchInTxt) ||
                    book.volume.includes(state.searchInTxt) ||
                    book.mainAuthorName.includes(state.searchInTxt)
                )
            )
                return false;

            /*   
    NEW WAY PERIOD
    if (
        (state.currentFilter > 0 &&
          (book.dor & (1 << (state.currentFilter - 1))) > 0) ||
        (book.dor == 0 && state.currentFilter == 6) ||
        state.currentFilter == 0
      )
        return true;
      else return false; */

            if (
                (state.currentFilter > 0 && book.dor == state.currentFilter) ||
                (book.dor == 0 && state.currentFilter == 6) ||
                state.currentFilter == 0
            )
                return true;
            else return false;
        });
        let results = 0;

        if (state.resultsType == "special") results = list.length;
        else
            list.forEach((l) => {
                results += l.fs.results;
            });

        state.totalResults = results;
        state.currentListLength = list.length;

        currListData = list;
        currListCahceObj = cacheObj;
        return {
            booksList: list
        };
    },
    getListLength(state) {
        return state.currentListLength;
    },

    getCurrentFSName(state) {
        return state.currentFsName;
    },
    getGzirim(state, getters) {
        const retAgain = state.booksIdsRefresh;

        /*     let list = getters.getCurrentList;

        list = list.booksList.map((b) => {
          return {
            show: booksIds[b.index].gzirim,
            results: booksIds[b.index].gzirimData,
            numResults: booksIds[b.index].results,
          };
        });

        return list; */

        // let list = getters.getCurrentList;

        // return list.booksList.map((item) => {
        //   const b = item.fs.bookIdRef;
        //   return {
        //     show: b.gzirim,
        //     results: b.gzirimData,
        //     numResults: b.results,
        //   };
        // });
        return booksIds.map((b) => {
            return {
                show: b.gzirim,
                results: b.gzirimData,
                numResults: b.results,
            };
        });
    },
};

function bookYears(book) {
    let yearFrom = book.fromyear;
    let yearTo = book.toyear;
    return yearFrom == yearTo ? yearTo : yearFrom + " - " + yearTo;
}