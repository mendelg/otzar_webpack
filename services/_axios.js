import axios from "axios";
import init from "@/config/init.js";

let Axios = axios.create({
    baseURL: init.getServer(),
    timeout: 950000,
    headers: {},
});
if (globalThis.ELECTRON_ENV && globalThis.AXIOS_OFFLINE) {
    Axios = globalThis.AXIOS_OFFLINE;
    Axios.set_baseURL(init.getServer().slice(0, -1));
}

//set JWT to  header of axios
function setAuthHeader({
    token
}) {
    if (globalThis.ELECTRON_ENV && globalThis.AXIOS_OFFLINE) {
        Axios.add_defaults("Authorization", token);
    } else Axios.defaults.headers["Authorization"] = token;
}

//set JWT to  header of axios
function setHeader(name, val) {
    if (globalThis.ELECTRON_ENV && globalThis.AXIOS_OFFLINE) {
        // Axios.add_defaults(name, val);
    } else Axios.defaults.headers[name] = val;
}

//clear JWT  header of axios
function clearAuthHeader() {
    if (globalThis.AXIOS_OFFLINE)
        globalThis.AXIOS_OFFLINE.del_defaults("Authorization");
    else Axios.defaults.headers["Authorization"] = null;
}

export {
    Axios,
    setAuthHeader,
    clearAuthHeader,
    setHeader
};