import store from "@/store/store";
import backupService from "@/services/offline/backup.js";
import init from "@/config/init.js";

export async function runBackup() {
    await backupService.startBackup();
}

export const autoBackup =
    init.serverConnection == "offline" &&
    window.DEV_SETTINGS.settings.autoBackup == 1;

if (init.serverConnection == "offline") {
    backupService
        .setDefaultLOcationToStore()
        .then(() => {
            let path = store.getters["backup/backupLocation"];
            store.dispatch("backup/setDefaultBackupLocation", path);
            if (autoBackup) {
                let timeToBackup = new Date().getHours();

                setInterval(() => {
                    if (new Date().getHours() === timeToBackup) {
                        runBackup();
                    }
                }, 1000 * 60 * 60);
            }
        })
        .catch((err) => {
            console.error("לא הצליח לטעון מיקום ברירת מחדל של קובץ גיבוי", err);
        });
}