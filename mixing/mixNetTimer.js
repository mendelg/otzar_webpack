import net from "@/services/network";
import {
    Axios
} from "@/services/_axios";
import shutdown from "../services/shutdown.js";

export default {
    // sockets: {
    //   restartNetworkTrigger: function() {
    //     console.log("trigger called");
    //     this.triggerNetwork();
    //   },
    // },
    methods: {
        triggerNetwork() {
            let mins = 20;
            if (globalThis.OTZAR_BASIC_INFO ? .networkTimer)
                mins = globalThis.OTZAR_BASIC_INFO ? .networkTimer;
            let counter = mins * 1000 * 60; //mins
            // counter = 15000;
            if (
                globalThis.OTZAR_BASIC_INFO ? .networkMode == "both" ||
                globalThis.OTZAR_BASIC_INFO ? .networkMode == "client"
            ) {
                clearTimeout(this.$store.state.networkModule.network_timer);
                this.$store.state.networkModule.network_timer = setTimeout(
                    this.timerOccured,
                    counter
                );
            }
        },
        async stationNotUsed() {
            if (globalThis.OTZAR_BASIC_INFO.networkMode == "both") {
                await net.disconnectPcStation("SERVER");
                const info = await Axios.get("/api/general/basic-info");
                const data = info.data;
                globalThis.OTZAR_BASIC_INFO = data;
                this.$router.go({
                    name: "network"
                });
            } else shutdown.shutdown(shutdown.SHUTDOWN_CODE);
        },
        async timerOccured() {
            //if we came here the popup msgbox with yes no if he want to contiune

            let payload = {
                title: this.$t("networkComputer.itemMenu"),
                content: this.$t("networkComputer.stillUsedQuestion"),
                btns: [this.$t("general.yes"), this.$t("general.no")],
            };
            let shutdown_timer = setTimeout(async () => {
                //after 15 secs if no answer then shutdown the app
                this.stationNotUsed();
            }, 15000);
            let act = await this.$msg(payload);
            if (act == this.$t("general.yes")) {
                clearTimeout(shutdown_timer);
                this.triggerNetwork();
            } else this.stationNotUsed();
        },
    },
};