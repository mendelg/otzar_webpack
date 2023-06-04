import Vue from "vue";
import {
    i18n
} from "@/localization/local";
import BootApp from "./BootApp.vue";

let vue = new Vue({
    i18n,
    render: (h) => h(BootApp),
}).$mount("#app");
export default vue;