import {
    postUserSetting,
    addSettingListner,
} from "@/services/userSettingsData.js";
import VueInst from "@/main_app.js";
import store from "@/store/store";
import Vue from "vue";
const settingsObj = {
    get settings() {
        return store.state.user.settings;
    },
    async setSettings(key, value) {
        if (VueInst.$root.appMode.online() && VueInst.$root.userType.ipMainUser()) {
            if (key == "language")
                document.cookie = `lang=${value}; expires=Thu, 30 Dec 9999 12:00:00 UTC`;

            Vue.set(store.state.user.settings, key, value);
            return;
        }
        return postUserSetting({
            key,
            value
        });
    },
    delSettings(key) {},
    addListner(key, fn) {
        addSettingListner(key, fn);
    },
};
window.DEV_SETTINGS = settingsObj;
export default function(Vue) {
    Vue.mixin({
        computed: {
            userSettings() {
                return settingsObj;
            },
        },
    });
}

export async function setSettings(key, value) {
    return postUserSetting({
        key,
        value
    });
}