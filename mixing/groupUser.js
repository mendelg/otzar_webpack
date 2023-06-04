import {
    IPUserNoPersDataMsg
} from "@/services/userBooksData.js";
import {
    mapGetters
} from "vuex";

export default {
    computed: {
        ...mapGetters("user", ["isIPLimited"]),
    },
    methods: {
        userDataLimited() {
            if (this.isIPLimited) {
                IPUserNoPersDataMsg();
                return true;
            }
        },
    },
};