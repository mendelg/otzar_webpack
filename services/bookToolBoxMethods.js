import {
    Axios
} from "@/services/_axios";
import init from "@/config/init.js";

//add book to favorites
export function addToFavorites({
    bookId
}) {
    let url = init.getServer() + init.UsersDB.userLists + init.UsersDB.favorites;
    return Axios.post(url, {
        book: bookId,
    });
}

//get ocr
export function getOCR({
    bookId,
    pageId,
    x,
    y,
    width,
    height,
    startWord,
    numWord,
    pageData,
}) {
    let url =
        init.getServer() +
        init.BooksDB.books +
        "/" +
        bookId +
        init.BooksDB.pages +
        "/" +
        pageId +
        init.BooksDB.ocr;
    return Axios.post(url, {
        x,
        y,
        width,
        height,
        startWord,
        numWord,
        pageData,
    });
}
export function getMmts(bookId) {
    let url =
        init.getServer() +
        init.BooksDB.books +
        "/" +
        bookId +
        init.BooksDB.mareiMekomot;
    return Axios.get(url, {
        bookId
    });
}

// export function getMmtsOnPage(bookId, pageId) {
//   let url =
//     init.getServer() +
//     init.BooksDB.books +
//     "/" +
//     bookId +
//     init.BooksDB.pages +
//     "/" +
//     pageId +
//     init.BooksDB.mareiMekomot;
//   return Axios.post(url, { bookId, pageId });
// }

export function print() {}
export function search() {}
export function link() {}
export function details() {}
export function fullScreen() {}