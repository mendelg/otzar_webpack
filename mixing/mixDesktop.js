import {
    openBook
} from "@/services/bookData.js";
import {
    mapActions,
    mapGetters
} from "vuex";
import {
    Axios
} from "@/services/_axios";
import store from "@/store/store";
import {
    deflate
} from "pako";
import init from "@/config/init.js";
import * as tabModule from "@/store/modules/_tab.js";
import VueInst from "@/main_app.js";

export default {
    methods: {
        ...mapActions("desktop", [
            "setVisible",
            "loadDesks",
            "changeDeskName",
            "setDefault",
            "delDesktop",
        ]),
        ...mapActions("tabsManager", ["setBook"]),
        async saveCurrentDesktop(recent = false, title = "", wait = true) {
            let deskId = -1;
            if (title !== "RECENT") {
                let exists = VueInst.$store.state.desktop.desktops.filter(
                    (d) => d.title == title
                )[0];
                if (exists) {
                    let act = await VueInst.$msg({
                        title: VueInst.$t("desktops.alredyExists"),
                        content: VueInst.$t("desktops.doReplace"),
                        btns: [VueInst.$t("general.yes"), VueInst.$t("general.no")],
                    });
                    if (act === VueInst.$t("general.yes")) {
                        deskId = exists.id;
                        //await this.delDesktop(exists.id);
                    } else return;

                    /*       let deskId = -1;
      if (title !== "RECENT") {
        let exists = VueInst.$store.state.desktop.desktops.filter(
          (d) => d.title == title
        )[0];
        if (exists) {
          if (wait) {
            let act = await VueInst.$msg({
              title: VueInst.$t("desktops.alredyExists"),
              content: VueInst.$t("desktops.doReplace"),
              btns: [VueInst.$t("general.yes"), VueInst.$t("general.no")],
            });
            if (act === VueInst.$t("general.yes")) {
              deskId = exists.id;
              //await this.delDesktop(exists.id);
            } else return;
          } else {
            deskId = exists.id;
          } */
                }
            }
            let tabs = store.getters["tabsManager/getAllTabs"];
            let currentTab = store.state.tabsManager.currentTabId;
            let tabsData = [];
            let _title = title;
            if (_title.trim() == "" && !recent) {
                this.popError(this.$t("errors.mustInsertNameDesktop"));
                return;
            }
            // else if (title == "RECENT" && !recent) {
            //   this.popError(this.$t("general.constName"));
            //   return;
            // }
            if (tabs.length < 1) {
                if (!recent) this.popError(this.$t("errors.notExistData"));
                return;
            }
            tabs.forEach((tabId) => {
                let tabState = Object.assign({}, store.state.tabs[tabId]);
                tabState.MM = [];
                tabState.pages = [];
                tabState.tsiyunim = [];

                const newTabId = tabState.id.slice(0, 4) + Math.random(1 % 10000000);
                if (currentTab == tabState.id) {
                    //set currenttab to new id
                    currentTab = newTabId;
                }
                tabState.id = newTabId;
                tabsData.push(tabState);
            });
            let desktop = {
                data: {
                    tabsData,
                    active: currentTab
                },
                title,
                default: 0,
            };

            if (recent) {
                delete desktop.default;
                let Authorization = store.state.user.token;
                if (store.getters["user/getSubUserData"].subUserId > 0) {
                    Authorization = store.getters["user/getSubUserData"].subUserToken;
                }
                let body = {
                    desktop,
                    Authorization,
                };
                let compress = deflate(JSON.stringify(body), {
                    to: "string",
                });
                //if we in electron then call electron to do it

                if (globalThis.ELECTRON_ENV && globalThis.SOCKETS_OFFLINE) {
                    return Axios.post(
                        init.getServer() + "api/user/desktops/recent",
                        compress
                    );
                } else {
                    //for IP user dont send, unless subuser connected
                    if (
                        store.getters["user/isUserIP"] &&
                        store.getters["user/getSubUserData"].subUserId == 0
                    )
                        return;

                    let send = navigator.sendBeacon(
                        init.getServer() + "api/user/desktops/recent",
                        compress
                    );
                    if (!send) {
                        let payload = {
                            title: VueInst.$t("general.error"),
                            content: VueInst.$t("desktops.errorSaving"),
                            btns: [VueInst.$t("general.confirm")],
                        };
                        await VueInst.$msg(payload);
                    }
                }
            } else {
                if (deskId == -1)
                    await Axios.post(init.getServer() + "api/user/desktops", desktop);
                else {
                    desktop.id = deskId;
                    delete desktop.default;

                    await Axios.patch(init.getServer() + "api/user/desktops", desktop);
                }
                this.loadDesks();
            }
        },
        setDesktopEventUnload() {
            if (!this.lastDesk && !this.event_desk_added) {
                this.event_desk_added = true;
            }
        },
        async openDesktop(desk) {
            store.dispatch("welcome/closewindow");
            this.setVisible(false);

            this.$nextTick(async () => {
                //store.dispatch("desktop/setCurrentDesktop", desk.title);
                let data = JSON.parse(desk.data);
                let activeTab = null;
                let currBookExistsInDesktop = false;

                currBookExistsInDesktop = data.tabsData.find(
                    (t) =>
                    t.book == this.$route.params ? .book &&
                    t.page == this.$route.params ? .page &&
                    t.drawData ? .fs ? .fs == this.$route.params ? .fs &&
                    t.drawData ? .fs ? .start == this.$route.params ? .start &&
                    t.drawData ? .fs ? .end == this.$route.params ? .end
                );

                if (currBookExistsInDesktop) data.active = currBookExistsInDesktop.id;
                else if (
                    desk.title.toLowerCase() == "recent" &&
                    this.$route.params ? .book
                )
                    data.active = this.$route.params ? .tab;
                store.state.tabsManager.tabs.forEach((t) => {
                    let tabBook = store.state.tabs[t].book;

                    if (
                        desk.title.toLowerCase() != "recent" ||
                        !this.$route.params ? .book ||
                        this.$route.params ? .book != tabBook ||
                        currBookExistsInDesktop
                    ) {
                        store.unregisterModule(["tabs", t]);
                        store.state.tabsManager.tabs = store.state.tabsManager.tabs.filter(
                            (ta) => ta != t
                        );
                    }
                });
                // store.state.tabsManager.tabs = [];

                data.tabsData.forEach(async (i) => {
                    let tab = i;
                    const newId = tab.id.slice(0, 4) + Math.random(1 % 10000000);

                    if (data.active == tab.id) data.active = newId;
                    tab.id = newId;

                    let newTab = Object.assign({}, tabModule);
                    newTab.state = function() {
                        return tab;
                    };
                    // COMMENTTED THIS SO TAB WILL OPEN IN RECENT PAGE EVEN IF MULTIPLE TABS OF SAME BOOK
                    //force opening book in recent page
                    //let p = await getRecentPage(tab.book);
                    // if (p.length > 0)
                    /*   try {
                      let books = this.getRecentBooks.filter(
                        (book) => book.bookId == tab.book
                      );
                      tab.page = books.length > 0 ? books[0].pageId : 1;
                    } catch (ex) {
                      console.log(ex);
                    }

                    */
                    // parseInt(p[0].pageId);
                    tab.minimize = true;
                    tab.fsFinished = false;
                    if (store.state.homePage) tab.minimize = false;
                    // if (store.state.tabsManager.tabs.includes(tab.id)) return;
                    if (tab.id == data.active) activeTab = tab;
                    if (tab.imageEdit) tab.imageEdit.enable = false;
                    store.registerModule(["tabs", tab.id], newTab);
                    store.state.tabsManager.tabs.push(tab.id);

                    if (tab.pinned)
                        store.dispatch("tabsManager/pinTab", {
                            tabId: tab.id,
                            pin: true
                        });

                    // ;
                    // if (tab.id.startsWith("win_"))
                    //  await openBook(tab.book, tab.page, tab.id);

                    /*  if (tab.id.startsWith("win_")) {
                      this.setBook({ ...i, tabId: tab.id });
                    } */
                });

                // this.$store.state.tabsManager.currentTabId = tab.id;
                if (!activeTab) return;

                store.dispatch("tabsManager/setCurrentTabId", activeTab.id);
                await openBook(
                    activeTab.book,
                    activeTab.page,
                    activeTab.id,
                    activeTab.drawData ? .fs
                );
                store.state.bookList.initBook = parseInt(
                    store.state.tabs[data.active].book
                );
                globalThis.firstTime = 0;
                //  if (!this.$store.state.homePage)

                // ;
                // this.$store.state.homePage = false;
            });
        },
        async openInitBook(book) {
            await openBook(book, -1);
            store.state.bookList.initBook = parseInt(book);
        },
    },
};