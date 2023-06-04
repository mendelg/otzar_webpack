import VueInst from "@/main_app.js";
import store from "@/store/store";

function msg() {
    const notification = {
        type: "error",
        message: VueInst.$t("optionNotAvailableInThisV"),

        timeout: 2000,
        setting: {
            grid: "icon",
            nameIcon: "not-allowed",
            position: "center",
        },
    };
    VueInst.$notify(notification);
}

function blockHandler(e) {
    /**@type {Event}*/
    const event = e;
    msg();
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
}
export default function(Vue) {
    Vue.directive("kiosk", {
        inserted: function(el, binding, vnode) {
            if (!store.state.kiosk || binding.value === false) return;
            if (binding.modifiers.remove) {
                return el.remove();
            }
            /** @type {HTMLElement} */
            let old_element = el;
            old_element.addEventListener("click", blockHandler, {
                capture: true
            });
            old_element.disabled = true;
            old_element.style.cursor = "no-drop !important";
            // let new_element = old_element.cloneNode(true);
            // let p = old_element.parentNode;
            // if (!p) return;
            // p.replaceChild(new_element, old_element);
            // new_element.onclick = () => msg(Vue);
            // new_element.disabled = true;
            // new_element.style.cursor = "no-drop";
        },
        updated: function(el, binding, vnode) {
            if (!store.state.kiosk || binding.value === false) return;
            if (binding.modifiers.remove) return el.remove();
            /** @type {HTMLElement} */
            let old_element = el;
            old_element.removeEventListener("click", blockHandler, {
                capture: true
            });
            old_element.addEventListener("click", blockHandler, {
                capture: true
            });
            old_element.disabled = true;
            old_element.style.cursor = "no-drop !important";
            // let new_element = old_element.cloneNode(true);
            // let p = old_element.parentNode;
            // if (!p) return;
            // p.replaceChild(new_element, old_element);
            // new_element.onclick = () => msg(Vue);
            // new_element.disabled = true;
            // new_element.style.cursor = "no-drop !important";
        },
        unbind(el) {
            el.removeEventListener("click", blockHandler, {
                capture: true
            });
        },
    });
}