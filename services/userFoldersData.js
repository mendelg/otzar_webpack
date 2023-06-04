import {
    Axios
} from "@/services/_axios";
import init from "@/config/init.js";
import * as bookList from "@/store/modules/bookList.js";
import store from "@/store/store";
import Vue from "vue";
import VueInst from "@/main_app.js";
//add user's folder to the server
//param:folder
export function addUserFolder(folder) {
    let data;
    return new Promise(function(resolve, reject) {
        switch (folder.foldertypeid) {
            case 1:
            case 2:
                {
                    //book list
                    //getting the url that sendig the post
                    let url = init.getServer() + init.BooksDB.userListAddFolder;
                    Axios.post(url, folder)
                    .then((response) => {
                        if (response.code == 409) {
                            notifyError("קיימת רשימה בשם זה");
                            resolve(false);
                        } else {
                            data = response.data;
                            store.dispatch("userFolders/updateFolders", data);
                            resolve(true);
                        }
                    })
                    //catches errors
                    .catch(function(error) {
                        console.error(error);
                        if (error.response.status == 409) notifyError("קיימת רשימה בשם זה");
                        resolve(false);
                    });
                    break;
                }
            case 3:
                {
                    // freesearch list
                    folder.listable = "free";

                    folder.fsId = store.state.freeSearchBookList.currentFsName;
                    let url = init.getServer() + init.BooksDB.userListAddFolder + "/free";
                    Axios.post(url, folder)
                    .then((response) => {
                        data = response.data;
                        //the server sending the updated folders tree (with the new folder)
                        //and insert the folders data in state->folders that in the module userFolders
                        store.dispatch("userFolders/updateFolders", data);
                        resolve(true);
                    })
                    //catches errors
                    .catch(function(error) {
                        console.error(error);
                        if (error.response.status == 409) notifyError("קיימת רשימה בשם זה");
                        resolve(false);
                    });
                    break;
                }
            default:
                {
                    resolve(false);
                }
        }
    });
}
//update user folder
//param:folder
export function updateUserFolder(folder) {
    //getting the url that sendig the update
    let url = init.getServer() + init.BooksDB.userListUpdateFolder;
    Axios.patch(url, folder)
        .then((response) => {
            //the server dending the updated folders tree (with the updated folder)
            //and insert the folders data in state->folders that in the module userFolders
            let data = response.data;
            store.dispatch("userFolders/updateFolders", data);
        })
        //catches errors
        .catch(function(error) {
            console.error(error);
        });
}
//userMoveFolder moveUserFolder
export function moveUserFolder(folder) {
    //getting the url that sendig the dispach
    let url = init.getServer() + init.BooksDB.userMoveFolder;
    Axios.patch(url, folder)
        .then((response) => {
            //the server dending the updated folders tree (with the new location of the moved folder in the tree)
            //and insert the folders data in state->folders that in the module userFolders
            let data = response.data;
            store.dispatch("userFolders/updateFolders", data);
        })
        //catches errors
        .catch(function(error) {
            console.error(error);
        });
}
//userFolderListAddBooks
export async function userFolderListAddBooks(folder) {
    switch (folder.listType) {
        case "book":
            //getting the url that sendig the dispach
            let url = init.getServer() + init.BooksDB.userFolderListAddBooks;
            await Axios.post(url, folder)
                .then((response) => {
                    //the server dending the updated folders tree (with the updated folder)
                    //and insert the folders data in state->folders that in the module userFolders
                    let data = response.data;
                    store.dispatch("userFolders/updateFolders", data);
                })
                //catches errors
                .catch(function(error) {
                    console.error(error);
                });
            break;

        case "free":
            {
                //getting the url that sendig the dispach
                folder.fsId = store.state.freeSearchBookList.currentFsName;
                folder.userList = store.getters["freeSearchBookList/isSavedList"];

                let url =
                    init.getServer() + init.BooksDB.userFolderListAddBooks + "/free";
                await Axios.post(url, folder)
                //catches errors
                .catch(function(error) {
                    console.error(error);
                });
                break;
            }
    }
}
//userFolderListDeleteBooks
export function userFolderListDeleteBooks(folder) {
    //getting the url that sendig the dispach
    let url =
        init.getServer() + init.BooksDB.userFolderListDeleteBooks + folder.id;
    let books = folder.books;
    Axios.delete(url, {
            data: folder
        })
        .then((Response) => {
            //getUserSavedList(folder.id);
            store.dispatch("bookList/deleteUserListBooksIds", folder);
        })
        //catches errors
        .catch(function(error) {
            console.error(error);
        });
}
//delete user folder
//param:id- folder id
export function deleteUserFolder(id) {
    //getting the url that sendig to the servere to delete the folder
    let url = init.getServer() + init.BooksDB.userListDeleteFolder + id;
    Axios.delete(url)
        .then((response) => {
            //the server dending the updated folders tree (without the deleted folder)
            //and insert the folders data in state->folders that in the module userFolders
            let data = response.data;
            store.dispatch("userFolders/updateFolders", data);
            //updateFolders
        })
        //catches errors
        .catch(function(error) {
            console.error(error);
        });
}
//gettin all user's folders- we call this function after login
export async function getUserFolders() {
    //getting the url that sendig to the servere to get folders data
    let url = init.getServer() + init.BooksDB.userListGetFolders;
    return Axios.get(url);
}
//get user saved list- in array of objects the has:  {bookId,userListId,pageId}
//in this getter we need just the array of books ids
//param: id- of the folder saved list
export async function getUserSavedList(
    id,
    setList = true,
    returnAllInfo = false
) {
    let url = init.getServer() + init.BooksDB.getUserSavedList + id;
    return (
        Axios.get(url)
        .then((response) => {
            //array of ids to insert inside the books ids
            let ids = [];
            //filter the data to push in to the array the ids
            response.data.filter((data) => {
                if (returnAllInfo) ids.push(data);
                else ids.push(data.bookId);
            });

            if (setList)
                //insert the ids array in the module bookList in state->booksids
                bookList.setUserListBooksIds(ids);
            else return ids;
        })
        //catches errors
        .catch(function(error) {
            console.error(error);
        })
    );
}

export async function updateQBSort(data) {
    let url =
        init.getServer() + init.UsersDB.userLists + init.UsersDB.quickbutton;
    return (
        Axios.patch(url, data)
        .then((response) => {})
        //catches errors
        .catch(function(error) {
            console.error(error);
        })
    );
}
export async function getUserRecentBooks(bookId) {
    let url =
        init.getServer() +
        init.UsersDB.users +
        init.UsersDB.recentBooks +
        "/" +
        bookId;
    let page = await Axios.get(url);
    return page.data;
}

export async function getUserQuickButtons() {
    let url =
        init.getServer() + init.UsersDB.userLists + init.UsersDB.quickbutton;
    let buttons = await Axios.get(url);

    return buttons.data;
}

//add quick button (with or without books) to the server
export function addQuickButton(btnData) {
    return new Promise(function(resolve, reject) {
        let url =
            init.getServer() + init.UsersDB.userLists + init.UsersDB.quickbutton;
        Axios.post(url, btnData)
            .then((response) => {
                let data = response.data;
                //add button to state
                //store.dispatch("quickButtons/add", data);
                resolve(data);
            })
            //catches errors
            .catch((err) => reject(err));
    });
}

export async function renameBookQB({
    userListId,
    bookId,
    title
}) {
    let url =
        init.getServer() +
        init.BooksDB.getUserSavedList +
        init.UsersDB.quickbutton +
        "/rename";
    try {
        let result = await Axios.patch(url, {
            userListId,
            bookId,
            title
        });
        return result;
    } catch {
        notifyError(VueInst.$t("folders.errorRenameBookQB"));
        return false;
    }
}

//get list of books from user saved freesearch list
export async function getUserFreeSearchSavedList(id, setList = true) {
    let url = init.getServer() + init.UsersDB.userLists + "/free/" + id;
    return (
        Axios.get(url)
        .then((response) => {
            //if results file of list does not exist any more
            if (response.data.filename == "NOFILE") {
                notifyError(VueInst.$t("folders.notExistList"));
                return;
            }
            //array of ids to insert inside the books ids
            //  let ids = [];
            //filter the data to push in to the array the ids
            //  response.data.filter((data) => {
            //    ids.push(data.bookId);
            //   });

            if (setList) {
                //insert the ids array in the module freeSearchBookList in state->booksids
                store
                    .dispatch(
                        "freeSearchBookList/setCurrentFsName",
                        response.data.fileName.startsWith("S_") ?
                        "special" :
                        response.data.fileName
                    )
                    .then(() => {
                        if (response.data.fileName.startsWith("S_"))
                            store.state.freeSearchBookList.resultsType = "special";
                        else store.state.freeSearchBookList.resultsType = "classic";
                        store.dispatch(
                            "freeSearchBookList/setResultBooks",
                            response.data.books
                        );
                    });
            } else return response.data.books;
        })
        //catches errors
        .catch(function(error) {
            console.error(error);
        })
    );
}

//remove books from freesearch list
export function userFreeSearchListDeleteBooks(folder) {
    let url =
        init.getServer() +
        init.BooksDB.userFolderListDeleteBooks +
        "free/" +
        folder.fsData.type +
        "/" +
        folder.fsData.id;
    let books = folder.books;
    Axios.delete(url, {
            data: {
                books
            }
        })
        .then((response) => {
            Promise.resolve(response);
        })
        //catches errors
        .catch(function(error) {
            console.error(error);
            Promise.reject(error);
        });
}

function notifyError(error) {
    const notification = {
        type: "error",
        message: error,
        timeout: 4000,
        setting: {
            nameIcon: "icon-save-win",
            position: "center",
        },
    };
    Vue.notify(notification);
}