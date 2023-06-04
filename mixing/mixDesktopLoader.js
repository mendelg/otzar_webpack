import desktopManager from "./mixDesktop";
export default {
    data() {
        return {
            _savetimer: null,
        };
    },
    computed: {
        lastDesk() {
            let last = this.$store.state.user.settings.lastDesk;
            if (last == "1") return true;
            return false;
        },
        doneLoadDesks() {
            return this.$store.state.desktop.doneLoadDesks;
        },
    },
    methods: {
        __saveLastDesk() {
            return desktopManager.methods.saveCurrentDesktop(true, "RECENT");

            let currentDesktop = this.$store.state.desktop.currentDesktop;
            return desktopManager.methods.saveCurrentDesktop(
                currentDesktop == "",
                currentDesktop || "RECENT",
                false
            );
        },
        setDesktopEventUnload(added) {
            if (added === true) {
                window.addEventListener("beforeunload", this.__saveLastDesk);
                window.addEventListener("unload", this.__saveLastDesk);
            } else {
                window.removeEventListener("beforeunload", this.__saveLastDesk);
                window.removeEventListener("unload", this.__saveLastDesk);
            }
        },
    },
    watch: {
        lastDesk(nval, oval) {
            clearInterval(this._savetimer);
            if (nval) {
                this._savetimer = setInterval(() => {
                    this.__saveLastDesk();
                }, 15000);
            }
            this.setDesktopEventUnload(!nval);
        },
        doneLoadDesks(nval) {
            if (nval) {
                if (this.$route.path == "/" || this.$route.name == "book") {
                    if (this.$_mobile && this.$store.state.desktop.desktops.length == 0)
                        this.openInitBook(103967);

                    let def = this.$store.state.desktop.desktops.find(
                        (a) => a.default == 1
                    );

                    if (!def && this.userSettings.settings.lastDesk === "1") return;

                    let last = this.$store.state.desktop.desktops.find(
                        (a) => a.title == "RECENT"
                    );

                    if (!def && !last) return;

                    let openDesk = def ? def : last;
                    if (!openDesk) return;
                    this.openDesktop(openDesk);
                }
            }
        },
    },
    created() {
        this.setDesktopEventUnload(!this.lastDesk);
        if (globalThis.SET_LAST_DESKTOP) {
            globalThis.SET_LAST_DESKTOP(this.__saveLastDesk);
            //create timer for lastdesk in case of unexcepted exit

            this._savetimer = setInterval(() => {
                this.__saveLastDesk();
            }, 15000);
        }
    },
};