import Vue from "vue";

export const namespaced = true;
import {
    treeBooks
} from "@/store/modules/books.js";
import {
    postUserPersonalComment,
    postUserPersonalKey,
    postUserPersonalMark,
    updateUserPersonalComment,
    updateUserPersonalKey,
    updateUserPersonalLink,
    deleteUserPersonalComment,
    deleteUserPersonalKey,
    deleteUserPersonalLink,
    deleteUserPersonalMark,
    postUserPersonalLink,
} from "@/services/loadUserPersonalExtensions.js";

export const state = {
    personalAdditions: {}, // { comments: [], keys: [], markers: [], links: [] }
    addingLink: false,
    firstLink: null,
    secondLink: null,
    fsTotal: 0,
    editExtens: false,
    itemEdit: {},
    openEditor: false,
};
export const mutations = {
    CLEAR_ALL_ADDITIONS(state) {
        state.personalAdditions = {};
    },
    //personal additions
    SET_PERSONAL_ADDITIONS(state, {
        bookId,
        personalAdditions
    }) {
        Vue.set(state.personalAdditions, bookId, personalAdditions);
    },
    //keys
    ADD_PERSONAL_KEY(state, {
        bookId,
        newKey
    }) {
        let pers = state.personalAdditions[bookId];
        if (!pers) pers = {
            comments: [],
            keys: [],
            links: [],
            markers: []
        };
        pers.keys.push(newKey);
        //  Vue.set(state.personalAdditions, bookId, pers);
    },
    DEL_PERSONAL_KEY(state, {
        bookId,
        keyId
    }) {
        let pers = state.personalAdditions[bookId];
        if (!pers) pers = {
            comments: [],
            keys: [],
            links: [],
            markers: []
        };
        pers.keys = pers.keys.filter((key) => key.id != keyId);
        //  Vue.set(state.personalAdditions, bookId, pers);
    },
    UPD_PERSONAL_KEY(state, {
        bookId,
        editKey
    }) {
        let pers = state.personalAdditions[bookId];
        if (!pers) pers = {
            comments: [],
            keys: [],
            links: [],
            markers: []
        };
        pers.keys = pers.keys.map((key) => (key.id === editKey.id ? editKey : key));
        // Vue.set(state.personalAdditions, bookId, pers);
    },
    //comments
    ADD_PERSONAL_COMMENT(state, {
        bookId,
        userComment
    }) {
        let pers = state.personalAdditions[bookId];
        if (!pers) pers = {
            comments: [],
            keys: [],
            links: [],
            markers: []
        };
        pers.comments = [...pers.comments, userComment];
        //Vue.set(state.personalAdditions, bookId, pers);
    },
    DEL_PERSONAL_COMMENT(state, {
        bookId,
        keyId
    }) {
        let pers = state.personalAdditions[bookId];
        if (!pers) pers = {
            comments: [],
            keys: [],
            links: [],
            markers: []
        };
        pers.comments = pers.comments.filter((key) => key.id != keyId);
        //Vue.set(state.personalAdditions, bookId, pers);
    },
    UPD_PERSONAL_COMMENT(state, {
        bookId,
        editKey
    }) {
        let pers = state.personalAdditions[bookId];
        if (!pers) pers = {
            comments: [],
            keys: [],
            links: [],
            markers: []
        };
        pers.comments = pers.comments.map((key) =>
            key.id === editKey.id ? editKey : key
        );
        // Vue.set(state.personalAdditions, bookId, pers);
    },
    //markers
    ADD_PERSONAL_MARKER(state, {
        bookId,
        userMarker
    }) {
        let pers = state.personalAdditions[bookId];
        if (!pers) pers = {
            comments: [],
            keys: [],
            links: [],
            markers: []
        };
        pers.markers.push(userMarker);
        //Vue.set(state.personalAdditions, bookId, pers);
    },
    DEL_PERSONAL_MARKER(state, {
        bookId,
        userMarkerId
    }) {
        let pers = state.personalAdditions[bookId];
        if (!pers) pers = {
            comments: [],
            keys: [],
            links: [],
            markers: []
        };
        pers.markers = pers.markers.filter((key) => key.id != userMarkerId);
        //Vue.set(state.personalAdditions, bookId, pers);
    },
    UPD_PERSONAL_MARKER(state, {
        bookId,
        editKey
    }) {
        let pers = state.personalAdditions[bookId];
        if (!pers) pers = {
            comments: [],
            keys: [],
            links: [],
            markers: []
        };
        pers.markers = pers.markers.map((key) =>
            key.id === editKey.id ? editKey : key
        );
        // Vue.set(state.personalAdditions, bookId, pers);
    },
    //links
    ADD_PERSONAL_LINK(state, {
        bookId,
        newLink
    }) {
        let pers = state.personalAdditions[bookId];
        if (!pers) pers = {
            comments: [],
            keys: [],
            links: [],
            markers: []
        };
        pers.links.push(newLink);
        //Vue.set(state.personalAdditions, bookId, pers);
    },
    DEL_PERSONAL_LINK(state, {
        bookId,
        userLinkId
    }) {
        let pers = state.personalAdditions[bookId];
        if (!pers) pers = {
            comments: [],
            keys: [],
            links: [],
            markers: []
        };
        pers.links = pers.links.filter((key) => key.id != userLinkId);
        //  Vue.set(state.personalAdditions, bookId, pers);
    },
    UPD_PERSONAL_LINK(state, {
        bookId,
        editLink
    }) {
        let pers = state.personalAdditions[bookId];
        if (!pers) pers = {
            comments: [],
            keys: [],
            links: [],
            markers: []
        };
        pers.links = pers.links.map((link) =>
            link.id === editLink.id ? editLink : link
        );
        // Vue.set(state.personalAdditions, bookId, pers);
    },
    START_ADD_LINK(state) {
        state.addingLink = true;
    },
    STOP_ADD_LINK(state) {
        state.addingLink = false;
    },
    SET_FIRST_LINK(state, link) {
        state.firstLink = link;
    },
    SECOND_LINK_FINISHED(state, secLink) {
        state.secondLink = secLink;
    },
    OPEN_EDITOR(state) {
        state.openEditor = true;
    },
    CLOSE_EDITOR(state) {
        state.openEditor = false;
        state.editExtens = false;
        state.itemEdit = {};
        state.addingLink = false;
    },
    CLOSE_EXTENS1(state) {
        // state.addExtendsType = "";
        state.openEditor = false;
        state.addingLink = false;
        state.firstLink = null;
        state.secondLink = null;
    },
};
export const actions = {
    clearAllPersonalAdditions({
        commit
    }) {
        commit("CLEAR_ALL_ADDITIONS");
    },
    //personal additions
    setPersonalAdditions({
        commit
    }, {
        bookId,
        personalAdditions
    }) {
        commit("SET_PERSONAL_ADDITIONS", {
            bookId,
            personalAdditions
        });
    },
    //keys
    async addKey({
        commit
    }, {
        bookId,
        newKey
    }) {
        newKey = await postUserPersonalKey(newKey);
        //insert bookName element in the key  - from treeBooks by book id
        let b = treeBooks.get(treeBooks.root, newKey.bookId);
        newKey.bookName = b ? b.name : "";
        await commit("ADD_PERSONAL_KEY", {
            bookId,
            newKey
        });
    },
    async delKey({
        commit
    }, {
        bookId,
        keyId
    }) {
        await deleteUserPersonalKey(keyId);
        commit("DEL_PERSONAL_KEY", {
            bookId,
            keyId
        });
    },
    async updKey({
        commit
    }, {
        bookId,
        editKey
    }) {
        editKey = await updateUserPersonalKey(editKey);
        await commit("UPD_PERSONAL_KEY", {
            bookId,
            editKey
        });
    },
    //comments
    async addComment({
        commit
    }, {
        bookId,
        userComment
    }) {
        userComment = await postUserPersonalComment(userComment);
        let b = treeBooks.get(treeBooks.root, userComment.bookId);
        userComment.bookName = b ? b.name : "";
        await commit("ADD_PERSONAL_COMMENT", {
            bookId,
            userComment
        });
    },
    async delComment({
        commit
    }, {
        bookId,
        keyId
    }) {
        await deleteUserPersonalComment(keyId);
        commit("DEL_PERSONAL_COMMENT", {
            bookId,
            keyId
        });
    },
    async updComment({
        commit
    }, {
        bookId,
        editKey
    }) {
        editKey = await updateUserPersonalComment(editKey);
        await commit("UPD_PERSONAL_COMMENT", {
            bookId,
            editKey
        });
    },
    //markers
    async addMarker({
        commit
    }, {
        bookId,
        userMarker
    }) {
        userMarker = await postUserPersonalMark(userMarker);
        let b = treeBooks.get(treeBooks.root, userMarker.bookId);
        userMarker.bookName = b ? b.name : "";
        await commit("ADD_PERSONAL_MARKER", {
            bookId,
            userMarker
        });
    },
    async delMarker({
        commit
    }, {
        bookId,
        userMarkerId
    }) {
        await deleteUserPersonalMark(userMarkerId);
        commit("DEL_PERSONAL_MARKER", {
            bookId,
            userMarkerId
        });
    },
    async updMarker({
        commit
    }, {
        bookId,
        editKey
    }) {
        await commit("UPD_PERSONAL_MARKER", {
            bookId,
            editKey
        });
    },
    //links
    async addLink({
        commit,
        dispatch,
        state
    }, userLink) {
        let {
            firstLink,
            secondLink
        } = userLink;
        firstLink = {
            bookId: firstLink.bookId,
            pageId: firstLink.pageId,
            x: firstLink.x,
            y: firstLink.y,
            note: firstLink.note,
            position: firstLink.position,
            name: firstLink.name,
            letter: firstLink.letter,
        };
        secondLink = {
            bookId: secondLink.bookId,
            pageId: secondLink.pageId,
            x: secondLink.x,
            y: secondLink.y,
            note: secondLink.note,
            position: secondLink.position,
            name: secondLink.name,
            letter: secondLink.letter,
        };
        userLink = {
            firstLink,
            secondLink
        };
        let links = await postUserPersonalLink(userLink);
        links = await dispatch("setLinksDetail", links);
        await commit("ADD_PERSONAL_LINK", {
            bookId: firstLink.bookId,
            newLink: links[0],
        });
        //update another state if exists
        if (state.personalAdditions[secondLink.bookId]) {
            await commit("ADD_PERSONAL_LINK", {
                bookId: secondLink.bookId,
                newLink: links[1],
            });
        }
    },
    async delLink({
        commit,
        state
    }, payload) {
        const {
            userLinkId,
            bookId,
            userLinkId2,
            bookId2
        } = payload;
        await deleteUserPersonalLink(userLinkId);
        commit("DEL_PERSONAL_LINK", {
            bookId,
            userLinkId
        });
        if (state.personalAdditions[bookId2]) {
            commit("DEL_PERSONAL_LINK", {
                bookId: bookId2,
                userLinkId: userLinkId2
            });
        }
    },
    async updLinkPos({
        commit,
        dispatch,
        state
    }, {
        bookId,
        userLink
    }) {
        userLink = await updateUserPersonalLink(userLink);
        await commit("UPD_PERSONAL_LINK", {
            bookId,
            editLink: userLink[0]
        });
    },
    async updLink({
        commit,
        dispatch,
        state
    }, userLink) {
        let {
            firstLink,
            secondLink
        } = userLink;
        firstLink = {
            id: firstLink.id,
            bookId: firstLink.bookId,
            pageId: firstLink.pageId,
            x: firstLink.x,
            y: firstLink.y,
            note: firstLink.note,
        };
        secondLink = {
            id: secondLink.id,
            bookId: secondLink.bookId,
            pageId: secondLink.pageId,
            x: secondLink.x,
            y: secondLink.y,
            note: secondLink.note,
        };
        userLink = {
            firstLink,
            secondLink,
        };
        let links = await updateUserPersonalLink(userLink);
        links = await dispatch("setLinksDetail", links);

        //update also another state if exists
        if (state.personalAdditions[links[0].bookId]) {
            await commit("UPD_PERSONAL_LINK", {
                bookId: links[0].bookId,
                editLink: links[0],
            });
        }
        if (state.personalAdditions[links[1].bookId]) {
            await commit("UPD_PERSONAL_LINK", {
                bookId: links[1].bookId,
                editLink: links[1],
            });
        }
    },
    setLinksDetail({
        dispatch
    }, links) {
        links.forEach((l) => {
            let b = treeBooks.get(treeBooks.root, l.bookId);
            l.bookName = b ? b.name : "";
            l.authorName = b ? b.mainAuthorName : "";
            b = treeBooks.get(treeBooks.root, l.linkedTo.bookId);
            l.linkedTo.bookName = b ? b.name : "";
            l.linkedTo.authorName = b ? b.mainAuthorName : "";
        });
        return links;
    },
    addNewLink({
        commit,
        dispatch
    }, link) {
        dispatch("setFirstLink", link);
        commit("START_ADD_LINK");
    },
    setFirstLink({
        commit
    }, link) {
        commit("SET_FIRST_LINK", link);
    },
    secondLinksFinished({
        commit,
        dispatch
    }, secLink) {
        commit("SECOND_LINK_FINISHED", secLink);
        commit("STOP_ADD_LINK");
    },
    openEditorWin({
        commit
    }) {
        commit("OPEN_EDITOR");
    },
    closeEditorWin({
        commit,
        dispatch
    }) {
        commit("CLOSE_EDITOR");
    },
    closeExtens1({
        commit,
        dispatch
    }) {
        commit("CLOSE_EXTENS1"); //empty satet
    },
};
export const getters = {
    getPersonalAdditions(state) {
        return state.personalAdditions;
    },
    getOpenEditor(state) {
        return state.openEditor;
    },
};