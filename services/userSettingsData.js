//userSettingsData

import {
    Axios
} from "@/services/_axios";
import store from "@/store/store";
import init from "@/config/init.js";
let trigger = [];
let subs = new Map();
let firstTime = true;
//settings
export function postUserSetting({
    key,
    value
}) {
    let url = init.getServer() + init.UsersDB.users + init.UsersDB.settings;
    return Axios.post(url, {
            key,
            value
        })
        .then((response) => {
            getUserSettingsAndSetIt(response.data);
            return response;
        })
        .catch(function(error) {
            console.error(error);
        });
}
export async function getUserSetting() {
    let url = init.getServer() + init.UsersDB.users + init.UsersDB.settings;
    let settings = await Axios.get(url);
    return settings.data;
}

export async function getUserSettingsAndSetIt(old = null) {
    if (!old) {
        old = await getUserSetting();
    }
    const hadLang = old.find((a) => a.settingKey == "language");
    if (!hadLang) old.push({
        settingKey: "language",
        settingValue: "he"
    });

    let settings = settingsToObject(old);
    if (!settings.language) settings.language = "he";
    store.dispatch("user/setUserSettings", settings);
    trigger.forEach((fn) => fn.fn(fn.val));
    if (firstTime) firstTime = false;
}

export function settingsToObject(settings) {
    let obj = {};
    if (!firstTime) trigger = [];
    settings.forEach((element) => {
        obj[element.settingKey] = element.settingValue;
        //Call listerns
        let subsFn = subs.get(element.settingKey);
        if (subsFn) {
            if (JSON.stringify(element.settingValue) != JSON.stringify(subsFn.old)) {
                subsFn.old = element.settingValue;
                subsFn.subs.forEach((a) =>
                    trigger.push({
                        fn: a,
                        val: element.settingValue
                    })
                );
            }
        }
    });
    return obj;
}
export function deleteUserSetting(userDataKey) {
    let url =
        init.getServer() +
        init.UsersDB.users +
        init.UsersDB.settings +
        "/" +
        userDataKey;
    Axios.delete(url)
        .then((response) => {
            return response;
        })
        .catch(function(error) {
            console.error(error);
        });
}

export function addSettingListner(key, fn) {
    let setting = subs.get(key);
    if (!setting) {
        setting = {
            subs: new Set(),
            old: undefined
        };
        subs.set(key, setting);
    }
    setting.subs.add(fn);
}

export function removeSettingListner(key, fn) {
    let setting = subs.get(key);
    if (setting) setting.subs.delete(fn);
}