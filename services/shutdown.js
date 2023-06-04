import {
    Axios
} from "@/services/_axios";
const RESTART_CODE = "restart";
const SHUTDOWN_CODE = "shutdown";

function restart() {
    return shutdown(RESTART_CODE);
}

function shutdown(error = "") {
    return Axios.post("/api/general/shutdown-app", {
        code: error
    });
}
export default {
    restart,
    shutdown,
    SHUTDOWN_CODE,
    RESTART_CODE
};