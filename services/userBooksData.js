import {
    Axios
} from "./_axios";
import {
    doHardReload
} from "./bookData";
import init from "@/config/init.js";
import Vue from "@/main_app.js";
//add userbook to index and AVL tree
export function addUserBookToSystem(book) {
    doHardReload();
}

//get users recent books
export function getUserRecentBooks() {
    let url = init.getServer() + init.UsersDB.users + init.UsersDB.recentBooks;
    return Axios.get(url);
}

//get user books
export async function getUserBooks(bookId) {
    let url = init.getServer() + init.BooksDB.userBook;
    let books = await Axios.get(url);

    return books.data;
}

//get recent page
export async function getRecentPage(bookId) {
    let url =
        init.getServer() +
        init.UsersDB.users +
        init.UsersDB.recentBooks +
        "/" +
        bookId;
    let page = await Axios.get(url);
    return page.data;
}
//add user recent book
export function addUpdateUserRecentBook({
    bookId,
    pageId
}) {
    let url = init.getServer() + init.UsersDB.users + init.UsersDB.recentBooks;
    return Axios.patch(url, {
        bookid: bookId,
        pageid: pageId,
    });
}
//delete user recent book by id
export function deleteUserRecentBook(id) {
    let url = init.getServer() + init.UsersDB.users + init.UsersDB.recentBooks;
    return Axios.delete(url + "/" + id);
}

//add book to favorites
export function addToFavorites({
    books
}) {
    let url = init.getServer() + init.UsersDB.userLists + init.UsersDB.favorites;
    return Axios.post(url, {
        books,
    });
}

//delete book from favorites
export function removeFromFavorites({
    books
}) {
    let url = init.getServer() + init.UsersDB.userLists + init.UsersDB.favorites;
    return Axios.delete(url, {
        data: {
            books
        }
    });
}

//get users favorite books
export function getUserFavoriteBooks() {
    let url = init.getServer() + init.UsersDB.userLists + init.UsersDB.favorites;
    return Axios.get(url);
}

export function setBookOriginalDetails(book) {
    let url = init.getServer() + init.UsersDB.userBookDetails;
    return Axios.post(url, book);
}
export async function getUserBooksDetails() {
    let url = init.getServer() + init.UsersDB.userBookDetails;
    let details = await Axios.get(url);

    return details.data;
}
export function deletUserBookDetails(id) {
    let url = init.getServer() + init.UsersDB.userBookDetails + "/" + id;
    return Axios.delete(url);
}

export function IPUserNoPersDataMsg() {
    const notification = {
        type: "error",
        message: Vue.$t("users.noSavePersonalData"),
        timeout: 2000,
        setting: {
            grid: "icon",
            nameIcon: "icon-print",
            position: "center",
        },
    };
    Vue.$notify(notification);
}