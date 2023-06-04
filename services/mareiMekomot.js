import {
    Axios
} from "@/services/_axios";
import init from "@/config/init.js";

export async function searchBookByMm(str) {
    // str = encodeURI(str);
    let url = `${init.getServer()}${init.BooksDB.books}/mm/`;
    try {
        let data = await Axios.get(url + "?str=" + str);

        return data.data;
    } catch (ex) {
        console.error(ex);
        return [];
    }
}

export async function getYesodByCategoryId(categoryId) {
    // str = encodeURI(str);
    let url = init.getServer() + init.BooksDB.basicBooksIds + `/${categoryId}`;
    try {
        let data = await Axios.get(url);

        return data.data;
    } catch (ex) {
        console.error(ex);
        return [];
    }
}