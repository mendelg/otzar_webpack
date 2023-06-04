import net from "@/services/network";
import {
    Axios
} from "@/services/_axios";

export default {
    data() {
        return {
            _timer: null,
            clients: [],
            psw: "",
        };
    },
    methods: {
        async innersetServerToBoth() {
            await net.setServerToBoth();
        },

        async disconnectStation(id = "", onlyMef = false) {
            try {
                await net.disconnectPcStation(id, onlyMef);
                this.getClients();
                //if this is server then go to network page

                if (
                    globalThis.OTZAR_BASIC_INFO.networkMode == "server" ||
                    globalThis.OTZAR_BASIC_INFO.networkMode == "both"
                ) {
                    this.getClients();
                    // const info = await Axios.get("/api/general/basic-info");
                    // const data = info.data;
                    // globalThis.OTZAR_BASIC_INFO = data;
                    // if (globalThis.OTZAR_BASIC_INFO.networkMode == "server")
                    // this.$router.go({ name: "network" });
                }
                // else {
                //   //popup close msg and close the app after 30 secs
                //   const notification = {
                //     type: "success",
                //     message: this.$t("network.autoCloseOnAdminDisconnect"),
                //     timeout: 15000,
                //   };
                //   this.$notify(notification);
                //   setTimeout(() => {
                //     shutdown.shutdown(shutdown.SHUTDOWN_CODE);
                //   }, 15000);
                // }
            } catch (ex) {
                console.error(ex);
            }
        },
        async getClients() {
            try {
                let {
                    data
                } = await net.getClients(this.psw);
                this.clients = data;
            } catch (ex) {
                console.error(ex);
            }
        },
    },
    mounted() {
        //get clients
        this.getClients();
        this._timer = setInterval(this.getClients, 3000);
    },
    beforeDestroy() {
        clearInterval(this._timer);
    },
};