const uuidv1 = require("uuid/v1");
export const namespaced = true;

export const state = {
    notifications: []
};

export const mutations = {
    PUSH(state, notification) {
        state.notifications.push({
            ...notification
        });
    },
    DELETE(state, notificationId) {
        state.notifications = state.notifications.filter(
            notification => notification.id !== notificationId
        );
    }
};
export const actions = {
    add({
        commit
    }, notification) {
        notification.id = uuidv1();
        commit("PUSH", notification);
        return notification.id;
    },
    remove({
        commit
    }, notificationId) {
        commit("DELETE", notificationId);
    }
};