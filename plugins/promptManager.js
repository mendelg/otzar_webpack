import store from "@/store/store";
let promptManager = {};

promptManager.install = function(Vue) {
    Vue.prototype.$prompt = function(msg, center = false) {
        store.dispatch("prmptBox/show", msg);
        return new Promise((resolve, reject) => {
            Vue.prototype.$confirm = function(str) {
                store.dispatch("prmptBox/remove");
                resolve(str);
            };
            Vue.prototype.$removePrmpt = function() {
                store.dispatch("prmptBox/remove");
                resolve(false);
            };
        });
    };
};

export default promptManager;