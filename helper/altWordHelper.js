import {
    Axios
} from "@/services/_axios.js";
import init from "@/config/init.js";
import * as advLocalStorage from "localforage";
export function checkForBooksUpdate() {
    let url = init.getServer() + init.BooksDB.updateBook;
    return Axios.get(url)
        .then(async (response) => {
            let lastUpdatServer = new Date(response.data[0].changed);
            const tm = await advLocalStorage.getItem("update-book");
            let lastUpdatLocal = new Date(tm);
            if (lastUpdatServer > lastUpdatLocal) {
                advLocalStorage.setItem("update-book", response.data[0].changed);
                return Promise.resolve(true);
            } else return Promise.resolve(false);
        })
        .catch(function(error) {
            return Promise.reject(error);
        });
}
export function checkForWordAltUpdate() {
    let url = init.getServer() + init.BooksDB.updateWord;
    return Axios.get(url)
        .then(async (response) => {
            let lastUpdatServer = new Date(response.data[0]["changed"]);
            const tm = await advLocalStorage.getItem("update-word-alt");
            let lastUpdatLocal = new Date(tm);
            if (lastUpdatServer > lastUpdatLocal) {
                advLocalStorage.setItem("update-word-alt", response.data[0].changed);
                return Promise.resolve(true);
            } else return Promise.resolve(false);
        })
        .catch(function(error) {
            return Promise.reject(error);
        });
}

export function checkForFSWordAltUpdate() {
    let url = init.getServer() + init.BooksDB.updateFSWord;

    return Axios.get(url)
        .then(async (response) => {
            let lastUpdatServer = new Date(response.data[0]["changed"]);
            const tm = await advLocalStorage.getItem("fs-update-word-alt");
            let lastUpdatLocal = new Date(tm);
            if (lastUpdatServer > lastUpdatLocal) {
                //set a new date of updated words in localStorage
                await advLocalStorage.setItem(
                    "fs-update-word-alt",
                    response.data[0].changed
                );
                return Promise.resolve(true);
            } else return Promise.resolve(false);
        })
        .catch(function(error) {
            return Promise.reject(error);
        });
}

export function getWord(str) {
    // console.dir(init.BooksData.wordAlt)
    let inx = init.BooksData.wordAlt.wordsIndex[str];
    if (!inx) return null;
    return init.BooksData.wordAlt.words.filter((v, i) => {
        if (inx.includes(i)) return v;
    });
}

export function getFSAltWord(str, type = 1) {
    if (init.BooksData.FSwordAlt[type - 1].wordsIndex == undefined) return null;
    let inx = init.BooksData.FSwordAlt[type - 1].wordsIndex[str];
    if (!inx) return null;

    let alt = init.BooksData.FSwordAlt[type - 1].words.filter((v, i) => {
        if (inx.includes(i) & (v != str)) return v;
    });
    alt = [...new Set(alt)];

    return alt;
}

export function getWords(phrase) {
    let altWords = {};

    let phraseWords = phrase.split(" ");
    phraseWords = new Set(phraseWords);
    phraseWords.forEach((word) => {
        let inx = init.BooksData.wordAlt.wordsIndex[word];
        if (typeof inx == "undefined") return;
        altWords[word] = init.BooksData.wordAlt.words.filter((v, i) => {
            if (inx.includes(i)) return v;
        });
    });
    return altWords;
}

export function getSearchObject(txtSearch) {
    let arrSearch = [];

    txtSearch.split(" ").forEach((word, wordAt) => {
        let altrWordInxArr = init.BooksData.wordAlt.wordsIndex[word];
        let obj = {
            word,
            wordAt,
            mainWord: true
        };
        arrSearch.push(obj);

        //if word has qoutes - ass slt word without
        let quoteAlt = "";
        if (word.indexOf('"') > -1) {
            quoteAlt = word.replace('"', "");
            let obj = {
                word: quoteAlt,
                wordAt,
                mainWord: false
            };
            arrSearch.push(obj);
        }

        if (altrWordInxArr) {
            //get all alt words
            altrWordInxArr.forEach((wordInx) => {
                //get the real alt word
                let wordAlt = init.BooksData.wordAlt.words[wordInx];
                if (wordAlt && wordAlt !== quoteAlt) {
                    let obj = {
                        word: wordAlt,
                        wordAt,
                        mainWord: false
                    };
                    arrSearch.push(obj);
                }
            });
        }
    });

    return arrSearch;
}

export function getSearchObjectWithSpecCols(words) {
    try {
        let arrSearch = [];
        Object.keys(words).forEach((key) => {
            let inCol = "";
            switch (key) {
                case "ספר":
                    // inCol = "name";
                    //set the bit of col - name and volume
                    inCol = (1 << 1) & (1 << 2);
                    break;
                case "מחבר":
                    // inCol = "authors";
                    inCol = 1 << 4;
                    break;
                case "מקום":
                    // inCol = "places";
                    inCol = 1 << 5;
                    break;
            }
            words[key].split(" ").forEach((word, wordAt) => {
                //  if (key == "שנה") return;
                let altrWordInxArr = init.BooksData.wordAlt.wordsIndex[word];
                let obj = {
                    word,
                    wordAt,
                    inCol,
                    mainWord: true
                };
                arrSearch.push(obj);

                //if word has qoutes - ass slt word without
                let quoteAlt = "";
                if (word.indexOf('"') > -1) {
                    quoteAlt = word.replace('"', "");
                    let obj = {
                        word: quoteAlt,
                        wordAt,
                        inCol,
                        mainWord: false
                    };
                    arrSearch.push(obj);
                }

                if (altrWordInxArr) {
                    //get all alt words
                    altrWordInxArr.forEach((wordInx) => {
                        //get the real alt word
                        let wordAlt = init.BooksData.wordAlt.words[wordInx];
                        if (wordAlt && wordAlt !== quoteAlt) {
                            let obj = {
                                word: wordAlt,
                                wordAt,
                                inCol,
                                mainWord: false
                            };
                            arrSearch.push(obj);
                        }
                    });
                }
            });
        });

        return arrSearch;
    } catch (ex) {
        console.log(`error searching advanced txt >> ${ex.message}`);
        return [];
    }
}

export function BuildSearchStrings(phrase) {
    let lstSearch = [];
    lstSearch.push(phrase);
    let altWord = getWord(phrase);
    let altWords = getWords(phrase);
    let results;
    for (const [key, value] of Object.entries(altWords)) {
        let word = key;
        value.forEach((i) => lstSearch.push(phrase.replace(word, i)));
    }
    if (altWord) {
        lstSearch = [...lstSearch, ...altWord];
    }
    results = [...new Set(lstSearch)];

    return results;
}