import {
    Axios
} from "@/services/_axios.js";
import init from "@/config/init.js";
import * as books from "../store/modules/books";
import store from "@/store/store";
import * as advLocalStorage from "localforage";
//getting book by ID from server
export function fetchBookByID(book) {
    if (window._mobile) return Promise.resolve();
    //url of the request
    let url = init.getServer() + init.BooksDB.books + "/" + book;
    return new Promise(function(resolve, reject) {
        Axios.get(url)
            .then((response) => {
                if (response.data.length > 0) resolve(response.data[0]);
                else resolve({});
            })
            //catches errors
            .catch(function(error) {
                reject(error);
            });
    });
}

//getting all books from server
export async function fetchBooks(NABooks = false) {
    return new Promise((resolve, reject) => {
        //url of the request
        let url = init.getServer() + init.BooksDB.books + init.BooksDB.compress;
        if (NABooks) url += "/NA";
        Axios.get(url)
            .then((response) => {
                //storing the data that we got in the localStorage
                // if (globalThis.DEV_COMPRESS_HEBREW)
                //   localStorage.setItem("books", response.data);
                // booksUpdated();
                resolve(response.data);
            })
            //catches errors
            .catch(function(error) {
                // throw error;
                reject(error);
            });
    });
}

//getting all books from server
export async function fetchBooksBoth() {
    return new Promise((resolve, reject) => {
        //url of the request
        let url =
            init.getServer() + init.BooksDB.books + "/all" + init.BooksDB.compress;

        Axios.get(url)
            .then((response) => {
                //storing the data that we got in the localStorage
                // if (globalThis.DEV_COMPRESS_HEBREW)
                //   localStorage.setItem("books", response.data);
                // booksUpdated();
                resolve(response.data);
            })
            //catches errors
            .catch(function(error) {
                // throw error;
                reject(error);
            });
    });
}

export function booksUpdated() {
    let url = init.getServer() + init.BooksDB.updateBook;

    return Axios.get(url)

        .then((response) => {
            //set a new date of updated books in localStorage
            localStorage.setItem("update-book", response.data[0].changed);
            store.dispatch("books/setLastBooksUpdate", response.data[0].changed);
        })
        .catch(function(error) {
            console.error(error);
        });
}
//get the real book of basic book by system book id
//param:id
export function getSystemFoldersBookById(id) {
    if (window._mobile) return Promise.resolve();
    //url of the request
    let url = init.getServer() + init.BooksDB.systemFoldersBooksList + id;
    Axios.get(url)
        .then((response) => {
            return response.data;
        })
        //catches errors
        .catch(function(error) {
            console.error(error);
        });
}
//get array of objects that has the "fake" ids of basic books and the "real" ids of the books
//we use this to know what is the "real" bookid from basic books
export function fetchBasicBooksIds() {
    if (window._mobile) return Promise.resolve();
    let promise = new Promise((resolve, reject) => {
        //url of the request
        let url = init.getServer() + init.BooksDB.basicBooksIds;
        //get reguest
        Axios.get(url)
            .then((response) => {
                //insert in  books.state.systemBasicBooksIds the reall ids and the 'fake' ids of basic books
                books.state.systemBasicBooksIds = response.data;
                let basicB = response.data;
                let idsB = [];
                basicB = basicB.filter((bb) => {
                    if (bb.books[0]) idsB.push(bb.books[0].id);
                });
                //insert in books.state.basicBooksIds in array the reall basic books ids
                books.state.basicBooksIds = idsB;
                resolve();
            })
            //catches errors
            .catch(function(error) {
                console.error(error);
                reject();
            });
    });
    return promise;
}

//fetching the alternative words for freesearch
export async function fetchFSWordsAlt() {
    // let otzarCache = await caches.open("otzar");
    let url = init.getServer() + init.BooksDB.FSwordAlt;
    try {
        let data = await Axios.get(url);

        return data.data;
    } catch (ex) {
        console.error(ex);
    }
    return null;
}

//fetching the replacing words for search input
export function fetchWordsAlt() {
    let url = init.getServer() + init.BooksDB.wordAlt;
    return new Promise((resolve, reject) => {
        Axios.get(url)
            //url of the request
            .then(async (response) => {
                resolve(response.data);
            })
            //catches errors
            .catch(function(error) {
                console.error(error);
                reject(error);
            });
    });
}
//get all basic books
export async function fetchBasicBooks() {
    //url of the request
    let url = init.getServer() + init.BooksDB.filter;
    await Axios.post(url, {
            CategoryTypeId: 1,
            dept: 2,
        })
        .then(function(response) {
            //let bsBooks = flatten(response.data)
            localStorage.setItem("basicBooks", JSON.stringify(response.data));
            init.BooksData.basicBooks = response.data;
        })
        .catch(function(error) {
            console.error(error);
        });
}

//get list of books not to print
export async function fetchNPBooks() {
    //url of the request
    let url = init.getServer() + init.BooksDB.noPrintBooks;
    await Axios.get(url)
        .then(function(response) {
            init.BooksData.noPrintBooks = response.data;
        })
        .catch(function(error) {
            console.error(error);
        });
}

//not in use for now
export function flatten(data) {
    return data.reduce(function(result, next) {
        if (next.next.length > 0) {
            result = result.concat(flatten(next.next));
            next.next = [];
        } else {
            result.push(next);
        }
        return result;
    }, []);
}