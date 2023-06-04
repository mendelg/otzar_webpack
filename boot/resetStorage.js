import initData from "../config/init";
const {
    storageVersion
} = initData;
const localVer = localStorage.getItem("storageVersion");
import * as advLocalStorage from "localforage";
if (
    localVer != storageVersion ||
    (globalThis.NEED_TO_REFRESH_BOOKS && globalThis.NEED_TO_REFRESH_BOOKS())
) {
    //reset all storage
    console.warn("reset all storage");
    localStorage.clear();
    advLocalStorage.clear();
    localStorage.setItem("storageVersion", storageVersion);
}