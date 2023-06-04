import store from "@/store/store";
export default async function auth({
    to,
    from
}) {
    if (!store.state.user.username) {
        //if free user so let log him
        if (globalThis.SERVER_MODE === "offline") {
            await store.dispatch("user/login", {
                username: "זמני",
                password: "1234",
            });
            return Promise.resolve({
                error: 0,
                next: null
            });
        } else {
            let originalRef = from.refer ? from.refer : to;
            let routeData = {
                name: "login",
                params: {
                    refer: originalRef
                }
            };
            return Promise.resolve({
                error: 0,
                next: routeData
            });
        }
    } else {
        return Promise.resolve({
            error: 0,
            next: null
        });
    }
}