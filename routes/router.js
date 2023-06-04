import Vue from "vue";
import Router from "vue-router";

// import licenseCheck from "@/middleware/licenseCheck";
import login from "@/middleware/auth";
import desktop from "@/middleware/desktop";
import loadDesktop from "@/middleware/loadDesktop";
// import delBooksChecks from "@/middleware/delbooks";
import mws from "@/middleware/mw_init.js";
import loading from "@/middleware/loading";
// import remeber from "@/middleware/remeber";
import menuRoute from "./menu";
import bookRoute from "./books";
// import Menu from "@/components/popupMenu/MainMenu.vue";
import error from "@/pages/Error.vue";
import licenseError from "@/pages/LicenseError.vue";
import noPlace from "@/pages/NoPlace.vue";
import kickout from "@/pages/Kickout.vue";
import NoServer from "@/pages/NoServer.vue";

import network from "@/pages/network.vue";
import managePanel from "@/pages/managePanelIPUsers.vue";
import OnlineDisconnect from "@/pages/onlineDisconnect.vue";
import store from "@/store/store";
const Book = () =>
    import ( /* webpackChunkName: "Book" */ "@/pages/Book.vue");

Vue.use(Router);

export default new Router({
    routes: [
        ...bookRoute,
        {
            path: "/",
            async beforeEnter(to, from, next) {
                if (to.query.home) store.state.homePage = true;
                globalThis.firstTime = -1;
                if (to.name != "book") globalThis.firstTime = 0;
                else if (globalThis.firstTime === -1) {
                    globalThis.firstTime = 1;
                }
                next();
            },
            component: () =>
                import ( /* webpackChunkName: "Home" */ "@/pages/Home.vue"),
            children: [
                ...menuRoute, ,
                {
                    path: "b/:book/p/:page/t/:tab/fs/:fs/start/:start/end/:end/c/:c?",
                    name: "book",
                    components: {
                        book: Book
                    },
                    async beforeEnter(to, from, next) {
                        await mws({
                            to,
                            from,
                            next
                        }, [
                            // licenseCheck,
                            // delBooksChecks,
                            login,
                            loading,
                            desktop,
                            loadDesktop,
                        ]);
                    },
                    meta: {
                        // middleware: [login, loading, desktop, loadDesktop]
                    },
                },
                {
                    path: "exKotar/:book",
                    name: "exlibrisKotar",
                    components: {
                        book: Book
                    },
                    async beforeEnter(to, from, next) {
                        await mws({
                            to,
                            from,
                            next
                        }, [
                            // licenseCheck,
                            // delBooksChecks,
                            login,
                            loading,
                            desktop,
                            loadDesktop,
                        ]);
                    },
                },
                {
                    path: "",
                    name: "main",
                    components: {
                        book: Book
                    },
                    async beforeEnter(to, from, next) {
                        await mws({
                            to,
                            from,
                            next
                        }, [
                            // licenseCheck,
                            // delBooksChecks,
                            login,
                            loading,
                            desktop,
                            loadDesktop,
                        ]);
                    },
                    meta: {
                        // middleware: [login, loading, desktop, loadDesktop],
                    },
                },
            ],
        },
        {
            path: "/login",
            name: "login",
            component: () =>
                import ( /* webpackChunkName: "Login" */ "@/pages/Login.vue"),
        },
        {
            path: "/create-user-9238d82",
            name: "createuser",
            component: () =>
                import ( /* webpackChunkName: "Login" */ "@/pages/CreateUser.vue"),
        },
        {
            path: "/loading",
            name: "loading",
            props: true,
            component: () =>
                import ( /* webpackChunkName: "Loader" */ "@/pages/Loading.vue"),
        },
        {
            path: "/about",
            name: "about",
            meta: {
                // middleware: login,
            },
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () =>
                import ( /* webpackChunkName: "about" */ "@/pages/About.vue"),
        },
        {
            path: "/b/:book",
            name: "child-book",
            component: () =>
                import (
                    /* webpackChunkName: "Book" */
                    "@/components/book/booksContainer.vue"
                ),
            props: true,
            async beforeEnter(to, from, next) {
                await mws({
                    to,
                    from,
                    next
                }, [
                    // licenseCheck,
                    // delBooksChecks,
                    login,
                    loading,
                    desktop,
                    loadDesktop,
                ]);
            },
            // meta: { middleware: [login, loading, desktop, loadDesktop] },
        },
        {
            path: "/error/:err",
            name: "error",
            component: error,
            props: true,
        },
        {
            path: "/licerror/:err",
            name: "lic_error",
            component: licenseError,
            props: true,
        },
        {
            path: "/noplace",
            name: "no_place",
            component: noPlace,
            props: true,
        },
        {
            path: "/kickout",
            name: "kickout",
            component: kickout,
            props: true,
        },
        {
            path: "/noserver",
            name: "noserver",
            component: NoServer,
            props: true,
        },
        {
            path: "/network",
            name: "network",
            component: network,
        },
        {
            path: "/disconnected",
            name: "disconnected",
            component: OnlineDisconnect,
        },
        {
            path: "/passres/:id/:type?",
            name: "password-reset",
            props: true,
            component: () =>
                import ( /* webpackChunkName: "PassReset" */ "@/pages/PassReset.vue"),
        },
        {
            path: "/manage-panel",
            name: "manage-panel",
            component: managePanel,
        },
    ],
});