import Vue from "vue";
import Vuex from "vuex";
import * as offline from "@/store/modules/offline.js";
import * as books from "@/store/modules/books.js";
import * as quickButtons from "@/store/modules/quickButtons.js";
import * as book from "@/store/modules/book.js";
import * as notification from "@/store/modules/notification.js";
import * as searchBook from "@/store/modules/searchBook.js";
import * as tabsManager from "@/store/modules/tabsManager.js";
import * as tab from "@/store/modules/_tab.js";
import mobile from "@/store/modules/mobile.js";
import * as bookList from "@/store/modules/bookList.js";
import * as userFolders from "@/store/modules/userFolders.js";
import * as userRecentBooks from "@/store/modules/userRecentBooks.js";
import * as userFavoriteBooks from "@/store/modules/userFavoriteBooks.js";
import * as user from "@/store/modules/user.js";
import * as folders from "@/store/modules/componentModules/folders.js";
import * as loader from "@/store/modules/loader.js";
import * as msgBox from "@/store/modules/msgBox.js";
import * as booklistComp from "@/store/modules/componentModules/booklistComp.js";
import * as freeSearchBooklistComp from "@/store/modules/componentModules/freeSearchBookListComp.js";
import * as popupOnceComp from "@/store/modules/componentModules/popupOnceComp.js";
import * as menuPersonalExtentions from "@/store/modules/componentModules/menuPersonalExtentions.js";
import * as bookPersonalExtensions from "@/store/modules/componentModules/bookPersonalExtensions.js";
import * as encyclopedia from "@/store/modules/componentModules/encyclopedia.js";
import * as gimCalculator from "@/store/modules/componentModules/gimCalculator.js";
import * as createBook from "@/store/modules/componentModules/createBook.js";
import * as progressWindow from "@/store/modules/componentModules/progressWindow.js";
import * as gzirim from "@/store/modules/gzirim.js";
import taskbar from "@/store/modules/componentModules/taskbar.js";
import * as centerPopContainer from "@/store/modules/componentModules/centerPopContainer.js";
import * as welcome from "@/store/modules/componentModules/welcome.js";
import * as desktop from "@/store/modules/desktop.js";
import * as bookPopups from "@/store/modules/componentModules/bookPopups.js";
import * as userSetting from "@/store/modules/userSetting.js";
import * as updatesCenter from "@/store/modules/componentModules/updatesCenter.js";
import * as importOldVersData from "@/store/modules/componentModules/importOldVersData.js";
import * as findMm from "@/store/modules/componentModules/findMm.js";
import menu from "./modules/menu";
import WaitTasks from "./modules/waitTask";
import bookListRefresh from "./modules/bookListRefresh";
import mefoPrinter from "./modules/mefoPrinter";
import mefo from "./modules/mefo";
import updates from "./modules/updateModule";
import commonWin from "./modules/commonWin";
import * as print from "./modules/print.js";
import * as mefShas from "./modules/mefShas";
import * as networkModule from "./modules/network";
import * as systemFolders from "@/store/modules/systemFolders.js";
import * as freeSearchBookList from "@/store/modules/freeSearchBookList.js";
import * as freeSearch from "@/store/modules/freeSearch.js";
import * as userSearchHistory from "@/store/modules/userSearchHistory.js";
import * as userPersonalExtensions from "@/store/modules/userPersonalExtensions.js";
import * as userAltWords from "@/store/modules/userAltWords.js";
import * as customSort from "@/store/modules/customSort.js";
import * as systemKeys from "@/store/modules/systemKeys.js";
import * as backup from "@/store/modules/backup.js";
import * as prmptBox from "@/store/modules/prmptBox.js";
import * as personalAdditionsTabs from "@/store/modules/personalAdditionsTabs.js";
import * as tabs from "@/store/modules/tabs";
import * as vKeyBoard from "@/store/modules/vKeyBoard";
//userSearchHistory

import AVLTree from "../utils/avl";

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        updatesCenter,
        networkModule,
        tabs,
        mefo,
        bookListRefresh,
        mefoPrinter,
        WaitTasks,
        userFolders,
        notification,
        offline,
        mefShas,
        books,
        searchBook,
        bookList,
        tabsManager,
        tab,
        updates,
        mobile,
        userRecentBooks,
        user,
        folders,
        booklistComp,
        bookPopups,
        popupOnceComp,
        loader,
        commonWin,
        print,
        systemFolders,
        userFavoriteBooks,
        freeSearchBookList,
        userSetting,
        importOldVersData,
        findMm,
        freeSearchBooklistComp,
        freeSearch,
        userSearchHistory,
        userPersonalExtensions,
        menuPersonalExtentions,
        bookPersonalExtensions,
        book,
        quickButtons,
        userAltWords,
        msgBox,
        encyclopedia,
        gimCalculator,
        welcome,
        desktop,
        createBook,
        gzirim,
        centerPopContainer,
        taskbar,
        menu,
        customSort,
        systemKeys,
        backup,
        progressWindow,
        prmptBox,
        personalAdditionsTabs,
        vKeyBoard,
    },
    state: {
        reloadAllPages: 0,
        kiosk: false,
        fatalError: false,
        bookOnlyMode: false,
        showOsk: false,
        saveRecentDesktop: true,
        booksChanged: 0,
        triggerBooksGetter: 0,
        hasModalOpen: false,
        myPdfWin: false,
        booksUpdate: true,
        lastActiveList: 1, //1==booklist 2= freesearch booklist
        currentActiveListIndex: 0,
        hasInternet: false,
        shiftPress: false,
        homePage: false,
        online_timer: null,
        otzar_version: 0,
        printing: {},
    },
    mutations: {
        SET_BOOKONLYMODE(state, mode) {
            state.bookOnlyMode = mode;
        },
    },
    actions: {
        setBookOnlyMode({
            commit
        }, mode) {
            commit("SET_BOOKONLYMODE", mode);
        },
    },
});
store.state.booklistComp.checkBookList = new AVLTree();
window._store = store;
export default store;