import {
    Axios
} from "@/services/_axios";
import store from "@/store/store";

export default {
    async startBackup(force = false) {
        let path = store.getters["backup/backupLocation"];
        if (!path) await this.setDefaultLOcationToStore();
        path = store.getters["backup/backupLocation"];

        return Axios.post("/api/backup/", {
                path,
                force
            })
            .then((response) => {
                this.updateLastBackupFile();
                return Promise.resolve(response.data);
            })
            .catch(function(error) {
                return Promise.reject(error);
            });
    },
    updateLastBackupFile() {
        let path = store.getters["backup/backupLocation"];
        this.getLastbackupFile(path)
            .then((file) => {
                store.dispatch("backup/setLastBackupFile", file);
            })
            .catch((err) => {
                store.dispatch("backup/setLastBackupFile", null);
            });
    },
    // restoreBackup(path) {
    //   return Axios.post("/api/backup/restore", { path }, { timeout: 0 })
    //     .then((response) => {
    //       return Promise.resolve(response.status);
    //     })
    //     .catch(function(error) {
    //       // return Promise.reject(error.response.status);
    //       return Promise.reject(error);
    //     });
    // },
    gteDefaultLOcation() {
        return Axios.get("/api/backup/path/default")
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch(function(error) {
                return Promise.reject(error);
            });
    },
    async setDefaultLOcationToStore() {
        let path = await this.gteDefaultLOcation();
        store.dispatch("backup/setDefaultBackupLocation", path);
    },
    getLastbackupFile(backupLocation) {
        return Axios.get("/api/backup/last/?backupLocation=" + backupLocation)
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch(function(error) {
                return Promise.reject(error);
            });
    },
    getFileDetails(path) {
        return Axios.get("/api/backup/file", {
                params: {
                    path
                }
            })
            .then((response) => {
                return Promise.resolve(response.data);
            })
            .catch(function(error) {
                return Promise.reject(error);
            });
    },
};