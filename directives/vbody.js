export default function(Vue) {
    Vue.directive("body", {
        inserted: function(el, binding, vnode) {
            document.body.insertBefore(el, null);
            if (binding.modifiers.focuselement) {
                let focusEl = document.getElementById(binding.expression);
                focusEl.focus();
                //  focusEl.select();
            }
        },
        unbind: function(el) {
            /** @type {HTMLElement} */
            let elem = el;
            if (elem.parentElement == document.body) document.body.removeChild(el);
        },
    });
}