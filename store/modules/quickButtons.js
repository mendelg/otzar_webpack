export const namespaced = true;
import {
    addQuickButton,
    getUserQuickButtons,
} from "@/services/userFoldersData";
import Vue from "vue";
export const state = {
    buttons: [],
    showAddQuickBtn: false,
    booksToAdd: [],
};

export const mutations = {
    ADD(state, btn) {
        state.buttons.push(btn);
    },
    SET(state, data) {
        state.buttons = data;
    },
    DELETE(state, id) {
        state.buttons = state.buttons.filter((btn) => btn.id !== id);
    },
    SHOW(state, value) {
        state.showAddQuickBtn = value;
    },
    ADD_BOOKS(state, books) {
        state.booksToAdd = books;
    },
};
export const actions = {
    add({
        commit
    }, btn) {
        return new Promise(function(resolve, reject) {
            addQuickButton(btn)
                .then((button) => {
                    if (button) {
                        commit("ADD", button);
                        resolve(button.id);
                    } else reject(-1);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
    remove({
        commit
    }, id) {
        commit("DELETE", id);
    },
    setData({
        commit
    }, data) {
        commit("SET", data);
    },
    showAddQuickBtn({
        commit
    }, data) {
        commit("SHOW", data);
    },
    addBooks({
        commit
    }, data) {
        commit("ADD_BOOKS", data);
    },
    setQuickButtonsData({
        dispatch
    }) {
        return new Promise(function(resolve, reject) {
            getUserQuickButtons()
                .then((r) => {
                    dispatch("setData", r);
                    resolve(true);
                })
                .catch((error) => {
                    console.error(error);
                    reject(false);
                });
        });
    },
};

export const getters = {
    getButtons(state) {
        return state.buttons;
    },
    isShow(state) {
        return state.showAddQuickBtn;
    },
    getBooks(state) {
        return state.booksToAdd;
    },
};