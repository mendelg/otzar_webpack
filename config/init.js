import maindata from "@/config/Maindata.js";
import db from "@/config/database.js";
import general from "@/config/general.js";
export default {
    storageVersion: 11.3,
    BooksData: { ...maindata
    },
    ...db,
    ...general,
};