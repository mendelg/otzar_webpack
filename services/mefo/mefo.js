import {
    Axios
} from "@/services/_axios.js";
import store from "@/store/store";
import init from "@/config/init.js";
import {
    inflate
} from "pako";
export function getPageRects(book) {
    let url = `${init.getServer()}${init.MefoDB.shas}/${book}`;
    return Axios.get(url)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch(function(error) {
            return Promise.reject(error);
        });
}

export function getMefoSectionsByShasId(secShasId) {
    let url = `${init.getServer()}${init.MefoDB.mefarshim}/get`;

    return Axios.post(url, secShasId)
        .then((response) => {
            let res = inflate(response.data, {
                to: "string"
            });
            res = JSON.parse(res);
            res = res.map((s) => ({
                ...s,
                otzarBook: store.getters["books/getBookbyId"](s.book),
            }));
            return Promise.resolve(res);
        })
        .catch(function(error) {
            return Promise.reject(error);
        });
}