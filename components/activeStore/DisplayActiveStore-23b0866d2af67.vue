<template>
  <div v-if="activeStoreState" class="display-active flex flex-bet font">
    <div class="flex content-display-active rtl dir-rtl">
      <div>{{ $t("store.activeStore") }}:</div>
      <div class="bold padd-r-6">
        {{ activeStoreTytle }}
        |
        {{ listStoreLength }}
        {{ $t("general.books") }}
      </div>
    </div>
    <div class="">
      <button
        class="btn active-cancel-btn  btn-small"
        @click="resetActiveStore"
      >
        {{ $t("general.returnDefults") }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  //activeStore/DisplayActiveStore
  computed: {
    ...mapGetters("books", [
      "getActiveStoreTitle",
      "getLengthOfActiveStoreBooks",
    ]),
    activeStoreTytle() {
      switch (this.getActiveStoreTitle) {
        case "favorites":
          return this.$t("userDefaultFolders.favorites");
        case "pdfbooks":
          return this.$t("userDefaultFolders.pdfbooks");
          break;
        case "recentbooks":
          return this.$t("userDefaultFolders.recentbooks");
          break;
        case "hiddenbooks":
          return this.$t("userDefaultFolders.hiddenbooks");
          break;
      }

      return this.getActiveStoreTitle;
    },
    activeStoreState() {
      if (this.getActiveStoreTitle == "") return false;
      else return true;
    },
    listStoreLength() {
      return this.getLengthOfActiveStoreBooks;
    },
  },
  methods: {
    resetActiveStore() {
      this.$store.dispatch("books/resetActiveStore");
    },
  },
};
</script>

<style lang="scss" scoped>
$bg-color2: #f7f7f7;
.display-active {
  //width: 100%;
  height: 27px;
  display: flex;
  font-size: 14px;
  padding: 0 8px 0 4px;
  line-height: 0px;
  // border-bottom: 1px solid rgb(68, 67, 70);
  color: #fff;
  background-color: var(--custom-color2);
  align-items: center;
  &::before {
    // content: "";
    // display: block;
    // height: 100%;
    // width: 100%;
    // background-color: #000;
  }
  p {
    font-weight: bold;
    margin-right: 15px;
  }
  .btn .btn-border-hover {
    margin: 0px;
  }
  .btn.active-cancel-btn {
    background-color: var(--custom-color1);
    color: #fff;
    border: none;
    height: 19px !important;
    line-height: 19px;
    margin: 0;
    &:hover {
      font-weight: bold;
    }
  }
  // .content-display-active {
  //   background-color: #000;
  // }
}
</style>
