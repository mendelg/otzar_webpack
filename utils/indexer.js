let inxData = {};
import * as advLocalStorage from "localforage";

function getObjValueByKey(o, s) {
    if (!s) return null;
    s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
    s = s.replace(/^\./, ""); // strip a leading dot
    var a = s.split(".");

    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return null;
        }
    }

    if (typeof o == "string") return o.toLowerCase();
    else if (typeof o == "undefined" || o == null) return null;
    return o;
}

function stripTxt(word) {
    return word.replace(/[^0-9a-zA-Zא-ת"']/gi, " ").replace(/  +/g, " ");
}

function stringToWordArr(pharse) {
    pharse = stripTxt(pharse);
    return pharse.split(" ");
}

function search(txtSearch, inxObj, options = {}) {
    let data = inxObj.data;
    let settings = options;
    let deps = new Set();
    let tmpResults = new Set();
    let ignoreThis = false;
    let score = {};
    inxObj.indexedKeys.forEach((prop) => {
        score[prop] = {
            score: 1,
            firstWordScore: 1,
            wordAtScore: 0,
            fullWordScore: 1,
            startWith: 0,
        };
    });

    if (!settings) {
        settings = {
            full: false,
            location_points: 1,
            full_points: 1,
            score,
        };
    }
    if (!settings.full) settings.full = false;
    if (!settings.location) settings.location = 1;
    if (!settings.prop_count) settings.prop_count = 1;
    if (!settings.full_points) settings.full_points = 1;
    if (!settings.score) settings.score = score;
    score = settings.score;
    let txtSpl = [];

    if (typeof txtSearch == "string") {
        let spl = stringToWordArr(txtSearch);
        spl.forEach((v, i) =>
            txtSpl.push({
                word: v,
                wordAt: i,
                inCol: null,
                mainWord: true
            })
        );
    } else {
        //build by the given obj
        txtSpl = txtSearch;
        let lastCol = null;
        let counter = 0;
        for (let obj of txtSpl) {
            if (!obj.inCol) continue;
            if (lastCol != obj.inCol) {
                obj.colInx = counter;
                counter++;
                lastCol = obj.inCol;
            } else obj.colInx = counter - 1;
        }
    }
    let wordAt = 0;
    let mainWord = true;
    let inCol = null;
    let colId = null;
    let lastCol = null;
    txtSpl.forEach((txtData) => {
        let txt = txtData.word;
        txt = txt.replace(/[^0-9a-zA-Zא-ת"]/gi, "");

        //reset tmpResult for each general word
        if (wordAt != txtData.wordAt) tmpResults.clear();

        //use internally to match again prev word result
        wordAt = txtData.wordAt;
        mainWord = txtData.mainWord;
        inCol = txtData.inCol;
        colId =
            txtData.colInx != null && txtData.colInx != undefined ?
            txtData.colInx :
            null;
        let txtLen = txt.length;
        if (lastCol != colId) {
            lastCol = colId;
            tmpResults.clear();
        }
        data.forEach((value, key) => {
            let foundFullMatch = false;
            let startAt = -1;

            if (settings.full) {
                foundFullMatch = key == txt ? value : false;
                if (!found) return;
                startAt = 0;
            } else {
                startAt = key.indexOf(txt);
            }

            //add full word match star

            // //add location level to result
            if (startAt == -1) return;
            // else if (startAt == 0) {
            //   //add level_match
            //   level += settings.location;
            // }

            //add full match points
            if (txtLen == key.length) {
                // level += settings.full_points;
                foundFullMatch = true;
            } else {
                if (!mainWord) return;
            }

            //add to results
            // ;
            value.forEach((v, k) => {
                let points = 0;

                if (
                    (k.dirty_times < wordAt && wordAt != 0) ||
                    (colId != null && k.cols_dirty_times != colId && colId != 0)
                ) {
                    //we should ignore this word as it exclude from prev searches
                    return;
                } else if (
                    k.dirty_times >= wordAt &&
                    (wordAt != 0 || (colId != 0 && colId != null))
                ) {
                    //dont add the word just edit the word
                    //we can actually add the v.total_level again :-)

                    v.keys_found.forEach((matchInfo, prop) => {
                        ignoreThis = false;
                        if (inCol) {
                            ignoreThis = true;
                            if (prop == inCol) ignoreThis = false;
                        }
                        //calc FirstWord point
                        if (matchInfo.FirstWord) {
                            points += score[prop].firstWordScore;
                        }
                        //calc full match point
                        if (foundFullMatch) {
                            let o = score[prop].fullWordScore;
                            points += o;
                        }

                        //calc full match point
                        if (startAt == 0) {
                            points += score[prop].startWith;
                        }
                        points += score[prop].score;
                        if (k._resItem["key_" + prop + "_step"] != wordAt) {
                            if (k._resItem["key_" + prop + "_found"]) {
                                k._resItem["key_" + prop + "_found"]++;
                                k._resItem["key_" + prop + "_step"] = wordAt;
                            } else {
                                k._resItem["key_" + prop + "_found"] = 1;
                                k._resItem["key_" + prop + "_step"] = wordAt;
                            }
                        }
                    });
                    // k._resItem.match += settings.prop_count + level;
                    if (k.dirty_times > wordAt) {
                        if (points > k._resItem.last_points) {
                            k._resItem.match += points - k._resItem.last_points;
                            k._resItem.last_points = points;
                        }
                    } else {
                        k._resItem.match += points;
                        k._resItem.last_points = points;
                    }

                    k.dirty_times = wordAt + 1;
                    k.cols_dirty_times = colId + 1;
                    tmpResults.add(k._resItem);
                    return;
                }

                //this is the first round - meaning add it anyway
                points = 0;

                let resultItem = {
                    item: k._resItem.item,
                    match: points,
                    last_points: points,
                };

                v.keys_found.forEach((matchInfo, prop) => {
                    ignoreThis = false;
                    if (inCol) {
                        ignoreThis = true;
                        if (prop == inCol) ignoreThis = false;
                    }
                    //calc FirstWord point
                    if (matchInfo.FirstWord) {
                        points += score[prop].firstWordScore;
                    }
                    //calc full match point
                    if (foundFullMatch) {
                        points += score[prop].fullWordScore;
                    }

                    //calc full match point
                    if (startAt == 0) {
                        points += score[prop].startWith;
                    }
                    points += score[prop].score;
                    if (k._resItem) {
                        k._resItem["key_" + prop + "_found"] = 1;
                        k._resItem["key_" + prop + "_step"] = wordAt;
                    } else {
                        resultItem["key_" + prop + "_found"] = 1;
                        resultItem["key_" + prop + "_step"] = wordAt;
                    }
                });

                if (k.dirty_times > 0) {
                    //just check the match level
                    if (k._resItem.match < points) {
                        k._resItem.last_points = points;
                        k._resItem.match = points;
                    }

                    return;
                }

                //for the first ever success match
                if (ignoreThis) {
                    ignoreThis = false;
                    return;
                }
                resultItem.match = points;
                resultItem.last_points = points;
                k.dirty_times = txtData.wordAt + 1;
                k.cols_dirty_times = colId + 1;
                k._resItem = resultItem;

                // results.add(resultItem);
                const itemToChange = k;
                deps.add(() => {
                    itemToChange._resItem = {
                        item: itemToChange._resItem.item
                    };

                    itemToChange.dirty_times = 0;
                    itemToChange.cols_dirty_times = 0;
                });
                tmpResults.add(resultItem);
            });
        });
    });

    let ret = Array.from(tmpResults);

    // ret.forEach((a) => (a.item = a.item));
    deps.forEach((reset) => reset());

    // let retData = ret.map((a) => {
    //   return {
    //     item: a.item._self,
    //     match: a.match,
    //   };
    // });
    // ;
    //
    return ret;
}

function createIndex(data, options = {}) {
    let all_words = new Map();
    // let books_in = new Map();
    // let deps = new Set();
    // let reset = () => deps.forEach((reseter) => reseter());

    let properties = options.properties;
    //   let match_settings = options.match_settings;

    //check we have props to index
    if (!properties) {
        console.error("options.properties is empty");
        return;
    }
    let indexedKeys = [];
    //map props to include id
    properties = options.properties.map((a, i) => {
        let level = 1;
        let prop = "";
        let type = null;
        let keys = [];
        if (typeof a == "string") prop = a;
        else {
            prop = a.prop;
            level = a.level;
            type = a.type;
            keys = a.keys;
        }
        indexedKeys.push(prop);
        return {
            prop,
            level,
            id: i,
            type,
            keys
        };
    });

    //   //check we have match_setting to index
    //   if (!match_settings)
    //     match_settings = { place: 1, prop_count: 1, word_match: 1 };
    //   //   if (!match_settings.place) match_settings.place = 1;
    //   if (!match_settings.prop_count) match_settings.prop_count = 1;
    //   if (!match_settings.word_match) match_settings.word_match = 1;

    //loop through the properties and get the word

    data.forEach((elem) => {
        //for each item let get all props and index them
        IndexElemProps(elem, properties);
    });

    function IndexElemProps(element, props) {
        let elem = {
            dirty_times: 0,
            cols_dirty_times: 0,
            _resItem: {
                item: element.id
            },
        };
        // let elem = new Proxy(element, {
        //   dirty_times: 0,
        //   cols_dirty_times: 0,
        //   _resItem: null,
        //   get: function(target, prop, receiver) {
        //     if (prop === "dirty_times") {
        //       return this.dirty_times;
        //     } else if (prop === "_resItem") return this._resItem;
        //     else if (prop == "_self") return element;
        //     return Reflect.get(...arguments);
        //   },
        //   set: function(target, prop, value) {
        //     if (prop === "dirty_times") {
        //       this.dirty_times = value;
        //       return true;
        //     } else if (prop === "_resItem") {
        //       this._resItem = value;
        //       return true;
        //     }
        //     return Reflect.set(target, prop, value);
        //   },
        // });

        props.forEach((prop) => {
            let itemContentArr = null;
            //get key value
            if (prop.type == "Array") {
                itemContentArr = getObjValueByKey(element, prop.prop);
                if (!itemContentArr || itemContentArr.length == 0) return;
            } else if (prop.type == "ObjectArray") {
                let keys = prop.keys;
                let lstWord = [];
                if (!keys) return;
                itemContentArr = getObjValueByKey(element, prop.prop);
                if (!itemContentArr || itemContentArr.length == 0) return;
                itemContentArr.forEach((arrObj, arrObjInx) => {
                    keys.forEach((key) => {
                        lstWord.push(arrObj[key]);
                    });
                });
                itemContentArr = lstWord;
            } else {
                itemContentArr = getObjValueByKey(element, prop.prop);
                // if (
                //   prop.prop == "volume" &&
                //   itemContentArr == "ב" &&
                //   elem.name.includes("דברי יחזקאל")
                // )
                //   ;
                if (!itemContentArr) return;
                if (typeof itemContentArr == "string") {
                    itemContentArr = [itemContentArr];
                }
            }

            itemContentArr.forEach((itemContent) => {
                //split to words
                let words = stringToWordArr(itemContent);
                //index each word
                words.forEach((word, loc) => {
                    let location = loc == 0 ? 1 : 0;
                    let item = all_words.get(word);
                    //add to books_in

                    // let bookin = books_in.get(element.id);
                    // if (!bookin) {
                    //   let lst = new Set();
                    //   books_in.set(element.id, { id: elem._resItem, lst });
                    //   bookin = lst;
                    // } else bookin = bookin.lst;
                    // bookin.add(word);

                    if (!item) {
                        //we dont have this word in the list so add it first
                        let containObjs = new Map();
                        all_words.set(word, containObjs);
                        item = containObjs;
                    }

                    //now check if we need to add the obj or just update
                    let objInList = item.get(elem);
                    if (objInList) {
                        //set it
                        // if (prop.level > objInList.prop_level) {
                        //   objInList.prop_level = prop.level;
                        // }
                        // if (location < objInList.location) {
                        //   objInList.location = location;
                        // }

                        objInList.keys_found.set(prop.prop, {
                            FirstWord: location,
                            wordAt: loc,
                            score: prop.level,
                        });

                        // objInList.total_level = objInList.prop_level + objInList.location;
                    } else {
                        let keys_found = new Map();
                        keys_found.set(prop.prop, {
                            FirstWord: location,
                            wordAt: loc,
                            score: prop.level,
                        });

                        //create new one
                        let itemInfo = {
                            // location,
                            // prop_level: prop.level,
                            keys_found,
                            // fixed_total_level: location + prop.level,
                            // total_level: location + prop.level,
                        };
                        // let reseter = () => {
                        //   elem._resItem = null;
                        //   elem.dirty_times = 0;
                        //   elem.cols_dirty_times = 0;
                        // };
                        // deps.add(reseter);
                        item.set(elem, itemInfo);
                    }
                });
            });
        });
    }
    // window.nix = { all_words, books_in };
    // books_in, reset, indexedKeys, deps, options
    // books_in = null;

    return {
        data: all_words,
        indexedKeys,
        options
    };
}

function addNewBook(booksArr, indexData, booksIn, deps, options) {
    let all_words = indexData;
    let books_in = booksIn;
    let properties = options.properties;
    //   let match_settings = options.match_settings;

    //check we have props to index
    if (!properties) {
        console.error("options.properties is empty");
        return;
    }
    let indexedKeys = [];
    //map props to include id
    properties = options.properties.map((a, i) => {
        let level = 1;
        let prop = "";
        let type = null;
        let keys = [];
        if (typeof a == "string") prop = a;
        else {
            prop = a.prop;
            level = a.level;
            type = a.type;
            keys = a.keys;
        }
        indexedKeys.push(prop);
        return {
            prop,
            level,
            id: i,
            type,
            keys
        };
    });

    //loop through the properties and get the word
    booksArr.forEach((elem) => {
        //for each item let get all props and index them
        IndexElemProps(elem, properties);
    });

    function IndexElemProps(element, props) {
        let elem = new Proxy(element, {
            dirty_times: 0,
            _resItem: null,
            get: function(target, prop, receiver) {
                if (prop === "dirty_times") {
                    return this.dirty_times;
                } else if (prop === "_resItem") return this._resItem;
                else if (prop == "_self") return element;
                return Reflect.get(...arguments);
            },
            set: function(target, prop, value) {
                if (prop === "dirty_times") {
                    this.dirty_times = value;
                    return true;
                } else if (prop === "_resItem") {
                    this._resItem = value;
                    return true;
                }
                return Reflect.set(target, prop, value);
            },
        });

        props.forEach((prop) => {
            let itemContentArr = null;
            //get key value
            if (prop.type == "Array") {
                itemContentArr = getObjValueByKey(elem, prop.prop);
                if (!itemContentArr || itemContentArr.length == 0) return;
            } else if (prop.type == "ObjectArray") {
                let keys = prop.keys;
                let lstWord = [];
                if (!keys) return;
                itemContentArr = getObjValueByKey(elem, prop.prop);
                if (!itemContentArr || itemContentArr.length == 0) return;
                itemContentArr.forEach((arrObj, arrObjInx) => {
                    keys.forEach((key) => {
                        lstWord.push(arrObj[key]);
                    });
                });
                itemContentArr = lstWord;
            } else {
                itemContentArr = getObjValueByKey(elem, prop.prop);
                // if (
                //   prop.prop == "volume" &&
                //   itemContentArr == "ב" &&
                //   elem.name.includes("דברי יחזקאל")
                // )
                //   ;
                if (!itemContentArr) return;
                if (typeof itemContentArr == "string") {
                    itemContentArr = [itemContentArr];
                }
            }

            itemContentArr.forEach((itemContent) => {
                //split to words
                let words = stringToWordArr(itemContent);
                //index each word
                words.forEach((word, loc) => {
                    let location = loc == 0 ? 1 : 0;
                    let item = all_words.get(word);
                    //add to books_in

                    let bookin = books_in.get(element.id);
                    if (!bookin) {
                        let lst = new Set();
                        books_in.set(element.id, {
                            id: elem,
                            lst
                        });
                        bookin = lst;
                    } else bookin = bookin.lst;
                    bookin.add(word);

                    if (!item) {
                        //we dont have this word in the list so add it first
                        let containObjs = new Map();
                        all_words.set(word, containObjs);
                        item = containObjs;
                    }

                    //now check if we need to add the obj or just update
                    let objInList = item.get(elem);
                    if (objInList) {
                        //set it
                        // if (prop.level > objInList.prop_level) {
                        //   objInList.prop_level = prop.level;
                        // }
                        // if (location < objInList.location) {
                        //   objInList.location = location;
                        // }

                        objInList.keys_found.set(prop.prop, {
                            FirstWord: location,
                            wordAt: loc,
                            score: prop.level,
                        });
                        // objInList.total_level = objInList.prop_level + objInList.location;
                    } else {
                        let keys_found = new Map();
                        keys_found.set(prop.prop, {
                            FirstWord: location,
                            wordAt: loc,
                            score: prop.level,
                        });
                        //create new one
                        let itemInfo = {
                            // location,
                            // prop_level: prop.level,
                            keys_found,
                            // fixed_total_level: location + prop.level,
                            // total_level: location + prop.level,
                        };
                        let reseter = () => {
                            elem._resItem = null;
                            elem.dirty_times = 0;
                            elem.cols_dirty_times = 0;
                        };
                        deps.add(reseter);
                        item.set(elem, itemInfo);
                    }
                });
            });
        });
    }
}

function deleteBookById(bookId, indexData, booksIn) {
    //SHOULD I CARE ABOUT THE DEPS ?!!?!??!?!? :-(
    /** @type {Map} */
    const bkIn = booksIn;
    /** @type {Map} */
    const inxData = indexData;
    const info = bkIn.get(bookId);
    if (info) {
        const proxyBook = info.id;
        /** @type {Array} */
        const words = info.lst;
        words.forEach((word) => {
            /** @type {Map} */
            const wordInInx = inxData.get(word);
            wordInInx.delete(proxyBook);
        });
    }
}

async function createTinyIndex(
    buffer,
    cache = null,
    storageKey = "inxBooks",
    loadToMem = false
) {
    if (cache) {
        if (loadToMem) inxData = cache;
        return;
    }
    //gather the info
    const infoData = new Uint32Array(buffer, 0, 4);
    const stringSize = infoData[0];
    const stringStartAtByte = 4 * 4;
    const tableDataSize = infoData[1];
    const tableDataStartAtByte = stringStartAtByte + stringSize;
    const booksDataSize = infoData[2];
    const booksDataStartAtByte = tableDataStartAtByte + tableDataSize;

    //build the string
    const stringBuf = new Uint8Array(buffer, stringStartAtByte, stringSize);
    const stringData = new TextDecoder().decode(stringBuf);
    const allWords = stringData.split("|");
    //just ret the data

    let info = {
        strings: allWords,
        minus: tableDataSize,
        tableDataSize,

        booksDataSize,
        buffer: buffer.slice(
            tableDataStartAtByte,
            booksDataStartAtByte + booksDataSize
        ),
    };
    inxData = info;
    await advLocalStorage.setItem(storageKey, inxData);
    if (!loadToMem) inxData = null;

    // return info;
}

function freeIndexMemory() {
    inxData = null;
    console.log("index mem release");
}

function searchTinyIndex(txt, searchInfo = {}) {
    const inx = inxData;
    let wordsToSearch = txt;
    let booksReults = [];
    const vbuff = new Int32Array(inx.buffer);
    const fullPointScore = searchInfo.full_points ? searchInfo.full_points : 0;

    const bufOffestInDWORD = inx.tableDataSize / 4;
    //first fix the txt incase of string

    if (typeof txt == "string") {
        txt = txt.split(" ");
        txt.forEach((word, i) =>
            wordsToSearch.push({
                word,
                wordAt: i,
                inCol: false,
                mainWord: true
            })
        );
    }
    let lastWordAt = -1;
    // let generalWordsLength = 1;
    let generalWordsLength = 0;
    wordsToSearch.forEach((w, i) => {
        if (i == 0) {
            wordsToSearch[i].wordIndex = 0;
            generalWordsLength++;
        } else {
            if (wordsToSearch[i].inCol != wordsToSearch[i - 1].inCol) {
                wordsToSearch[i].wordIndex = generalWordsLength;
                generalWordsLength++;
            } else if (wordsToSearch[i].wordAt != wordsToSearch[i - 1].wordAt) {
                wordsToSearch[i].wordIndex = generalWordsLength;
                generalWordsLength++;
            } else {
                wordsToSearch[i].wordIndex = wordsToSearch[i].wordAt;
            }
        }
    });

    wordsToSearch.forEach((wordInSearch) => {
        //now loop words in inx itself
        // if (
        //   (lastWordAt.wordAt != wordInSearch.wordAt ||
        //     lastWordAt.inCol != wordInSearch.inCol) &&
        //   lastWordAt.wordAt != -1
        // )
        //   generalWordsLength++;
        inx.strings.forEach((wordInIndex, posWordInIndex) => {
            let points = 0;
            const sWordPosInI = wordInIndex.indexOf(wordInSearch.word);
            //if no match at all just return
            if (sWordPosInI == -1) return;
            //incase of alt word - return if not full match
            //if (sWordPosInI != 0 && !wordInSearch.mainWord) return;
            //if full match then first of all add full points score
            if (sWordPosInI == 0) points += fullPointScore;
            //add the book and the number of times is found
            //lets loop through the books and add the info

            const tableTranslateAddr = posWordInIndex * 2;
            const dataAddr = vbuff[tableTranslateAddr];
            const dataCount = vbuff[tableTranslateAddr + 1];
            const loopStartAt = dataAddr / 4 + bufOffestInDWORD;
            const loopEndsAt = loopStartAt + dataCount * 2;
            for (let bookPos = loopStartAt; bookPos < loopEndsAt; bookPos += 2) {
                const bookId = vbuff[bookPos];
                let flag = vbuff[bookPos + 1];
                // if (bookId == 9582) ;
                //check flag with inCol
                if (wordInSearch.inCol) {
                    if ((wordInSearch.inCol & flag) == 0) {
                        //not fit to condition
                        continue;
                    }
                }

                //add flag of full word match
                if (sWordPosInI == 0) {
                    let tmp = flag & 0xff;
                    tmp = tmp << 8;
                    flag = flag | tmp;
                }
                if (booksReults[bookId] == undefined) {
                    //first word in wordinsearch not found so ignore this
                    if (wordInSearch.wordIndex > 0) continue;
                    booksReults[bookId] = [];
                    booksReults[bookId].push(0); // found times
                    booksReults[bookId].push(flag); // flags data
                } else {
                    if (booksReults[bookId][0] == wordInSearch.wordIndex) {
                        //just or the last flag
                        let lastFlag = booksReults[bookId][booksReults[bookId].length - 1];
                        booksReults[bookId][booksReults[bookId].length - 1] =
                            lastFlag | flag;
                    } else if (booksReults[bookId][0] + 1 == wordInSearch.wordIndex) {
                        //should inc the found times and also add flag
                        booksReults[bookId][0]++;
                        booksReults[bookId].push(flag); // flags data
                    }
                }
            }
        });
        lastWordAt = wordInSearch;
    });

    //we have array of results lets build correct info array
    const results = booksReults;
    let realResults = [];

    results.forEach((resultData, bookid) => {
        let bookMatch = 2;
        let bookMatchCount = 0;
        let authMatch = 8;
        let authMatchCount = 0;
        let score = 0;
        const book = bookid;

        //if not enough matches
        if (resultData[0] < generalWordsLength - 1) return;
        for (let i = 1; i < resultData.length; i++) {
            const matchFlag = resultData[i];
            if (2 & matchFlag) bookMatchCount++;
            bookMatch = bookMatch & matchFlag;
            if (8 & matchFlag) authMatchCount++;
            authMatch = authMatch & matchFlag;
            Object.keys(searchInfo.score).forEach((key) => {
                let keyInfo = searchInfo.score[key];
                let keyExists = keyInfo.bit;
                let keyFirstWord = keyInfo.bit << 8;
                let keyFullMatch = keyInfo.bit << 16;
                // const fullWordMatch=65536 & bookMatch;
                keyExists = keyExists & matchFlag;
                if (keyExists) score += keyInfo.score;
                if (keyFirstWord) score += keyInfo.firstWordScore;
                if (keyFullMatch) score += keyInfo.fullWordScore;
            });
        }
        realResults.push({
            book,
            bookNameMatch: bookMatch,
            bookMatchCount,
            match: score,
            authMatch,
            authMatchCount,
        });
    });
    return realResults;
}

export default {
    search,
    createIndex,
    deleteBookById,
    addNewBook,
    createTinyIndex,
    searchTinyIndex,
    freeIndexMemory,
    inxData,
};