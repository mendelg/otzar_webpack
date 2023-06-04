import store from "@/store/store";

const openAt = (dest) => {
    store.dispatch(`menu/openAt`, dest);
};
export default {
    openDisconnectSettings() {
        openAt("disconnectSettings");
    },
    openCreateSubUser() {
        openAt("createSubUser");
    },
    OpenAdvSettingsMenu() {
        openAt("advSettingsMenu");
    },
    openLoginSubUser() {
        openAt("loginSubUser");
    },
    openSavePersonalData() {
        openAt("savePersonalData");
    },
    openChangePassword() {
        openAt("changePassword");
    },
    openWhatsNewMenu() {
        openAt("whatsNew");
    },
    openMyLicense() {
        openAt("myLicense");
    },
    OpenMyProfileMenu() {
        openAt("myProfile");
    },
    OpenSettingsMenu() {
        openAt("settings");
    },
    OpenToolsMenu() {
        openAt("tools");
    },
    OpenHelpMenu() {
        openAt("help");
    },
    OpenBugsReportMenu() {
        openAt("bugs");
    },
    OpenContactMenu() {
        openAt("contact");
    },
    OpenExtentionsMenu() {
        openAt("exten");
    },
    OpenLanguageMenu() {
        openAt("lang");
    },
    OpenDisplayMenu() {
        openAt("display");
    },
    OpenMmMenu() {
        openAt("mm");
    },
    openHistoryMenu() {
        openAt("history");
    },
    openPersonalExtenMenu() {
        openAt("personal-exten");
    },
    openDesktopsMenu() {
        openAt("desktops");
    },
    openShortcutsMenu() {
        openAt("shortcuts");
    },
    openAppUpdatesMenu() {
        openAt("app-updates");
    },
    openOpenBook() {
        openAt("openbook");
    },
    openPersonalCommentsMenu() {
        // openAt("personal-comments");
        store.dispatch("commonWin/setShow", {
            type: "commentsShow",
            show: true
        });
    },
    openPersonalKeysMenu() {
        // openAt("personal-Keys");
        store.dispatch("commonWin/setShow", {
            type: "keysShow",
            show: true
        });
    },
    openPersonalMarksMenu() {
        // openAt("personal-marks");
        store.dispatch("commonWin/setShow", {
            type: "marksShow",
            show: true
        });
    },
    openPersonalLinksMenu() {
        // openAt("personal-links");
        store.dispatch("commonWin/setShow", {
            type: "linksShow",
            show: true
        });
    },
    openAboutAppMenu() {
        openAt("about-app");
    },
    openHelpDocsMenu() {
        openAt("help-docs");
    },
    openContactListMenu() {
        openAt("contact-list");
    },
    openLicenceCodeMenu() {
        openAt("lic-app");
    },
    openBooksInfoMenu() {
        openAt("books");
    },
    openBooksInfoBookDetails(bookId) {
        openAt("book-settings");
    },
    openMainMenu() {
        openAt("main");
    },
    openBackup() {
        openAt("backup");
    },
    openHiddenBooksMenu() {
        openAt("hiddenbooks");
    },
    OpenSupportMenu() {
        openAt("support");
    },
    openAt(at) {
        openAt(at);
    },
    closeMenu() {
        store.dispatch(`menu/closeMenu`);
        store.dispatch(`menu/resetMenu`);
    },
    OpenNetworkMenu() {
        openAt("network");
    },
};