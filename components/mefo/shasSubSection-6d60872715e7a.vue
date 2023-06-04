<template>
  <div
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
    class="shasRow"
    :class="{
      gilyonHover: secHover && section.gilyon,
      shasSectionSelected:
        shasSecSelected.length && section && isSectionSelected,
      shasSectionHover: secHover,
    }"
    @click.ctrl.stop="selectShasSec(true)"
    @click.exact="selectShasSec(false)"
    :page="page"
  ></div>
</template>

<script>
import { getYesodByCategoryId } from "@/services/mareiMekomot.js";
import winManager from "@/services/book_win";

export default {
  props: ["section", "row", "secHover", "tabId", "page"],
  data() {
    return {};
  },
  methods: {
    async selectShasSec(addIt) {
      if (this.section.gilyon) {
        let res = await getYesodByCategoryId(this.section.gilyon.categoryId);
        res = res[0];
        if (!res) return;
        winManager.createWinBook(res.bookId, "PID_" + res.pageName);
      } else {
        this.$emit("selectShasSec", { section: this.section, addIt });
      }
    },
  },
  computed: {
    isSectionSelected() {
      const id = this.section.id;
      const had = this.shasSecSelected.find((a) => a.id == id);
      return had;
    },
    shasSecSelected() {
      return this.$store.state.tabs[this.tabId].shasSecSelected;
    },
    // ...mapGetters("systemFolders", ["getSystemFolderOfBasicBooks"]),
    // sifreiYesod() {
    //   let sifrey = this.getSystemFolderOfBasicBooks;
    //   if (sifrey != undefined) return sifrey.next;
    //   else return [];
    // },
    // isGilyon() {
    //   return this.secHover && ["mh", "em", "to"].includes(this.section.type);
    // },
  },
};
</script>

<style lang="scss" scoped>
.shasRow {
  position: absolute;
  display: block;
  z-index: 2999;
  cursor: pointer;
  // background-color: rgba(163, 53, 53, 0.479);
}
.shasSectionHover {
  background-color: var(--custom-color3);
  opacity: 0.5;
}
.shasSectionSelected {
  background-color: var(--custom-color3);
  opacity: 0.9;
}
.gilyonHover {
  // background-color: rgba(167, 187, 56, 0.671);
}
</style>
