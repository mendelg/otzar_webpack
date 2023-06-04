import {
    getSearchHistoryByType
} from "@/services/history.js";
import {
    getFSAltWord
} from "@/helper/altWordHelper.js";
import store from "@/store/store";
export const namespaced = true;
const DEFSPACE = 30;
const NIRDAFOT_CHAR = "~";
const OCR_CHAR = "#";
const RT_CHAR = "^";
const MALE_CHASER_CHAR = "@";
const NEG_CHAR = "--";
const CHILUFIYOT_SEPERATOR = "/";
const ORDER_CHAR = "&";
const SHIMUSH_CHAR = "+";
const CONCAT_CHAR = "-";
const CONCAT2_CHAR = "_";
const SPACE_START_CHAR = "{";
const SPACE_END_CHAR = "}";
const FIRST_PAGES_CHAR = "|";

const SPEC_CHARS = [
    ORDER_CHAR,
    OCR_CHAR,
    RT_CHAR,
    NIRDAFOT_CHAR,
    MALE_CHASER_CHAR,
    FIRST_PAGES_CHAR,
];

function addWord(w, concat, wordIndex, space, chilufiyot, words) {
    let shimush = false;
    let rt = false;
    let mc = false;
    let nirdafot = false;
    if (w.indexOf(SHIMUSH_CHAR) > -1) {
        shimush = true;
        w = w.replace(SHIMUSH_CHAR, "");
    }

    if (w.indexOf(NIRDAFOT_CHAR) > -1) {
        nirdafot = true;
        w = w.replace(NIRDAFOT_CHAR, "");
    }

    if (w.indexOf(MALE_CHASER_CHAR) > -1) {
        mc = true;
        w = w.replace(MALE_CHASER_CHAR, "");
    }

    if (w.indexOf(RT_CHAR) > -1) {
        rt = true;
        w = w.replace(RT_CHAR, "");
    }

    let altWords = getFSAltWord(w);
    let rtWords = getFSAltWord(w, 2);

    let userAltWords = null;
    let userRTWords = null;
    try {
        userAltWords = store.getters["freeSearch/getUserAltWords"](w);
    } catch (ex) {}

    try {
        userRTWords = store.getters["freeSearch/getUserAltWords"](w, 2);
    } catch (ex) {}

    if (altWords == null) altWords = [];
    else
        altWords = altWords.map((altWord) => {
            return {
                word: altWord,
                checked: false
            };
        });

    if (rtWords == null) rtWords = [];
    else
        rtWords = rtWords.map((altWord) => {
            return {
                word: altWord,
                checked: false
            };
        });

    if (userAltWords == null) userAltWords = [];
    else
        userAltWords = userAltWords.map((altWord) => {
            return {
                word: altWord.word,
                checked: false,
                id1: altWord.mainWordId,
                id2: altWord.altId,
                user: true,
            };
        });

    if (userRTWords == null) userRTWords = [];
    else
        userRTWords = userRTWords.map((altWord) => {
            return {
                word: altWord.word,
                checked: false,
                id1: altWord.mainWordId,
                id2: altWord.altId,
                user: true,
            };
        });

    rtWords = userRTWords.concat(rtWords);
    altWords = userAltWords.concat(altWords);

    //get multiple alt words
    let multiAltWords = [];
    if (wordIndex < words.length - 1) {
        let multiWord = words[wordIndex];
        for (let i = wordIndex + 1; i < words.length; i++) {
            multiWord += " " + words[i];
            let aWords = getFSAltWord(multiWord);
            if (aWords) multiAltWords.push({
                w: multiWord,
                alt: aWords
            });
            aWords = getFSAltWord(multiWord, 2);
            if (aWords) multiAltWords.push({
                w: multiWord,
                alt: aWords
            });
        }
    }

    return {
        id: wordIndex,
        w,
        concat,
        shimush,
        nirdafot,
        mc,
        rt,
        space: space,
        chilufiyot,
        altWords,
        rtWords,
    };
}

function getChilufiyot(word) {
    let result = {
        chil: []
    };

    var matches = word.match(/(\(.+\/.+\))/g);
    if (matches) {
        matches.forEach((m) => {});
    }
    if ((word.slice(0, 1) == "(") & (word.slice(-1) == ")")) {
        word = word.slice(1, word.length - 1);
        let words = word.split(CHILUFIYOT_SEPERATOR);
        result.mainWord = words[0];
        words.shift();
        result.chil = words;
        return result;
    } else {
        result.mainWord = word;

        return result;
    }
}

export const state = {
    freeSearchHistory: [],
    searchStr: "",
    searchProgress: 0,
    showAdvancedPopup: false,
    searching: false,
    inBook: false,
    currentResultExporting: {},
    currentPercentExporting: 0,
    enumSearchInType: {
        //all books
        all: 1,
        //selected books
        selected: 3,
        //in meforesh
        inMeforesh: 4,
        //browse for any list
        browse: 6,
        //current book list (bottom list)
        currentList: 2,
        //tsiyunim & maftechot
        tsiyunim: 5,
        custom: 7,
    },
    searchType: "classic" /* classic, special   */ ,
    searchInBookTxt: "",
};

export const mutations = {
    SET_SEARCHING(state, value) {
        state.searching = value;
    },
    SET_HISTORY(state, history) {
        state.freeSearchHistory = history;
    },
    SET_SEARCH_STRING(state, words) {
        state.searchStr = words;
    },
    SET_SHOW_ADVANCED_POPUP(state, value) {
        state.showAdvancedPopup = value;
    },
    TOGGLE_SHOW_ADVANCED_POPUP(state) {
        state.showAdvancedPopup = !state.showAdvancedPopup;
    },
    SET_SEARCH_PROGRESS(state, progress) {
        state.searchProgress = progress;
    },
};

export const getters = {
    getUserAltWords: (state, getters, rootState, rootGetters) => (
        word,
        type = 1
    ) => {
        return rootGetters["userAltWords/getUserAltWordsByWord"](word, type);
    },
    isSearching(state) {
        return state.searching;
    },
    getSearchProgress(state) {
        return state.searchProgress;
    },
    getShowAdvPopup(state) {
        return state.showAdvancedPopup;
    },
    getfreeSearchHistory(state) {
        return state.freeSearchHistory;
    },
    getSearchString(state) {
        return state.searchStr;
    },

    getSearchWordsForSearch(state, getters) {
        let search = getters.getSearchWords;
        search.words.forEach((word) => {
            word.altWords = word.altWords.filter((altword) => altword.checked);
        });
        return search;
    },
    getSearchWords(state, getters) {
        let s = getters["getSearchWords1"](state.searchStr);
        return s;
    },
    getSearchWords1: (state) => (txt) => {
        let ocr = false;
        let firstPages = false;
        let rasheitevot = false;
        let nirdafot = false;
        let malechaser = false;
        let space = DEFSPACE;
        let order = false;
        let no = [];
        let cleanStr;
        let searchInData = "";
        let re = new RegExp(
            `${OCR_CHAR}|\\${ORDER_CHAR}|\\${FIRST_PAGES_CHAR}`,
            "g"
        );

        //get data about which books to search in
        if (txt == undefined) txt = state.searchStr;
        let moreData = txt.split(":");
        if (moreData.length == 1) cleanStr = txt.replace(re, "");
        else {
            cleanStr = moreData[1].replace(re, "");
            searchInData = moreData[0];
        }
        //check if global space sent
        if (searchInData != "" && !isNaN(searchInData))
            space = parseInt(searchInData);
        if (txt.indexOf(OCR_CHAR) > -1) ocr = true;
        if (txt.indexOf(FIRST_PAGES_CHAR) > -1) firstPages = true;
        if (txt.indexOf(ORDER_CHAR) > -1) order = true;

        let words = cleanStr.split(" ");
        words = words.filter((item) => item);
        let numWords = words.length;
        let finalWordsArr = [];
        let tempWordsArr = [];
        let tempWordsArr2 = [];
        let wordIndex = 0;

        let concatReg = new RegExp(`${CONCAT_CHAR}|\\${CONCAT2_CHAR}`, "g");
        words.forEach((word) => {
            if (word.indexOf(NEG_CHAR) == 0) {
                let w = word.slice(2).trim();
                if (w != "") no.push(w);
                return;
            }
            let concatWords = word.split(concatReg);
            concatWords.forEach((tempword, j) => {
                let concat = false;
                if (j < concatWords.length - 1) concat = true;
                tempWordsArr.push({
                    word: tempword,
                    concat
                });
            });
        });

        tempWordsArr.forEach((word, i) => {
            var myString = word.word;
            var myRegexp = /({\d+})([^}{\d}]+)/g;
            let match = myRegexp.exec(myString);
            if (match == null) {
                tempWordsArr2.push({
                    word: myString,
                    space,
                    concat: word.concat
                });
                return;
            }
            let tempStr = myString;
            while (match != null) {
                let firstWord = tempStr.substr(0, tempStr.indexOf(match[0]));
                if (firstWord != "")
                    tempWordsArr2.push({
                        word: firstWord,
                        space: parseInt(match[1].split(/[{|}]/)[1]),
                        concat: false,
                    });
                else if (tempWordsArr2.length > 0)
                    tempWordsArr2[tempWordsArr2.length - 1].space = parseInt(
                        match[1].split(/[{|}]/)[1]
                    );
                let concat = false;

                tempStr = tempStr.substr(
                    tempStr.indexOf(match[0]) + match[0].length,
                    tempStr.length - tempStr.indexOf(match[0])
                );
                //if  last word, set concat to word concat
                if (tempStr === "") concat = word.concat;
                tempWordsArr2.push({
                    word: match[2],
                    space,
                    concat,
                });

                match = myRegexp.exec(myString);
            }
        });

        tempWordsArr2.forEach((tempword) => {
            let word = tempword.word;

            let chilufiyot = getChilufiyot(word);
            finalWordsArr.push(
                addWord(
                    word,
                    tempword.concat,
                    wordIndex,
                    tempword.space,
                    chilufiyot.chil,
                    words
                )
            );
            wordIndex++;
        });

        let result = {
            words: finalWordsArr,
            globalSpace: space,
            ocr,
            rasheitevot,
            no,
            malechaser,
            nirdafot,
            more: [],
            order,
            firstPages,
        };

        return result;
    },
};

export const actions = {
    setSearching({
        commit
    }, value) {
        commit("SET_SEARCHING", value);
    },
    setSearchProgress({
        commit
    }, progress) {
        commit("SET_SEARCH_PROGRESS", progress);
    },
    setShowAdvPopup({
        commit
    }, value) {
        commit("SET_SHOW_ADVANCED_POPUP", value);
    },
    toggleShowAdvPopup({
        commit
    }) {
        commit("TOGGLE_SHOW_ADVANCED_POPUP");
    },
    setFreeSearchHistory({
        commit
    }) {
        getSearchHistoryByType("free").then((result) => {
            result = result.map((r) => r.info);
            commit("SET_HISTORY", result);
        });
    },

    setSearchString({
        commit
    }, searchTxt) {
        commit("SET_SEARCH_STRING", searchTxt);
    },
    createSearchTxtFromArray({
        commit
    }, searchData) {
        return new Promise((resolve, reject) => {
            let str = "";

            searchData.words.forEach((word, i) => {
                let lastWord = i == searchData.words.length - 1;
                if (word.shimush) str += SHIMUSH_CHAR;
                if (word.nirdafot) str += NIRDAFOT_CHAR;
                if (word.mc) str += MALE_CHASER_CHAR;
                if (word.rt) str += RT_CHAR;
                str += word.w;
                if ((word.concat === true) & !lastWord) str += CONCAT_CHAR;
                else if (
                    word.space != DEFSPACE &&
                    word.space != searchData.globalSpace &&
                    !lastWord
                )
                    str += SPACE_START_CHAR + word.space + SPACE_END_CHAR;
                else str += " ";
            });
            searchData.moreOptions.forEach((opt, i) => {
                if (opt) str = SPEC_CHARS[i] + str.trim();
                else str = str.trim().replace(SPEC_CHARS[opt], "");
            });

            searchData.no.forEach((opt) => {
                str += " --" + opt.trim();
            });
            if (searchData.globalSpace != DEFSPACE)
                str = searchData.globalSpace + ":" + str;
            resolve(str);
        });
    },
};