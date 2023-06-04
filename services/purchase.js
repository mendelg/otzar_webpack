import {
    Axios
} from "@/services/_axios";
import init from "@/config/init.js";

//open otzar store, returns API to store
export async function openStore(purchaseData) {
    let url = init.getServer() + init.general.openStore;

    try {
        let data = await Axios.post(url, purchaseData);

        return data.data;
    } catch (ex) {
        console.log(ex);
        return false;
    }
}
//get disk products prices from office DB
export async function getDiskProductsInfo() {
    //let url = "https://office.otzar.org/api/products/getofflineproducts";
    let url = init.getServer() + init.general.getofflineproducts;
    try {
        let data = await Axios.get(url);
        return data.data;
    } catch (ex) {
        console.log(ex);
        return false;
    }
}