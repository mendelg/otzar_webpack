export default {
    methods: {
        loadIndex() {
            this.$store.dispatch("books/loadIndexData", true);
        },
        freeIndex() {
            this.$store.dispatch("books/freeIndexMemory");
        },
    },
};