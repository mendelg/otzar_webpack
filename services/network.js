import {
    Axios
} from "@/services/_axios";
import encrypt from "../utils/simpleEnc";
let data = {
    async getClients(psw = "") {
        try {
            const pswEnc = encrypt.crypt(encrypt.salt, psw);
            let data = await Axios.get("/api/network/net-clients?c=" + pswEnc);
            return data;
        } catch (ex) {
            console.error(ex);
        }
    },
    async disconnectPcStation(station_id, onlymef = false) {
        try {
            let data = await Axios.post("/api/network/disconnect", {
                id: station_id,
                onlymef,
            });
            return data;
        } catch (ex) {
            console.error(ex);
        }
    },
    async setServerToBoth() {
        await Axios.get("/api/network/set-server-to?mode=both");
        // location.href = window.location.protocol + "\\\\" + window.location.host;

        // window.open(
        //   window.location.protocol + "\\\\" + window.location.host,
        //   "אוצר החכמה",
        //   "width=" + screen.availWidth + ",height=" + screen.availHeight
        // );
    },
};
export default data;