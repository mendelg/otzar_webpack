import * as loadUserPersonalExtensions from "@/services/loadUserPersonalExtensions.js";
import * as books from "@/store/modules/books.js";
import {
    getBookName
} from "@/services/bookData";
//userPersonalExtensions
export const namespaced = true;

export const state = {
    userCommentsList: [],
    userMarkersList: [],
    userKeysList: [],
    userLinksList: [],
};
export const mutations = {
    /**
     * set comments list
     * @param {Array} commentsList -to set userCommentsList in state
     */
    SET_USER_COMMENTS_LIST(state, commentsList) {
        state.userCommentsList = commentsList;
    },
    /**
     * set markers list
     * @param {Array} markersList -to set userMarkersList in state
     */
    SET_USER_MARKERS_LIST(state, markersList) {
        state.userMarkersList = markersList;
    },
    /**
     * set keys list
     * @param {Array} keysList -to set userKeysList in state
     */
    SET_USER_KEYS_LIST(state, keysList) {
        state.userKeysList = keysList;
    },
    SET_USER_LINKS_LIST(state, linksList) {
        state.userLinksList = linksList;
    },
    /**
     * add comment
     * @param {Object} comment -to add the comment to userCommentsList in state
     */
    ADD_USER_COMMENT(state, comment) {
        state.userCommentsList.push(comment);
    },
    /**
     * add key
     * @param {Object} key -to add the key to userKeysList in state
     */
    ADD_USER_KEY(state, key) {
        state.userKeysList.push(key);
    },
    ADD_USER_LINK(state, link) {
        state.userLinksList.push(link);
    },
    /**
     * add marker
     * @param {Object} marker -to add the marker to userMarkersList in state
     */
    ADD_USER_MARKER(state, marker) {
        state.userMarkersList.push(marker);
    },
    /**
     * update comment
     * @param {Object} comment -to update the comment in userCommentsList in state
     */
    UPDATE_USER_COMMENT(state, comment) {
        let index = state.userCommentsList.findIndex((c) => c.id == comment.id);
        state.userCommentsList.splice(index, 1, comment);
    },
    /**
     * update key
     * @param {Object} key -to update the key in userKeysList in state
     */
    UPDATE_USER_KEY(state, key) {
        let index = state.userKeysList.findIndex((k) => k.id == key.id);
        state.userKeysList.splice(index, 1, key);
    },
    UPDATE_USER_LINK(state, link) {
        let index = state.userLinksList.findIndex((l) => l.id == link.id);
        state.userLinksList.splice(index, 1, link);
    },
    /**
     * delete comment
     * @param {Number} userCommentId -to delete the comment by its id from userCommentsList in state
     */
    DELETE_USER_COMMENT(state, userCommentId) {
        let index = state.userCommentsList.findIndex((c) => c.id == userCommentId);
        state.userCommentsList.splice(index, 1);
    },
    /**
     * delete key
     * @param {Number} userKeyId -to delete the key by its id from userKeysList in state
     */
    DELETE_USER_KEY(state, userKeyId) {
        let index = state.userKeysList.findIndex((k) => k.id == userKeyId);
        state.userKeysList.splice(index, 1);
    },
    DELETE_USER_LINK(state, userLinkId) {
        let index = state.userLinksList.findIndex((l) => l.id == userLinkId);
        state.userLinksList.splice(index, 1);
        index = state.userLinksList.findIndex((l) => l.linkTo == userLinkId);
        if (index > -1) state.userLinksList.splice(index, 1);
    },
    /**
     * delete marker
     * @param {Number} userMarkerId -to delete the marker by its id from userMarkersList in state
     */
    DELETE_USER_MARKER(state, userMarkerId) {
        let index = state.userMarkersList.findIndex((m) => m.id == userMarkerId);
        state.userMarkersList.splice(index, 1);
    },
};
export const actions = {
    /**
     * set personal extensions
     *  dispatch 3 actions:
     * 1- loadUserCommentsList
     * 2- loadUserKeysList
     * 3- loadUserMarkersList
     * 4- loadUserLinksList
     */
    setPersonalExtensions({
        dispatch
    }) {
        let promise = new Promise(async (resolve, reject) => {
            //temp
            resolve();
            return;
            await dispatch("loadUserCommentsList", {
                offset: 2,
                limit: 3
            });
            await dispatch("loadUserKeysList", {
                offset: 2,
                limit: 3
            });
            await dispatch("loadUserMarkersList", {
                offset: 2,
                limit: 3
            });
            await dispatch("loadUserLinksList", {
                offset: 2,
                limit: 3
            });
            resolve();
        });
        return promise;
    },
    /**
     * load user comments list
     */
    async getAllComments({
        commit
    }) {
        //send a get request to getUserPersonalComments to get the comments list
        let commentsList = await loadUserPersonalExtensions.getUserPersonalComments();
        //insert bookName element in every comment object and get the value
        //from treeBooks by book id
        commentsList.forEach((c) => {
            let b = books.treeBooks.get(books.treeBooks.root, c.bookId);
            if (b) c.bookName = getBookName(b.name, b.volume, true); //b ? b.name : "";
        });
        return commentsList;
    },
    async getAllKeys({
        commit
    }) {
        //send a get request to getUserPersonalComments to get the comments list
        let keysList = await loadUserPersonalExtensions.getUserPersonalKeys();
        //insert bookName element in every comment object and get the value
        //from treeBooks by book id
        keysList.forEach((c) => {
            let b = books.treeBooks.get(books.treeBooks.root, c.bookId);
            if (b) c.bookName = getBookName(b.name, b.volume, true); //if (b) c.bookName = b ? b.name : "";
        });
        return keysList;
    },
    async getAllLinks({
        commit
    }) {
        //send a get request to getUserPersonalComments to get the comments list
        let linksList = await loadUserPersonalExtensions.getUserPersonalLinks();
        //insert bookName element in every comment object and get the value
        //from treeBooks by book id
        linksList.forEach((c) => {
            let b = books.treeBooks.get(books.treeBooks.root, c.bookId);
            if (b) c.bookName = getBookName(b.name, b.volume, true); //if (b) c.bookName = b ? b.name : "";
        });
        return linksList;
    },

    async loadUserCommentsList({
        commit,
        rootState
    }, {
        offset = -1,
        limit = -1,
        txt = ""
    }) {
        //send a get request to getUserPersonalComments to get the comments list
        let commentsList = await loadUserPersonalExtensions.getUserPersonalComments(
            0,
            offset,
            limit,
            rootState.menuPersonalExtentions.sortListType,
            txt
        );
        //insert bookName element in every comment object and get the value
        //from treeBooks by book id
        commentsList.forEach((c) => {
            let b = books.treeBooks.get(books.treeBooks.root, c.bookId);
            if (b) c.bookName = getBookName(b.name, b.volume, true); //if (b) c.bookName = b ? b.name : "";
        });
        //commit mutation SET_USER_COMMENTS_LIST to set the list in state
        commit("SET_USER_COMMENTS_LIST", commentsList);
    },
    /**
     * load user keys list
     */
    async loadUserKeysList({
        commit,
        rootState
    }, {
        offset = -1,
        limit = -1,
        txt = ""
    }) {
        //send a get request to getUserPersonalKeys to get the keys list
        let keysList = await loadUserPersonalExtensions.getUserPersonalKeys(
            0,
            offset,
            limit,
            rootState.menuPersonalExtentions.sortListType,
            txt
        );
        //insert bookName element in every key object and get the value
        //from treeBooks by book id
        keysList.forEach((k) => {
            let b = books.treeBooks.get(books.treeBooks.root, k.bookId);
            if (b) k.bookName = getBookName(b.name, b.volume, true); //if (b) k.bookName = b ? b.name : "";
        });
        commit("SET_USER_KEYS_LIST", keysList);
    },
    async loadUserLinksList({
        commit,
        dispatch,
        rootState
    }, {
        offset = -1,
        limit = -1,
        txt = ""
    }) {
        let links = await loadUserPersonalExtensions.getUserPersonalLinks(
            0,
            offset,
            limit,
            rootState.menuPersonalExtentions.sortListType,
            txt
        );
        links = await dispatch("setLinksDetail", links);
        commit("SET_USER_LINKS_LIST", links);
    },
    setLinksDetail({
        dispatch
    }, links) {
        links.forEach((l) => {
            let b = books.treeBooks.get(books.treeBooks.root, l.bookId);
            l.bookName = b ? b.name : "";
            l.authorName = b ? b.mainAuthorName : "";
            b = books.treeBooks.get(books.treeBooks.root, l.linkedTo.bookId);
            //   l.linkedTo.bookName = b ? b.name : "";
            if (b) l.linkedTo.bookName = getBookName(b.name, b.volume, true); //
            l.linkedTo.authorName = b ? b.mainAuthorName : "";
        });
        return links;
    },
    /**
     * load user markers list
     */
    async loadUserMarkersList({
        commit,
        rootState
    }, {
        offset = -1,
        limit = -1,
        txt = ""
    }) {
        //get markers from server
        let markersList = await loadUserPersonalExtensions.getUserPersonalMarks(
            0,
            offset,
            limit,
            rootState.menuPersonalExtentions.sortListType,
            txt
        );
        //insert bookName element in every marker - from treeBooks by book id
        markersList.forEach((m) => {
            let b = books.treeBooks.get(books.treeBooks.root, m.bookId);

            if (b) m.bookName = getBookName(b.name, b.volume, true); //if (b) m.bookName = b ? b.name : "";
        });
        commit("SET_USER_MARKERS_LIST", markersList);
    },
    /**
     * add user comment
     * @param {Object} userComment
     */
    async addUserComment({
        commit
    }, userComment) {
        //send a post request to postUserPersonalComment to add the comment
        let comment = await loadUserPersonalExtensions.postUserPersonalComment(
            userComment
        );
        //insert bookName element in the comment object and get the value
        //from treeBooks by book id

        let b = books.treeBooks.get(books.treeBooks.root, comment.bookId);
        // comment.bookName = b ? b.name : "";
        if (b) comment.bookName = getBookName(b.name, b.volume, true); //
        //commit mutation ADD_USER_COMMENT to add the comment in userCommentsList
        commit("ADD_USER_COMMENT", comment);
    },
    /**
     * add user key
     * @param {Object} userKey
     */
    async addUserKey({
        commit
    }, userKey) {
        //post new key to server
        let key = await loadUserPersonalExtensions.postUserPersonalKey(userKey);
        //insert bookName element in the key  - from treeBooks by book id
        let b = books.treeBooks.get(books.treeBooks.root, key.bookId);
        // key.bookName = b ? b.name : "";
        if (b) key.bookName = getBookName(b.name, b.volume, true); //
        commit("ADD_USER_KEY", key);
    },
    /**
     * add user marker
     * @param {Object} userMarker
     */
    async addUserMarker({
        commit
    }, userMarker) {
        //send a post request to postUserPersonalMark to add the marker
        let marker = await loadUserPersonalExtensions.postUserPersonalMark(
            userMarker
        );
        //insert bookName element in the marker object and get the value
        //from treeBooks by book id
        let b = books.treeBooks.get(books.treeBooks.root, marker.bookId);
        // marker.bookName = b ? b.name : "";
        if (b) marker.bookName = getBookName(b.name, b.volume, true); //
        //commit mutation ADD_USER_MARKER to add the marker in userMarkersList
        commit("ADD_USER_MARKER", marker);
    },
    async addUserLink({
        commit,
        dispatch
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
        };
        secondLink = {
            bookId: secondLink.bookId,
            pageId: secondLink.pageId,
            x: secondLink.x,
            y: secondLink.y,
            note: secondLink.note,
        };
        userLink = {
            firstLink,
            secondLink
        };
        let links = await loadUserPersonalExtensions.postUserPersonalLink(userLink);

        links = await dispatch("setLinksDetail", links);

        await commit("ADD_USER_LINK", links[0]);
        await commit("ADD_USER_LINK", links[1]);
        return;
    },
    /**
     * update user comment
     * @param {Object} userComment
     */
    async updateUserComment({
        commit
    }, userComment) {
        //send a patch request to updateUserPersonalComment to update the comment
        let comment = await loadUserPersonalExtensions.updateUserPersonalComment(
            userComment
        );
        //insert bookName element in the comment object and get the value
        //from treeBooks by book id
        let b = books.treeBooks.get(books.treeBooks.root, comment.bookId);
        //comment.bookName = b ? b.name : "";
        if (b) comment.bookName = getBookName(b.name, b.volume, true); //
        //commit mutation UPDATE_USER_COMMENT to update the comment in userCommentsList
        commit("UPDATE_USER_COMMENT", comment);
    },
    /**
     * update user key
     * @param {Object} userKey
     */
    async updateUserKey({
        commit
    }, userKey) {
        //send a patch request to updateUserPersonalKey to update the key
        let key = await loadUserPersonalExtensions.updateUserPersonalKey(userKey);
        //insert bookName element in the key object and get the value
        //from treeBooks by book id
        let b = books.treeBooks.get(books.treeBooks.root, key.bookId);
        // key.bookName = b.name;
        if (b) key.bookName = getBookName(b.name, b.volume, true); //
        //commit mutation UPDATE_USER_KEY to update the key in userKeysList
        commit("UPDATE_USER_KEY", key);
    },
    async updateUserLink({
        commit,
        dispatch
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
            secondLink
        };
        let links = await loadUserPersonalExtensions.updateUserPersonalLink(
            userLink
        );
        links = await dispatch("setLinksDetail", links);

        await commit("UPDATE_USER_LINK", links[0]);
        await commit("UPDATE_USER_LINK", links[1]);
        return;
    },
    /**
     * delete user comment
     * @param {Number} userCommentId
     */
    async deleteUserComment({
        commit
    }, userCommentId) {
        //send a delete request to deleteUserPersonalComment to delete the comment
        await loadUserPersonalExtensions.deleteUserPersonalComment(userCommentId);
        //commit mutation DELETE_USER_COMMENT to delete the comment from userCommentsList
        commit("DELETE_USER_COMMENT", userCommentId);
    },
    /**
     * delete user key
     * @param {Number} userKeyId
     */
    async deleteUserKey({
        commit
    }, userKeyId) {
        //send a delete request to deleteUserPersonalKey to delete the key
        await loadUserPersonalExtensions.deleteUserPersonalKey(userKeyId);
        //commit mutation DELETE_USER_KEY to delete the key from userKeysList
        commit("DELETE_USER_KEY", userKeyId);
    },
    async deleteUserLink({
        commit
    }, userLinkId) {
        await loadUserPersonalExtensions.deleteUserPersonalLink(userLinkId);
        commit("DELETE_USER_LINK", userLinkId);
    },
    /**
     * delete user marker
     * @param {Number} userMarkerId
     */
    async deleteUserMarker({
        commit
    }, userMarkerId) {
        //send a delete request to deleteUserPersonalMark to delete the marker
        await loadUserPersonalExtensions.deleteUserPersonalMark(userMarkerId);
        //commit mutation DELETE_USER_MARKER to delete the marker from userMarkersList
        commit("DELETE_USER_MARKER", userMarkerId);
    },
};
//getters
export const getters = {};