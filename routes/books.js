import login from "@/middleware/auth";
import loading from "@/middleware/loading";
import mws from "@/middleware/mw_init.js";
import store from "@/store/store";
export default [{
    path: "/book/:book/p/:page/t/:tab/fs/:fs/start/:start/end/:end/c",
    name: "bookOnly",
    component: () =>
        import ( /* webpackChunkName: "Book" */ "@/pages/Book.vue"),
    props: true,
    async beforeEnter(to, from, next) {
        store.dispatch("setBookOnlyMode", true);
        await mws({
            to,
            from,
            next
        }, [login, loading]);
        next();
    },
    // meta: {
    //   middleware: [login, loading, desktop, loadDesktop],
    // },
}, ];