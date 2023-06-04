import Vue from "vue";
import {
    i18n
} from "@/localization/local";
import BootServer from "./BootServer.vue";

let vue = new Vue({
    i18n,
    render: (h) => h(BootServer),
}).$mount("#app");
export default vue;