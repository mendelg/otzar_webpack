import {
    addSettingListner
} from "@/services/userSettingsData";
import store from "@/store/store";

//set mm settings
addSettingListner("mm", (val) => {
    // store.dispatch(
    //   "userSetting/setViewPlacesRegularly",
    //   val == "1" ? true : false
    // );
});