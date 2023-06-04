let moment = require("moment");
let pastYear = moment().subtract(1, "years");
globalThis.pastYear = pastYear;
let plus = 10;

function clickHandler(e) {
    let secs = moment().diff(pastYear, "seconds");
    e.currentTarget.style.zIndex = secs;

    //e.target.style.zIndex = secs;
}
export default function(Vue) {
    Vue.directive("zindex", {
        // When the bound element is inserted into the DOM...
        inserted: function(el, binds) {
            let left = el.offsetLeft;
            let top = el.offsetTop;
            let secs = moment().diff(pastYear, "seconds");
            // add last zindex
            el.style.zIndex = secs;
            if (!binds.modifiers.fixed) {
                //neg the plus
                plus = ~plus;
                el.style.left = plus + left + "px";
                el.style.top = plus + top + "px";
            }
            //add event lis
            el.addEventListener("click", clickHandler);
        },
        update: function(el, binds) {
            el.removeEventListener("click", clickHandler);
            el.addEventListener("click", clickHandler);
        },
        unbind: function(el) {
            el.removeEventListener("click", el.clickHandler);
        },
    });
}