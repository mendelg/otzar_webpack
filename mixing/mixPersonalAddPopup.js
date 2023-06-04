import {
    mapActions
} from "vuex";

export default {
    data() {
        return {
            offset: 0,
            limit: 100,
        };
    },
    methods: {
        incOffset(inc) {
            this.offset += inc * this.limit;
        },
        setOffset(val) {
            this.offset = val;
        },
    },
    computed: {
        getCurrentRows() {},
    },
};