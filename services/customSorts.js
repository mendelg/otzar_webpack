import {
    Axios
} from "@/services/_axios.js";
import init from "@/config/init.js";
import Vue from "@/main_app.js";
import store from "@/store/store";

//replace all custom sorts
export function saveAllCustomSorts(customSorts) {
    let url = `${init.getServer()}${init.UsersDB.customSorts}/replace`;
    return Axios.post(url, {
            customSorts
        })
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch(function(error) {
            return Promise.reject(error);
        });
}

//insert\update custom sort
export function saveCustomSort({
    title,
    details
}) {
    let url = `${init.getServer()}${init.UsersDB.customSorts}`;
    return Axios.post(url, {
            title,
            details
        })
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch(function(error) {
            return Promise.reject(error);
        });
}

//get users' custom sorts
export function getCustomSorts() {
    let url = `${init.getServer()}${init.UsersDB.customSorts}`;
    return Axios.get(url, null)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch(function(error) {
            return Promise.reject(error);
        });
}

//delete user custom sort
export function delCustomSort(title) {
    let url = `${init.getServer()}${init.UsersDB.customSorts}/${title}`;
    return Axios.delete(url)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch(function(error) {
            return Promise.reject(error);
        });
}

//get custom sort books
export function getCustomSortBooks(title) {
    let url = `${init.getServer()}${init.UsersDB.customSorts}/${title}`;
    return Axios.get(url)
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch(function(error) {
            return Promise.reject(error);
        });
}

//set default customSort
export function setDefaultCustomSort(title) {
    Vue.userSettings.setSettings("defaultCustomSort", "custom_" + title);
}

//sort now by current custom sort
export function sortNow(title) {
    store.dispatch("freeSearchBookList/setSortByList", "custom_" + title);
}