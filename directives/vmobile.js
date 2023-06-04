export let mobile = false;
if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    )
) {
    mobile = true;
}
export default function(Vue) {
    Vue.directive("mobile", {
        inserted: function(el, binding, vnode) {
            /**@type {HTMLElement} */
            const elem = el;
            if (binding.modifiers.show) {
                if (!mobile) elem.style.display = "none";
                else elem.style.display = "none";
            } else if (binding.modifiers.hide) {
                if (mobile) elem.style.display = "none";
            }
        },
    });
}