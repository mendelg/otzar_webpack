import store from "@/store/store";

export default function(Vue) {
    Vue.directive("modal", {
        inserted: function(el, binding, vnode) {
            store.state.hasModalOpen = true;
        },
        unbind: function(el) {
            store.state.hasModalOpen = false;
        },
        updated: (el) => {
            if (el.style.display == "none") store.state.hasModalOpen = false;
            store.state.hasModalOpen = true;
        },
    });
}