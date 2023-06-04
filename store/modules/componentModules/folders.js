import Vue from "vue";
import VueInst from "@/main_app.js";

import {
    getUserSavedList,
    getUserFreeSearchSavedList,
} from "@/services/userFoldersData.js";
import {
    openBook as open
} from "@/services/bookData.js";
import {
    getSystemFoldersBooksIdListById,
    getFullTitle,
    getSystemFoldersMultipleBooksLists,
} from "@/services/loadSystemFoldersFromServer";
import {
    books
} from "../books";

export const namespaced = true;
let resetList = false;
let lastMefsSelected = null;
let lastNoshimSelected = null;
let lastYesodSelected = null;
export const state = {
    createFolder: false,
    //array of all selected folder
    selectFolder: [],
    // perameter boolian if selected folder is system or not
    selectSystem: false,
    showOrder: true,
    multiSelect: false,
    inSystemFolder: false,
    viewMenu: false,
    viewSystemFolder: true,
    viewMineFolder: true,
    orderBy: "name",
    modeEdit: {
        edit: false,
        type: "",
        value: "",
    },
    historyAction: {
        action: "",
        parentId: "",
        parentIdOld: "",
        folder: "",
    },
    modeView: "symbol",
    valueEditCur: "",
    cutFolderId: null,
    openPopup: false,
    typePopup: "",
    listType: "",
    arrowKey: {
        dir: "",
        isKey: false,
    },
    isArrowKey: false,
    chabadListId: 102909,
    browseType: "",
};

export const mutations = {
    //get value true for creareFolder
    //param: createFolder
    TOOGLE_CREATE_FOLDER(state, toggle) {
        if (toggle) {
            let x = VueInst.$store.getters["userFolders/getContentInFolder"];
            let title = VueInst.$t("files1.newFolder");
            x = x.filter((x) => x.folderTypeId == 1);
            let find = x.find((x) => x.title == title);
            let m = 0;
            while (find) {
                m++;
                title = VueInst.$t("files1.newFolder") + " " + m;

                find = x.find((x) => x.title == title);
            }
            state.createFolder = true;
            state.modeEdit.edit = true;
            state.modeEdit.type = "create";
            state.modeEdit.value = title;
        } else {
            state.createFolder = false;
            state.modeEdit.edit = false;
            state.modeEdit.type = "";
            state.modeEdit.value = "";
            state.valueEditCur = "";
        }
    },
    SET_SELECT_FOLDER(state, payload) {
        resetList = false;
        //check if the selected folder already exists in the array
        //
        if (payload.foldersSystem == "true") {
            state.selectSystem = true;
        } else {
            state.selectSystem = false;
        }

        //check if folder selected is

        let a = state.selectFolder.find((select) => select.id == payload.folder.id);
        //if so, return
        if (a) return;

        payload.folder.positionElem = payload.positionElem;
        let newFold = Object.assign({}, payload.folder);
        if (
            state.modeView == "tree" &&
            payload.folder.level &&
            payload.folder.level > 1 &&
            state.multiSelect
        ) {
            a = state.selectFolder.find(
                (select) => select.id == payload.folder.parent.id
            );
            if (a) {
                if (a.nextSelected) {
                    a.nextSelected.push(newFold);
                } else {
                    let next = [];
                    next.push(newFold);
                    Vue.set(a, "nextSelected", next);
                    //   a.nextSelected = next;
                }
            } else {
                // newFold.parent.nextSelected.push(payload.folder);
                Vue.set(newFold.parent, "nextSelected", payload.folder);
                state.selectFolder.push(newFold.parent);
            }
        } else state.selectFolder.push(newFold);
        state.selectFolder = [...new Set(state.selectFolder)];
    },
    UN_SELECT_FOLDER(state) {
        state.selectFolder = [];
        state.selectSystem = false;
    },
    UN_SELECT_FOLDER_BY_ID(state, id) {
        //remove folder by id from array
        // state.selectSystem = false;

        resetList = false;
        let find = state.selectFolder.find((a) => {
            return a.id == id;
        });
        if (!find) return;
        if (find.categoryTypeId == 3) resetList = true;

        state.selectFolder = state.selectFolder.filter((a) => {
            return a.id != id;
        });
        if (state.selectFolder.length != 0) resetList = false;
    },
    UN_SELECT_NEXT_SELECTED_FOLDERS(state, payload) {
        let parent = state.selectFolder.find((a) => {
            return a.id == payload.parentId;
        });
        if (!parent) return;
        parent.nextSelected = parent.nextSelected.filter((a) => {
            return a.id != payload.id;
        });
    },
    // show/hide right menu
    TOGGLE_VIEW_MENU(state, toggle) {
        if (toggle) state.viewMenu = true;
        else state.viewMenu = false;
    },
    // save string name's folder While typing
    SET_VALUE_FOLDER(state, value) {
        state.valueEditCur = value;
    },
    // save string name's When you are finished typing
    SAVE_VALUE_FOLDER(state) {
        if (state.valueEditCur.length > 0)
            state.modeEdit.value = state.valueEditCur;
    },
    SET_MODE_EDIT(state, payload) {
        state.modeEdit.type = payload.type;
        state.modeEdit.value = payload.value;
        state.modeEdit.edit = true;
        state.valueEditCur = "";
    },
    SET_MODE_VIEW(state, view) {
        state.modeView = view;
    },
    // Exit edit mode
    //reset varibal
    CANCEL_EDIT(state) {
        state.createFolder = false;
        state.modeEdit.edit = false;
        state.modeEdit.type = "";
        state.modeEdit.value = "";
    },
    //Selection of cut mode saved folder in varibal is named 'cutFolderId'
    // until select folder for move(paste)
    CUT_FOLDER(state) {
        if (state.selectFolder.length && state.selectFolder.length > 0)
            state.cutFolderId = state.selectFolder[0].id;
    },
    //Selection of paste mode
    //reset varibal 'cutFolderId'
    PASTE_FOLDER(state) {
        state.cutFolderId = null;
    },
    //open/close popup
    TOGGLE_POPUP_FOLDER(state, toggle) {
        if (toggle) state.openPopup = true;
        else state.openPopup = false;
    },
    // saved in state type folder: export / import
    SET_TYPE_POPUP(state, type) {
        if (type) {
            state.typePopup = type;
        }
    },
    SET_BROWSE_TYPE(state, type) {
        if (type) {
            state.browseType = type;
        }
    },

    SET_LIST_TYPE(state, type) {
        if (type) {
            state.listType = type;
        }
    },
    SET_ORDER_BY(state, orderBy) {
        state.orderBy = orderBy;
    },
    RESET_ALL(state) {
        // return;
        state.showOrder = true;
        state.multiSelect = false;
        state.modeView = "symbol";
        state.createFolder = false;
        state.selectFolder = [];
        // state.selectSystem = []
        state.inSystemFolder = false;
        state.viewMenu = false;
        state.viewSystemFolder = true;
        state.viewMineFolder = true;
        // state.orderBy= "name"
        state.valueEditCur = "";
        state.cutFolderId = null;
        state.typePopup = "";
    },
    ARROW_KEY(state, dir1) {
        state.arrowKey = dir1;
        state.isArrowKey = dir1.isKey;
    },
    TOGGLE_MULTI_SELECT(state, toggle) {
        state.multiSelect = toggle;
    },
};
export const actions = {
    setSearchTo({
        dispatch
    }, str) {
        dispatch("userFolders/setSearchTo", str, {
            root: true,
        });
        dispatch("systemFolders/setSearchTo", str, {
            root: true,
        });
    },
    setChabadActiveStore({
        state,
        dispatch,
        rootGetters,
        localGetters
    }) {
        let listId = state.chabadListId;
        getSystemFoldersBooksIdListById(listId, false).then((books) => {
            dispatch("books/setActiveStore", books, {
                root: true,
            });
            let payload = {
                id: listId,
                type: "system",
                isRegStore: false,
            };
            dispatch("books/setActiveStoreData", payload, {
                root: true,
            });
        });
    },
    setActiveStore({
        state,
        dispatch,
        rootGetters,
        localGetters
    }, isRegStore) {
        let idsArr = [];
        let selectId = state.selectFolder[0].id;
        if (!state.selectSystem) {
            getUserSavedList(selectId, false).then((books) => {
                dispatch("books/setActiveStore", books, {
                    root: true,
                });
                let payload = {
                    id: selectId,
                    type: "user",
                    isRegStore,
                };
                dispatch("books/setActiveStoreData", payload, {
                    root: true,
                });
            });
        } else {
            getSystemFoldersBooksIdListById(selectId, false).then((books) => {
                dispatch("books/setActiveStore", books, {
                    root: true,
                });
                let payload = {
                    id: selectId,
                    type: "system",
                    isRegStore,
                };
                dispatch("books/setActiveStoreData", payload, {
                    root: true,
                });
            });
        }
    },
    openFolder({
        state,
        dispatch,
        rootGetters,
        localGetters
    }, doSelect = false) {
        if (!state.selectFolder.length || state.selectFolder.length == 0) return;
        let inSearch = rootGetters["userFolders/getTextSearchInput"];
        //  In Search mode, there is another action that handles opening folders
        if ((inSearch && inSearch != "") || inSearch.length > 0) {
            dispatch("openFolderInSearch");
            return;
        }
        let id;
        let type;
        //if mine selected folder
        if (!state.selectSystem) {
            dispatch("openMineFolder");
            dispatch("unSelectFolders");
        }
        //if system selected folder
        else if (state.selectSystem) {
            dispatch("openSystemFolder", doSelect);
        }
    },
    openMineFolder({
        state,
        dispatch,
        rootGetters,
        localGetters
    }) {
        // Only one fold opens
        let id;
        let type;
        id = state.selectFolder[0].id;
        let listable = state.selectFolder[0].listable;
        type = state.selectFolder[0].folderTypeId;
        state.viewSystemFolder = false;

        // type = folder
        if (type == 0) {
            return;
        }
        //1=folder
        if (
            type === 1 &&
            !(listable === "pdfbooks" && state.typePopup === "browse")
        ) {
            dispatch("userFolders/setFolderParentId", id, {
                root: true,
            });
            state.viewSystemFolder = false;
        }

        //if browsing for freesearch
        if (state.typePopup == "browse") {
            if (type === 1 && listable !== "pdfbooks") return;
            let selectedFolderTitle;
            if (state.selectFolder.length > 0) {
                selectedFolderTitle = state.selectFolder[0].title;
            }
            //set special lists title
            switch (listable) {
                case "favorites":
                    selectedFolderTitle = VueInst.$t("userDefaultFolders.favorites");
                    break;
                case "pdfbooks":
                    selectedFolderTitle = VueInst.$t("userDefaultFolders.pdfbooks");
                    break;
                case "recentbooks":
                    selectedFolderTitle = VueInst.$t("userDefaultFolders.recentbooks");
                    break;
            }

            if (state.browseType === "add") {
                dispatch(
                    "userSetting/setCustomSearchIn", {
                        id,
                        name: selectedFolderTitle,
                        type
                    }, {
                        root: true
                    }
                );
                dispatch("togglePopupFolder", false);
                return;
            }

            if (listable === "recentbooks") {
                let ids = rootGetters["userRecentBooks/getRecentBooks"].map(
                    (a) => a.bookId
                );

                if (ids.length == 0) {
                    VueInst.$notify({
                        type: "error",
                        message: VueInst.$t("hiddenbooks.norecentbooks"),
                        timeout: 2000,
                    });

                    let prev = rootGetters["freeSearchBookList/getPrevSearchInType"];
                    dispatch("freeSearchBookList/setSearchInType", prev, {
                        root: true,
                    });
                    dispatch("togglePopupFolder", false);
                    return;
                } // ids.push(0);
                dispatch("freeSearchBookList/setBooksToSearchIn", ids, {
                    root: true,
                });
                dispatch("freeSearchBookList/setSavedListName", selectedFolderTitle, {
                    root: true,
                });
                dispatch("togglePopupFolder", false);
                return;
            }
            if (listable == "pdfbooks") {
                let ids = [];
                books.forEach((b) => {
                    if (b.id >= 6000000) ids.push(b.id);
                });

                if (ids.length == 0) {
                    VueInst.$notify({
                        type: "error",
                        message: VueInst.$t("myPdf.nopdfbooks"),
                        timeout: 2000,
                    });

                    let prev = rootGetters["freeSearchBookList/getPrevSearchInType"];
                    dispatch("freeSearchBookList/setSearchInType", prev, {
                        root: true,
                    });
                    dispatch("togglePopupFolder", false);
                    return;
                } // ids.push(0);

                dispatch("freeSearchBookList/setBooksToSearchIn", ids, {
                    root: true,
                });
                dispatch("freeSearchBookList/setSavedListName", selectedFolderTitle, {
                    root: true,
                });
                dispatch("togglePopupFolder", false);
                return;
            }

            if (type == 3)
                //free search list

                getUserFreeSearchSavedList(state.selectFolder[0].id, false).then(
                    (books) => {
                        if (books.length == 0) books.push(0);
                        dispatch(
                            "freeSearchBookList/setBooksToSearchIn",
                            books.map((b) => b.book), {
                                root: true,
                            }
                        );
                        dispatch(
                            "freeSearchBookList/setSavedListName",
                            selectedFolderTitle, {
                                root: true,
                            }
                        );
                    }
                );
            //normal list
            else
                getUserSavedList(state.selectFolder[0].id, false).then((books) => {
                    if (books.length == 0) books.push(0);
                    dispatch("freeSearchBookList/setBooksToSearchIn", books, {
                        root: true,
                    });
                    dispatch("freeSearchBookList/setSavedListName", selectedFolderTitle, {
                        root: true,
                    });
                });
            dispatch("togglePopupFolder", false);
            return;
        }

        if (listable === "hiddenbooks") {
            let ids = books.filter((b) => b._inHide);
            ids = ids.map((i) => i.id);
            let payload = {
                ids,
                type: "HIDDEN_LIST",
                content: VueInst.$t("lists.hiddenBooks"),
            };

            dispatch("bookList/addUserActionToHistory", payload, {
                root: true,
            });
            dispatch("togglePopupFolder", false);
            return;
        }

        if (listable == "userbooks") {
            let ids = books
                .filter((b) => b.id >= 5000000 && b.id < 6000000)
                .map((b) => b.id);
            let payload = {
                ids,
                type: "CUSTOM_LIST",
                content: VueInst.$t("lists.mineBooks"),
            };

            dispatch("bookList/addUserActionToHistory", payload, {
                root: true,
            });
            dispatch("togglePopupFolder", false);
            return;
        } else if (listable == "pdfbooks") {
            let ids = books.filter((b) => b.id >= 6000000).map((b) => b.id);
            let payload = {
                ids,
                type: "CUSTOM_LIST",
                content: VueInst.$t("lists.pdfBooks"),
            };

            dispatch("bookList/addUserActionToHistory", payload, {
                root: true,
            });
            dispatch("togglePopupFolder", false);
            return;
        }
        // type = folder
        if (type == 0) {
            return;
        }
        //1=folder
        if (type == 1) {
            dispatch("userFolders/setFolderParentId", id, {
                root: true,
            });
            state.viewSystemFolder = false;
        }
        // 2 = list
        else {
            // In saved export can't list
            if (state.typePopup == "export") return;
            if (state.typePopup == "activeStore") return;
            //if browsing, we just want the ids of list

            let payLoadType = "SAVED_LIST";
            let content = state.selectFolder[0].title;
            if (listable === "recentbooks") {
                payLoadType = "RECENT_BOOKS";
                content = VueInst.$t("userDefaultFolders.recentbooks");
            }

            if (listable === "favorites") {
                // payLoadType = "RECENT_BOOKS";
                content = VueInst.$t("userDefaultFolders.favorites");
            }

            let payload = {
                listId: state.selectFolder[0].id,
                id: state.selectFolder[0].id,
                type: payLoadType,
                content, //: VueInst.$t("userDefaultFolders.recentbooks"),
            };

            if (type == 3)
                dispatch("freeSearchBookList/addUserActionToHistory", payload, {
                    root: true,
                });
            else {
                dispatch("bookList/addUserActionToHistory", payload, {
                    root: true,
                });
            }
            dispatch("togglePopupFolder", false);
        }
    },
    openSystemFolder({
            state,
            dispatch,
            rootGetters,
            localGetters
        },
        doSelect = false
    ) {
        const catInfo = {
            YesodBooks: 1,
            Mefarshim: 2,
            Noshim: 3,
            Mahagarim: 4,
            TextBooks: 5,
        };

        const selectedFolder = state.selectFolder[state.selectFolder.length - 1];
        const id = selectedFolder.id;
        const folderLevel = selectedFolder.level;
        const folderCatg = selectedFolder.categoryTypeId;

        state.inSystemFolder = true;
        state.viewSystemFolder = true;
        state.viewMineFolder = false;
        let setInfo = false;

        if (state.typePopup == "browse") {
            let selectedFolderTitle = "";
            if (state.selectFolder.length > 0) {
                selectedFolderTitle = getParentTitle(selectedFolder, "-"); //state.selectFolder[0].title;
            }

            if (folderCatg == catInfo.YesodBooks) {
                dispatch("toggleMultiSelect", false);
            } else {
                if (folderCatg <= catInfo.Noshim && folderLevel >= 1) {
                    if (folderCatg == catInfo.Noshim) dispatch("toggleMultiSelect", true);
                    else dispatch("toggleMultiSelect", false);
                    dispatch("setModeView", "tree");
                    state.showOrder = false;
                } else {
                    dispatch("toggleMultiSelect", false);
                }
                if (state.multiSelect && id != 3) {
                    dispatch("openFolderMulti", doSelect);
                    return;
                }
            }

            if (folderCatg == catInfo.YesodBooks) {
                if (id === 1) {
                    //main branch
                    dispatch("systemFolders/setFolderParentId", id, {
                        root: true,
                    });
                    return;
                }

                if (state.browseType === "add") {
                    dispatch(
                        "userSetting/setCustomSearchIn", {
                            id,
                            name: selectedFolderTitle,
                            type: 4
                        }, {
                            root: true
                        }
                    );
                    dispatch("togglePopupFolder", false);
                    return;
                }

                let books = [];
                books = state.selectFolder[0].next.map(
                    (a) =>
                    rootGetters["books/getSystemBasicBookByFolderId"](a.id).id || false
                );
                books.filter((b) => b);
                dispatch("freeSearchBookList/setBooksToSearchIn", books, {
                    root: true,
                });
                dispatch("freeSearchBookList/setSavedListName", selectedFolderTitle, {
                    root: true,
                });
                dispatch("togglePopupFolder", false);
                return;
            }

            if (
                folderLevel >= 2 ||
                (folderLevel == 1 && folderCatg == catInfo.TextBooks) // categoryTypeId 5 = text books
            ) {
                if (folderCatg == catInfo.YesodBooks) {
                    let books = [];
                    books = state.selectFolder[0].next.map(
                        (a) => rootGetters["books/getSystemBasicBookByFolderId"](a.id).id
                    );

                    dispatch("freeSearchBookList/setBooksToSearchIn", books, {
                        root: true,
                    });
                    dispatch("freeSearchBookList/setSavedListName", selectedFolderTitle, {
                        root: true,
                    });
                } else {
                    if (state.browseType === "add") {
                        let data = {
                            id,
                            name: selectedFolderTitle,
                            type: folderCatg === catInfo.Mefarshim ? 5 : 1,
                        };

                        dispatch("userSetting/setCustomSearchIn", data, {
                            root: true
                        });
                        dispatch("togglePopupFolder", false);
                        return;
                    }

                    if (folderCatg === catInfo.Mefarshim) {
                        let booksToSearch = {
                            meforesh: true,
                            id
                        };
                        dispatch("freeSearchBookList/setBooksToSearchIn", booksToSearch, {
                            root: true,
                        });
                        dispatch(
                            "freeSearchBookList/setSavedListName",
                            selectedFolderTitle, {
                                root: true,
                            }
                        );
                    } else
                        getSystemFoldersBooksIdListById(id, false).then((books) => {
                            dispatch("freeSearchBookList/setBooksToSearchIn", books, {
                                root: true,
                            });
                            dispatch(
                                "freeSearchBookList/setSavedListName",
                                selectedFolderTitle, {
                                    root: true,
                                }
                            );
                        });
                }
                dispatch("togglePopupFolder", false);
                dispatch("unSelectFolders");
            } else {
                dispatch("systemFolders/setFolderParentId", id, {
                    root: true,
                });
            }
            return;
        }

        //get the position if its noshim or YesodBooks or Mefarshim
        if (state.selectFolder[0].categoryTypeId <= 3) {
            switch (state.selectFolder[0].categoryTypeId) {
                // case catInfo.Mefarshim:
                //   if (lastMefsSelected != null) {
                //     state.selectFolder = lastMefsSelected;
                //     setInfo = true;
                //     lastMefsSelected = null;
                //   }
                //   break;
                // case catInfo.YesodBooks:
                //   if (lastYesodSelected != null) {
                //     state.selectFolder = lastYesodSelected;
                //     setInfo = true;
                //     lastYesodSelected = null;
                //   }
                //   break;
                case catInfo.Noshim:
                    if (lastNoshimSelected != null) {
                        state.selectFolder = lastNoshimSelected;
                        setInfo = true;
                        lastNoshimSelected = null;
                    }
                    // lastNoshimSelected = selectedFolder;
                    break;
            }
            //we need to set system folder info too
            if (setInfo) {
                let ids = [];
                let sfolder = state.selectFolder[0];
                while (sfolder) {
                    ids.push(sfolder.id);
                    sfolder = sfolder.parent;
                }
                ids.push(0); //for root folder
                ids = ids.reverse();
                dispatch(
                    "systemFolders/setSystemInfoIds", {
                        id: state.selectFolder[0].id,
                        arr: ids
                    }, {
                        root: true,
                    }
                );
            }
        }
        state.showOrder = true;

        /*  if (
          folderLevel >= 2 ||
          (folderLevel == 1 && folderCatg == catInfo.TextBooks) // categoryTypeId 5 = text books
        ) */
        if (folderCatg <= catInfo.Noshim && folderLevel >= 1) {
            if (folderCatg == catInfo.Noshim) dispatch("toggleMultiSelect", true);
            else dispatch("toggleMultiSelect", false);
            dispatch("setModeView", "tree");
            state.showOrder = false;
        } else {
            dispatch("toggleMultiSelect", false);
        }
        if (state.multiSelect && id != 3) {
            dispatch("openFolderMulti");
            return;
        }
        let payload = {
            listId: id,
            id: id,
            type: "SYSTEM_LIST",
            content: getFullTitle(state.selectFolder[0], " - "),
            meforesh: folderCatg == catInfo.Mefarshim,
            categoryTypeId: folderCatg,
            level: folderLevel,
        };

        // If at the end of the folders-list
        if (state.selectFolder[0].next.length == 0) {
            //also in selection of yesod books :
            if (folderCatg == 1 && !setInfo) {
                dispatch("openFolderYesodBooks");
                return;
            }
            // dispatch(
            //   "systemFolders/setFolderParentId",
            //   state.selectFolder[0].parent.id,
            //   {
            //     root: true,
            //   }
            // );
            dispatch("togglePopupFolder", false);
        } else
            dispatch("systemFolders/setFolderParentId", id, {
                root: true,
            });

        if (state.typePopup !== "activeStore") {
            dispatch("bookList/addUserActionToHistory", payload, {
                root: true,
            });
        }
        dispatch("unSelectFolders");
    },
    openFolderMulti({
        state,
        dispatch
    }, doSelect = false) {
        let subjects = [];
        // group1 = state.selectFolder.filter(
        //   (select) => select.level == 2 || select.level == 1
        // );
        // group2 = state.selectFolder.filter((select) => select.level == 3);

        //filter NOSIM root level
        state.selectFolder = state.selectFolder.filter((f) => f.id != 3);
        state.selectFolder.forEach((select) => {
            let group1 = [];
            let group2 = [];
            if (select.nextSelected && select.nextSelected.length > 0) {
                group2 = select.nextSelected;
            } else {
                group1.push(select);
            }
            let a = group2.filter((select) => select.level == 2);
            group2 = group2.filter((select) => select.level >= 3);
            group1 = [...group1, ...a];
            group1 = group1.map((x) => x.id);
            group2 = group2.map((x) => x.id);
            if (group1.length == 0) {
                group1 = group2;
                group2 = [];
            }
            subjects.push({
                group1,
                group2,
            });
        });

        let content = "";

        if (state.selectFolder.length > 1)
            content = VueInst.$t("folders.subMultySelect");
        //  state.selectFolder.forEach((element, index) => {
        //if (index == 0)
        else {
            content += getFullTitle(state.selectFolder[0], " - ");
            if (state.selectFolder[0].nextSelected)
                state.selectFolder[0].nextSelected.forEach((element, index) => {
                    index == 0 ?
                        (content += ": " + element.title) :
                        (content += " , " + element.title);
                });
        }
        // else content + " , " + element.title;
        //   });

        if (state.typePopup == "browse") {
            if (doSelect) {
                if (state.browseType === "add") {
                    let data = {
                        id: subjects,
                        name: content,
                        type: 6,
                    };

                    dispatch("userSetting/setCustomSearchIn", data, {
                        root: true
                    });
                    dispatch("togglePopupFolder", false);
                    return;
                }
                getSystemFoldersMultipleBooksLists(subjects, false).then((books) => {
                    dispatch("freeSearchBookList/setBooksToSearchIn", books, {
                        root: true,
                    });
                    dispatch("freeSearchBookList/setSavedListName", content, {
                        root: true,
                    });
                });

                return;
            }
        }

        let payload = {
            type: "SYSTEM_MULTIPLE_LISTS",
            content: content,
            groups: subjects,
        };

        // return;
        dispatch("bookList/addUserActionToHistory", payload, {
            root: true,
        });

        // dispatch("togglePopupFolder", false);
    },
    openFolderInSearch({
        state,
        dispatch,
        rootGetters
    }) {
        dispatch("userFolders/resetTextSearch", null, {
                root: true,
            }),
            dispatch("systemFolders/resetTextSearch", null, {
                root: true,
            });

        let id;
        let type;
        const selectedFolder = state.selectFolder[0];
        let selected = state.selectFolder[0];
        const folderLevel = selectedFolder.level;
        const folderCatg = selectedFolder.categoryTypeId;
        const listable = selected.listable;
        id = selected.id;
        if (state.selectSystem) {
            state.inSystemFolder = true;
            state.viewSystemFolder = true;
            state.viewMineFolder = false;

            //if browsing for freesearch
            if (state.typePopup == "browse") {
                let selectedFolderTitle;
                if (state.selectFolder.length > 0) {
                    selectedFolderTitle = selectedFolder.title;
                }

                if (folderCatg == catInfo.YesodBooks) {
                    if (id === 1) {
                        //main branch
                        dispatch("systemFolders/setFolderParentId", id, {
                            root: true,
                        });
                        return;
                    }

                    if (state.browseType === "add") {
                        dispatch(
                            "userSetting/setCustomSearchIn", {
                                id,
                                name: selectedFolderTitle,
                                type: 4
                            }, {
                                root: true
                            }
                        );
                        dispatch("togglePopupFolder", false);
                        return;
                    }

                    let books = [];
                    books = state.selectFolder[0].next.map(
                        (a) => rootGetters["books/getSystemBasicBookByFolderId"](a.id).id
                    );

                    dispatch("freeSearchBookList/setBooksToSearchIn", books, {
                        root: true,
                    });
                    dispatch("freeSearchBookList/setSavedListName", selectedFolderTitle, {
                        root: true,
                    });
                    dispatch("togglePopupFolder", false);
                    return;
                }

                if (
                    folderLevel >= 2 ||
                    (folderLevel == 1 && folderCatg == 5) // categoryTypeId 5 = text books
                ) {
                    if (folderCatg == 1) {
                        let books = [];
                        books = selectedFolder.next.map(
                            (a) => rootGetters["books/getSystemBasicBookByFolderId"](a.id).id
                        );

                        dispatch("freeSearchBookList/setBooksToSearchIn", books, {
                            root: true,
                        });
                        dispatch(
                            "freeSearchBookList/setSavedListName",
                            selectedFolderTitle, {
                                root: true,
                            }
                        );
                    } else {
                        if (folderCatg === catInfo.Mefarshim) {
                            let booksToSearch = {
                                meforesh: true,
                                id
                            };
                            dispatch("freeSearchBookList/setBooksToSearchIn", booksToSearch, {
                                root: true,
                            });
                            dispatch(
                                "freeSearchBookList/setSavedListName",
                                selectedFolderTitle, {
                                    root: true,
                                }
                            );
                        } else
                            getSystemFoldersBooksIdListById(id, false).then((books) => {
                                if (books.length == 0) books.push(0);
                                dispatch("freeSearchBookList/setBooksToSearchIn", books, {
                                    root: true,
                                });
                                dispatch(
                                    "freeSearchBookList/setSavedListName",
                                    selectedFolderTitle, {
                                        root: true,
                                    }
                                );
                            });
                    }
                    dispatch("togglePopupFolder", false);
                    dispatch("unSelectFolders");
                } else {
                    dispatch("systemFolders/setFolderParentId", id, {
                        root: true,
                    });
                }
                return;
            }

            if (selected.categoryTypeId == 1) {
                dispatch("openFolderYesodBooks");
                return;
            }

            let payload = {
                listId: selected.id,
                id: selected.id,
                type: "SYSTEM_LIST",
                content: selected.title,
                meforesh: selected.categoryTypeId == 2,
                categoryTypeId: selected.categoryTypeId,
            };
            if (state.typePopup !== "activeStore") {
                dispatch("bookList/addUserActionToHistory", payload, {
                    root: true,
                });
            }
            if (selected.next && selected.next.length > 0)
                dispatch("systemFolders/setFolderParentIdFromSearch", id, {
                    root: true,
                });
            else {
                dispatch("togglePopupFolder", false);
            }

            return;
        }
        type = selected.folderTypeId;
        state.viewSystemFolder = false;

        //if browsing for freesearch
        if (state.typePopup == "browse") {
            if (type == 1 && listable !== "pdfbooks") {
                dispatch("userFolders/setFolderParentIdFromSearch", id, {
                    root: true,
                });
                state.viewSystemFolder = false;
                return;
            }

            let selectedFolderTitle;
            if (state.selectFolder.length > 0) {
                selectedFolderTitle = state.selectFolder[0].title;
            }

            //set special lists title
            switch (listable) {
                case "favorites":
                    selectedFolderTitle = VueInst.$t("userDefaultFolders.favorites");
                    break;
                case "pdfbooks":
                    selectedFolderTitle = VueInst.$t("userDefaultFolders.pdfbooks");
                    break;
                case "recentbooks":
                    selectedFolderTitle = VueInst.$t("userDefaultFolders.recentbooks");
                    break;
            }

            if (listable === "recentbooks") {
                let ids = rootGetters["userRecentBooks/getRecentBooks"].map(
                    (a) => a.bookId
                );

                if (ids.length == 0) {
                    VueInst.$notify({
                        type: "error",
                        message: VueInst.$t("hiddenbooks.norecentbooks"),
                        timeout: 2000,
                    });

                    let prev = rootGetters["freeSearchBookList/getPrevSearchInType"];
                    dispatch("freeSearchBookList/setSearchInType", prev, {
                        root: true,
                    });
                    dispatch("togglePopupFolder", false);
                    return;
                } // ids.push(0);
                dispatch("freeSearchBookList/setBooksToSearchIn", ids, {
                    root: true,
                });
                dispatch("freeSearchBookList/setSavedListName", selectedFolderTitle, {
                    root: true,
                });
                dispatch("togglePopupFolder", false);
                return;
            }
            if (listable === "pdfbooks") {
                let ids = [];
                books.forEach((b) => {
                    if (b.id >= 6000000) ids.push(b.id);
                });

                if (ids.length == 0) {
                    VueInst.$notify({
                        type: "error",
                        message: VueInst.$t("myPdf.nopdfbooks"),
                        timeout: 2000,
                    });

                    let prev = rootGetters["freeSearchBookList/getPrevSearchInType"];
                    dispatch("freeSearchBookList/setSearchInType", prev, {
                        root: true,
                    });
                    dispatch("togglePopupFolder", false);
                    return;
                } // ids.push(0);

                dispatch("freeSearchBookList/setBooksToSearchIn", ids, {
                    root: true,
                });
                dispatch("freeSearchBookList/setSavedListName", selectedFolderTitle, {
                    root: true,
                });
                dispatch("togglePopupFolder", false);
                return;
            }
            if (listable === "hiddenbooks") {
                let ids = books.filter((b) => b._inHide);
                ids = ids.map((i) => i.id);
                if (ids.length == 0) {
                    VueInst.$notify({
                        type: "error",
                        message: VueInst.$t("hiddenbooks.nohiddenbooks"),
                        timeout: 2000,
                    });

                    let prev = rootGetters["freeSearchBookList/getPrevSearchInType"];
                    dispatch("freeSearchBookList/setSearchInType", prev, {
                        root: true,
                    });
                    dispatch("togglePopupFolder", false);
                    return;
                } // ids.push(0);
                dispatch("freeSearchBookList/setBooksToSearchIn", ids, {
                    root: true,
                });
                dispatch(
                    "freeSearchBookList/setSavedListName",
                    VueInst.$t("userDefaultFolders.hiddenbooks"), {
                        root: true,
                    }
                );
                dispatch("togglePopupFolder", false);
                return;
            }
            /*  cannot serach in user books
              if (listable == "userbooks") {
                let ids = books.filter((b) => b.id >= 5000000 && b.id < 6000000);
                dispatch("freeSearchBookList/setBooksToSearchIn", ids, {
                  root: true,
                });
                dispatch("freeSearchBookList/setSavedListName", selectedFolderTitle, {
                  root: true,
                });
                dispatch("togglePopupFolder", false);
                return;
              } */

            if (type == 3)
                //free search list
                getUserFreeSearchSavedList(state.selectFolder[0].id, false).then(
                    (books) => {
                        if (books.length == 0) books.push(0);
                        dispatch("freeSearchBookList/setBooksToSearchIn", books, {
                            root: true,
                        });
                        dispatch(
                            "freeSearchBookList/setSavedListName",
                            selectedFolderTitle, {
                                root: true,
                            }
                        );
                    }
                );
            //normal list
            else
                getUserSavedList(state.selectFolder[0].id, false).then((books) => {
                    if (books.length == 0) books.push(0);
                    dispatch("freeSearchBookList/setBooksToSearchIn", books, {
                        root: true,
                    });
                    dispatch("freeSearchBookList/setSavedListName", selectedFolderTitle, {
                        root: true,
                    });
                });
            dispatch("togglePopupFolder", false);
            return;
        }

        if (type == 1) {
            dispatch("userFolders/setFolderParentIdFromSearch", id, {
                root: true,
            });
            state.viewSystemFolder = false;
        } else {
            //if (type == 2) {
            if (state.typePopup == "export") return;
            let payload = {
                id: selected.id,
                listId: selected.id,
                type: "SAVED_LIST",
                content: selected.title,
            };
            /*   dispatch("bookList/addUserActionToHistory", payload, {
              root: true,
            }); */

            if (type == 3)
                dispatch("freeSearchBookList/addUserActionToHistory", payload, {
                    root: true,
                });
            else {
                dispatch("bookList/addUserActionToHistory", payload, {
                    root: true,
                });
            }

            dispatch("togglePopupFolder", false);

            // document.getElementsByClassName;
        }

        dispatch("unSelectFolders");
    },
    async openFolderYesodBooks({
        state,
        dispatch,
        rootGetters,
        localGetters,
        rootState,
    }) {
        rootState.homePage = false;
        let x = rootGetters["books/getSystemBasicBookByFolderId"](
            state.selectFolder[0].id
        );
        if (x) {
            dispatch("togglePopupFolder", false);
            let moreData = {
                pages: [],
                tsiyunim: [],
                userTsiyuns: [],
                fsResults: [],
            };

            open(x.id, 1);

            let payload2 = {
                type: "SEARCH",
                content: "",
            };
            dispatch("bookList/addUserActionToHistory", payload2, {
                root: true,
            });
        }
    },
    toggleMultiSelect({
        commit
    }, toggle) {
        commit("TOGGLE_MULTI_SELECT", toggle);
    },
    //creare user folder
    //param: folder
    createFolder({
        dispatch
    }) {
        dispatch("saveValueFolder");
        let title = state.modeEdit.value;
        dispatch("userFolders/createUserFolder", title, {
            root: true,
        });
    },
    toggleCreateFolder({
        commit,
        dispatch
    }, toggle) {
        if (toggle) {
            dispatch("unSelectFolders");
        }
        commit("TOOGLE_CREATE_FOLDER", toggle);
    },
    setSelectFolder({
        commit
    }, payload) {
        // ;
        commit("SET_SELECT_FOLDER", payload);
    },
    changeSelectByArrow({
        dispatch,
        rootgetters
    }, dir) {
        if (!state.selectFolder.length || state.selectFolder.length == 0) return;
        if (state.selectFolder.length > 1) {
            dispatch("unSelectFolders");
            return;
        }
        let id = state.selectFolder[0].id;
        let x = this.getters["folders/getCurrentListFolder"];

        let i = x.findIndex((item) => item.id == id);
        let folder;

        switch (dir) {
            case "left":
                dispatch("arrowKey", {
                    dir: "left",
                    isKey: true,
                });
                break;
            case "right":
                dispatch("arrowKey", {
                    dir: "right",
                    isKey: true,
                });
                break;
            case "top":
                dispatch("arrowKey", {
                    dir: "top",
                    isKey: true,
                });
                return;
            case "bottom":
                dispatch("arrowKey", {
                    dir: "bottom",
                    isKey: true,
                });
                return;
        }
    },
    arrowKey({
        commit
    }, dir1) {
        commit("ARROW_KEY", dir1);
    },
    unSelectFolders({
        commit,
        dispatch
    }) {
        if (state.selectFolder.length > 0 && state.modeEdit.edit) {
            if (state.modeEdit.type == "rename") {
                dispatch("renameFolder");
            }
        }
        commit("UN_SELECT_FOLDER");
    },
    unSelectFoldersById({
        commit,
        dispatch
    }, id) {
        if (state.selectFolder.length > 0 && state.modeEdit.edit) {
            if (state.modeEdit.type == "rename") {
                dispatch("renameFolder");
            }
        }
        commit("UN_SELECT_FOLDER_BY_ID", id);
    },
    unSelectNextSelectedFolders({
        commit
    }, payload) {
        commit("UN_SELECT_NEXT_SELECTED_FOLDERS", payload);
    },
    renameFolder({
        dispatch
    }) {
        dispatch("saveHistoryAction", {
            action: "rename",
            parentId: "",
            parentIdOld: "",
            folder: state.selectFolder[0],
        });
        dispatch("saveValueFolder");
        let payload = {
            title: state.modeEdit.value,
            id: state.selectFolder[0].id,
            action: "rename",
        };
        dispatch("userFolders/updateUserFolder", payload, {
            root: true,
        });
        state.modeEdit.edit = false;
        state.modeEdit.type = "";
        state.modeEdit.value = "";
    },
    toggleViewMenu({
        commit
    }, toggle) {
        if (state.typePopup == "activeStore") return;
        commit("TOGGLE_VIEW_MENU", toggle);
    },
    setValueFolder({
        commit
    }, value) {
        commit("SET_VALUE_FOLDER", value);
    },
    saveValueFolder({
        commit
    }) {
        commit("SAVE_VALUE_FOLDER");
    },
    setModeEdit({
        commit
    }, payload) {
        commit("SET_MODE_EDIT", payload);
    },
    setModeView({
        commit,
        rootGetters,
        localGetters
    }, view) {
        commit("SET_MODE_VIEW", view);
        let inSearch = rootGetters["userFolders/getTextSearchInput"];
        if (!inSearch) localStorage.setItem("mode_view", view);
    },
    cancelEdit({
        commit
    }) {
        commit("CANCEL_EDIT");
    },
    cutFolder({
        commit
    }) {
        commit("CUT_FOLDER");
    },
    pasteFolder({
        commit,
        dispatch
    }) {
        if (state.cutFolderId) {
            let payload = {
                id: state.cutFolderId,
                action: "move",
                // parentId:null
                // parentId: state.selectFolder.id
            };
            // dispatch("userFolders/updateUserFolder", payload, { root: true })
            dispatch("userFolders/moveUserFolder", payload, {
                root: true,
            });
            commit("PASTE_FOLDER");
        }
    },
    savePositionForSomeSysFolder({
        state
    }) {
        let selectedFolder = state.selectFolder[0];
        if (!selectedFolder) return;
        let parent;
        while (selectedFolder) {
            parent = selectedFolder.id;
            if (parent <= 3 && parent != 0) {
                //save loc of this folder
                switch (parent) {
                    case 1:
                        lastYesodSelected = state.selectFolder;
                        break;
                    case 2:
                        lastMefsSelected = state.selectFolder;
                        break;
                    case 3:
                        lastNoshimSelected = state.selectFolder;
                        break;
                }
                break;
            }
            selectedFolder = selectedFolder.parent;
        }
    },
    togglePopupFolder({
        commit,
        dispatch,
        state,
        getters
    }, toggle) {
        if (!toggle) {
            dispatch("savePositionForSomeSysFolder");
        }
        commit("TOGGLE_POPUP_FOLDER", toggle);
        // if (
        //   state.multiSelect &&
        //   state.selectFolder.length &&
        //   state.selectFolder[0].categoryTypeId == 3
        // )
        // if (!toggle) {
        //   //reset folder info when close on noshim
        //   dispatch("resetAllStateFolders");
        //   return;
        // } else if (state.listType != "book") {
        //   dispatch("resetAllStateFolders");
        // }
        if (resetList && toggle == false) {
            dispatch("bookList/goToHistory", {
                id: 1
            }, {
                root: true
            });
        }
        if (!toggle) dispatch("resetAllStateFolders");
        let view = localStorage.getItem("mode_view");

        if (!view) {
            localStorage.setItem("mode_view", "symbol");
            commit("SET_MODE_VIEW", "symbol");
            return;
        }
        // ;
        if (view == "tree") {
            const allowTree = getters.getAllowTree;
            if (allowTree) commit("SET_MODE_VIEW", view);
            else commit("SET_MODE_VIEW", "symbol");
        } else commit("SET_MODE_VIEW", view);
        // if (state.selectFolder.length && state.selectFolder[0].categoryTypeId  0) {
    },
    setOpenTypePopup({
        commit
    }, type) {
        return new Promise(function(resolve, reject) {
            resolve(commit("SET_TYPE_POPUP", type));
        });
    },
    setBrowseType({
        commit
    }, type) {
        return new Promise(function(resolve, reject) {
            resolve(commit("SET_BROWSE_TYPE", type));
        });
    },
    setListType({
        commit
    }, type) {
        return new Promise(function(resolve, reject) {
            resolve(commit("SET_LIST_TYPE", type));
        });
    },

    setOrderBy({
        commit
    }, orderBy) {
        commit("SET_ORDER_BY", orderBy);
    },
    setFoldersPrevParentId({
        dispatch,
        rootGetters,
        localGetters
    }, id) {
        // let id1 = id
        if (!state.inSystemFolder) {
            let x = rootGetters["userFolders/getParentsFolderTree"];
            if (!x || x.length <= 2) {
                state.viewSystemFolder = true;
                state.inSystemFolder = false;
            }
            dispatch("userFolders/setFoldersPrevParentId", id, {
                root: true,
            });
            // let x = rootgetters["userFolders/getParentsFolderTree"]
        } else {
            let x = rootGetters["systemFolders/getParentsFolderTree"];
            if (!x || x.length <= 2) {
                state.viewMineFolder = true;
                state.inSystemFolder = false;
            }
            dispatch("systemFolders/setFoldersPrevParentId", id, {
                root: true,
            });
            // let x = rootgetters["systemFolders/getParentsFolderTree"]
        }
    },
    setFoldersPrevParentById({
        dispatch,
        rootGetters,
        localGetters
    }, id) {
        // let id1 = id
        if (!state.inSystemFolder) {
            dispatch("userFolders/setFoldersPrevParentId", id, {
                root: true,
            });
            let x = rootGetters["userFolders/getParentsFolderTree"];
            if (!x) {
                state.viewSystemFolder = true;
                state.inSystemFolder = false;
            }
            // let x = rootgetters["userFolders/getParentsFolderTree"]
        } else {
            dispatch("systemFolders/setFoldersParentIdById", id, {
                root: true,
            });
            let x = rootGetters["systemFolders/getParentsFolderTree"];
            if (!x) {
                state.viewMineFolder = true;
                state.inSystemFolder = false;
            }
            // let x = rootgetters["systemFolders/getParentsFolderTree"]
        }
    },
    resetAllStateFolders({
        dispatch,
        commit
    }) {
        // resetFolderParentId
        commit("RESET_ALL");
        // if (state.viewMineFolder && state.viewSystemFolder) return
        // if (state.inSystemFolder)
        dispatch("userFolders/setSearchTo", "", {
                root: true,
            }),
            dispatch("systemFolders/setSearchTo", "", {
                root: true,
            });
        dispatch("systemFolders/resetFolderParentId", null, {
            root: true,
        });
        // else
        dispatch("userFolders/resetFolderParentId", null, {
            root: true,
        });
    },
    setIconFolder({
        dispatch
    }, icon) {
        let payload = {
            icon: icon,
            id: state.selectFolder[0].id,
            action: "icon",
        };
        dispatch("userFolders/updateUserFolder", payload, {
            root: true,
        });
    },
    setPinTop({
        dispatch
    }) {
        if (!state.selectFolder.length || state.selectFolder.length == 0) return;
        let pin;
        if (state.selectFolder[0].pin == 0) pin = 1;
        else pin = 0;
        let payload = {
            pin: pin,
            id: state.selectFolder[0].id,
            action: "pin",
        };
        dispatch("userFolders/updateUserFolder", payload, {
            root: true,
        });
    },
    saveHistoryAction() {
        return;
    },
    userFolderListDeleteBooks({
        dispatch
    }, folder) {
        dispatch("userFolders/userFolderListDeleteBooks", folder, {
            root: true,
        });
    },
    deleteFolder({
        dispatch
    }, id) {
        dispatch("userFolders/deleteUserFolder", id, {
            root: true,
        });
        dispatch("unSelectFolders");
    },
};
export const getters = {
    getBrowseType(state) {
        return state.browseType;
    },
    viewPopup(state) {
        return state.openPopup;
    },
    getAllowTree(state) {
        let allowTree = false;
        if (
            state.selectFolder.length &&
            state.selectFolder[0].categoryTypeId &&
            state.selectFolder[0].categoryTypeId <= 3
        ) {
            allowTree = true;
        }
        return allowTree;
    },
    getParentsFolderTree(state, localgetters, rootstate, rootgetters) {
        if (state.inSystemFolder)
            return rootgetters["systemFolders/getParentsFolderTree"];
        return rootgetters["userFolders/getParentsFolderTree"];
    },
    getCurrentListFolder(state, localgetters, rootstate, rootgetters) {
        let fold = rootgetters["userFolders/getFolders"];
        //maybe in the future we will add. for now we hide some folder types
        let itemsToShow = [
            "book",
            "favorites",
            "recentbooks",
            "qckbtn",
            "hiddenbooks",
            "userbooks",
            "pdfbooks",
        ];
        fold = fold.filter(
            (i) =>
            itemsToShow.includes(i.listable) &&
            !(
                state.typePopup == "browse" && ["userbooks", "hiddenbooks"].includes(i.listable)
            )
        );

        if (!fold || fold.length == 0) return [];
        let order = state.orderBy;
        let lst = fold.slice().sort((item, selected) => {
            //sort regular & system user folders

            if (selected.listable == "favorites") {
                return 1;
            } else if (item.listable == "favorites") {
                return -1;
            }

            if (selected.listable == "recentbooks") {
                return 1;
            } else if (item.listable == "recentbooks") {
                return -1;
            }
            if (selected.listable == "book" && item.listable != "book") {
                return -1;
            } else if (item.listable == "book" && selected.listable != "book") {
                return 1;
            }
            if (selected.listable == "qckbtn") {
                return 1;
            } else if (item.listable == "qckbtn") {
                return -1;
            }

            //sort folders and files
            if (selected.folderTypeId == 2 && item.folderTypeId == 1) {
                return -1;
            } else if (item.folderTypeId == 2 && selected.folderTypeId == 1) {
                return 1;
            }

            if (!item.pin && selected.pin) return 1;
            if (item.pin && !selected.pin) return -1;
            switch (order) {
                case "name":
                    return item.title.localeCompare(selected.title);
                case "date":
                    return item.createdAt > selected.createdAt ? -1 : 1;
                    //item.updated_date.localeCompare(selected.updated_date);
                case "type":
                    return item.folderTypeId > selected.folderTypeId ? -1 : 1;
            }
            return 0;
        });

        return lst;
    },
    getCurrentListFolderSystem: (
        state,
        localgetters,
        rootstate,
        rootgetters
    ) => () => {
        let fold = rootgetters["systemFolders/getSystemFoldersGetters"]();
        if (!fold || fold.length == 0) return [];
        return fold;
    },
    getCreateFolder(state) {
        return state.createFolder;
    },
    getShowOrder(state) {
        return state.showOrder;
    },
    getSelectFolder(state) {
        if (state.selectFolder.length == 0) return [];
        return state.selectFolder;
    },
    getSelectFolderLast(state) {
        if (!state.selectFolder.length || state.selectFolder.length == 0) return [];
        return state.selectFolder[state.selectFolder.length - 1];
    },
    hasSelectSystemFolder(state) {
        if (state.selectSystem) return true;
        return false;
    },
    getIdSelectFolder(state) {
        if (state.selectFolder.length > 0) return state.selectFolder[0].id;
    },
    getNameSelectFolder(state) {
        if (!state.selectFolder || state.selectFolder.length == 0) return null;
        return state.selectFolder[0].title;
    },
    hasViewMenu(state) {
        return state.viewMenu;
    },
    getModeEdit(state) {
        return state.modeEdit;
    },
    isFocusFolders(state) {
        return state.inFocus;
    },
    getTypePopup(state) {
        return state.typePopup;
    },
    getListType(state) {
        return state.listType;
    },
    getOrderBy(state) {
        return state.orderBy;
    },
    hasViewSystemFolder(state) {
        return state.viewSystemFolder;
    },
    hasViewMineFolder(state) {
        return state.viewMineFolder;
    },
    getAllListCurrent(state, localgetters, rootstate, rootgetters) {
        let list = [];
        let system = [];
        let folders = [];
        if (state.viewSystemFolder) {
            folders = rootgetters["folders/getCurrentListFolderSystem"]();
        }
        if (state.viewMineFolder) {
            system = rootgetters["folders/getCurrentListFolder"];
        }
        list = [...folders, ...system];
        return list;
    },
    hasCutFolder(state) {
        if (state.cutFolderId) return true;
        return false;
    },
    inSystemFolder(state) {
        return state.inSystemFolder;
    },
    pinSelected(state) {},
    isKeyArrow(state) {
        return state.arrowKey;
    },
    getModeView(state) {
        return state.modeView;
    },
};

function getParentTitle(p, deleimiter) {
    if (!p.parent) return p.title;
    return getParentTitle(p.parent, deleimiter) + deleimiter + p.title;
}