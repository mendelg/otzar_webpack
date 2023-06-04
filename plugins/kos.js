import {
    Axios
} from "@/services/_axios";
let oks = {};
oks.install = function(Vue) {
    Vue.$show_oks = showOks;
    Vue.prototype.$show_oks = showOks;
    window.$show_oks = showOks;
};

let showOks = function() {
    return Axios.get("/api/general/kos");
};
export default oks;
export const showKeyboard = () => showOks();