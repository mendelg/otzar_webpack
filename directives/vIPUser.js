import VueInst from "@/main_app.js";
import store from "@/store/store";

function msg(event) {
    const notification = {
        type: "error",
        message: VueInst.$t("users.noSavePersonalData"),
        timeout: 2000,
        setting: {
            grid: "icon",
            nameIcon: "icon-print",
            position: "center",
        },
    };
    VueInst.$notify(notification);

    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
}

export default function(Vue) {
    Vue.directive("ipUser", {
        inserted: function(el, binding, vnode) {
            if (globalThis.SERVER_MODE == "offline") return;
            if (
                (store.state.user.userType == "IP" ||
                    store.state.user.userType == "GROUP") &&
                store.state.user.subUserId == 0
            ) {
                el.setAttribute("disabled", "");
                el.addEventListener("click", msg, {
                    capture: true
                });
            }
        },
        unbind: function(el, binding, vnode) {
            el.removeAttribute("disabled");
            el.removeEventListener("click", msg, {
                capture: true
            });
        },
        updated: function(el, binding, vnode) {
            if (globalThis.SERVER_MODE == "offline") return;
            if (
                (store.state.user.userType == "IP" ||
                    store.state.user.userType == "GROUP") &&
                store.state.user.subUserId == 0
            ) {
                el.setAttribute("disabled", "");
                el.addEventListener("click", msg, {
                    capture: true
                });
            }
        },
    });
}