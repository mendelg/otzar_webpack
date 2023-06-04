export const namespaced = true;
import Vue from "@/main_app.js";
import VueInst from "@/main_app.js";

let bg = "bright";
let color = "#b577730";
let color2 = "#81592a";
let size = "compact";
let lang = "he";
export const state = {
    language: lang,
    //dark bright archaic
    backgroundColor: bg,
    subColor: color,
    secondSubColor: color2,
    textSize: size,
    placementOfPageGradesAndCustomExtensions: "left",
    //utd-up to down rtl- right to left
    pageScrollingDirection: "utd",
    //insteadOf newTab
    bookDisplayTab: "insteadOf",
    //drive or local
    saveBackupLocation: "drive",
    autoBackup: true,
    viewPlacesRegularly: true,
    bookItemSize: "large",
};

export const mutations = {
    SET_CUSTOM_SEARCH_IN(state, data) {},
    REMOVE_CUSTOM_SEARCH_IN(state, index) {
        let currentSetting = VueInst.userSettings.settings.custom_search_in;
        if (!currentSetting) return;
        currentSetting = JSON.parse(currentSetting);
        currentSetting.splice(index, 1);
        VueInst.userSettings.setSettings(
            "custom_search_in",
            JSON.stringify(currentSetting)
        );
    },
    SET_LANGUAGE(state, language) {
        state.language = language;
        // localStorage.setItem("language", language);
        VueInst.userSettings.setSettings("language", language);
    },
    SET_BACKGROUND_COLOR(state, backgroundColor) {
        state.backgroundColor = backgroundColor;
        // localStorage.setItem("theme", state.backgroundColor);
        VueInst.userSettings.setSettings("theme", backgroundColor);
    },
    SET_SUB_COLOR(state, subColor) {
        state.subColor = subColor.color1;
        state.secondSubColor = subColor.color2;
        // localStorage.setItem("secondSubColor", state.secondSubColor);
        // localStorage.setItem("subColor", state.subColor);
        VueInst.userSettings.setSettings("subColor", subColor.color1);
        VueInst.userSettings.setSettings("secondSubColor", subColor.color2);
    },
    SET_TEXT_SIZE(state, textSize) {
        state.textSize = textSize;
        VueInst.userSettings.setSettings("textSize", textSize);
    },
    SET_BOOK_ITEM_SIZE(state, bookItemSize) {
        state.bookItemSize = bookItemSize;
        VueInst.userSettings.setSettings("bookItemSize", bookItemSize);
    },
    SET_PLACEMENT(state, placement) {
        state.placementOfPageGradesAndCustomExtensions = placement;
    },
    //pageScrollingDirection
    SET_PAGE_SCROLLING_DIRECTION(state, scrollDirection) {
        state.pageScrollingDirection = scrollDirection;
    },
    SET_BOOK_DISPLAY_TAB(state, bookDisplayTab) {
        state.bookDisplayTab = bookDisplayTab;
    },
    //viewPlacesRegularly
    SET_VIEW_PLACES_REGULARLY(state, value) {
        value != undefined ?
            (state.viewPlacesRegularly = value) :
            (state.viewPlacesRegularly = !state.viewPlacesRegularly);
    },
    //set marei meomot settings
    SET_MM(state, {
        key,
        value
    }) {
        VueInst.userSettings.setSettings(key + "Mm", value);
    },
};

export const actions = {
    setCustomSearchIn({
        commit,
        dispatch
    }, data) {
        let currentSetting = VueInst.userSettings.settings.custom_search_in;
        currentSetting = currentSetting ? JSON.parse(currentSetting) : [];
        currentSetting.push(data);
        VueInst.userSettings
            .setSettings("custom_search_in", JSON.stringify(currentSetting))
            .then((a) => {
                dispatch("freeSearchBookList/toggleCustomAdded", null, {
                    root: true
                });
            });
    },
    removeCustomSearchIn({
        commit
    }, index) {
        commit("REMOVE_CUSTOM_SEARCH_IN", index);
    },

    setLanguage({
        commit
    }, language) {
        commit("SET_LANGUAGE", language);
    },
    setBackgroundColor({
        commit
    }, backgroundColor) {
        commit("SET_BACKGROUND_COLOR", backgroundColor);
        if (window.OtzarTitleSetColor) {
            window.OtzarTitleSetColor(backgroundColor);
        }
    },
    setSubColor({
        commit
    }, subColor) {
        commit("SET_SUB_COLOR", subColor);
    },
    setTextSize({
        commit
    }, textSize) {
        commit("SET_TEXT_SIZE", textSize);
    },
    setBookItemSize({
        commit
    }, bookItemSize) {
        commit("SET_BOOK_ITEM_SIZE", bookItemSize);
    },
    setPlacement({
        commit
    }, placement) {
        commit("SET_PLACEMENT", placement);
    },
    setPageScrollingDirection({
        commit
    }, scrollDirection) {
        commit("SET_PAGE_SCROLLING_DIRECTION", scrollDirection);
    },
    setBookDisplayTab({
        commit
    }, bookDisplayTab) {
        commit("SET_BOOK_DISPLAY_TAB", bookDisplayTab);
    },
    setViewPlacesRegularly({
        commit
    }, value) {
        commit("SET_VIEW_PLACES_REGULARLY", value);
    },
    setMm({
        commit
    }, {
        key,
        value
    }) {
        commit("SET_MM", {
            key,
            value
        });
    },
};

export const getters = {
    getUserSetting(state) {
        let payload = {
            language: state.language,
            backgroundColor: state.backgroundColor,
            textSize: state.textSize,
            bookItemSize: state.bookItemSize,
            placement: state.placementOfPageGradesAndCustomExtensions,
            bookDisplayTab: state.bookDisplayTab,
            autoBackup: state.autoBackup,
        };
        return payload;
    },
    getUserLanguageSetting(state) {
        let l = state.language;
        return l;
    },
    getUserDisplaySetting(state) {
        let payload = {
            backgroundColor: state.backgroundColor,
            subColor: state.subColor,
            textSize: state.textSize,
            bookItemSize: state.bookItemSize,
            placement: state.placementOfPageGradesAndCustomExtensions,
            bookDisplayTab: state.bookDisplayTab,
            scrollDirection: state.pageScrollingDirection,
        };

        return payload;
    },

    getBackupSettings(state) {
        //state.autoBackup = autoBackup;
        //state.saveBackupLocation=saveBackupLocation;
        let backupSettings = {
            saveBackupLocation: state.saveBackupLocation,
            autoBackup: state.autoBackup,
        };
        return backupSettings;
    },
    getviewPlaces(state) {
        return state.viewPlacesRegularly;
    },
    showMm(state) {
        return VueInst.userSettings.settings.showMm != 0;
        //   return s == undefined ? true : s == 1;
    },
    MMshowWithoutTooltip(state, getters) {
        return (
            getters.showMm && VueInst.userSettings.settings.showWithoutTooltipMm == 1
        );
    },
    MMhideMode(state, getters) {
        let res = getters.showMm ?
            {
                color: false,
                hover: false,
                tooltip: false,
                link: false,
            } :
            {
                color: VueInst.userSettings.settings.hideModeHideTextColorMm != 0,
                hover: VueInst.userSettings.settings.hideModeHideHoverMm == 1,
                tooltip: VueInst.userSettings.settings.hideModeHideTooltipMm != 0,
                link: VueInst.userSettings.settings.fullDisableMm == 1,
            };

        return res;
    },
    MMshowYesodOnly(state) {
        return VueInst.userSettings.settings.yesodOnlyMm == 1;
    },
};