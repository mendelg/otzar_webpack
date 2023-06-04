export const namespaced = true;

export const state = {
    stage: 0,
    percentage: 0,
    version: 0,
    ENUM_UPDATES_STAGES: {
        UPDATES_AVAILABE: 1,
        UPDATES_DOWNLOADING: 2,
        UPDATES_EXTRACTING: 3,
        COPY_TO_DRIVE: 4,
        COPY_TO_LOCAL: 5,
        READY: 6,
        ERROR: 7,
        UPDATED: 8,
    },
    info: null,
    inProcess: false,
    externalNotConnected: false,
    multiDisk: false,
};

export const mutations = {
    SET_EXTERNAL_NOT_CONNECTED(state, value) {
        state.externalNotConnected = value;
    },
    SET_MULTI_DISKS(state, value) {
        state.multiDisk = value;
    },
    SET_STAGE(state, stage) {
        state.stage = stage;
    },
    SET_PERCENTAGE(state, percentage) {
        state.percentage = percentage;
    },
    SET_VERSION(state, version) {
        state.version = version;
    },
    SET_INFO(state, info) {
        state.info = info;
    },
    SET_INPROCESS(state, value) {
        state.inProcess = value;
    },
};

export const actions = {
    setExternalNotConnected({
        commit
    }, value) {
        commit("SET_EXTERNAL_NOT_CONNECTED", value);
    },
    setMultiDisks({
        commit
    }, value) {
        commit("SET_MULTI_DISKS", value);
    },
    setInProcess({
        commit
    }, value) {
        commit("SET_INPROCESS", value);
    },
    setVersion({
        commit
    }, version) {
        commit("SET_VERSION", version);
    },
    setStage({
        commit
    }, stage) {
        commit("SET_STAGE", stage);
    },
    setPercentage({
        commit
    }, percentage) {
        commit("SET_PERCENTAGE", percentage);
    },
    setInfo({
        commit
    }, info) {
        commit("SET_INFO", info);
    },
};

export const getters = {
    getExternalNotConnected(state) {
        return state.externalNotConnected;
    },
    getMultiDisk() {
        return state.multiDisk;
    },
    getInfo(state) {
        return state.info;
    },
    getStage(state) {
        return state.stage;
    },
    getPercentage(state) {
        return state.percentage;
    },
    getVersion(state) {
        return state.version;
    },
    showNotifier(state) {
        return [
            state.ENUM_UPDATES_STAGES.UPDATES_AVAILABE,
            state.ENUM_UPDATES_STAGES.READY,
            state.ENUM_UPDATES_STAGES.ERROR,
        ].includes(state.stage);
    },
    showProgress(state) {
        return [
            state.ENUM_UPDATES_STAGES.UPDATES_DOWNLOADING,
            state.ENUM_UPDATES_STAGES.UPDATES_EXTRACTING,
            state.ENUM_UPDATES_STAGES.COPY_TO_LOCAL,
            state.ENUM_UPDATES_STAGES.COPY_TO_DRIVE,
        ].includes(state.stage);
    },
    getInProcess(state) {
        return ![
            state.ENUM_UPDATES_STAGES.READY,
            state.ENUM_UPDATES_STAGES.ERROR,
            state.ENUM_UPDATES_STAGES.UPDATED,
        ].includes(state.stage);
    },
    appUpdated() {
        return state.stage == state.ENUM_UPDATES_STAGES.UPDATED;
    },
};