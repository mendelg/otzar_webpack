export const namespaced = true;

export const state = {
    defaultBackupLocation: "",
    lastBackupFile: null,
};

//mutations
export const mutations = {
    SET_DEFAULT_LOCAION(state, payload) {
        state.defaultBackupLocation = payload;
    },
    SET_LAST_BACKUP_FILE(state, payload) {
        state.lastBackupFile = payload;
    },
};

//actions
export const actions = {
    setDefaultBackupLocation({
        commit
    }, location) {
        commit("SET_DEFAULT_LOCAION", location);
    },
    setLastBackupFile({
        commit
    }, file) {
        commit("SET_LAST_BACKUP_FILE", file);
    },
};

export const getters = {
    defaultBackupLocation(state) {
        return state.defaultBackupLocation;
    },
    lastBackupFile(state) {
        return state.lastBackupFile;
    },
    backupType() {
        return window.DEV_SETTINGS.settings.backupLocationType || "system";
    },
    autoBackup() {
        return window.DEV_SETTINGS.settings.autoBackup == 1;
    },
    cusBackupLocation() {
        return window.DEV_SETTINGS.settings.customBackupLocation;
    },
    backupLocation(state, getters) {
        let location =
            getters.backupType === "system" ?
            getters.defaultBackupLocation :
            getters.cusBackupLocation;
        if (location) return location.replace(/\//g, "\\").replace(/\\\\/g, "\\");
        else return "";
    },
};