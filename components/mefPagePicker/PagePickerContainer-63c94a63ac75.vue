<template>
  <div class="page_pickers_container">
    <slot />
    <!-- <Right /> -->
    <div class="page_picker_container">
      <book @bookselect="setBook"></book>
      <page @pageselect="setPage" :tabId="tabId"></page>
      <sub-page @subpage="setSubpage"></sub-page>
    </div>
    <!-- <Left /> -->
  </div>
</template>

<script>
import Book from "./BookPicker.vue";
import Page from "./PagesPicker.vue";
import SubPage from "./SubPagePicker.vue";
import Right from "./ArrowRight.vue";
import Left from "./ArrowLeft.vue";
import { openBook } from "@/services/bookData";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("mefShas", [
      "getSelectedPageNumber",
      "getSelectedBookNumber",
      "getSelectedSubPage",
    ]),
  },
  components: {
    Book,
    Page,
    SubPage,
    Right,
    Left,
  },
  props: ["tabId"],
  methods: {
    setBook(v) {
      openBook(v.bookid, Number(v.firstPage) + 1, this.tabId);
    },
    setPage(v) {
      // let page
      // openBook(v.bookid, page, this.tabId);
      openBook(this.getSelectedBookNumber, v.number + 1, this.tabId);
    },
    setSubpage(v) {
      const page = this.getSelectedPageNumber + 1;
      if (page % 2 == 1)
        openBook(
          this.getSelectedBookNumber,
          this.getSelectedPageNumber - 1,
          this.tabId
        );
      else
        openBook(
          this.getSelectedBookNumber,
          this.getSelectedPageNumber + 1,
          this.tabId
        );
    },
  },
};
</script>

<style>
.page_pickers_container {
  /* width: 226px; */
  /* position: absolute; */
  top: 2px;
  /* float: left; */
  left: 0px;
  float: left;
  /* margin: 4px; */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 6px;
}
.page_picker_container {
  border-style: solid;
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #d4d4d4;
  border-radius: 16px;
  border-width: 1px;
  height: 30px;

  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  /* background-color: #ffffff; */
  overflow: visible;
  cursor: pointer;
  height: 26px;
  box-sizing: border-box;
  margin-bottom: 2px;
  /* width: 177px; */
}
.dropdown-icon {
  color: gray;
  margin-top: 1.5px;
  line-height: 14px;
}
.arrows {
  cursor: pointer;
}
</style>
