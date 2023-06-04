//PersonalExtensions
import {
    Axios
} from "@/services/_axios";
import init from "@/config/init.js";

export async function getUserPersonalComments(
    bookId = 0,
    offset = -1,
    limit = -1,
    sort = "",
    txt = ""
) {
    let url =
        init.getServer() +
        init.UsersDB.users +
        init.UsersDB.personalComments +
        "/" +
        offset +
        "/" +
        limit +
        "/" +
        (sort != "" ? sort : 0) +
        "/" +
        (txt ? txt : 0);
    if (bookId > 0)
        url = `${init.getServer() + init.BooksDB.book}${bookId}${
      init.UsersDB.personalComments
    }`;
    let commentsList = await Axios.get(url);
    return commentsList.data;
}
export async function getUserPersonalKeys(
    bookId = 0,
    offset = -1,
    limit = -1,
    sort = "",
    txt = ""
) {
    let url =
        init.getServer() +
        init.UsersDB.users +
        init.UsersDB.personalKeys +
        "/" +
        offset +
        "/" +
        limit +
        "/" +
        (sort != "" ? sort : 0) +
        "/" +
        (txt ? txt : 0);
    if (bookId > 0)
        url = `${init.getServer() + init.BooksDB.book}${bookId}${
      init.UsersDB.personalKeys
    }`;
    let keysList = await Axios.get(url);
    return keysList.data;
}
export async function getUserPersonalLinks(
    bookId = 0,
    offset = -1,
    limit = -1,
    sort = "",
    txt = ""
) {
    let url =
        init.getServer() +
        init.UsersDB.users +
        init.UsersDB.personalLinks +
        "/" +
        offset +
        "/" +
        limit +
        "/" +
        (sort != "" ? sort : 0) +
        "/" +
        (txt ? txt : 0);
    if (bookId > 0)
        url = `${init.getServer() + init.BooksDB.book}${bookId}${
      init.UsersDB.personalLinks
    }`;
    let linksList = await Axios.get(url);
    return linksList.data;
}
export async function getUserPersonalMarks(
    bookId = 0,
    offset = -1,
    limit = -1,
    sort = "",
    txt = ""
) {
    let url =
        init.getServer() +
        init.UsersDB.users +
        init.UsersDB.personalMarks +
        "/" +
        offset +
        "/" +
        limit +
        "/" +
        (sort != "" ? sort : 0) +
        "/" +
        (txt ? txt : 0);
    if (bookId > 0)
        url = `${init.getServer() + init.BooksDB.book}${bookId}${
      init.UsersDB.personalMarks
    }`;
    let marksList = await Axios.get(url);
    return marksList.data;
}

export async function getPersonalAdditionsByBook(bookId) {
    let additions = {};
    additions.keys = await getUserPersonalKeys(bookId);
    additions.comments = await getUserPersonalComments(bookId);
    additions.markers = await getUserPersonalMarks(bookId);
    additions.links = await getUserPersonalLinks(bookId);
    return additions;
}

export async function postUserPersonalComment(userComment) {
    let url =
        init.getServer() + init.UsersDB.users + init.UsersDB.personalComments;
    let comment = await Axios.post(url, userComment);
    return comment.data;
}
export async function postUserPersonalKey(userKey) {
    let url = init.getServer() + init.UsersDB.users + init.UsersDB.personalKeys;
    let key = await Axios.post(url, userKey);
    return key.data;
}
export async function postUserPersonalLink(userLink) {
    let url = init.getServer() + init.UsersDB.users + init.UsersDB.personalLinks;
    let link = await Axios.post(url, userLink);
    return link.data;
}
export async function postUserPersonalMark(userMark) {
    let url = init.getServer() + init.UsersDB.users + init.UsersDB.personalMarks;
    let mark = await Axios.post(url, userMark);
    return mark.data;
}

export async function updateUserPersonalComment(userComment) {
    let url =
        init.getServer() + init.UsersDB.users + init.UsersDB.personalComments;
    try {
        let comment = await Axios.patch(url, userComment);
        return comment.data;
    } catch (ex) {
        console.error(ex);
    }
}
export async function updateUserPersonalKey(userKey) {
    let url = init.getServer() + init.UsersDB.users + init.UsersDB.personalKeys;
    let key = await Axios.patch(url, userKey);
    return key.data;
}
export async function updateUserPersonalLink(userLink) {
    let url = init.getServer() + init.UsersDB.users + init.UsersDB.personalLinks;
    let link = await Axios.patch(url, userLink);
    return link.data;
}

export async function deleteUserPersonalComment(userCommentId) {
    let url =
        init.getServer() +
        init.UsersDB.users +
        init.UsersDB.personalComments +
        "/" +
        userCommentId;
    await Axios.delete(url);
}
export async function deleteUserPersonalKey(userKeyId) {
    let url =
        init.getServer() +
        init.UsersDB.users +
        init.UsersDB.personalKeys +
        "/" +
        userKeyId;
    await Axios.delete(url);
}
export async function deleteUserPersonalLink(userLinkId) {
    let url =
        init.getServer() +
        init.UsersDB.users +
        init.UsersDB.personalLinks +
        "/" +
        userLinkId;
    await Axios.delete(url);
}
export async function deleteUserPersonalMark(userMarkId) {
    let url =
        init.getServer() +
        init.UsersDB.users +
        init.UsersDB.personalMarks +
        "/" +
        userMarkId;

    try {
        await Axios.delete(url);
    } catch (ex) {
        console.error(ex.message);
    }
}