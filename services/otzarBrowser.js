import store from "../store/store";
import * as systemFolders from "../store/modules/systemFolders";

function openOtzarExplorerAt(folder = "", folderToOpen = null) {
    const sysfolders = systemFolders.systemFolders;
    let sys = "true";
    let catId = -1;
    switch (folder) {
        case "topics":
            catId = 3;
            break;
        case "mefs":
            catId = 2;
            break;
        case "fav":
            catId = 9000;
            sys = "false";
    }
    if (catId == -1) return;

    let toFolder;

    if (folderToOpen) toFolder = folderToOpen;
    else {
        toFolder = sysfolders.next.find(
            (a) => a.categoryTypeId && a.categoryTypeId == catId
        );
    }
    const openFolder = {
        foldersSystem: sys,
        folder: toFolder,
    };
    if (openFolder.folder == undefined) return;

    store.dispatch("folders/setSelectFolder", openFolder);
    store.dispatch("folders/togglePopupFolder", true);
    store.dispatch("folders/openFolder");
}

// folder: {id: 2, title: "מפרשים", level: 1, position: 2, parentId: 0, …}
// foldersSystem: "true"
export default {
    openOtzarExplorerAt
};