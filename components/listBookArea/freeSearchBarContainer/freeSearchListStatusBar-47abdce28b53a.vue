<template>
  <div
    class="lineStatusList  flex dir-rtl flex-bet"
    v-if="name != '' && !$_mobile"
  >
    <div>
      <span>{{ name }}</span>
      <span>{{ filter }}</span>
      <span> | </span>

      <span v-if="!isSavedList">{{ totalResultsM }}</span>
      <span v-if="getResultsType === 'special'">{{
        $t("general.results")
      }}</span>
      <span v-if="!isSavedList && getResultsType === 'classic'"
        >{{ $t("freeSearchResults.resultIn") }}-
      </span>
      <span v-if="getResultsType === 'classic'"
        >{{ currentItem ? currentItem + "/" : " " }}
        <span>{{ sum }}</span>
      </span>
      <span v-if="getResultsType === 'classic'">{{
        $t("freeSearchResults.books")
      }}</span>

      <span v-if="!isSavedList"> {{ listType }}</span>
    </div>
    <div class="font-w-300" v-if="getListCheckBooksFree.length > 0">
      <div class="flex ">
        <!-- <span><span>&nbsp;</span>|<span>&nbsp;</span> </span> -->
        <span>{{ getListCheckBooksFree.length.toLocaleString() }}</span>
        <span>&nbsp;</span>
        <span>{{ $t("lists.checkedBooks") }}</span>
        <!-- <span>&nbsp;</span><span>&nbsp;</span> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  computed: {
    ...mapState("freeSearchBookList", ["totalResults"]),
    ...mapGetters("freeSearchBookList", [
      "getCheckedBooks",
      "getListLength",
      "getTextSearch",
      "getFinalTextSearch",
      "getCurrentFilterName",
      "getCurrentFilterNumResults",
      "getFreeSearchSearchInType",
      "getFSListName",
      "isSavedList",
      "getResultsType",
    ]),
    ...mapGetters("freeSearchBooklistComp", ["getListCheckBooksFree"]),
    currentItem() {
      try {
        let current = this.$store.state.currentActiveListIndex.split(".")[0];
        current = parseInt(current) + 1;
        if (isNaN(current)) return 0;
        return this.$store.state.lastActiveList === 2
          ? current.toLocaleString()
          : 0;
      } catch (ex) {
        return 0;
      }
    },
    isSavedList() {
      return this.getFSListName != "";
    },
    totalResultsM() {
      return this.totalResults.toLocaleString() + " ";
    },
    name() {
      return this.getFSListName != ""
        ? this.getFSListName +
            " ( " +
            this.$t("freeSearchResults.listSaved") +
            " )"
        : this.getFinalTextSearch;
    },
    sum() {
      let filterNum = this.getCurrentFilterNumResults;
      if (filterNum == -1)
        return "" + this.getListLength.toLocaleString() + " ";
      return "" + filterNum.toLocaleString() + " ";
    },
    filter() {
      let filterTitle = this.getCurrentFilterName;
      if (filterTitle != "") filterTitle = " / " + filterTitle;
      return " " + filterTitle;
    },
    listType() {
      let lt = this.getFreeSearchSearchInType;
      if (lt != "")
        if (lt == "special")
          lt = " {" + this.$t("freeSearchInput.searchIn.siyun_maf") + "}";
        else lt = " {" + this.$t("freeSearchResults.inLimitedListBooks") + "}";
      else lt = "";
      return lt;
    },
  },
};
</script>

<style lang="scss" scoped>
$bg-color1: #fff;
.lineStatusList {
  line-height: 23px;
  padding: 0 7px;
  font-size: 12px;
  font-weight: bold;
  background-color: var(--bg-color8);
  // border-bottom: 2px solid #d4d4d4;
  border-top: 2px solid var(--bg-color9);
  // border-bottom: 2px solid var(--bg-color9);
  // background-color: var(--bg-color1);
  box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.16);
  color: var(--text-color1);
  z-index: 1;
}
</style>
