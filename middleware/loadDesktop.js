import {
    getRecentDesktop
} from "@/services/desktops.js";

export default async function saveRecent({
    from,
    to
}) {
    return getRecentDesktop().then((res) => {
        let desk = res.data[0];
        return Promise.resolve({
            error: 0,
            next: null
        });
    });
}