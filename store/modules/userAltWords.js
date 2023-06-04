import {
    Store
} from "vuex";
import store from "@/store/store.js";
import {
    getUserAltWords,
    addUserAltWords,
    deleteUserAltWord,
} from "@/services/userAltWords.js";

export const namespaced = true;

export const state = function() {
    return {
        altWords: {},
    };
};

export const mutations = {
    SET_ALT_WORDS(state, altWords) {
        state.altWords = altWords;
    },
};

export const actions = {
    addUserAltWord({
        commit
    }, {
        word1,
        word2,
        type
    }) {
        addUserAltWords({
            word1,
            word2,
            type
        }).then((words) => {
            commit("SET_ALT_WORDS", words.data);
        });
    },
    delUserAltWord({
        commit
    }, {
        id1,
        id2
    }) {
        return deleteUserAltWord(id1, id2).then((words) => {
            commit("SET_ALT_WORDS", words.data);
        });
    },

    setUserAltWords({
        commit
    }) {
        return new Promise(function(resolve, reject) {
            getUserAltWords()
                .then((words) => {
                    commit("SET_ALT_WORDS", words);
                    resolve(true);
                })
                .catch((error) => {
                    console.error(error);
                    reject(false);
                });
        });
    },
};

export const getters = {
    getUserAltWords(state) {
        return state.altWords;
    },
    getUserAltWordsByWord: (state) => (word, type = 1) => {
        let inx = state.altWords[type - 1].wordsIndex[word];
        if (!inx) return null;
        let wordInx = state.altWords[type - 1].words.indexOf(word);
        let altWords = [];
        state.altWords[type - 1].words.forEach((v, i) => {
            if (inx.includes(i) & (v != word))
                altWords.push({
                    word: v,
                    mainWordId: wordInx,
                    altId: i
                });
        });
        altWords = [...new Set(altWords)];
        return altWords;
    },
};