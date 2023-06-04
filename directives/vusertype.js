import VueInst from "@/main_app.js";
import store from "@/store/store";

function msg() {
    const notification = {
        type: "error",
        message: VueInst.$t("optionNotAvailableForGuest"),

        timeout: 2000,
        setting: {
            grid: "icon",
            nameIcon: "not-allowed",
            position: "center",
        },
    };
    VueInst.$notify(notification);
}

function addEvent(el) {
    /** @type {HTMLElement} */
    let elem = el;
    elem.removeEventListener("click", msg);
    elem.addEventListener("click", msg);

    elem.style.cursor = "default";
    elem.style.color = "lightgrey";
}
export default function(Vue) {
    Vue.directive("usertype", {
        inserted: function(el, binding, vnode) {
            if (
                globalThis.SERVER_MODE === "online" &&
                store.state.user.userType === "GUEST" &&
                binding.modifiers.guest
            ) {
                addEvent(el);
            }
        },
        unbind: function(el, binding, vnode) {
            el.removeEventListener("click", msg);
        },
        updated: function(el, binding, vnode) {
            if (
                globalThis.SERVER_MODE === "online" &&
                store.state.user.userType === "GUEST" &&
                binding.modifiers.guest
            ) {
                addEvent(el);
            }
        },
    });
}