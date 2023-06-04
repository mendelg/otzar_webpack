import VueInst from "@/main_app.js";

function msg(Vue) {
    const notification = {
        type: "error",
        message: VueInst.$t("optionNotAvailableInDemoV"),

        timeout: 2000,
        setting: {
            grid: "icon",
            nameIcon: "not-allowed",
            position: "center",
        },
    };
    Vue.notify(notification);
}

export default function(Vue) {
    Vue.directive("disable", {
        inserted: function(el, binding, vnode) {
            if (globalThis.DEV_FOR_TEST_OR_REAL_PROD) return;
            /** @type {HTMLElement} */
            // let old_element = el;
            // let new_element = old_element.cloneNode(true);
            // old_element.parentNode.replaceChild(new_element, old_element);
            // new_element.onclick = () => msg(Vue);
        },
        updated: function(el, binding, vnode) {
            if (globalThis.DEV_FOR_TEST_OR_REAL_PROD) return;
            /** @type {HTMLElement} */
            // let old_element = el;
            // let new_element = old_element.cloneNode(true);
            // old_element.parentNode.replaceChild(new_element, old_element);
            // new_element.onclick = () => msg(Vue);
        },
    });
}