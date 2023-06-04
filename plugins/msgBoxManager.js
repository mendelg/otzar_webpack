import store from "@/store/store";
let msgBoxManager = {};

msgBoxManager.install = function(Vue) {
    Vue.prototype.$msg = function(msg, center = false) {
        store.dispatch("msgBox/show", msg);
        return new Promise((resolve, reject) => {
            Vue.prototype.$clickMsg = function(str) {
                store.dispatch("msgBox/remove");
                resolve(str);
            };
            Vue.prototype.$removeMsg = function() {
                store.dispatch("msgBox/remove");
                resolve("");
            };
        });
    };

    //   Vue.prototype.$clickMsg = function(str) {
    //     store.dispatch("msgBox/remove");
    //   };
    //   Vue.prototype.$removeMsg = function({ id }) {
    //     store.dispatch("msgBox/remove", id);
    //   };
};

export default msgBoxManager;