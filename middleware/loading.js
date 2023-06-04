//import store from "@/store/store";

export default function loading({
    to
}) {
    let store = require("@/store/store").default;
    if (store.state.loader == undefined) return next();
    if (!store.state.loader.doneLoading) {
        store.state.loader.refer = to;
        let next = {
            name: "loading",
            params: {
                refer: to,
            },
        };
        return Promise.resolve({
            error: 0,
            next
        });
    }

    return Promise.resolve({
        error: 0,
        next: null
    });
}