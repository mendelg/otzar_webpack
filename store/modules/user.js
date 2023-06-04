import {
    loginUser,
    loadAllUserData,
    updateVisitSubUser,
    addUserVisit,
    getUserExtraInfo,
    ENUM_LOGIN_WIN_MODES,
} from "@/services/login.js";
import {
    Axios,
    setAuthHeader,
    clearAuthHeader
} from "@/services/_axios.js";

import {
    settingsToObject
} from "@/services/userSettingsData";
import {
    getSocket
} from "@/main_app";
import VueInst from "@/main_app.js";
import onlineStationsHelper from "@/services/onlineStations";
import general from "@/config/general";

export const namespaced = true;
export const state = {
    userId: 0,
    clientId: 0,
    stickerId: 0,
    username: "",
    fullname: "",
    permissions: [],
    token: "",
    userType: "",
    settings: {},
    showLogin: false,
    licenseInfo: {},
    refreshLicense: 0,
    phone: "",
    cellPhone: "",
    email: "",
    subUserId: 0,
    subUserName: "",
    subUserToken: "",
    IPUserManager: false,
    uId: "",
    disconnectStation: 20,
    extraInfo: null,
    showLoginMode: ENUM_LOGIN_WIN_MODES.LOGIN,
    otzarConnection: true,
    mefConnection: true,
    pendingUserName: "",
    otzarFull: false,
    mefFull: false,
    reactAppConnection: 0,
    loginTab: 1,
};
export const mutations = {
    SET_OTZAR_CONNECTION(state, payload) {
        state.otzarConnection = payload;
    },
    SET_MEF_CONNECTION(state, payload) {
        state.mefConnection = payload;
    },
    SET_SUB_USER(state, {
        subUserId,
        subUserName,
        subUserToken
    }) {
        state.subUserId = subUserId;
        state.subUserName = subUserName;
        state.subUserToken = subUserToken;
    },
    SET_USER_EXT_INFO(state, {
        token
    }) {
        if (globalThis.SERVER_MODE == "offline") return;
        getUserExtraInfo(token).then((data) => {
            if (data) state.extraInfo = data;
            //start online timer
            if (VueInst.appMode.online() && state.userType !== "GUEST")
                onlineStationsHelper.startOnlineTimer();
        });
    },
    SET_USER_DATA(state, {
        userData,
        token,
        settings
    }) {
        let protectionCode = 0;

        if (userData.permissions) {
            userData.permissions.forEach((p) => {
                protectionCode = protectionCode | p.protectionCode;
            });
        }

        state.bothApps =
            protectionCode & general.licensePackages.MEF_OTZAR &&
            protectionCode & general.licensePackages.FULL;
        if (userData.connectionInfo ? .full && VueInst.appMode.online()) {
            if (userData.connectionInfo ? .switchApps)
                state.showLoginMode = ENUM_LOGIN_WIN_MODES.SWITCHAPPS;
            else state.showLoginMode = ENUM_LOGIN_WIN_MODES.STATIONS_FULL;
            state.showLogin = true;
        }

        const socket = getSocket();
        socket.emit("setUserSocket", {
            connectionType:
                (state.otzarConnection &&
                    state.mefConnection &&
                    userData.userType == "GROUP") ||
                userData.userType != "GROUP" ?
                "both" :
                state.mefConnection ?
                "mef" :
                "otzar",
            token,
            login: true,
        });

        state.token = token;
        state.userId = userData.id;
        state.clientId = userData.clientId;
        state.stickerId = userData.stickerId;
        state.username = userData.username;
        state.fullname =
            (userData.firstName || "") + " " + (userData.lastName || "");
        state.permissions = protectionCode;
        state.userType = userData.userType || "";
        state.phone = userData.phone;
        state.cellPhone = userData.cellPhone;
        state.email = userData.email;
        if (settings) state.settings = settingsToObject(settings);
        state.pendingUserName = userData.pendingUser || "";
        state.otzarFull = userData.connectionInfo ? .otzarFull || false;
        state.mefFull = userData.connectionInfo ? .mefFull || false;
    },
    SET_USER_SETTINGS(state, settings) {
        state.settings = settings;
    },
    CLEAR_USER_DATA(state) {
        state.clientId = 0;
        state.username = "";
        state.permissions = [];
        state.token = "";
        state.stickerId = 0;
        state.settings = {};
        state.userType = "";
        state.licenseInfo = {};
        state.pendingUserName = "";
    },
    SET_LICENSE_INFO(state, licenseInfo) {
        state.licenseInfo = licenseInfo;
    },
    SET_PERMISSIONS(state, permissions) {
        let protectionCode = 0;

        if (permissions) {
            permissions.forEach((p) => {
                protectionCode = protectionCode | p.protectionCode;
            });
        }
        state.permissions = protectionCode;
    },
};
export const actions = {
    setSubUser({
        commit,
        state
    }, {
        subUserId,
        subUserName,
        token
    }) {
        commit("SET_SUB_USER", {
            subUserId,
            subUserName,
            subUserToken: token
        });

        if (subUserId > 0) {
            updateVisitSubUser({
                subUser: subUserName,
                uId: state.uId
            });
            setAuthHeader({
                token
            });
            loadAllUserData();
        } else {
            let data = localStorage.getItem("user");
            setAuthHeader(JSON.parse(data));
            loadAllUserData();
        }
    },
    loginSubUser({
        state
    }) {},
    setLicenseInfo({
        commit
    }, licenseInfo) {
        commit("SET_LICENSE_INFO", licenseInfo);
    },
    setPermissions({
        commit
    }, permissions) {
        commit("SET_PERMISSIONS", permissions);
    },
    setUser({
        dispatch,
        commit,
        rootState
    }, data) {
        let mef = false,
            otzar = false;
        if (
            data.userData.userType == "SINGLE" ||
            data.userData.userType == "GUEST"
        ) {
            mef = true;
            otzar = true;
        }

        if (data.userData.userType == "GROUP") {
            if (
                data.userData.connectionInfo ? .type == "both" ||
                data.userData.connectionInfo ? .type == "otzar"
            ) {
                otzar = true;
            }
            if (
                data.userData.connectionInfo ? .type == "both" ||
                data.userData.connectionInfo ? .type == "mef"
            ) {
                mef = true;
            }
        }
        commit("SET_OTZAR_CONNECTION", otzar);
        commit("SET_MEF_CONNECTION", mef);
        state.reactAppConnection++;
        rootState.reloadAllPages++;

        dispatch("setUserData", data);
        localStorage.setItem("user", JSON.stringify(data));
        setAuthHeader(data);

        //add user visit
        //addUserVisit();

        return Promise.resolve();
    },
    setUserData({
        commit,
        state,
        dispatch
    }, {
        userData,
        token
    }) {
        commit("SET_USER_DATA", {
            userData,
            token
        });
        commit("SET_USER_EXT_INFO", {
            token
        });
        dispatch("setChabadActiveStore", null);
        dispatch("books/removeNBT", undefined, {
            root: true
        });

        if (globalThis.SERVER_MODE == "online" && userData.error) {
            let act = VueInst.$msg({
                title: VueInst.$t("general.warning"),
                content: VueInst.$t(`login.${userData.error}`),
                btns: [VueInst.$t("general.confirm")],
            });
        }
    },
    setChabadActiveStore({
        state,
        dispatch
    }) {
        //if license is chabad set activestore to chabad
        if (
            (state.permissions & general.licensePackages.CHABAD) > 0 &&
            (state.permissions & general.licensePackages.FULL) == 0
        ) {
            dispatch("folders/setChabadActiveStore", null, {
                root: true
            });
        }
    },
    setUserSettings({
        commit
    }, data) {
        commit("SET_USER_SETTINGS", data);
    },
    async login({
        dispatch
    }, user) {
        if (globalThis.SERVER_MODE == "offline") {
            try {
                //on offline mode take user details from ROOT\data\userData.json file
                await Axios.get("api/general/user_details");
            } catch (ex) {
                console.log(ex);
            }
        }
        try {
            const {
                data
            } = await loginUser(user, false);
            await dispatch("setUserData", data);

            localStorage.setItem("user", JSON.stringify(data));
            setAuthHeader(data);
            return data;
        } catch (error) {
            throw error;
        }
    },
    loginFreeUser({
        commit,
        dispatch
    }) {
        return loginUser({
                username: "",
                password: ""
            }, true)
            .then(({
                data
            }) => {
                dispatch("setUserData", data);
                localStorage.setItem("user", JSON.stringify(data));
                setAuthHeader(data);
                //add user visit
                //addUserVisit();
                return Promise.resolve();
            })
            .catch((error) => {
                console.error(error);
                return Promise.reject(error);
            });
    },
    logout({
        dispatch
    }, data) {
        onlineStationsHelper.stopOnlineTimer();
        //  addUserVisit(false, true).then(() => {
        dispatch("setUserData", data);
        localStorage.setItem("user", JSON.stringify(data));
        setAuthHeader(data);
        //add user visit
        //  addUserVisit();
        return Promise.resolve();
        //  });
    },
};
export const getters = {
    hasMefConnection(state) {
        let r = state.reactAppConnection;
        return state.mefConnection;
    },
    hasOtzarConnection(state) {
        let r = state.reactAppConnection;
        return state.otzarConnection;
    },
    getUserPermissions() {
        return state.permissions;
    },
    getSubUserData(state) {
        return {
            subUserId: state.subUserId,
            subUserName: state.subUserName,
            subUserToken: state.subUserToken,
        };
    },
    isUserGuest(state) {
        return globalThis.SERVER_MODE == "offline" ?
            false :
            state.userType == "GUEST";
    },
    isUserIP(state) {
        return globalThis.SERVER_MODE == "offline" ?
            false :
            state.userType == "IP" || state.userType == "GROUP";
    },
    isIPLimited() {
        return globalThis.SERVER_MODE == "offline" ?
            false :
            (state.userType == "IP" || state.userType == "GROUP") &&
            state.subUserId == 0;
    },
    getUserName(state) {
        //return state.username;
        return state.fullname;
    },
    getPendingUserName(state) {
        //return state.username;
        return state.pendingUserName;
    },
    getUserId(state) {
        return state.userId;
    },
    getUserToken(state) {
        return state.token;
    },
    getOtzarVersion(state) {
        let react = state.refreshLicense;
        return state.licenseInfo.otzarVer || 19;
    },
    hasMefLicense(state) {
        return globalThis.SERVER_MODE == "online" ?
            state.permissions & general.licensePackages.MEF_OTZAR :
            state.licenseInfo.mefotzarLicence > 0;
    },
    hasOtzarLicense(state) {
        return;
        state.permissions & general.licensePackages.ALL;
    },
    getUserContactDeatils(state) {
        const {
            phone,
            cellPhone,
            email
        } = state;
        return {
            phone,
            cellPhone,
            email
        };
    },
    isOtzarFull: (state) => state.otzarFull,
    isMefFull: (state) => state.mefFull,
};