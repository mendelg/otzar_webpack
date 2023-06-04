import {
    Axios
} from "@/services/_axios.js";
import init from "@/config/init.js";

//save search to history
export function saveSearchToHistory({
    data
}) {
    // return;
    let url = init.UsersDB.history;
    return Axios.post(url, data)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch(function(error) {
            return Promise.reject(error);
        });
}
export function setSearchHistoryPin(data) {
    let url = init.UsersDB.history;
    return Axios.patch(url, data)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch(function(error) {
            return Promise.reject(error);
        });
}

export function updateSearchHistoryDate(data) {
    data.historyDate = new Date().toString();
    let url = init.UsersDB.history + "/date";
    return Axios.patch(url, data)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch(function(error) {
            return Promise.reject(error);
        });
}

export function deleteSearchFromHistory(id) {
    let url = init.UsersDB.history + "/" + id;
    return Axios.delete(url)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch(function(error) {
            return Promise.reject(error);
        });
}
//get history
export async function getSearchHistory() {
    let url = init.UsersDB.history;
    let serachList = await Axios.get(url);
    return serachList.data;
}
//get history by type (book, free etc.)
export function getSearchHistoryByType(type) {
    let url = init.UsersDB.history + init.UsersDB.historyType + "/" + type;
    return Axios.get(url)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch(function(error) {
            return Promise.reject(error);
        });
}