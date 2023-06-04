import store from "../store/store";
import router from "@/routes/router";
import removeFromLoading from "@/services/removeFromLoading.js";
import {
    logOutUserTotal,
    disconnectUser,
    ENUM_LOGIN_WIN_MODES,
} from "@/services/login";
import {
    sendPrintSocket
} from "@/services/print.js";
import Vue from "@/main_app";
export default [{
        on: "startUpdateBooksAndInx",
        fn: startUpdateBooksAndInxTask,
    },
    {
        on: "done_printing",
        fn: () =>
            store.state.print.show > 0 ?
            store.state.print.show--
            :
            (store.state.print.show = 0),
    },
    {
        on: "close_station",
        fn: goToForceClose,
    },
    {
        on: "no_server",
        fn: goToNoServer,
    },
    {
        on: "no_place",
        fn: goToNoPlace,
    },
    {
        on: "server_station_start",
        fn: () => isServerStationRunning(true),
    },
    {
        on: "server_station_exit",
        fn: () => isServerStationRunning(false),
    },
    {
        on: "go_network",
        fn: reloadPage,
    },
    {
        on: "net_connect_error",
        fn: () => setNetErrorTo(true),
    },
    {
        on: "net_connect_ok",
        fn: () => setNetErrorTo(false),
    },
    {
        on: "recivedToken",
        fn: () => removeFromLoading(14),
    },
    {
        on: "onlineUserDisconnect",
        fn: () => logOutUserTotal(), //logOutUserTotal()
    },
    {
        on: "onlineSingleUserDisconnect",
        fn: (data) => disconnectUser(ENUM_LOGIN_WIN_MODES.DISCONNECT_SINGLE),
    },
    {
        on: "doneUpdateBooksAndInx",
        fn: readyUpdateBooksAndInxTask,
    },
    {
        on: "lic_expire_warning",
        fn: showExpireMsg,
    },
    {
        on: "mefo_disconnect_by_admin",
        fn: () => setMefKickOut(true),
    },
    {
        on: "mefo_set_no_space",
        fn: () => setMefNoPlace(true),
    },
    {
        on: "socket-connected",
        fn: setUserUId,
    },
    {
        on: "DiskLocalMismatch",
        fn: warnAndCloseApp
    },
    {
        on: "versionOlderThan5",
        fn: () => warnAndCloseApp(true)
    },

    // {
    //   on: "error",
    //   fn: goToErrorPage,
    // },
    // {
    //   on: "disconnect",
    //   fn: () => alert(8),
    // },
];

//OLD WHICH USE WAITTASK
// function addUpdateBooksAndInxTask() {
//   const task = {
//     msg: VueInst.$t("service.updateListBook"),
//     action: reloadAllBooksAndInx,
//     type: "RELOAD_BOOK_AND_INX",
//   };
//
//   store.dispatch("WaitTasks/addAction", task);
// }
async function showExpireMsg(data) {
    let act = await Vue.$msg({
        title: Vue.$t("general.attention"),
        content: Vue.$t("driverErrors.licWarning") + data,
        btns: [Vue.$t("general.confirm")],
    });
}

function readyUpdateBooksAndInxTask() {
    store.dispatch("bookListRefresh/setStatus", "ready", {
        root: true
    });
}

function startUpdateBooksAndInxTask() {
    store.dispatch("bookListRefresh/setStatus", "preparing", {
        root: true
    });
}

function isServerStationRunning(mode) {
    store.dispatch("networkModule/setServerStatusTo", mode);
}

function goToErrorPage({
    err,
    code
}) {
    router.replace({
        name: "lic_error",
        params: {
            err,
            code
        },
    });
}

function setNetErrorTo(val) {
    if (!val) {
        removeFromLoading(0.02);
    }
    store.state.networkModule.error = val;
}

function goToForceClose({
    err,
    code
}) {
    router.replace({
        name: "kickout",
    });
}

function goToNoServer({
    err,
    code
}) {
    router.replace({
        name: "noserver",
    });
}

function setMefKickOut(v) {
    store.dispatch("mefo/setNoSpace", false);
    store.dispatch("mefo/setKickOut", v);
}

function setMefNoPlace(v) {
    store.dispatch("mefo/setNoSpace", v);
}

function reloadPage() {
    location.href = window.location.protocol + "\\\\" + window.location.host;
    // router.replace({
    //   name: "network",
    // });
}

function goToNoPlace({
    err,
    code
}) {
    router.replace({
        name: "no_place",
    });
}

function setUserUId(data) {
    store.state.user.uId = data;
    if (store.state.printing.bookId) {
        sendPrintSocket(store.state.printing);
    }
}

async function warnAndCloseApp(old) {
    let payload = {
        title: Vue.$t("general.warning"),
        content: old ?
            Vue.$t("updates.runFromMainApp") :
            Vue.$t("updates.disklocalMismatch"),
        btns: [Vue.$t("general.confirm")],
    };
    await Vue.$msg(payload);

    globalThis.CLOSE_APP();
}

window.MEFO = {
    setMefNoPlace,
    setMefKickOut,
};