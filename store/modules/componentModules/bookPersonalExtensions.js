//userPersonalExtensions
export const namespaced = true;
export const state = {
    openEditor: false,
    createExtentionMode: false,
    addExtendsType: "",
    offsetEditor: {
        x: 0,
        y: 0,
    },
    pageEditor: 0,
    editExtens: false,
    itemEdit: {},
    addingLink: false,
    firstLink: null,
    secondLink: null,
    dragging: false,
};
export const mutations = {
    SET_OFFSET(state, offset) {
        state.offsetEditor = offset;
    },
    SET_PAGE(state, page) {
        state.pageEditor = page;
    },
    SET_ADD_EXTENS_TYPE(state, type) {
        state.addExtendsType = type;
    },
    TOGGLE_ADD_EXTENST_MODE(state, toggle) {
        state.createExtentionMode = toggle;
    },
    SET_MODE_EDIT(state, item) {
        state.openEditor = true;
        state.editExtens = true;
        state.itemEdit = item;
        state.offsetEditor.x = 255;
        state.offsetEditor.y = 50;
    },
};
export const actions = {
    openEditorWin({
        commit
    }) {
        commit("OPEN_EDITOR");
    },
    setOffset({
        commit
    }, offset) {
        commit("SET_OFFSET", offset);
    },
    setExtenPage({
        commit
    }, page) {
        commit("SET_PAGE", page);
    },
    setAddEtensType({
        commit
    }, type) {
        commit("SET_ADD_EXTENS_TYPE", type);
    },
    toggleCrtExtensMode({
        commit,
        dispatch
    }, toggle) {
        commit("TOGGLE_ADD_EXTENST_MODE", toggle);
    },
    stopCreatModeAllExtantions({
        dispatch
    }) {
        dispatch("toggleCrtExtensMode", false);
    },
    startCreateExtentionMode({
        dispatch
    }) {
        dispatch("toggleCrtExtensMode", true);
    },
    closeExtens({
        commit,
        dispatch
    }) {
        dispatch("stopCreatModeAllExtantions"); //stop "+" & cursor icon
        dispatch("personalAdditionsTabs/closeEditorWin", null, {
            root: true
        }); //close editor window
        commit("SET_ADD_EXTENS_TYPE", ""); //empty satet - type
        dispatch("personalAdditionsTabs/closeExtens1", null, {
            root: true
        }); //empty satet
    },
    setModeEdit({
        commit
    }, item) {
        commit("SET_MODE_EDIT", item);
    },
};

export const getters = {
    createMarkerMode(state) {
        return state.createExtentionMode && state.addExtendsType == "marker";
    },
    createLinksMode(state) {
        return state.createExtentionMode && state.addExtendsType == "link";
    },
    createKeyMode(state) {
        return state.createExtentionMode && state.addExtendsType == "key";
    },
    createCommentMode(state) {
        return state.createExtentionMode && state.addExtendsType == "comment";
    },
    crtExtentionsMode(state, getters) {
        return state.createExtentionMode;
    },
    getAddExtensType(state) {
        return state.addExtendsType;
    },
    getModeEdit(state) {
        return state.editExtens;
    },
    getUserCommentsListByPage: (state, getters, rootState, rootGetter) => (
        id
    ) => {
        let commentsList = rootGetter["bookPersonalExtensions/getUserCommentsList"];
        let a = commentsList.filter((f) => f.pageId == id);
        return a;
    },
    getUserKeysListByPage: (state, getters, rootState, rootGetter) => (id) => {
        let commentsList = rootGetter["bookPersonalExtensions/getUserKeysList"];
        let a = commentsList.filter((f) => f.pageId == id);
        return a;
    },
    getUserLinksListByPage: (state, getters, rootState, rootGetter) => (id) => {
        let linkList = getters.getUserLinksList;
        let a = linkList.filter((f) => f.pageId == id);
        return a;
    },
    getUserMarkerListByPage: (state, getters, rootState, rootGetter) => (id) => {
        let commentsList = rootGetter["bookPersonalExtensions/getUserMarkersList"];
        let a = commentsList.filter((f) => f.pageId == id);
        return a;
    },
    getUserCommentsList(state, getters, rootState, rootGetter) {
        let commentsList = rootState.userPersonalExtensions.userCommentsList;

        return commentsList;
    },
    getUserKeysList(state, getters, rootState, rootGetter) {
        let keysList = rootState.userPersonalExtensions.userKeysList;

        return keysList;
    },
    getUserMarkersList(state, getters, rootState, rootGetter) {
        let markersList = rootState.userPersonalExtensions.userMarkersList;

        return markersList;
    },
    getUserLinksList(state, getters, rootState, rootGetter) {
        let linksList = rootState.userPersonalExtensions.userLinksList;

        return linksList;
    },
    getOffset(state) {
        return state.offsetEditor;
    },
    getPageEditor(state) {
        return state.pageEditor;
    },
    getOpenEditor(state) {
        return state.openEditor;
    },
};