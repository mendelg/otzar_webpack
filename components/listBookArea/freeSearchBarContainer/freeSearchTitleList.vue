<template>
  <div class="title padd-v-3">
    {{ textSearch }}
    <span>{{ filter }}</span>
    <slot></slot>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("freeSearchBookList", [
      "getTextSearch",
      "getFinalTextSearch",
      "getCurrentFilterName",
      "getFSListName",
    ]),
    textSearch() {
      return this.getFSListName != ""
        ? this.getFSListName
        : this.getFinalTextSearch && this.getFinalTextSearch.length > 0
        ? this.getFinalTextSearch
        : this.$t("quickBtn.noBookInList");
    },
    filter() {
      let filterTitle = this.getCurrentFilterName;
      if (filterTitle != "") filterTitle = " / " + filterTitle;
      return " " + filterTitle;
    },
  },
};
</script>

<style lang="scss" scoped></style>
