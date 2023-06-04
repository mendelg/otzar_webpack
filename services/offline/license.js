import {
    Axios
} from "@/services/_axios";
import init from "@/config/init.js";
import store from "../../store/store";

//set license code
export async function updateLicense(code) {
    let url = init.getServer() + init.BooksDB.license;
    try {
        let result = await Axios.post(url, {
            code
        });
        return result.data;
    } catch (ex) {
        console.error(ex);
        return false;
    }
}

//get applixcation data from info
export async function getAppInfo(useCache = true) {
    let url =
        init.getServer() + init.BooksDB.license + (!useCache ? "?noCache" : "");
    try {
        let result = await Axios.get(url);
        store.dispatch("user/setLicenseInfo", result.data);
        return result.data;
    } catch (ex) {
        console.error(ex);
        return false;
    }
}