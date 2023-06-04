//set license code
import {
    Axios
} from "@/services/_axios";
import init from "@/config/init.js";
import store from "../../store/store";

export async function getUserLicenseInfo() {
    let url = init.UsersDB.users + init.UsersDB.licenseInfo;
    try {
        let result = await Axios.get(url);
        if (result ? .data) {
            store.dispatch("user/setPermissions", result.data.permissions);
            return result.data;
        } else return false;
    } catch (ex) {
        console.error(ex);
        return false;
    }
}

export async function actualizeDay(saleId) {
    let url = init.UsersDB.users + init.UsersDB.actualizeDay;
    try {
        return (await Axios.post(url, {
            saleId
        })).data;
    } catch (ex) {
        console.error(ex);
        return false;
    }
}