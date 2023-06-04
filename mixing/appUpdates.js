import {
    getSocket
} from "@/main_app";
import {
    mapState,
    mapGetters
} from "vuex";
export default {
    computed: {
        ...mapState("updatesCenter", ["ENUM_UPDATES_STAGES"]),
        ...mapGetters("updatesCenter", [
            "getPercentage",
            "getStage",
            "getVersion",
            "showProgress",
            "getInfo",
        ]),
        processMessage() {
            let msg = "";

            switch (this.getStage) {
                case this.ENUM_UPDATES_STAGES.UPDATES_DOWNLOADING:
                    msg = this.$t("updates.downloading").replace(
                        "%VER%",
                        this.getVersion
                    );
                    break;
                case this.ENUM_UPDATES_STAGES.UPDATES_EXTRACTING:
                    msg = this.$t("updates.extracting").replace("%VER%", this.getVersion);
                    break;
                case this.ENUM_UPDATES_STAGES.COPY_TO_DRIVE:
                    msg = this.$t("updates.copyingToDrive");
                    break;
                case this.ENUM_UPDATES_STAGES.COPY_TO_LOCAL:
                    msg = this.$t("updates.copyingToLocal");
                    break;
                case this.ENUM_UPDATES_STAGES.ERROR:
                    msg = "שגיאה!!!!";
                    break;
                default:
                    msg = "";
            }
            return msg;
        },
    },
    methods: {
        updateNow(allDisks = false) {
            const socket = getSocket();
            socket.emit("downloadUpdates", allDisks);
        },
        restartApp() {
            if (globalThis.ELECTRON_ENV) {
                //if (globalThis.LAUNCH_AS_ADMIN)
                globalThis.RESTART_AS_ADMIN();
                // else globalThis.RESTART_APP(globalThis.LAUNCH_AS_ADMIN);
            } else location.reload();
        },

        notNow() {
            this.setStage(0);
        },
        async openErrorLog() {
            if (!(await globalThis.OPEN_ERROR_LOG("update"))) {
                const notification = {
                    type: "error",
                    message: this.$t("support.noFileMsg"),
                    timeout: 2000,
                };
                this.$notify(notification);
            }
        },
    },
};