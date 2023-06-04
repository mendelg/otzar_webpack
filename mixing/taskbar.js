const uuidv1 = require("uuid/v1");
import bookwin from "@/services/book_win.js";
const mix = {
    data() {
        return {
            __taskbar_id: null,
        };
    },
    props: {
        tabId: {
            type: String,
            default: "",
        },
        usemodeprop: {
            type: Boolean,
            default: false,
        },
        mini: {
            type: Boolean,
            default: false,
        },
        pin: {
            type: Boolean,
            default: false,
        },
        mini_title: {
            type: String
        },
        mode: {
            type: Boolean,
            default: false,
        },
        minicb: {
            type: Function,
            default: () => {},
        },
    },
    computed: {
        taskbarId() {
            return this.__taskbar_id;
        },
        isItemMinimize() {
            this.animate = true;
            setTimeout(() => {
                this.animate = false;
            }, 300);
            if (!this.mini) return false;

            let mode = false;

            let item = this.$store.state.taskbar.items.find(
                (i) => i.id == this.__taskbar_id
            );
            if (!item) return false;
            mode = !item.mode;

            return mode;
        },
    },
    watch: {
        mini_title: function(nval, oval) {
            this.setItemContent(nval);
        },
    },
    methods: {
        pinToTab() {
            bookwin.pinWinBookToTab(this.tabId);
        },
        setItemMinimize(mode) {
            this.animate = true;
            this.$emit("minimize", mode);
            setTimeout(() => {
                this.animate = false;
            }, 300);
            this.$store.dispatch("taskbar/setItemMode", {
                id: this.__taskbar_id,
                mode: !mode,
                cb: this.cb,
                tabId: this.tabId,
            });
        },
        setItemContent(content) {
            this.$store.dispatch("taskbar/setItemContent", {
                id: this.__taskbar_id,
                content,
            });
        },
        setTopItem() {
            this.$store.dispatch("taskbar/setTopItem", this.__taskbar_id);
        },
        __close() {
            this.$emit("close");
        },
    },
    created() {
        if (!this.mini && !this.usemodeprop) return;

        this.__taskbar_id = uuidv1();
        //this.mode = true;
        this.$store.dispatch("taskbar/addItem", {
            id: this.__taskbar_id,
            mode: this.mode,
            close: this.__close,
        });
        this.setItemMinimize(this.mode);
    },
    destroyed() {
        if (this.mini)
            this.$store.dispatch("taskbar/removeItem", this.__taskbar_id);
    },
};

export default mix;