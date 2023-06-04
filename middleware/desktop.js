import store from "@/store/store";

export default async function saveRecent({
    from,
    to
}) {
    store.state.saveRecentDesktop = false;

    return Promise.resolve({
        error: 0,
        next: null
    });
}