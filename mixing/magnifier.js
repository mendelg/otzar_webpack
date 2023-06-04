const mix = {
    data() {
        return {
            magnifyPosition: {
                x: 0,
                y: 0
            },
            refresh: false,
            magnifyPage: 0,
            imgRatio: 1,
            marginLeft: 0,
        };
    },
    computed: {
        showMagnify() {
            return this.$store.state.tabsManager.showMagnifier;
        },
    },
    methods: {
        toggleMagnifier() {
            this.$store.state.tabsManager.showMagnifier = !this.$store.state
                .tabsManager.showMagnifier;
        },
        setMagnifyData(x, y, e, pages) {
            try {
                let rect = this.$el.getBoundingClientRect();
                let pageElem = document.elementFromPoint(x + rect.left, y + rect.top);

                if (
                    pageElem &&
                    pageElem.className.indexOf("selectContainer") > -1 &&
                    pageElem.hasAttribute("page")
                ) {
                    this.magnifyPage = pages[pageElem.getAttribute("page") - 1].name;
                    this.imgRatio = pageElem.getAttribute("ratio") || 1;
                    this.marginLeft = pageElem.getAttribute("mleft") || 0;

                    this.refresh = !this.refresh;
                    this.magnifyPosition = {
                        x,
                        y
                    };
                } else {
                    // this.magnifyPage = 0;
                }
            } catch (ex) {
                // this.magnifyPage = 0;
            }
        },
    },
};

export default mix;