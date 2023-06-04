export default function(Vue) {
    Vue.directive("dev", {
        inserted: function(el, binds) {
            if (!globalThis.OTZAR_DEV_MODE &&
                localStorage.getItem("otzar_dev_mode") != "1"
            )
                el.remove();
        },
    });
}