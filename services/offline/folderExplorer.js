import {
    Axios
} from "@/services/_axios";

export function getSubFolders(path) {
    return Axios.get("/api/folders/", {
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
}

export function getHomePath() {
    return Axios.get("/api/folders/homePath")
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch(function(error) {
            return Promise.reject(error);
        });
}

export function getDrives() {
    return Axios.get("/api/folders")
        .then((response) => {
            return Promise.resolve(response.data);
        })
        .catch(function(error) {
            return Promise.reject(error);
        });
}