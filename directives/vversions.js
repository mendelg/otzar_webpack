import store from "@/store/store";

export default function(Vue) {
    Vue.directive("version", {
        inserted: function(el, binds) {
            if (globalThis.SERVER_MODE == "online") return;

            const curVersoin = store.getters["offline/version"];
            if (binds.modifiers.less) {
                if (curVersoin > binds.value) el.remove();
            } else if (binds.modifiers.up) {
                if (curVersoin < binds.value) el.remove();
            } else {
                if (curVersoin != binds.value) el.remove();
            }
        },
    });
}