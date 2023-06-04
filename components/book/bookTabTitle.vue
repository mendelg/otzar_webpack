<template>
  <span
    v-tooltip="toolTipContent"
    :style="titleStyle"
    @click="setActive()"
    class="tab-title"
    :class="{ inlist: inList }"
    >{{ titleToShow }}{{ pageLetter }}</span
  >
</template>

<script>
import { mapActions } from "vuex";
import mixMefo from "@/mixing/mixIsMefo";
export default {
  props: ["title", "tabId", "origTitle", "inList"],
  mixins: [mixMefo],
  computed: {
    titleToShow() {
      if (!String(this.tabId).startsWith("win_") && this.isMefo) {
        return getMasechetName(this.title);
      }
      return this.title;
    },
    pageLetter() {
      try {
        if (!String(this.tabId).startsWith("win_") && this.isMefo) {
          let pageData = this.$store.state.tabs[this.tabId].pages[
            this.$store.state.tabs[this.tabId].page - 1
          ];
          let pageLetter = pageData.pagedata[0]?.letter || "";
          if (pageLetter != "" && pageLetter.split(" ").length == 2) {
            let daf = pageLetter.split(" ")[0];
            let amud = pageLetter.split(" ")[1] == "א" ? "." : ":";
            return " " + daf + amud;
          } else return "";
        }
      } catch {
        return "";
      }
    },
    getTabId() {
      return this.tabId;
    },
    toolTipContent() {
      return this.inList || this.title == this.$t("tabs.chooseBook")
        ? { content: "", placement: "bottom" }
        : { content: this.title, placement: "bottom" };
    },
    titleStyle() {
      return (
        (this.inList ? "" : "pointer-events: none;") +
        (this.isMefo ? "color:var(--custom-color1);font-weight:600" : "")
      );
    },
  },
  methods: {
    ...mapActions("tabsManager", ["setCurrentTabId"]),
    setActive() {
      /*  let book = this.$store.getters[`${this.getTabId}/getBook`];
      let page = this.$store.getters[`${this.getTabId}/getPage`];

      openBook(book, page, this.getTabId); */
      // this.setCurrentTabId(this.getTabId);
      this.$emit("click");
    },
  },
};

function getMasechetName(title) {
  let masechet = title.split("-");
  try {
    if (masechet[1]) {
      masechet = masechet[1]
        .split("/")[0]
        .trim()
        .substr(masechet[1].trim().indexOf(" ") + 1)
        .trim();

      return masechet;
    }
    return title;
  } catch (ex) {
    return title;
  }
}
</script>

<style lang="scss" scoped>
.inlist {
  text-overflow: initial;
  overflow: visible;
  flex-grow: initial;
}
</style>
