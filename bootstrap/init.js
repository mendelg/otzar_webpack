import {
    Axios
} from "@/services/_axios";
import {
    loadUserSettings
} from "./loadUserSettings";
require("./applySettings");
import config from "@/config/general";
import store from "@/store/store";
//check for user only mode and if so skip some loaders
const bookOnlyMode = store.state.bookOnlyMode;
//before all valid user
if (
    false
    /* globalThis.DEV_CONNECT_USER_TO_FREE_AUTO &&
    config.serverConnection === "online" */
) {
    // loadUserSettings().then(() => {
    //   require("./autoBackup");
    //   require("./loadSystemData");
    //   require("./loadUserData");
    // });
} else {
    Axios.get("/api/user/valid")
        .then((e) => {
            if (e.data.valid) {
                loadUserSettings().then((response) => {
                    if (response) {
                        if (!bookOnlyMode) require("./autoBackup");
                        require("./loadSystemData");
                        require("./loadUserData");
                    }
                });
            } else {
                //delete user storage
                localStorage.removeItem("user");
                //go to user login page
                if (globalThis.ELECTRON_ENV) globalThis.RELOAD_APP();
                else location.reload();
            }
        })
        .catch((err) => {
            console.error(err);
        });
}