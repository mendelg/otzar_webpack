import store from "@/store/store";
import router from "@/routes/router";
import {
    ENUM_LOGIN_WIN_MODES,
    disconnectUser
} from "@/services/login";
import desktopManager from "@/mixing/mixDesktop";

function startOnlineTimer(checkIfStarted = false) {
    if (
        globalThis.SERVER_MODE === "offline" ||
        globalThis.DEV_CONNECT_USER_TO_FREE_AUTO ||
        (store.state.user.userType != "IP" && store.state.user.userType != "GROUP")
    )
        return;

    let timeout = 60 * 1000 * (store.state.user.extraInfo ? .idleminutes || 20);

    clearInterval(store.state.online_timer);
    if (!checkIfStarted || store.state.online_timer != null)
        store.state.online_timer = setInterval(() => {
            checkActivity();
        }, timeout);
}

function stopOnlineTimer() {
    clearTimeout(store.state.online_timer);
}

function checkActivity() {
    //no activity for X minutes
    clearTimeout(store.state.online_timer);

    //dont disconnect from some routes
    if (!["manage-panel"].includes(router.currentRoute.name)) {
        desktopManager.methods.saveCurrentDesktop(true);
        /*  logoutUser();
        //localStorage.setItem("user", "");
        router.replace({ name: "disconnected" }); */
        disconnectUser(ENUM_LOGIN_WIN_MODES.DISCONNECT_NO_USE);
    }
}

export default {
    startOnlineTimer,
    stopOnlineTimer,
};