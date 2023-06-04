import store from "@/store/store";
import removeLoading from "@/services/removeFromLoading.js";
import {
    runBackup,
    autoBackup
} from "./autoBackup";

//check license

// if (globalThis.SERVER_MODE === "offline") {
//   getAppInfo().then((res) => {
//     if (typeof res === "number") {
//       router.replace({
//         name: "lic_error",
//         params: { err: res, code: res },
//       });
//       return;
//     }
//   });
// }
//check for user only mode and if so skip some loaders
const bookOnlyMode = store.state.bookOnlyMode;
if (bookOnlyMode) {
    removeLoading(1);
} else {
    store.dispatch("userRecentBooks/setRecentBooks").then((res) => {
        //remove loader
        removeLoading(1);
    });
}

/* store.dispatch("userFavoriteBooks/setFavoriteBooks").then((res) => {
  //remove loader
  removeLoading(2);
}); */

//USER_FOLDERS :3
//userFoldersData.getUserFolders()
//

if (bookOnlyMode) {
    removeLoading(3);
} else {
    store
        .dispatch("userFolders/setFoldersData")
        .then(() => {
            removeLoading(3);
        })
        .catch(() => {});
}

//check for user only mode and if so skip the loader
if (bookOnlyMode) {
    removeLoading(7);
} else {
    //load user freeSearchHistory
    store.dispatch("userSearchHistory/setSearchHistoryList").then(() => {
        store.dispatch("freeSearchBookList/setFreeSearchHistory").then(() => {
            store
                .dispatch("bookList/addHistoryToActionList")
                .then(() => removeLoading(7));
        });
    });
}

if (bookOnlyMode) {
    removeLoading(10);
} else {
    //load user quick buttons
    store
        .dispatch("quickButtons/setQuickButtonsData")
        .then(() => {
            removeLoading(10);
        })
        .catch(() => {});
}

//load user alt words

store
    .dispatch("userAltWords/setUserAltWords")
    .then(() => {
        removeLoading(11);
    })
    .catch(() => {});

if (bookOnlyMode) {
    removeLoading(12);
    removeLoading(13);
} else {
    store
        .dispatch("customSort/setCustomSortBooks")
        .then(() => {
            removeLoading(12);
        })
        .catch(() => {});
    if (autoBackup) {
        //מה שקורה קודם
        let t = setTimeout(() => {
            removeLoading(13);
        }, 2500);
        runBackup().then(() => {
            clearTimeout(t);
            removeLoading(13);
        });
    } else {
        removeLoading(13);
    }
}