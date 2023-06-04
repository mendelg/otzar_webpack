import store from "@/store/store";
import * as tabModule from "@/store/modules/_tab.js";
import {
    getBookName
} from "./bookData.js";
import {
    fetchBookByID
} from "@/services/loadBooksDataFromServer.js";
import VueInst from "@/main_app.js";
export default {
    createWinBook,
    createWinBookFromTab,
    closeWinBook,
    pinWinBookToTab,
    pinTabToWinBook,
    clearWinBook,
    tabsOverflowWarning,
};
import {
    getRecentPage
} from "./userBooksData";

async function clearWinBook(tabId) {
    if (!store.state.tabsManager.tabs.includes(tabId)) return;
    store.dispatch(`tabs/${tabId}/clearTab`);
}

async function createWinBook(
    bookid,
    pageNum,
    width = null,
    height,
    tabId = null,
    volumes = false,
    fsData,
    masks = {}
) {
    if (fsData == undefined && pageNum === -1) {
        //get recent page if not freesearch or meforshim
        //first check if we have a pinned page
        let pinnedPage = false;
        try {
            let pinnedPages = VueInst.userSettings.settings.pinnedPages;
            if (pinnedPages) {
                pinnedPages = new Map(JSON.parse(pinnedPages));

                if (pinnedPages.has(bookid.toString())) {
                    pageNum = pinnedPages.get(bookid.toString());
                    pinnedPage = true;
                }
            }
        } catch {}

        if (!pinnedPage) {
            let p = await getRecentPage(bookid);
            if (p.length > 0) pageNum = parseInt(p[0].pageId);
            else pageNum = 1;
        }
    }

    const bookOnlyMode = store.state.bookOnlyMode;
    if (!store.state.tabsManager.tabs.includes(tabId))
        tabId = "win_" + new Date().getTime();
    else store.state.tabs[tabId].pages = [];
    // if (tabId == null) tabId = "win_" + new Date().getTime();

    let bk = store.getters["books/getBookbyId"](bookid);
    let title = "";
    if (width == null) {
        width = document.body.clientWidth * 0.85;
        height = document.body.clientHeight * 0.85;
    }
    if (bookOnlyMode) {
        let bookDetails = await fetchBookByID(bookid);
        if (bookDetails) {
            title = getBookName(bookDetails.name, bookDetails.volume, true);
            title +=
                " / " + bookDetails.authors.filter((a) => a.authorTypeId === 1)[0].name;
        }
    } else {
        if (bk) {
            title = getBookName(bk.name, bk.volume, true);
            title += bk.mainAuthorName == "" ? "" : " / " + bk.mainAuthorName;
        } else return false;
    }
    let drawData = {};
    if (fsData != undefined)
        drawData.fs = {
            fs: fsData.fs,
            start: fsData.start,
            end: fsData.end
        };

    store.dispatch("tabsManager/setBook", {
        tabId,
        book: bookid,
        page: pageNum,
        width,
        height,
        drawData,
        title,
        volumes,
        masks,
    });
    return true;
}

function tabsOverflowWarning(window = false) {
    VueInst.$notify({
        type: "warning",
        message: VueInst.$t(
            window ? "tabs.overflowWinsMsg" : "tabs.overflowTabsMsg"
        ),
        timeout: 4000,
    });
}

function createWinBookFromTab(tabId, width, height) {
    let currentTab = store.state.tabs[tabId];
    currentTab = JSON.parse(JSON.stringify(currentTab));
    let tab = currentTab;
    tab.id = "win_" + new Date().getTime();

    let newTab = Object.assign({}, tabModule);
    newTab.winWidth = width;
    newTab.winWidth = height;

    const overflow = store.getters["tabsManager/winBooksOverflow"];
    if (overflow) {
        tabsOverflowWarning(true);
        return;
    }

    newTab.state = function() {
        return tab;
    };

    store.registerModule(["tabs", tab.id], newTab);
    store.state.tabsManager.tabs.push(tab.id);
    //close details window
    store.dispatch("bookPopups/closeBookDetails");
}

function pinTabToWinBook(tabId) {
    let currentTab = store.state.tabs[tabId];
    currentTab = JSON.parse(JSON.stringify(currentTab));
    let tab = currentTab;
    tab.id = new Date().getTime().toString();
    tab.id = "win_" + tab.id;
    tab.minimize = false;
    let newTab = Object.assign({}, tabModule);

    tab.winWidth = document.body.clientWidth * 0.85;
    tab.winHeight = document.body.clientHeight * 0.9;

    const overflow = store.getters["tabsManager/winBooksOverflow"];
    if (overflow) {
        tabsOverflowWarning(true);
        return;
    }

    newTab.state = function() {
        return tab;
    };

    store.registerModule(["tabs", tab.id], newTab);
    store.state.tabsManager.tabs.push(tab.id);
    store.dispatch("tabsManager/delTab", tabId);
}

function pinWinBookToTab(tabId) {
    let currentTab = store.state.tabs[tabId];
    currentTab = JSON.parse(JSON.stringify(currentTab));
    let tab = currentTab;
    tab.id = new Date().getTime().toString();

    const overflow = store.getters["tabsManager/tabsOverflow"];
    if (overflow) {
        tabsOverflowWarning();
        return;
    }

    let newTab = Object.assign({}, tabModule);

    newTab.state = function() {
        return tab;
    };

    store.registerModule(["tabs", tab.id], newTab);
    store.state.tabsManager.tabs.push(tab.id);
    store.dispatch("tabsManager/setCurrentTabId", tab.id);
    store.dispatch("tabsManager/delTab", tabId);

    store.dispatch("welcome/closewindow");
    store.state.homePage = false;
}

function closeWinBook() {}