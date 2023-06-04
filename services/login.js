import {
    Axios
} from "@/services/_axios.js";
import init from "@/config/init.js";
import store from "@/store/store";
import {
    loadUserSettings
} from "@/bootstrap/loadUserSettings";

//const { storageVersion } = init;

//import * as advLocalStorage from "localforage";
//import { reloadAllBooksAndInx } from "@/services/bookData";
export const ENUM_LOGIN_WIN_MODES = {
    DISCONNECT_SINGLE: 1,
    DISCONNECT_NO_USE: 2,
    STATIONS_FULL: 3,
    APP_CHOOSE: 4,
    LOGIN: 5,
    NO_LICENSE: 6,
    SWITCHAPPS: 7,
};
//login user
export function loginUser({
    username,
    password
}, free = false) {
    let url = init.UsersDB.users + init.UsersDB.login;
    if (free) {
        //return the free user
        url = init.UsersDB.users + init.UsersDB.freeuser;
        return Axios.get(url)
            .then((response) => {
                return Promise.resolve(response);
            })
            .catch(function(error) {
                return Promise.reject(error);
            });
    } else {
        return Axios.post(url, {
                username,
                password
            })
            .then((response) => {
                return Promise.resolve(response);
            })
            .catch(function(error) {
                return Promise.reject(error);
            });
    }
}

export function logoutUser() {
    let url = init.UsersDB.users + init.UsersDB.logout;

    return Axios.post(url)
        .then((response) => {
            return Promise.resolve(response.data);
            ן;
        })
        .catch(function(error) {
            return Promise.reject(error);
        });
}

//reset user
export async function resetUser() {
    let url = init.UsersDB.users + init.UsersDB.reset;
    try {
        return await Axios.post(url, null);
    } catch (ex) {
        console.error(ex);
        return false;
    }
}

export async function signInUser(loginData = {}) {
    let url = init.UsersDB.users + init.UsersDB.connectUser;
    try {
        let result = await Axios.post(url, loginData);
        return result.data;
    } catch (ex) {
        console.error(ex);
        return false;
    }
}

export async function changePassword(data) {
    let url = init.UsersDB.users + init.UsersDB.changePassword;
    try {
        let result = await Axios.post(url, data);
        return result.data;
    } catch (ex) {
        console.error(ex);
        return false;
    }
}

export async function createPendingUser(data) {
    let url = init.UsersDB.users + init.UsersDB.createPendingUser;
    try {
        let result = await Axios.post(url, data);
        return result.data;
    } catch (ex) {
        console.error(ex);
        return false;
    }
}

export async function createUserByGuid(guid) {
    let url = init.UsersDB.users + init.UsersDB.createUserByGuid;
    try {
        let result = await Axios.post(url, {
            guid
        });
        return result.data;
    } catch (ex) {
        console.error(ex);
        return false;
    }
}

export async function forgotPassword(data) {
    let url = init.UsersDB.users + init.UsersDB.forgotPassword;
    try {
        let result = await Axios.post(url, data);
        return result.data;
    } catch (ex) {
        console.error(ex);
        return false;
    }
}

export async function setUserPermissions() {
    let url = init.UsersDB.users + init.UsersDB.permissions;
    try {
        return (await Axios.get(url)).data;
    } catch (ex) {
        console.error(ex);
        return false;
    }
}

export async function addSubUser(values) {
    let url = init.UsersDB.users + init.UsersDB.subUsers;
    try {
        return (await Axios.post(url, values)).data;
    } catch (ex) {
        console.error(ex);
        return false;
    }
}

export async function getSubUser(values) {
    let url =
        init.UsersDB.users +
        init.UsersDB.subUsers +
        "/" +
        values.username +
        "/" +
        values.password;
    try {
        return (await Axios.get(url)).data;
    } catch (ex) {
        console.error(ex);
        return false;
    }
}

export async function loadAllUserData() {
    loadUserSettings().then(() => {
        store.dispatch("userRecentBooks/setRecentBooks");
        store.dispatch("userFolders/setFoldersData");
        store.dispatch("userSearchHistory/setSearchHistoryList").then(() => {
            store.dispatch("freeSearchBookList/setFreeSearchHistory").then(() => {
                store.dispatch("bookList/resetUserActionsList").then(() => {
                    store.dispatch("bookList/addHistoryToActionList");
                });
            });
        });
        store.dispatch("quickButtons/setQuickButtonsData");
        store.dispatch("userAltWords/setUserAltWords");
        store.dispatch("customSort/setCustomSortBooks");

        store.dispatch("userFavoriteBooks/clearFavoriteBooks").then(() => {
            store.dispatch("userFavoriteBooks/setFavoriteBooks");
        });
    });
}

export async function loginIPUserManager(password) {
    try {
        let verify = await Axios.post("/api/user/IPUser/login", {
            password
        });
        if (verify) return verify.data;
    } catch (ex) {
        return false;
    }
}

export async function updateVisitSubUser({
    uId,
    subUser
}) {
    let updated = await Axios.patch("/api/user/visits", {
        uId,
        subUser
    });
}

export async function logOutUserTotal() {
    let data = await logoutUser();
    store.dispatch("user/setSubUser", {
        subUserId: 0,
        subUserName: ""
    });
    store.dispatch("personalAdditionsTabs/clearAllPersonalAdditions");
    store.dispatch("books/resetActiveStore");
    store.dispatch("user/logout", data);

    //VueInst.$socket.client.emit("logout");
    loadAllUserData();
}

export async function disconnectUser(mode) {
    logoutUser();
    logOutUserTotal();
    store.state.user.showLoginMode = mode;
    store.state.user.showLogin = true;
    // VueInst.$router.replace({ name: "disconnected", params: { mode: 2 } });
    /* if (data == "disconnect") {
     
      logOutUserTotal();
      store.state.user.showLoginMode = 5;
      store.state.user.showLogin = true;
    } else {
      if (data == "request") {
        store.state.user.showLoginMode = 4;
        store.state.user.showLogin = true;
      }
    } */
}

export async function addUserVisit(start = true, success = 1, apps = "otzar") {
    let updated = await Axios.post("/api/user/visits", {
        start,
        success,
        apps,
    });
}

export async function getUserExtraInfo(token) {
    let url = init.UsersDB.users + init.UsersDB.extraInfo;
    try {
        return (await Axios.post(url, {
            token
        })).data;
    } catch (ex) {
        console.error(ex);
        return false;
    }
}

export async function updateUserExtraInfo(extraInfo) {
    let url = init.UsersDB.users + init.UsersDB.extraInfo;
    try {
        return (await Axios.patch(url, extraInfo)).data;
    } catch (ex) {
        console.error(ex);
        return false;
    }
}