export const namespaced = true;
import init from "@/config/init.js";
import {
    Axios
} from "@/services/_axios";
export const state = {
    show: false,
    save: false,
    desktops: [],
    loadLast: true,
    doneLoadDesks: false,
    mode: "open",
    currentDesktop: "",
};

export const mutations = {
    SET_VISIBLE(state, mode) {
        state.show = mode;
        //reset to default
        if (!mode) state.mode = "open";
    },
    SET_OPEN_MODE(state, mode) {
        state.mode = mode;
        //state.save = mode;
    },
    SET_DESKS(state, data) {
        state.desktops = data;
        if (!state.doneLoadDesks) state.doneLoadDesks = true;
    },
    SET_CURRENT_DESKTOP(state, data) {
        state.currentDesktop = data;
    },
};

export const actions = {
    setVisible({
        commit
    }, mode) {
        commit("SET_VISIBLE", mode);
    },
    setCurrentDesktop({
        commit
    }, data) {
        commit("SET_CURRENT_DESKTOP", data);
    },
    async loadDesks({
        commit
    }) {
        try {
            let ret = await Axios.get(init.getServer() + "api/user/desktops");
            commit("SET_DESKS", ret.data);
        } catch {}
    },
    setSaveMode({
        commit
    }, mode) {
        commit("SET_OPEN_MODE", mode);
    },
    async changeDeskName({
        commit
    }, payload) {
        let ret;
        try {
            ret = await Axios.patch(init.getServer() + "api/user/desktops", payload);
            ret = await Axios.get(init.getServer() + "api/user/desktops");
            commit("SET_DESKS", ret.data);
        } catch (ex) {
            ret = await Axios.get(init.getServer() + "api/user/desktops");
            commit("SET_DESKS", ret.data);
        }
    },
    async setDefault({
        commit
    }, payload) {
        let ret;
        try {
            ret = await Axios.patch(
                init.getServer() + "api/user/desktops/default",
                payload
            );
            ret = await Axios.get(init.getServer() + "api/user/desktops");
            commit("SET_DESKS", ret.data);
        } catch (ex) {
            ret = await Axios.get(init.getServer() + "api/user/desktops");
            commit("SET_DESKS", ret.data);
        }
    },
    async delDesktop({
        commit
    }, id) {
        let ret;
        try {
            ret = await Axios.delete(init.getServer() + "api/user/desktops/" + id);
            ret = await Axios.get(init.getServer() + "api/user/desktops");
            commit("SET_DESKS", ret.data);
        } catch (ex) {
            ret = await Axios.get(init.getServer() + "api/user/desktops");
            commit("SET_DESKS", ret.data);
        }
    },
};