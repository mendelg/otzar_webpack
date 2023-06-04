//userSendEmail
import {
    Axios
} from "@/services/_axios";
import init from "@/config/init.js";

export function postUserSendSystemEmail(emailDetails) {
    let url = init.getServer() + init.UsersDB.sendEmail;
    return Axios.post(url, emailDetails)
        .then((response) => {
            return response;
        })
        .catch(function(error) {
            console.error(error);
            return false;
        });
}