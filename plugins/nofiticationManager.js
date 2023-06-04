import store from "@/store/store";
let notificationmanager = {};

notificationmanager.install = function(Vue) {
    Vue.notify = notifyFunc;

    Vue.prototype.$notify = notifyFunc;
    Vue.prototype.$removeNotify = function({
        id
    }) {
        store.dispatch("notification/remove", id);
    };
};

let notifyFunc = function(notification) {
    store.dispatch("notification/add", notification).then((id) => {
        if (notification.hasOwnProperty("await")) {}
        if (notification.hasOwnProperty("timeout")) {
            setTimeout(() => {
                store.dispatch("notification/remove", id);
            }, notification.timeout);
        }
    });
};
export default notificationmanager;