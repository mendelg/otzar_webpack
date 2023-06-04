module.exports = {
    computed: {
        isMefo() {
            const id = this.getTabId ? this.getTabId : this.tabId;
            if (!id || !this.$store.state.tabs[id]) {
                console.warn("weird but no tabid (isMefo mix)");
                return null;
            }
            return this.$store.state.tabs[id].SHAS_SECTION_LIST_ID;
        },
    },
};