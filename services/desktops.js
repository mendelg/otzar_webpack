import {
    Axios
} from "@/services/_axios.js";
import init from "@/config/init.js";

//save recent desktop
export function saveRecentDesktop({
    data
}) {
    let url = init.UsersDB.users + init.UsersDB.desktops + init.UsersDB.recent;
    return Axios.post(url, {
            data
        })
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch(function(error) {
            return Promise.reject(error);
        });
}
//get recent desktop
export function getRecentDesktop() {
    let url = init.UsersDB.users + init.UsersDB.desktops + init.UsersDB.recent;
    return Axios.get(url, null)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch(function(error) {
            return Promise.reject(error);
        });
}

//get recent desktop
export function getDesktops() {
    let url = init.UsersDB.users + init.UsersDB.desktops + init.UsersDB.recent;
    return Axios.get(url, null)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch(function(error) {
            return Promise.reject(error);
        });
}

//get recent desktop
export function saveDesktop() {
    let url = init.UsersDB.users + init.UsersDB.desktops + init.UsersDB.recent;
    return Axios.get(url, null)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch(function(error) {
            return Promise.reject(error);
        });
}