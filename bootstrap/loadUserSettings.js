//loadUserSettings
import {
    Axios
} from "@/services/_axios";
import {
    getUserSavedList
} from "@/services/userFoldersData.js";
import {
    getSystemFoldersBooksIdListById
} from "@/services/loadSystemFoldersFromServer";
import {
    treeBooks
} from "@/store/modules/books";
import removeFromLoading from "@/services/removeFromLoading.js";
import {
    reloadAllBooksAndInx
} from "@/services/bookData";
import store from "@/store/store";
import {
    getUserSetting,
    getUserSettingsAndSetIt,
} from "@/services/userSettingsData.js";

export async function loadBookSettings() {
    let userSettings = await getUserSetting();
    await getUserSettingsAndSetIt(userSettings);
    userSettings.forEach((us) => {
        if (us.settingKey != "activeStore" && us.settingKey != "hiddenBooks")
            return;
        let val = JSON.parse(us.settingValue);
        us.settingValue = val;

        switch (us.settingKey) {
            case "hiddenBooks":
                us.settingValue.forEach((bk) => {
                    let book = Number(bk);
                    let treeBook = treeBooks.get(treeBooks.root, book);
                    if (treeBook) {
                        treeBook._hide = true;
                        treeBook._inHide = true;
                    }
                });
                store.state.booksChanged++;

                break;
            case "activeStore":
                {
                    if (us.settingValue.type == "user") {
                        let id = us.settingValue.id;
                        getUserSavedList(id, false).then((books) => {
                            store.dispatch("books/setActiveStore", books, {
                                root: true,
                            });
                            let payload = {
                                id,
                                type: "user",
                                isRegStore: true,
                            };
                            store.dispatch("books/setActiveStoreData", payload, {
                                root: true,
                            });
                        });
                    } else if (us.settingValue.type == "system") {
                        let id = us.settingValue.id;
                        getSystemFoldersBooksIdListById(id, false).then((books) => {
                            store.dispatch("books/setActiveStore", books, {
                                root: true,
                            });
                            let payload = {
                                id,
                                type: "system",
                                isRegStore: true,
                            };
                            store.dispatch("books/setActiveStoreData", payload, {
                                root: true,
                            });
                        });
                    }
                }
        }
    });
}

export async function loadUserSettings() {
    //first check user version
    const ver = (await Axios.get("/api/general/otzar_ver")).data;
    store.state.otzar_version = ver;
    if (store.state.bookOnlyMode) {
        removeFromLoading(0.001);
    } else {
        //apply the updates
        let continueLoad = true;
        if (globalThis.SERVER_MODE == "offline") {
            continueLoad = (await Axios.get("/api/general/apply-updates")).data;
            if (continueLoad == "need_refresh") {
                store.state.loader.upgradeErrorMsg = "תיכף התוכנה תעלה מחדש";
                return false;
            }
        }
        if (!continueLoad) return false;

        removeFromLoading(0.001);
    }
    let userSettings = await getUserSetting();

    removeFromLoading(0.1);
    await getUserSettingsAndSetIt(userSettings);
    if (userSettings.length > 0) {
        userSettings.forEach((us) => {
            if (us.settingKey == "open_sdarot") {
                store.dispatch(
                    "bookList/setShowVols",
                    us.settingValue == 1 ? true : false, {
                        root: true
                    }
                );
            }
            if (us.settingKey != "activeStore" && us.settingKey != "hiddenBooks")
                return;
            let val = JSON.parse(us.settingValue);
            us.settingValue = val;

            switch (us.settingKey) {
                case "hiddenBooks":
                    us.settingValue.forEach((bk) => {
                        let book = Number(bk);
                        let treeBook = treeBooks.get(treeBooks.root, book);
                        if (treeBook) {
                            treeBook._hide = true;
                            treeBook._inHide = true;
                        }
                    });
                    store.state.booksChanged++;

                    break;
                case "activeStore":
                    {
                        if (us.settingValue.type == "user") {
                            let id = us.settingValue.id;
                            getUserSavedList(id, false).then((books) => {
                                store.dispatch("books/setActiveStore", books, {
                                    root: true,
                                });
                                let payload = {
                                    id,
                                    type: "user",
                                    isRegStore: true,
                                };
                                store.dispatch("books/setActiveStoreData", payload, {
                                    root: true,
                                });
                            });
                        } else if (us.settingValue.type == "system") {
                            let id = us.settingValue.id;
                            getSystemFoldersBooksIdListById(id, false).then((books) => {
                                store.dispatch("books/setActiveStore", books, {
                                    root: true,
                                });
                                let payload = {
                                    id,
                                    type: "system",
                                    isRegStore: true,
                                };
                                store.dispatch("books/setActiveStoreData", payload, {
                                    root: true,
                                });
                            });
                        }
                    }
            }
        });
    }
    return true;
}