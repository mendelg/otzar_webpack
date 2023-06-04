import VueInst from "@/main_app.js";
export const namespaced = true;
/**
 * this module handles system folders
 *
 * @module systemFolders
 * @author Yaell Sella
 */
export let basicBooks = {};

export let setBasicBooks = (books) => {
    basicBooks = books;
};

export let systemFolders = {
    title: "תיקיה ראשית",
    id: 0,
    next: [],
};
//array of current folder content
export let currentFolder = [];

//state
export const state = {
    counterSys: 0,
    //text search
    textSearch: "",
    //currParentFolder
    currentFolderId: 0,
    //array of parents ids of the current folder content
    treeIds: [0],
};
export const mutations = {
    //reset text search
    RESET_TEXT_SEARCH(state) {
        state.textSearch = "";
    },
    //set the text search to apdate list books of search result
    SET_SEARCH_TO(state, txtSearch) {
        state.textSearch = txtSearch;
    },
    //reset tree ids to get the main folders content
    RESET_FOLDER_PARENT_ID(state) {
        //set the tree
        state.treeIds = state.treeIds.slice(0, 1);
        //set the current id to find the content
        state.currentFolderId = state.treeIds[0];
    },
    SET_FOLDER_PARENT_ID(state, id) {
        let pFolder = systemFolders.next;
        let ids = JSON.parse(JSON.stringify(state.treeIds));
        let treeFolder = [];
        let counter = 1;
        let newIds = [0];
        while (1) {
            let tmpFolder = pFolder.find((folder) => folder.id == id);
            if (tmpFolder) {
                pFolder = tmpFolder;
                treeFolder.push(pFolder.next);
                newIds.push(id);
                break;
            } else {
                pFolder = pFolder.find((folder) => folder.id == ids[counter]);
                treeFolder.push(pFolder.next);
                newIds.push(ids[counter]);
                counter++;
                pFolder = pFolder.next;
            }
        }

        //push the param in to the ids array
        // state.treeIds.push(id);
        state.treeIds = newIds;
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
    //set folder parents ids from search to build the path through parents ids
    SET_FOLDER_PARENT_ID_FROM_SEARCH(state, id) {
        state.treeIds.splice(1, 0, id);
        state.currentFolderId = state.treeIds[state.treeIds.length - 1];
    },
};
export const actions = {
    removeFromTreeIds({
        state
    }, id) {
        state.treeIds = state.treeIds.filter((t) => t != id);
    },
    setSystemInfoIds({
        state
    }, {
        arr,
        id
    }) {
        state.currentFolderId = id;
        state.treeIds = arr;
    },
    //calles the mutation SET_SEARCH_TO -to set text search
    setSearchTo({
        commit
    }, txtSearch) {
        commit("SET_SEARCH_TO", txtSearch);
    },
    resetTextSearch({
        commit
    }) {
        commit("RESET_TEXT_SEARCH");
    },
    resetFolderParentId({
        commit
    }) {
        //send the request to the mutation SET_FOLDER_PARENT_ID
        commit("RESET_FOLDER_PARENT_ID");
    },
    /**
     * set parent id, add id to the treeids
     * @param {Number} id
     */
    setFolderParentId({
        commit
    }, id) {
        //send the request to the mutation SET_FOLDER_PARENT_ID
        commit("SET_FOLDER_PARENT_ID", id);
    },
    /**
     * set folder parent id when user get out to prev folder to get the content inside
     * @param {Number} id
     */
    setFoldersParentIdById({
        commit
    }, id) {
        //return to skip this action if the user in the main folders
        if (state.treeIds.length < 1) return;
        //the user can "travel" throu prev parents folders
        //if that happends it will send the request to the mutation SET_FOLDERS_PREV_PARENT_ID-
        //to delete each time the last parent id in the idsTree array
        let ids = state.treeIds;
        while (ids[ids.length - 1] != id) commit("SET_FOLDERS_PREV_PARENT_ID");
    },
    /**
     * set folder parent id when user get out to prev folder to get the content inside
     * @param {Number} id
     */
    setFoldersPrevParentId({
        commit
    }) {
        //return to skip this action if the user in the main folders
        if (state.treeIds.length < 1) return;
        //send the request to the mutation SET_FOLDERS_PREV_PARENT_ID-
        //happends when user go back to the prev parent content
        commit("SET_FOLDERS_PREV_PARENT_ID");
    },
    /**
     * set folder parent id when user "travel" throu tree open folders- get the content
     * inside the chosen folder
     * @param {Object} payload (parentId, id)
     */
    setFoldersOpenTree({
        commit
    }, payload) {
        //return to skip this action if the user in the main folders
        if (state.treeIds.length < 1) return;
        //the user can "travel" throu tree open folders
        //if the chosen  folder is in prev folders
        // it will send the request to the mutation SET_FOLDERS_PREV_PARENT_ID-
        //to delete each time the last parent id in the idsTree array
        let ids = state.treeIds;
        while (ids[ids.length - 1] != payload.parentId)
            commit("SET_FOLDERS_PREV_PARENT_ID");
        //when the folder got in his parent folder in the array
        //the folder is in the current content send the request to the mutation SET_FOLDER_PARENT_ID
        commit("SET_FOLDER_PARENT_ID", payload.id);
    },
    //set folder parent id after enter folder from search result
    //param:id- the chosen foledr id
    setFolderParentIdFromSearch({
        commit
    }, id) {
        //reset parents folders ids array
        commit("RESET_FOLDER_PARENT_ID");
        //RESET_TEXT_SEARCH
        let currId = id;
        let firstId = state.treeIds[0];
        //while the current id not equel to the first id in the array:
        while (currId != firstId) {
            //find in the recursive function searchParentsIdTree the folder by its id
            let currF = searchParentsIdTree(systemFolders, currId);
            //call the mutation SET_FOLDER_PARENT_ID_FROM_SEARCH to
            //insert the id to the ids array
            commit("SET_FOLDER_PARENT_ID_FROM_SEARCH", currId);
            //set the current id to its parent id to keep trackin
            //'till we get the first parent id in the tree
            currId = currF.parentId;
        }
    },
};
/**
 * recursive function to find a system folder in tree by id
 * @param {Object} folder system folders tree
 * @param {Number} id folder id that we want to fint in system folders
 */
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
/**
 * recursive function to get the tree array folders in one array
 * use for search results
 * @param {Array} data
 */

export function flattenFolders(data) {
    if (data == undefined || data.length == 0) data = systemFolders.next;
    return data.reduce(function(result, next) {
        if (next.next.length > 0) {
            result = result.concat(flattenFolders(next.next));
            // let payload1 = {
            //   id: next.id,
            //   title: next.title,
            //   level: next.level,
            //   position: next.position,
            //   parentId: next.parentId,
            //   categoryTypeId: next.categoryTypeId,
            //   next: true,
            // };
            // result.push(payload1);
            result.push(next);
        } else {
            // let payload2 = {
            //   id: next.id,
            //   title: next.title,
            //   level: next.level,
            //   position: next.position,
            //   parentId: next.parentId,
            //   categoryTypeId: next.categoryTypeId,
            //   next: false,
            // };
            // result.push(payload2);
            result.push(next);
        }
        return result;
    }, []);
}

//getters
export const getters = {
    getCounter(state) {
        return state.counterSys;
    },
    //get the folder of basic books
    getSystemFolderOfBasicBooks(state) {
        return systemFolders.next.find((sf) => sf.categoryTypeId == 1);
    },
    //get text search input
    getTextSearchInput(state) {
        return state.textSearch;
    },
    //get system folders tree
    getSystemFolders(state) {
        return systemFolders;
    },
    //get system folders maagarim
    getSystemMaagarim: (state) => {
        return systemFolders.next[3].next;
    },
    //getter for getters
    getSystemFoldersGetters: (state, getters) => () => {
        let count = getters.getCounter;
        //if the text search is empty
        if (
            state.textSearch == null ||
            state.textSearch == "" ||
            state.textSearch.length < 2
        ) {
            //return getSystemFoldersContentByParentId
            return getters.getSystemFoldersContentByParentId();
        }
        //if its not empty-
        //return getSystemFoldersBySearchInput
        return getters.getSystemFoldersBySearchInput();
    },
    //get system folders from text search result
    getSystemFoldersBySearchInput: (state) => () => {
        if (state.textSearch == null || state.textSearch == "") return;
        let str = state.textSearch;
        str = str.replace(/\s*$/, "");
        let results = [];
        let currFolder = currentFolder;
        if (currFolder == undefined || currFolder.length == 0)
            currFolder = systemFolders.next;
        //flatten system folders from tree array
        let allCurrentFoldersTree = flattenFolders(currFolder);
        //loop through the system folders
        allCurrentFoldersTree.forEach((folder) => {
            //if folder title includes text search
            if (folder.title.includes(str)) {
                //push the folder to the results array
                results.push(folder);
            }
        });
        // return results array
        return results;
    },

    //get parents folder of content
    getParentsFolderTree(state) {
        //if there is no folders return
        if (!systemFolders.next.length > 0) return [];
        //parents ids of current content
        let ids = state.treeIds;
        let pFolders = systemFolders.next;
        //the array of all parents of content
        let parentsTree = [];
        parentsTree.push(systemFolders);

        for (let i = 1; ids.length > i; i++) {
            //find the folder by the ids[i]
            pFolders = pFolders.find((folder) => folder.id == ids[i]);

            let folder = {
                id: pFolders.id,
                title: pFolders.title,
                level: pFolders.level,
                position: pFolders.position,
                parentId: pFolders.parentId,
                categoryTypeId: pFolders.categoryTypeId,
            };
            //push it to parentsTree array
            parentsTree.push(folder);
            if (i == ids.length - 1) {
                return parentsTree;
            } else pFolders = pFolders.next;
        }
    },
    //get currant content folder
    getSystemFoldersContentByParentId: (state) => () => {
        //if the user in the main folder or there is no folders return
        //if (!state.systemFolders.length > 0 || state.folders === undefined) return;
        let pFolder = systemFolders.next;
        let ids = state.treeIds;
        //sort the main folders
        pFolder.sort(function(a, b) {
            return a.categoryTypeId - b.categoryTypeId;
        });
        if (ids.length == 1) {
            currentFolder = pFolder.next;
            return pFolder;
        }
        //for loop through the ids array of parents content
        for (let i = 1; ids.length > i; i++) {
            //find the parent
            pFolder = pFolder.find((folder) => folder.id == ids[i]);
            //if the parrent is the current parent return next-the content
            if (i == ids.length - 1) {
                currentFolder = pFolder.next;
                return pFolder.next;
            }
            //else - if we found the parent but its 1+ above the content get inside
            //to loop again to find the next parent in the array
            else pFolder = pFolder.next;
        }
    },
    //getter so the user can see all the parents folder of content
    getSystemFoldersOpenTree(state) {
        let pFolder = systemFolders.next;
        let ids = state.treeIds;
        let treeFolder = [];
        if (ids.length == 1) return pFolder.next;
        //for loop through the ids array of parents content
        for (let i = 1; ids.length > i; i++) {
            //find the parent folder by the ids[i]
            pFolder = pFolder.find((folder) => folder.id == ids[i]);
            //insert the array to treeFolder array
            treeFolder[i - 1] = pFolder.next;
            pFolder = pFolder.next;
        }
        let str = state.textSearch;
        if (str) {
            str = str.replace(/\s*$/, "");
            let results = {};
            let currFolder = treeFolder;
            if (currFolder == undefined || currFolder.length == 0)
                currFolder = systemFolders.next;
            //flatten system folders from tree array
            let allCurrentFoldersTree = flattenFolders(currFolder[0]);
            //loop through the system folders
            allCurrentFoldersTree.forEach((folder) => {
                //if folder title includes text search
                if (folder.title.includes(str)) {
                    if (folder.level == 1) results[folder.id] = folder;
                    else results[folder.parentId] = folder.parent;
                }
            });
            // return results array
            let res = [];
            Object.keys(results).forEach((k) => {
                res.push(results[k]);
            });

            return [res];
        }
        return treeFolder;
    },
};