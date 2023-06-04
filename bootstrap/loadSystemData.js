export const namespaced = true;
import {
    getSystemFonts
} from "@/services/general.js";
import removeFromLoading from "@/services/removeFromLoading.js";
import {
    getAppInfo
} from "@/services/offline/license.js";
import errorsMgr from "@/helper/errorCodes";
import * as loadBooksDataFromServer from "@/services/loadBooksDataFromServer.js";
import * as loadSystemFoldersFromServer from "@/services/loadSystemFoldersFromServer.js";
import store from "@/store/store";
import {
    loadBookSettings
} from "@/bootstrap/loadUserSettings.js";
import router from "@/routes/router";
import {
    Axios
} from "@/services/_axios";
import vueInst from "@/main_app.js";
async function load() {
    //getting basic app info
    const info = await Axios.get("/api/general/basic-info");
    const data = info.data;

    globalThis.OTZAR_BASIC_INFO = data;
    store.state.kiosk = globalThis.OTZAR_BASIC_INFO.kiosk;
    removeFromLoading(0.01);
    if (data.networkMode == "both" || data.networkMode == "client") {
        store.state.networkModule.network = true;
        if (data.networkMode == "client") {
            //send again and wait for networkStatus
            const info = await Axios.get("/api/general/basic-info?wait=1");
            globalThis.OTZAR_BASIC_INFO = info.data;
        }
        removeFromLoading(0.02);

        //check for free space
        if (globalThis.OTZAR_BASIC_INFO.networkStatus == "no_place") {
            router.replace({
                name: "no_place"
            });
            return;
        } else if (globalThis.OTZAR_BASIC_INFO.networkStatus == "no_server") {
            router.replace({
                name: "noserver"
            });
            return;
        }
    } else if (data.networkMode == "server") {
        router.replace({
            name: "network"
        });
        return;
    } else {
        removeFromLoading(0.02);
    }

    //if network then try to connect to server

    //next do licence check

    if (globalThis.SERVER_MODE === "offline") {
        const res = await getAppInfo();

        //res = 2;
        if (typeof res === "number" || res.LicType == 3) {
            let code = res;
            if (res.LicType == 3) code = 2; //lic expired
            let routeData = {
                name: "lic_error",
                params: {
                    err: vueInst.$t(errorsMgr.getErrorDesc()[code - 1]),
                    code
                },
            };
            store.state.fatalError = true;
            //we done and bad
            //go to error
            router.replace({
                error: 0,
                ...routeData
            });
            return;
        } else {
            //we done and ok
            store.dispatch("offline/setLicence", res);
            removeFromLoading(0.03);
        }
    } else removeFromLoading(0.03);

    const delBooks = await Axios.get("/api/general/delBooks");
    if (delBooks.data.length === 0) {
        const next = {
            name: "lic_error",
            params: {
                err: "no delbooks file",
                code: 100,
            },
        };

        store.state.fatalError = true;
        router.replace({
            error: 0,
            ...next
        });
        return;
    } else removeFromLoading(0.04);

    /**
     * BASIC_BOOKS_IDS :4
     * SYSTEM_FOLDERS :5
     * BOOKS:6
     */

    //BASIC_BOOKS_IDS :4
    //check for user only mode and if so skip some loaders
    const bookOnlyMode = store.state.bookOnlyMode;
    if (bookOnlyMode) {
        //in normal mode its happen in loadBooksToMemory (books vuex module)
        loadBooksDataFromServer.fetchNPBooks();
        store.dispatch("books/loadFSWordAltTomemory");
        removeFromLoading(4);
        removeFromLoading(5);
        removeFromLoading(6);
        removeFromLoading(2);
        // removeFromLoading(8);
        removeFromLoading(9);
        // TODO load only current book
        store.dispatch("userPersonalExtensions/setPersonalExtensions").then(() => {
            getSystemFonts().then(() => removeFromLoading(8));
        });
    } else {
        loadBooksDataFromServer
            .fetchBasicBooksIds()
            .then(() => {
                removeFromLoading(4);
            })
            .catch((err) => {
                console.error(err);
                router.replace({
                    name: "error",
                    params: {
                        code: 1
                    }
                });
            });
        //SYSTEM_FOLDERS :5

        loadSystemFoldersFromServer
            .getSystemFoldersCategoriesType()
            .then(() => {
                removeFromLoading(5);
            })
            .catch((err) => {
                console.error(err);
                router.replace({
                    name: "error",
                    params: {
                        code: 1
                    }
                });
            });
        //BOOKS:6

        store
            .dispatch("books/loadBooksAndOthers")
            .then(() => {
                loadBookSettings();
                removeFromLoading(6);
                store
                    .dispatch("userPersonalExtensions/setPersonalExtensions")
                    .then(() => {
                        getSystemFonts().then(() => removeFromLoading(8));
                    });

                store.dispatch("userFavoriteBooks/setFavoriteBooks").then((res) => {
                    //remove loader
                    removeFromLoading(2);
                });

                if (globalThis.SERVER_MODE == "online")
                    store.dispatch("user/setChabadActiveStore").then((res) => {});

                /*  loadUserSettings().then(() => {
                  removeFromLoading(9);
                }); */
            })
            .catch((err) => {
                console.error(err);
                router.replace({
                    name: "error",
                    params: {
                        code: 1
                    }
                });
            });
    }
}
load();