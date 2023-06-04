import Vue from "vue";
import init from "@/config/init.js";
import * as userFoldersData from "@/services/userFoldersData.js";
/**
 * this module handles user folders
 *
 * @module userFolders
 * @author Yaell Sella
 */
export const namespaced = true;

//state
export const state = {
    textSearch: "",
    //server insert the user folders in the login
    folders: [],
    currentFolder: [],
    //currParentFolder
    currentFolderId: 0,
    //array of parents ids of the current folder content
    treeIds: [],
    //enum of folders types are numbered to send to the server in create the types of folders in numbers
    enumFoldersType: {
        //user folder
        folder: 1,
        //user saved list of books
        booklist: 2,
        freelist: 3,
        desktop: 4,
    },
};

//mutations
export const mutations = {
    //reset text search
    RESET_TEXT_SEARCH(state) {
        state.textSearch = "";
    },
    //set the text search to apdate list books of search result
    SET_SEARCH_TO(state, txtSearch) {
        state.textSearch = txtSearch;
    },
    //creare user folder
    //param: folder
    async CREATE_USER_FOLDER(state, folder) {
        //send the param to services/userFoldersData to create
        let success = await userFoldersData.addUserFolder(folder);

        return success;
    },
    //update user folder
    //param: folder
    UPDATE_USER_FOLDER(state, folder) {
        //send the param to services/userFoldersData to update
        userFoldersData.updateUserFolder(folder);
    },
    //delete user folder
    //param: folder id
    DELETE_USER_FOLDER(state, id) {
        //send the param to services/userFoldersData to delete
        userFoldersData.deleteUserFolder(id);
    },
    //move user folder
    //param: folder
    MOVE_USER_FOLDER(state, folder) {
        //send the param to services/userFoldersData to move the folder
        userFoldersData.moveUserFolder(folder);
    },
    //USER_FOLDER_LIST_ADD_BOOKS
    USER_FOLDER_LIST_ADD_BOOKS(state, folder) {
        //send the param to services/userFoldersData to move the folder
        userFoldersData.userFolderListAddBooks(folder);
    },
    //USER_FOLDER_LIST_DELETE_BOOKS
    USER_FOLDER_LIST_DELETE_BOOKS(state, folder) {
        //send the param to services/userFoldersData to move the folder
        userFoldersData.userFolderListDeleteBooks(folder);
    },
    RESET_FOLDER_PARENT_ID(state) {
        //

        state.treeIds = state.treeIds.slice(0, 1);
        //set the current id to find the content
        state.currentFolderId = state.treeIds[0];
    },
    //set folder parent id when user get in folder to get the content inside by click on it
    //param:id
    SET_FOLDER_PARENT_ID(state, id) {
        //push the param in to the ids array
        state.treeIds.push(id);
        state.treeIds = [...new Set(state.treeIds)];
        //set the current id to find the content
        state.currentFolderId = id;
    },
    //set folder parent id when user get out to prev folder to get the content inside
    SET_FOLDERS_PREV_PARENT_ID(state) {
        //delete the last value in the array
        state.treeIds.pop();
        //set curr id to the updated last value
        state.currentFolderId = state.treeIds[state.treeIds.length - 1];
    },
    //set folder parent id when user get in folder from search
    SET_FOLDER_PARENT_ID_FROM_SEARCH(state, id) {
        state.treeIds.splice(1, 0, id);
        //set curr id to the updated last value
        state.currentFolderId = state.treeIds[state.treeIds.length - 1];
    },
    SET_FOLDERS_DATA(state, data) {
        state.folders = data;
        state.currentFolder = data;
        //currentFolderId-to get the main folder-the first parent
        state.currentFolderId = data[0].id;
        //array of parent of content- the first one will be allays the main folder
        state.treeIds = [data[0].id];
    },
    //UPDATE_FOLDERS
    UPDATE_FOLDERS(state, data) {
        state.folders = data;
    },
};

//actions
export const actions = {
    //calles the mutation SET_SEARCH_TO -to set text search
    setSearchTo({
        commit
    }, txtSearch) {
        commit("SET_SEARCH_TO", txtSearch);
    },
    //resetTextSearch
    resetTextSearch({
        commit
    }) {
        commit("RESET_TEXT_SEARCH");
    },
    setFoldersData({
        dispatch
    }) {
        return new Promise(function(resolve, reject) {
            userFoldersData
                .getUserFolders()
                .then((r) => {
                    if (r.data.length > 0) dispatch("setData", r.data);
                    resolve(true);
                })
                .catch((error) => {
                    //    if (error.response.status !== 404) {
                    console.error(error);
                    reject(false);
                    //  } else resolve(true);
                });
        });
        //commit("SET_FOLDERS_DATA", data);
    },
    setData({
        commit
    }, data) {
        let tmp = [];
        tmp.push(addParentsInfo(data[0]));
        commit("SET_FOLDERS_DATA", tmp);
    },
    refreshFolders({
        commit
    }) {
        return new Promise(function(resolve, reject) {
            userFoldersData
                .getUserFolders()
                .then((r) => {
                    if (r.length > 0) dispatch("setData", r.data);
                    commit("UPDATE_FOLDERS", r.data);
                    resolve(true);
                })
                .catch((error) => {
                    // if (error.response.status !== 404) {
                    console.error(error);
                    reject(false);
                    //   } else resolve(true);
                });
        });
    },
    updateFolders({
        commit,
        dispatch
    }, data) {
        commit("UPDATE_FOLDERS", data);
        dispatch("quickButtons/setQuickButtonsData", null, {
            root: true,
        });
    },
    //creare user folder
    //param: title
    createUserFolder({
        commit
    }, title) {
        //get the parentid from the curr folderid that the user is in to place the folder in it
        let parentid = state.currentFolderId;
        //the type of folder inserted from the enum in state in numbers- in this case regular folder-1
        let foldertypeid = state.enumFoldersType.folder;
        //folder payload
        let folder = {
            //gettin the title-folder name from the user input
            title: title,
            //gettin from state curr parent id to know where to create the new folder
            parentid,
            //folder's type in number
            foldertypeid,
        };

        //send the request to the mutation CREATE_USER_FOLDER
        commit("CREATE_USER_FOLDER", folder);
    },
    //create saved list- a list od book that the user choose to save in a folder
    //param:folder:object
    //the data of the folder that the component send :title-a name of the list(the user name it),
    //books-array of ids of the chosen books
    //the action add to the folder the data:parentid- where to put the new saved list
    //foldertypeid-the type of folder(send it in numbers from enumFoldersType)
    async createUserFolderSavedList({
        commit,
        getters
    }, folder) {
        let parentid = state.currentFolderId;
        //the type of folder inserted from the enum in state in numbers- in this case folder saved list of books-2
        let listType = getters.getListType;
        let saveType;
        switch (listType) {
            case "book":
                {
                    saveType = state.enumFoldersType.booklist;
                    break;
                }
            case "free":
                {
                    saveType = state.enumFoldersType.freelist;
                    break;
                }
        }
        let foldertypeid = saveType;
        //folder payload
        folder = {
            title: folder.title,
            books: folder.books,
            //get from state curr parent id to know where to create the new folder of the saved list
            parentid,
            //folder's type in number
            foldertypeid,
        };
        //send the request to the mutation CREATE_USER_FOLDER
        //let success = await commit("CREATE_USER_FOLDER", folder);

        let success = await userFoldersData.addUserFolder(folder);

        return success;
    },
    //update user folder
    //param: folder
    updateUserFolder({
        commit
    }, folder) {
        //send the request to the mutation UPDATE_USER_FOLDER
        commit("UPDATE_USER_FOLDER", folder);
    },
    //delete user folder
    //param: folder id
    deleteUserFolder({
        commit
    }, id) {
        //send the request to the mutation DELETE_USER_FOLDER
        commit("DELETE_USER_FOLDER", id);
    },
    //move user folder
    //param: folder
    moveUserFolder({
        commit
    }, folder) {
        folder.parentId = state.currentFolderId;
        //send the request to the mutation MOVE_USER_FOLDER
        commit("MOVE_USER_FOLDER", folder);
    },
    userFolderListAddBooks({
        commit
    }, folder) {
        //send the request to the mutation USER_FOLDER_LIST_ADD_BOOKS

        commit("USER_FOLDER_LIST_ADD_BOOKS", folder);
    },
    userFolderListDeleteBooks({
        commit
    }, folder) {
        //send the request to the mutation MOVE_USER_FOLDER
        commit("USER_FOLDER_LIST_DELETE_BOOKS", folder);
    },
    resetFolderParentId({
        commit
    }) {
        //send the request to the mutation SET_FOLDER_PARENT_ID
        commit("RESET_FOLDER_PARENT_ID");
    },

    //set folder parent id when user get in folder to get the content inside by click on it
    //param:id
    setFolderParentId({
        commit
    }, id) {
        //send the request to the mutation SET_FOLDER_PARENT_ID
        commit("SET_FOLDER_PARENT_ID", id);
    },
    //set folder id from dblclick on folder from search folder result
    //param:folder id
    setFolderParentIdFromSearch({
        commit
    }, id) {
        //call the mutation RESET_FOLDER_PARENT_ID
        commit("RESET_FOLDER_PARENT_ID");
        let currId = id;
        let firstId = state.treeIds[0];
        //while the current id not equel to the first id in the array:
        while (currId != firstId) {
            //find in the recursive function searchParentsIdTree the folder by its id
            let currF = searchParentsIdTree(state.folders[0], currId);
            //call the mutation SET_FOLDER_PARENT_ID_FROM_SEARCH to
            //insert the id to the ids array
            commit("SET_FOLDER_PARENT_ID_FROM_SEARCH", currId);
            //set the current id to its parent id to keep trackin
            //'till we get the first parent id in the tree
            currId = currF.parentId;
        }
    },
    //set folder parent id when user get out to prev folder to get the content inside
    //param: id
    setFoldersPrevParentId({
        commit
    }, id) {
        //return to skip this action if the user in the main folders
        if (state.treeIds.length < 2) return;
        //send the request to the mutation SET_FOLDERS_PREV_PARENT_ID-
        //happends when user go back to the prev parent content
        if (id == 0) return commit("SET_FOLDERS_PREV_PARENT_ID");
        //the user can "travel" throu prev parents folders
        //if that happends it will send the request to the mutation SET_FOLDERS_PREV_PARENT_ID-
        //to delete each time the last parent id in the idsTree array
        let ids = state.treeIds;
        while (ids[ids.length - 1] != id) commit("SET_FOLDERS_PREV_PARENT_ID");
    },
};
//recursive function to find a system folder in tree by id
export function searchParentsIdTree(folder, id) {
    if (folder.id == id) {
        return folder;
    } else if (folder.next != null) {
        var i;
        var result = null;
        for (i = 0; result == null && i < folder.next.length; i++) {
            result = searchParentsIdTree(folder.next[i], id);
        }
        return result;
    }
    return null;
}
//recursive function to get the tree folders in one array
//use for search results
export function flattenFolders(data) {
    if (data == undefined || data.length == 0) data = state.folders[0].next;
    return data.reduce(function(result, next) {
        if (next.next.length > 0) {
            result = result.concat(flattenFolders(next.next));
            result.push(next);
            //next.next = [];
        } else {
            result.push(next);
        }
        return result;
    }, []);
}
//getters
export const getters = {
    getListType(state, getters, rootState, rootGetters) {
        return rootGetters["folders/getListType"];
    },
    getTextSearchInput(state) {
        return state.textSearch;
    },
    getFolders(state, getters) {
        if (state.textSearch == null || state.textSearch == "") {
            return getters.getContentInFolder;
        }
        return getters.getFoldersBySearchInput;
    },
    getFoldersBySearchInput(state) {
        let str = state.textSearch;
        str = str.replace(/\s*$/, "");
        let results = [];
        let currFolder = state.currentFolder.next;
        let allCurrentFoldersTree = flattenFolders(currFolder);
        allCurrentFoldersTree.forEach((folder) => {
            if (folder.title.includes(str)) {
                results.push(folder);
            }
        });
        return results;
    },

    //getter so the user can see all the parents folder of content
    getParentsFolderTree(state) {
        //if the user in the main folder or there is no folders return
        if (!state.folders.length > 0 || state.folders === undefined) return;
        //parents ids of current content
        let ids = state.treeIds;
        let pFolders = state.folders; //.slice(0);
        let parentsTree = [];
        parentsTree.push(pFolders[0]);
        pFolders = pFolders[0].next;
        for (let i = 1; ids.length > i; i++) {
            pFolders = pFolders.find((folder) => folder.id == ids[i]);
            parentsTree.push(pFolders);
            if (pFolders.id == state.currentFolderId) {
                return parentsTree;
            } else pFolders = pFolders.next;
        }
    },
    //this getter is activate by the parents folder to get the content in the current place
    getContentInFolder(state) {
        //if the user in the main folder or there is no folders return
        //if (!state.folders.length > 0 || state.folders === undefined) return [];
        let pFolder = state.folders.slice(0);
        let ids = state.treeIds;
        //for loop through the ids array of parents content
        for (let i = 0; ids.length > i; i++) {
            //find the parent
            pFolder = pFolder.find((folder) => folder.id == ids[i]);
            //if the parrent is the current parent return next-the content
            if (pFolder.id == state.currentFolderId) {
                state.currentFolder = pFolder;

                return pFolder.next;
            }
            //else - if we found the parent but its 1+ above the content get inside
            //to loop again to find the next parent in the array
            else pFolder = pFolder.next;
        }
    },
};

export function addParentsInfo(data) {
    //if no next so juest ret
    if (!data || data.next.length < 1) return data;
    //loop over the items
    for (let i = 0; i < data.next.length; i++) {
        //add item parent
        data.next[i]["parent"] = data;
        //go to child
        addParentsInfo(data.next[i]);
    }

    return data;
}