import {
    Axios
} from "@/services/_axios";
import init from "@/config/init.js";
import * as systemFolders from "@/store/modules/systemFolders.js";
import * as bookList from "@/store/modules/bookList.js";
import {
    addParentsInfo
} from "@/store/modules/userFolders";
import {
    inflate
} from "pako";
//get full title of folder - include parents titles
export function getFullTitle(folderParent, deleimiter = ">") {
    // let parentName = "";
    // let tmpParent = folderParent[0].parent;
    // while (tmpParent) {
    //   parentName = tmpParent.title;
    //   tmpParent = tmpParent.parent;
    // }
    // let name = "";
    // //now get all folders name;
    // folderParent.forEach((p) => {
    //   let name = p.title;
    //   if (p.nextSelected) {
    //     name += deleimiter;
    //     p.nextSelected.forEach((c) => {
    //       name += p.title + " , ";
    //     });
    //     if (p.endsWith(" , ")) p = p.slice(0, -3);
    //   }
    //   name += " | ";
    // });
    // if (name.endsWith(" | ")) p = p.slice(0, -3);
    let name =
        folderParent && folderParent.parent ?
        getParentTitle(folderParent.parent, deleimiter) +
        deleimiter +
        folderParent.title :
        folderParent.title;
    return name;
}

function getParentTitle(p, deleimiter) {
    if (!p.parent) return p.title;
    return getParentTitle(p.parent, deleimiter) + deleimiter + p.title;
}
//get category types of the main system folders
export function getSystemFoldersCategoriesType() {
    if (!globalThis.DEV_LOAD_SYSTEM_FOLDERS || window._mobile) {
        return Promise.resolve();
    }
    let promise = new Promise((resolve, reject) => {
        //url of the request
        let url = init.getServer() + init.BooksDB.systemFoldersCategoriesType;
        //send axios get request

        Axios.get(url)
            .then(async (response) => {
                let types = response.data;

                //loop through the type
                for (let i = 0; i < types.length; i++) {
                    //get thevcategory type id
                    let id = {
                        CategoryTypeId: types[i].id,
                    };

                    //send the category type id to get its folder tree
                    let r = await getSystemFolderCategoriesById(id);
                    r = inflate(r.data, {
                        to: "string"
                    });
                    let tmp = r; //.data[0];
                    tmp = JSON.parse(tmp);
                    tmp = tmp[0];
                    if (tmp.next.length > 0) tmp = addParentsInfo(tmp);
                    systemFolders.systemFolders.next.push(tmp);
                    systemFolders.state.counterSys++;
                }

                //get basic books lists (for custom sorts)

                let r = await getSystemFolderCategoriesById({
                    CategoryTypeId: 8
                });
                r = inflate(r.data, {
                    to: "string"
                });
                let tmp = r; //.data[0];
                tmp = JSON.parse(tmp);
                tmp = tmp[0];
                if (tmp.next.length > 0) tmp = addParentsInfo(tmp);
                systemFolders.setBasicBooks(tmp);

                resolve();
                //set current folder in systemFolders to the main folder
            })
            //catches errors
            .catch(function(error) {
                console.error("error : ", error);
                reject();
            });
    });
    return promise;
}

//get main system folder by category type id
//param:CategoryTypeId
export function getSystemFolderCategoriesById(CategoryTypeId) {
    if (window._mobile) return Promise.resolve();
    //url of the request
    let url = init.getServer() + init.BooksDB.filter;
    //send axios post request with the param CategoryTypeId
    return Axios.post(url, CategoryTypeId);
}
//get books list of system folder
export function getSystemFoldersBooksIdListById(id, setList = true) {
    if (window._mobile) return Promise.resolve();
    //url of the request
    let url = init.getServer() + init.BooksDB.systemFoldersBooksList + id;

    //send axios get request with await
    return (
        Axios.get(url)
        .then((response) => {
            let systemB = response.data;

            if (setList) {
                bookList.setIsSystemBooksList(systemB);
            } else {
                let ids = [];
                //filter the data to push in to the array the ids
                response.data.filter((data) => {
                    ids.push(data.bookId);
                });
                return ids;
            }
        })
        //catches errors
        .catch(function(error) {
            console.error(error);
        })
    );
}
//get books list of multiple lists
//param:groups={group1:[], group2:[]}
export async function getSystemFoldersMultipleBooksLists(
    groups,
    setList = true
) {
    if (window._mobile) return Promise.resolve();
    //url of the request
    let url = init.getServer() + init.BooksDB.systemFoldersMultipleBooksLists;
    //send axios get request with await
    return (
        Axios.post(url, {
            groups
        })
        .then((response) => {
            let systemB = response.data;

            if (setList) {
                bookList.setIsSystemBooksList(systemB);
            } else {
                let ids = [];
                //filter the data to push in to the array the ids
                systemB.filter((data) => {
                    ids.push(data.bookId);
                });
                return ids;
            }
        })
        //catches errors
        .catch(function(error) {
            console.error(error);
        })
    );
}