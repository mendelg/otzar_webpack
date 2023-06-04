export const namespaced = true;

export const state = {
    serverAsStation: false,
    network_timer: null,
    network: false,
    error: false,
};

export const mutations = {
    SET_SERVER_STATION_TO(state, mode) {
        state.serverAsStation = mode;
    },
};

export const actions = {
    setServerStatusTo({
        commit,
        state,
        rootState
    }, mode) {
        commit("SET_SERVER_STATION_TO", mode);
    },
};