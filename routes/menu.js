import login from "@/middleware/auth";
import mws from "@/middleware/mw_init.js";
import desktop from "@/middleware/desktop";
import loadDesktop from "@/middleware/loadDesktop";
import loading from "@/middleware/loading";
const Book = () =>
    import ( /* webpackChunkName: "Book" */ "@/pages/Book.vue");
const Menu = () =>
    import (
        /* webpackChunkName: "MainMenu" */
        "@/components/popupMenu/MainMenu.vue"
    );
export default [{
        path: "/menu",
        name: "main-menu",
        components: {
            book: Book,
            menu: Menu
        },
        async beforeEnter(to, from, next) {
            await mws({
                to,
                from,
                next
            }, [login, loading]);
        },
        // meta: {
        //   middleware: [login, loading, desktop, loadDesktop],
        // },
        children: [{
                path: "menuOptions",
                name: "menu-options",
                component: () =>
                    import (
                        /* webpackChunkName: "MainSetting" */
                        "@/components/popupMenu/MenuOptions.vue"
                    ),
                async beforeEnter(to, from, next) {
                    await mws({
                        to,
                        from,
                        next
                    }, [login, loading]);
                },
                // meta: {
                //   middleware: [login, loading, desktop, loadDesktop],
                // },
            },
            {
                path: "setting",
                name: "main-setting",
                component: () =>
                    import (
                        /* webpackChunkName: "MainSetting" */
                        "@/components/popupMenu/MenuOptions/setting/MainSetting.vue"
                    ),
                async beforeEnter(to, from, next) {
                    await mws({
                        to,
                        from,
                        next
                    }, [login, loading]);
                },
                // meta: {
                //   middleware: [login, loading, desktop, loadDesktop],
                // },
            },
            {
                path: "languageSetting",
                name: "language-setting",
                component: () =>
                    import (
                        /* webpackChunkName: "LanguageSetting" */
                        "@/components/popupMenu/MenuOptions/setting/LanguageSetting.vue"
                    ),
                async beforeEnter(to, from, next) {
                    await mws({
                        to,
                        from,
                        next
                    }, [login, loading]);
                },
                // meta: {
                //   middleware: [login, loading, desktop, loadDesktop],
                // },
            },
            {
                path: "displaySetting",
                name: "display-setting",
                component: () =>
                    import (
                        /* webpackChunkName: "DisplaySetting" */
                        "@/components/popupMenu/MenuOptions/setting/DisplaySetting.vue"
                    ),
                async beforeEnter(to, from, next) {
                    await mws({
                        to,
                        from,
                        next
                    }, [login, loading]);
                },
                // meta: {
                //   middleware: [login, loading, desktop, loadDesktop],
                // },
            },
            {
                path: "mainTools",
                name: "main-tools",
                component: () =>
                    import (
                        /* webpackChunkName: "MainTools" */
                        "@/components/popupMenu/MenuOptions/tools/MainTools.vue"
                    ),
                async beforeEnter(to, from, next) {
                    await mws({
                        to,
                        from,
                        next
                    }, [login, loading]);
                },
                // meta: {
                //   middleware: [login, loading, desktop, loadDesktop],
                // },
            },
            //historyLists/Hitory
            {
                path: "history",
                name: "history",
                component: () =>
                    import (
                        /* webpackChunkName: "History" */
                        "@/components/popupMenu/MenuOptions/tools/historyLists/History.vue"
                    ),
                async beforeEnter(to, from, next) {
                    await mws({
                        to,
                        from,
                        next
                    }, [login, loading]);
                },
                // meta: {
                //   middleware: [login, loading, desktop, loadDesktop],
                // },
            },
            //PersonalExtensions
            {
                path: "personalExtensions",
                name: "personal-extensions",
                component: () =>
                    import (
                        /* webpackChunkName: "PersonalExtensions" */
                        "@/components/popupMenu/MenuOptions/tools/personalExtensions/PersonalExtensions.vue"
                    ),
                async beforeEnter(to, from, next) {
                    await mws({
                        to,
                        from,
                        next
                    }, [login, loading]);
                },
                // meta: {
                //   middleware: [login, loading, desktop, loadDesktop],
                // },
            },
            //DesktopSettings
            {
                path: "desktopSettings",
                name: "desktop-settings",
                component: () =>
                    import (
                        /* webpackChunkName: "DesktopSettings" */
                        "@/components/popupMenu/MenuOptions/tools/DesktopSettings.vue"
                    ),
                async beforeEnter(to, from, next) {
                    await mws({
                        to,
                        from,
                        next
                    }, [login, loading]);
                },
                // meta: {
                //   middleware: [login, loading, desktop, loadDesktop],
                // },
            },
            //ChangeBookInfoBooksList
            // {
            //   path: "booksInfoSettings",
            //   name: "books-info-settings",
            //   component: () =>
            //     import(
            //       /* webpackChunkName: "BooksInfoSettingsBooksList" */ "@/components/popupMenu/MenuOptions/tools/changeBookInfo/BooksInfoSettingsBooksList.vue"
            //     ),
            //   async beforeEnter(to, from, next) {
            //     await mws({ to, from, next }, [login, loading]);
            //   },
            //   // meta: {
            //   //   middleware: [login, loading, desktop, loadDesktop],
            //   // },
            // },
            //BookInfoSettings
            {
                path: "bookInfoSettings/:id",
                name: "book-settings",
                component: () =>
                    import (
                        /* webpackChunkName: "BookInfoSettings" */
                        "@/components/popupMenu/MenuOptions/tools/changeBookInfo/BookInfoSettings.vue"
                    ),
                async beforeEnter(to, from, next) {
                    await mws({
                        to,
                        from,
                        next
                    }, [login, loading]);
                },
                // meta: {
                //   middleware: [login, loading, desktop, loadDesktop],
                // },
            },
            //MainExtensions
            {
                path: "mainExtensions",
                name: "main-extensions",
                component: () =>
                    import (
                        /* webpackChunkName: "MainExtensions" */
                        "@/components/popupMenu/MenuOptions/extensions/MainExtensions.vue"
                    ),
                async beforeEnter(to, from, next) {
                    await mws({
                        to,
                        from,
                        next
                    }, [login, loading]);
                },
                // meta: {
                //   middleware: [login, loading, desktop, loadDesktop],
                // },
            },

            {
                path: "mainHelp",
                name: "main-help",
                component: () =>
                    import (
                        /* webpackChunkName: "MainHelp" */
                        "@/components/popupMenu/MenuOptions/help/MainHelp.vue"
                    ),
                async beforeEnter(to, from, next) {
                    await mws({
                        to,
                        from,
                        next
                    }, [login, loading]);
                },
                // meta: {
                //   middleware: [login, loading, desktop, loadDesktop],
                // },
            },
            {
                path: "showHelp",
                name: "show-help",
                component: () =>
                    import (
                        /* webpackChunkName: "showHelp" */
                        "@/components/popupMenu/MenuOptions/help/ShowHelp.vue"
                    ),
                async beforeEnter(to, from, next) {
                    await mws({
                        to,
                        from,
                        next
                    }, [login, loading]);
                },
                // meta: {
                //   middleware: [login, loading, desktop, loadDesktop],
                // },
            },
            {
                path: "about",
                name: "aboutApp",
                component: () =>
                    import (
                        /* webpackChunkName: "About" */
                        "@/components/popupMenu/MenuOptions/help/About.vue"
                    ),
                async beforeEnter(to, from, next) {
                    await mws({
                        to,
                        from,
                        next
                    }, [login, loading]);
                },
                // meta: {
                //   middleware: [login, loading, desktop, loadDesktop],
                // },
            },
            {
                path: "licenseCode",
                name: "license-code",
                component: () =>
                    import (
                        /* webpackChunkName: "LicenseCode" */
                        "@/components/popupMenu/MenuOptions/help/LicenseCode.vue"
                    ),
                async beforeEnter(to, from, next) {
                    await mws({
                        to,
                        from,
                        next
                    }, [login, loading]);
                },
                // meta: {
                //   middleware: [login, loading, desktop, loadDesktop],
                // },
            },
            {
                //ReportingBugs
                path: "reportingBugs",
                name: "repo-bugs",
                component: () =>
                    import (
                        /* webpackChunkName: "ReportingBugs" */
                        "@/components/popupMenu/MenuOptions/reportingBugs/ReportingBugs.vue"
                    ),
                async beforeEnter(to, from, next) {
                    await mws({
                        to,
                        from,
                        next
                    }, [login, loading]);
                },
                // meta: {
                //   middleware: [login, loading, desktop, loadDesktop],
                // },
            },

            //contact/Contact
            {
                path: "mainContact",
                name: "main-contact",
                component: () =>
                    import (
                        /* webpackChunkName: "Contact" */
                        "@/components/popupMenu/MenuOptions/contact/Contact.vue"
                    ),
                async beforeEnter(to, from, next) {
                    await mws({
                        to,
                        from,
                        next
                    }, [login, loading]);
                },
                // meta: {
                //   middleware: [login, loading, desktop, loadDesktop],
                // },
            },
            {
                path: "contactStaff",
                name: "staff-contact",
                component: () =>
                    import (
                        /* webpackChunkName: "ContactStaffList" */
                        "@/components/popupMenu/MenuOptions/contact/ContactStaffList.vue"
                    ),
                async beforeEnter(to, from, next) {
                    await mws({
                        to,
                        from,
                        next
                    }, [login, loading]);
                },
                // meta: {
                //   middleware: [login, loading, desktop, loadDesktop],
                // },
            },
        ],
    },
    {
        path: "desktopWindow",
        name: "desktop-window",
        component: () =>
            import (
                /* webpackChunkName: "DesktopWindow" */
                "@/components/popupMenu/MenuOptions/tools/DesktopWindow.vue"
            ),
        props: (route) => {
            return {
                save: route.meta.save
            };
        },

        async beforeEnter(to, from, next) {
            await mws({
                to,
                from,
                next
            }, [login, loading, desktop, loadDesktop]);
        },
        // meta: {
        //   middleware: [login, loading, desktop, loadDesktop],
        // },
    },
    {
        path: "commentsPopup",
        name: "comments-popup",
        component: () =>
            import (
                /* webpackChunkName: "CommentsPopup" */
                "@/components/popupMenu/MenuOptions/tools/personalExtensions/CommentsPopup.vue"
            ),
        async beforeEnter(to, from, next) {
            await mws({
                to,
                from,
                next
            }, [login, loading, desktop, loadDesktop]);
        },
        // meta: {
        //   middleware: [login, loading, desktop, loadDesktop],
        // },
    },
    //KeysPopup
    {
        path: "keysPopup",
        name: "keys-popup",
        component: () =>
            import (
                /* webpackChunkName: "KeysPopup" */
                "@/components/popupMenu/MenuOptions/tools/personalExtensions/KeysPopup.vue"
            ),
        async beforeEnter(to, from, next) {
            await mws({
                to,
                from,
                next
            }, [login, loading, desktop, loadDesktop]);
        },
        // meta: {
        //   middleware: [login, loading, desktop, loadDesktop],
        // },
    },
    //MarkersPopup
    {
        path: "markersPopup",
        name: "markers-popup",
        component: () =>
            import (
                /* webpackChunkName: "MarkersPopup" */
                "@/components/popupMenu/MenuOptions/tools/personalExtensions/MarkersPopup.vue"
            ),
        async beforeEnter(to, from, next) {
            await mws({
                to,
                from,
                next
            }, [login, loading, desktop, loadDesktop]);
        },
        // meta: {
        //   middleware: [login, loading, desktop, loadDesktop],
        // },
    },
];