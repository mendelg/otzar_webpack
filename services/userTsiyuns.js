import {
    Axios
} from "@/services/_axios";
import init from "@/config/init.js";

//add user tsiyun
export function addUserTsiyun({
    bookId,
    pageId,
    title
}) {
    let url = init.getServer() + init.UsersDB.users + init.UsersDB.tsiyuns;
    return Axios.post(url, {
        bookId,
        pageId,
        title,
    });
}
//delete user tsiyun by id
export function deleteUserTsiyun(id) {
    let url = init.getServer() + init.UsersDB.users + init.UsersDB.tsiyuns;
    return Axios.delete(url + "/" + id);
}

//rename user tsiyun
export function updateUserTsiyun(id, title) {
    let url = init.getServer() + init.UsersDB.users + init.UsersDB.tsiyuns;
    return Axios.patch(url, {
        id,
        title,
    });
}

//get user tsiyuns
export async function getUserTsiyuns(id) {
    let url =
        init.getServer() +
        init.UsersDB.users +
        init.UsersDB.tsiyuns +
        init.UsersDB.book +
        "/" +
        id;
    try {
        let tsiyunim = await Axios.get(url);
        return tsiyunim.data;
    } catch (err) {
        console.error(err);
        return [];
    }
}