<template>
  <div class="lineStatusList flex flex-bet" v-if="!$_mobile">
    <div class="flex-g-1" style="text-overflow: ellipsis;overflow: hidden;">
      <span>{{ name }}</span>
      <span><span>&nbsp;</span>|<span class="border-list-status"></span> </span>
      <span>{{ sum + (currentItem ? "/" + currentItem + " " : " ") }}</span>
      <span>{{ $t("general.books") }}</span>
    </div>
    <template v-if="getCheckedBooks.length > 0">
      <div class="flex hidden-book">
        <!-- <span><span>&nbsp;</span>|<span>&nbsp;</span> </span> -->
        <span>{{ getCheckedBooks.length.toLocaleString() }}</span>
        <span>&nbsp;</span>
        <span>{{ $t("lists.checkedBooks") }}</span>
        <!-- <span>&nbsp;</span><span>&nbsp;</span> -->
      </div>
    </template>
    <span
      v-if="
        enableHide &&
          this.getHiddenBooksLength > 0 &&
          !isHiddenList &&
          getCheckedBooks.length > 0
      "
      ><span>&nbsp;</span>|<span class="border-list-status">&nbsp;</span>
    </span>
    <template v-if="showToggleHide">
      <div
        v-kiosk.remove
        class="flex hidden-book"
        :class="{ hide: showHiddenBooks }"
      >
        <!-- <span><span>&nbsp;</span>|<span>&nbsp;</span> </span> -->
        <span>{{ hideBooksLength }}</span>
        <span>&nbsp;</span>
        <span>{{ $t("files1.hiddenBooks") }}</span>
        <span>&nbsp;</span><span>&nbsp;</span>
        <div class="btn-toggle-view flex" @click="toggleHiddenBooks">
          <div class="mef-icon">l</div>
          <!-- <template v-if="!showHiddenBooks">{{ $t("general.view") }}</template> -->
          <!-- <template v-else>{{ $t("general.hide") }}</template> -->
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import BaseButton from "../../BaseComponents/BaseButton.vue";
export default {
  components: { BaseButton },
  computed: {
    ...mapState("bookList", ["isActiveStore", "showHiddenBooks"]),
    ...mapGetters("bookList", [
      "getNameListBook",
      "getLengthOfCurrentList",
      "getDataOfCurrentList",
      "getHiddenBooksLength",
      "getCheckedBooks",
    ]),
    showToggleHide() {
      return (
        this.enableHide && this.getHiddenBooksLength > 0 && !this.isHiddenList
      );
    },
    currentItem() {
      let current = parseInt(this.$store.state.currentActiveListIndex) + 1;
      if (isNaN(current)) return 0;
      return this.$store.state.lastActiveList === 1
        ? current.toLocaleString()
        : 0;
    },
    enableHide() {
      return this.userSettings.settings.enableHidden != "0";
    },
    name() {
      if (this.getDataOfCurrentList.data.content == "")
        return " " + this.$t("general.allBookList");
      return " " + this.getDataOfCurrentList.data.content + " ";
    },
    sum() {
      return " " + this.getLengthOfCurrentList().toLocaleString();
    },
    hideBooksLength() {
      return " " + this.getHiddenBooksLength.toLocaleString() + " ";
    },
    isHiddenList() {
      return this.getDataOfCurrentList.data.type === "HIDDEN_LIST";
    },
  },
  methods: {
    async toggleHiddenBooks() {
      if (this.showHiddenBooks) {
        this.$store.dispatch("bookList/setShowHiddenBooks", false);
      } else this.$store.dispatch("bookList/setShowHiddenBooks", true);
      // await this.userSettings.setSettings("hiddenBooks", JSON.stringify([]));
    },
  },
};
</script>

<style lang="scss" scoped>
$bg-color1: #fff;
.lineStatusList {
  display: flex;
  //position: fixed;
  line-height: 23px;
  padding: 0 7px;
  font-size: 12px;
  font-weight: bold;
  // background-color: $bg-color1;
  border-top: 2px solid var(--bg-color9);
  border-bottom: 1px solid var(--bg-color9);
  background-color: var(--bg-color1);
  // box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.16);
  color: var(--text-color1);
  white-space: nowrap;
  z-index: 1;
  .hidden-book {
    color: #7f7f7f;
    font-weight: 300;
    &.hide {
      .mef-icon::before {
        content: "";
        position: absolute;
        height: 17px;
        border-left: 1px solid;

        transform: rotate(50deg);
        left: 11px;
        top: 3px;
      }
    }
  }
  .btn-toggle-view {
    cursor: pointer;
    color: var(--custom-color1);
    align-items: center;
    .mef-icon {
      font-size: 45px;
      font-weight: 100;
      position: relative;
      color: var(--custom-color1);
    }
  }
}
</style>
