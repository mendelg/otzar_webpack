<template>
  <div class="pagePicker" @click="toggleMenu" v-click-outside="closeMenu">
    <div class="selected-text">{{ innergetSelectedPage }}</div>
    <!-- <font-awesome-icon icon="caret-down" class="dropdown-icon" /> -->
    <span class="mef-font-default mef-font dropdown-icon">p</span>

    <div class="option-items" :class="{ 'mef-open-menu': showMenu }">
      <div
        class="option-item-general"
        :class="{ 'option-item': page && page.title != '' }"
        v-for="(page, index) in [
          { title: '', number: -1 },
          ...getBookListPages,
        ]"
        :key="index"
      >
        <span
          class="label-option"
          :class="{
            active:
              currentPage - 1 == (page ? page.number : -1) ||
              currentPage - 2 == (page ? page.number : -1),
          }"
          @click.stop="setPageNumber(page)"
        >
          {{ page ? page.title : "" }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from "@/mixing/mefMenuFunction.js";
import { mapGetters } from "vuex";
import { getBookPages, pagesDic } from "@/services/mefo/shasService";

export default {
  mixins: [Menu],
  props: ["lazy", "selected", "pagedata", "trick", "tabId"],
  methods: {
    pagesDic(x, y) {
      return pagesDic(x, y);
    },
    setPageNumber(page) {
      if (page == -1) return;
      this.closeMenu();
      this.$emit("pageselect", page);
    },
  },
  computed: {
    ...mapGetters("mefShas", [
      "getBookPages",
      "getSelectedPage",
      "getSelectedBookNumber",
    ]),
    innergetSelectedPage() {
      if (this.lazy == "1") {
        return this.pagedata.number == -1 ? "דף" : this.pagedata.title;
      }
      return this.getSelectedPage;
    },
    getBookListPages() {
      if (this.lazy == "1") {
        let add = 0;
        let selected = this.selected;
        if (
          this.$parent.book != null &&
          this.$parent.book.firstLabelPage != undefined
        ) {
          let pages = [
            { title: "כה", number: 53 },
            { title: "כו", number: 55 },
            { title: "כז", number: 57 },
            { title: "כח", number: 59 },
            { title: "כט", number: 61 },
            { title: "ל", number: 63 },
            { title: "לא", number: 65 },
            { title: "לב", number: 67 },
            { title: "לג", number: 69 },
          ];
          return pages;
        }

        let pages = this.pagedata ? getBookPages(add, selected) : [];
        // let pages = this.pagedata ? pagesDic(0, selected) : [];

        return pages;
      }
      return this.getBookPages;
    },
    currentPage() {
      return this.$store.getters[`tabs/${this.tabId}/getPage`];
    },
  },
};
</script>

<style scoped>
.pagePicker {
  font-size: 12px;
  border-left-color: #dcdcdc;
  border-width: 0px;
  display: flex;
  border-left-width: 1px;
  border-style: solid;
  text-align: right;
  width: 49px;
  box-sizing: border-box;
  position: relative;
  /* justify-content: center; */
  align-items: center;
}
.selected-text {
  width: 30px;
  padding-right: 6px;
}
.dropdown-icon {
  width: 13px;
  line-height: 14px;
  margin-left: 5px;
}
.option-items {
  display: none;
  position: absolute;
  flex-direction: row;
  z-index: 2;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  left: 0px;
  top: 100%;
  width: 303px;
  flex-wrap: wrap;
}
.mef-open-menu {
  display: flex;
}
.option-item {
  height: 30px;
  width: 30px;
  align-self: flex-start;
  border-style: solid;
  border-width: 1px;
  border-color: #f5f5f5;
  font-size: 14px;
  text-align: center;
  display: table;
}
.option-item-general {
  height: 30px;
  width: 30px;
}
.label-option {
  display: table-cell;
  vertical-align: middle;
}
.label-option:hover {
  background-color: #dedede;
}
.active {
  background-color: #dedede;
}
</style>
