export const namespaced = true;

export const state = {
    pops: [],
};

export const mutations = {
    //set visibily of popup
    ADD(state, obj) {
        state.pops.push({
            pop: obj.comp,
            id: obj.id
        });
    },
    DEL(state, id) {
        state.pops = state.pops.filter((a) => a.id != id);
    },
};

export const actions = {
    //set visibily of popup

    add({
        commit,
        state
    }, comp) {
        if (state.pops.find((a) => (a.id = comp.id))) {
            return;
        }
        commit("ADD", comp);
    },
    del({
        commit
    }, id) {
        commit("DEL", id);
    },
};