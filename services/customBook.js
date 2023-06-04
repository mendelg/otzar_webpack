import {
    Axios
} from "@/services/_axios";

export default {
    saveNew(data) {
        return Axios.post("/api/customBook/", {
                book: data
            })
            .then((response) => {
                return Promise.resolve(response);
            })
            .catch(function(error) {
                console.error("failed :>> ", error);
                return Promise.reject(error);
            });
    },
    save(data) {
        return Axios.patch("/api/customBook/", {
                book: data
            })
            .then((response) => {
                return Promise.resolve(response);
            })
            .catch(function(error) {
                console.error("failed :>> ", error);
                return Promise.reject(error);
            });
    },

    saveImage(bookId, pageId, image) {
        return Axios.post("/api/customBook/images", {
                bookId,
                pageId,
                image
            })
            .then((response) => {
                return Promise.resolve(response);
            })
            .catch(function(error) {
                return Promise.reject(error);
            });
    },
    getImage(bookId, pageId) {
        return Axios.get(`/api/customBook/${bookId}/${pageId}`)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch(function(error) {
                return Promise.reject(error);
            });
    },
    getThumbImage(bookId, pageId) {
        return Axios.get(`/api/customBook/${bookId}/${pageId}/thumbnail`)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch(function(error) {
                return Promise.reject(error);
            });
    },
    getBook(bookId) {
        return Axios.get("/api/customBook/" + bookId)
            .then((response) => {
                return Promise.resolve(JSON.parse(response.data));
            })
            .catch(function(error) {
                return Promise.reject(error);
            });
    },
    getBookData(bookId) {
        return Axios.get("/api/customBook/bookData/" + bookId)
            .then((response) => {
                return Promise.resolve(JSON.parse(response.data));
            })
            .catch(function(error) {
                return Promise.reject(error);
            });
    },
    getBooks() {
        return Axios.get("/api/customBook/books")
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch(function(error) {
                return Promise.reject(error);
            });
    },
    deleteBook(bookId) {
        return Axios.delete("/api/customBook/" + bookId)
            .then((response) => {
                return Promise.resolve(response);
            })
            .catch(function(error) {
                return Promise.reject(error);
            });
    },
    getBookSummury(bookId) {
        return Axios.get("/api/customBook/booksummury/" + bookId)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch(function(error) {
                return Promise.reject(error);
            });
    },

    addAuthor({
        name
    }) {
        return Axios.post("/api/user/authors", {
                name
            })
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch(function(error) {
                return Promise.reject(error);
            });
    },

    deleteAuthor(id) {
        return Axios.delete("/api/user/authors/" + id)
            .then((response) => {
                return Promise.resolve(response);
            })
            .catch(function(error) {
                return Promise.reject(error);
            });
    },

    editAuthor({
        id,
        name
    }) {
        return Axios.patch("/api/user/authors/", {
                id,
                name
            })
            .then((response) => {
                return Promise.resolve(response);
            })
            .catch(function(error) {
                return Promise.reject(error);
            });
    },

    getAllAuthors() {
        return Axios.get("/api/authors")
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch(function(error) {
                return Promise.reject(error);
            });
    },
    getUserAuthors() {
        return Axios.get("/api/authors/user")
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch(function(error) {
                return Promise.reject(error);
            });
    },
    searchAuthor(nameSrt) {
        return Axios.get("/api/authors/" + nameSrt)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch(function(error) {
                return Promise.reject(error);
            });
    },
};