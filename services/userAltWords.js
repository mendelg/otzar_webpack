import {
    Axios
} from "@/services/_axios";
import init from "@/config/init.js";

//add alt words
export async function addUserAltWords({
    word1,
    word2,
    type
}) {
    let url = init.getServer() + init.UsersDB.users + init.UsersDB.altWords;
    let data = await Axios.post(url, {
        word1,
        word2,
        type,
    });
    return data;
}
//delete user alt words pair
export async function deleteUserAltWord(id1, id2) {
    let url = init.getServer() + init.UsersDB.users + init.UsersDB.altWords;
    return await Axios.delete(url + "/" + id1 + "/" + id2);
}

//get user alt words
export async function getUserAltWords() {
    let url = init.getServer() + init.UsersDB.users + init.UsersDB.altWords;
    try {
        let words = await Axios.get(url);

        return words.data;
    } catch (err) {
        console.error(err);
        return [];
    }
}