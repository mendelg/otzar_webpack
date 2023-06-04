import router from "@/routes/router";
export const namespaced = true;
import VueInst from "@/main_app.js";

export const state = {
    loaders: [{
            id: 0.001,
            title: "applyUpdates",
        },
        {
            id: 0.01,
            title: "appinfo",
        },
        {
            id: 0.02,
            title: "network_server",
        },
        {
            id: 0.03,
            title: "licencecheck",
        },
        {
            id: 0.04,
            title: "delbooks",
        },
        {
            id: 0.1,
            title: "userSettings",
        },
        {
            id: 1,
            title: "lastBooks",
        },
        {
            id: 2,
            title: "favBooks",
        },
        {
            id: 3,
            title: "userFolder",
        },
        {
            id: 4,
            title: "yesodInx",
        },
        {
            id: 5,
            title: "systemFolders",
        },
        {
            id: 6,
            title: "books",
        },
        {
            id: 7,
            title: "searchHistory",
        },
        {
            id: 8,
            title: "userAdds",
        },
        // {
        //   id: 9,
        //   title: "טוען הגדרות משתמש",
        // },
        {
            id: 10,
            title: "quickBtn",
        },
        {
            id: 11,
            title: "altWords",
        },
        {
            id: 12,
            title: "customSortB",
        },
        {
            id: 13,
            title: "autoBackup",
        },
        // {
        //   id: 14,
        //   title: "socketConnected",
        // },
    ],
    doneLoading: false,
    refer: null,
    slowLoading: false,
    upgrading: false,
    upgradeErrorMsg: "",
    upgradingMefo: false,
    applyUpdatesProgMsg: "",
};

export const mutations = {
    REMOVE_FROM_LOADER(state, id) {
        state.loaders = state.loaders.filter((x) => x.id != id);
    },
    DONE_LOADER(state) {
        state.doneLoading = true;

        if (state.refer) router.push(state.refer);
        else
            router.push({
                name: "home",
            });
    },
};

export const actions = {
    removeFromLoader({
        commit,
        state,
        rootState
    }, id) {
        commit("REMOVE_FROM_LOADER", id);

        if (state.loaders.length == 0) {
            //check if we in error page then dont go
            if (!rootState.fatalError) commit("DONE_LOADER");
        }
    },
};

export const getters = {
    getTextLoading(state) {
        if (state.upgrading) {
            if (state.upgradeErrorMsg != "") return "error";
            return parseInt(VueInst.otzarVersion) == 19 ?
                "upgradingMefoDB" :
                "upgradingDB";
        }

        return state.loaders.length ? state.loaders[0].title : "done";
    },
};