<template>
  <div>
    <div class="header-book-list dir-rtl">
      <div class="action-list icons-check" v-if="showButtons">
        <div class="action-list-inner dir-rtl flex flex-bet w-100 ">
          <div class="flex flex-align-center">
            <div class="flex icon-group">
              <baseCheckBox
                class="check-item check-larg check-en"
                :class="{ 'check-minus': checkMinus }"
                size="larg"
                @change="checkAll"
                :minus="checkMinus"
                :checked="showActions"
              />
              <baseDropDown class="right list-en">
                <template #button class="list-dropdown">
                  <div class="otz-icon otz-icon-arrow otz-icon-square">o</div>
                </template>
                <template #list class="list-dropdown disable">
                  <baseItem @click="checkAll(null, true)">{{
                    $t("general.selectAll")
                  }}</baseItem>
                  <baseItem @click="checkAll(null, false)">{{
                    $t("general.cancelSelect")
                  }}</baseItem>
                  <baseItem @click="revert">{{
                    $t("general.reverseSelect")
                  }}</baseItem>
                </template>
              </baseDropDown>
            </div>
            <div v-if="showActions" class="flex check-all">
              <div
                v-kiosk
                v-if="!$_mobile"
                @click="doSaveFSList"
                class="otz-icon-square otz-icon mrg-l-3 show-scale"
                v-tooltip="{
                  content: this.$t('tooltip.saveSelect'),
                  placement: 'top',
                }"
              >
                v
              </div>
              <div
                v-if="!$_mobile"
                @click="doAddToFavorites"
                v-kiosk
                class="otz-icon-square otz-icon mrg-l-3 favorites-icon-top show-scale"
                v-tooltip="{
                  content: this.getFavoritesTooltip, // this.$t('tooltip.addFavoritesList'),
                  placement: 'top',
                }"
              >
                {{ getFavoritesIcon }}
              </div>
              <div
                @click="doRemoveBooks"
                class="otz-icon-square otz-icon mrg-l-3 show-scale"
                v-tooltip="{
                  content: this.$t('tooltip.garbage'),
                  placement: 'top',
                }"
              >
                9
              </div>
              <baseDropDown v-if="!$_mobile">
                <template #button>
                  <div class="otz-icon-square otz-icon mrg-l-3 show-scale">
                    8
                  </div>
                  <!-- <div class="icon-circle otz-icon icon-bg" v-tooltip="this.$t('folders.saveList')">o</div> -->
                </template>
                <template #list>
                  <baseItem
                    v-if="
                      false &&
                        $store.state.freeSearchBookList.resultsType ===
                          'classic'
                    "
                    @click="createCustomBookFromResults"
                    >צור ספר אישי מתוצאות החיפוש</baseItem
                  >
                  <baseItem
                    v-kiosk
                    v-if="
                      $store.state.freeSearchBookList.resultsType === 'classic'
                    "
                    @click="exportResults"
                    >{{ $t("freeSearchInput.exportREsults") }}</baseItem
                  >
                  <baseItemNext v-kiosk.remove>
                    <template #next>
                      <baseItem>{{ $t("general.exportSelectBook") }}</baseItem>
                    </template>
                    <template #list>
                      <baseItem @click="printResults('excel')">{{
                        $t("general.exportExel")
                      }}</baseItem>
                      <baseItem @click="printResults('pdf')">{{
                        $t("general.exportPdf")
                      }}</baseItem>
                    </template>
                  </baseItemNext>
                </template>
              </baseDropDown>
            </div>
          </div>
        </div>
      </div>
      <!-- <iconsUpdateContainer :showRefresh="false" /> -->

      <!-- <div class="icon-div icon-pin">
        <baseIcon nameIcon="pin-gray" width="12.358" height="13.4" pathIcon="icons-ganeral" />
      </div>-->
      <div class="title-header flex w-100">
        <freeSearchBarRecentSearches />
        <freeSearchTitleList />
      </div>
      <div class="icons-header-left flex h-100 flex-align-center">
        <iconsFolderContainer listType="free" :disable="!showActions" />
        <iconFreeSearchContainer />
        <div
          class="icon-circle otz-icon icon-otzar"
          v-tooltip="{
            content: this.$t('tooltip.searchIn'),
            placement: 'top',
          }"
          @click="searchInList"
          v-if="!inSearch && showButtons"
        >
          u
        </div>
      </div>
      <div class="flex div-search" v-if="inSearch">
        <div
          class="icon icon-search-in"
          :class="{ search: inSearch }"
          v-if="showSearch"
        >
          <div
            class="icon-circle otz-icon close-search"
            style="font-size:10px"
            @click="searchInList"
            v-if="inSearch"
          >
            F
          </div>
          <input
            v-focus
            :text="$store.state.freeSearchBookList.searchInTxt"
            class="b-border close div-input-search"
            :class="{ open: inSearch }"
            type="text"
            @input="txtSearchIn($event)"
            ref="inputSearch"
            :placeholder="$t('searchInput.placeHolder')"
          />
        </div>
      </div>

      <!-- ******* -->
      <ComboboxInput
        v-if="showButtons"
        class="fit-height mrg-l-3 mrg-r-3 free-combo list-en"
        :labal="currentSortKey"
        :labelKey="currentSortKey"
        :items="sortByList"
        @input="doSort($event)"
        :labelStart="currentSortKey"
      />
    </div>

    <BaseCleanPopup
      v-body
      v-zindex
      :h="30"
      :winh="170"
      @close="showFsExport = false"
      v-if="showFsExport"
    >
      <template v-slot:header>
        <span class="flex flex-align-center h-100">
          <BaseIcon
            class="icon-title"
            width="30"
            height="30"
            nameIcon="export"
            pathIcon="icons"
          />
          {{ $t("actionBook.exportSelectedResults") }}
        </span>
      </template>
      <fsResultsPrint />
    </BaseCleanPopup>

    <BaseCleanPopup
      v-body
      v-zindex
      :h="40"
      :winh="200"
      @close="
        $store.state.progressWindow.show = false;
        $store.state.progressWindow.bottomMessage = '';
      "
      v-if="$store.state.progressWindow.show"
    >
      <template v-slot:header>
        <span class="flex flex-align-center h-100">
          {{ $store.state.progressWindow.title }}
        </span>
      </template>

      <progressWindow />
    </BaseCleanPopup>
  </div>
</template>

<script>
let searchTimeout = null;
let lastSearch = "";
import iconsUpdateContainer from "@/components/listBookArea/headerBookListContainer/iconsUpdateList/iconsUpdateListContainer.vue";
import freeSearchTitleList from "@/components/listBookArea/freeSearchBarContainer/freeSearchTitleList.vue";
import iconsFolderContainer from "@/components/listBookArea/headerBookListContainer/iconFolderList/iconFolderListContainer.vue";
import iconFreeSearchContainer from "./iconFreeSearchContainer.vue";
import freeSearchBarRecentSearches from "./freeSearchBarRecentSearches.vue";
import fsResultsPrint from "@/components/FreeSearch/fsResultsPrint.vue";
import progressWindow from "@/components/progressWindow.vue";
import { printResultsList } from "@/services/bookLists.js";
import { exportFsResults } from "@/services/freeSearch.js";
import { mapState, mapGetters, mapActions } from "vuex";
import { treeBooks } from "@/store/modules/books";
export default {
  props: ["searchTxt"],
  components: {
    iconsUpdateContainer,
    freeSearchTitleList,
    iconsFolderContainer,
    iconFreeSearchContainer,
    freeSearchBarRecentSearches,
    fsResultsPrint,
    progressWindow,
  },
  data() {
    return {
      labelKey: this.currentSortKey,
      inSearch: false,
      searchText: "",
      labelStart: this.currentSortKey,
      showFsExport: false,
    };
  },
  watch: {
    searching: function(val, oldVal) {
      if (val) this.exitSearch();
    },
  },
  computed: {
    ...mapState("freeSearch", ["searching"]),
    ...mapState("userFavoriteBooks", ["favoriteChange"]),
    ...mapState("customSort", ["customSorts"]),
    ...mapState("freeSearchBookList", ["currentListLength", "searchInTxt"]),
    ...mapGetters("freeSearchBookList", [
      "getChecksCount",
      "getCurrentFilterName",
      "isSavedList",
      "getCurrentFSName",
      "getSortBy",
      "getCheckedBooks",
      "getFavoriteCheckBooksCount",
    ]),
    ...mapGetters("freeSearchBooklistComp", [
      "hasCheckAllFree",
      "hasCheckedTopFree",
      "getLengthListCheckFree",

      "getListCheckBooksIndex",
      "getListCheckBooksFree",
    ]),
    checkedFavorites() {
      let x = this.favoriteChange;
      //return 0; //temp
      let books = this.getCheckedBooks;
      let fav = books.filter((b) => {
        b = treeBooks.get(treeBooks.root, b);

        return !b.favorite === false;
      });
      return fav.length == books.length ? 1 : 0;
    },
    getFavoritesTooltip() {
      let checked = this.getFavoriteCheckBooksCount;
      return checked == 1
        ? this.$t("toolbox.removefavorites")
        : this.$t("toolbox.favorites");
    },
    getFavoritesIcon() {
      let checked = this.getFavoriteCheckBooksCount;
      return checked == 1 ? "0" : "P";
    },
    label() {
      return this.$t("freeSearchResults.sortBy");
    },
    currentSortKey() {
      try {
        let sort = this.getSortBy;
        //if (sort.startsWith("custom_")) sort = sort.split("_")[1];
        let key = this.sortByList.filter((s) => s.name == sort);
        if (!key || key.length == 0) return 2;
        return key[0].key;
      } catch (ex) {
        return 2;
      }
    },
    showButtons() {
      return (
        this.currentListLength > 0 ||
        this.getCurrentFilterName != "" ||
        this.searchInTxt != ""
      );
    },
    sortByList() {
      let custom = [];
      let key = 6;
      this.customSorts.forEach((sort) => {
        custom.push({ label: sort.title, key, name: "custom_" + sort.title });
        key++;
      });

      let sortOptions = [];
      sortOptions.push({
        label: this.$t("changeBookInfo.bookName"),
        key: 0,
        name: "book",
      });
      sortOptions.push({
        label: this.$t("changeBookInfo.authorName"),
        key: 1,
        name: "author",
      });
      if (this.$store.state.freeSearchBookList.resultsType == "classic") {
        sortOptions.push({
          label: this.$t("changeBookInfo.relevance"),
          key: 2,
          name: "ideal",
        });
        sortOptions.push({
          label: this.$t("changeBookInfo.deskResults"),
          key: 3,
          name: "rate",
        });
        sortOptions.push({
          label: this.$t("changeBookInfo.numResults"),
          key: 4,
          name: "results",
        });
      }
      sortOptions.push({
        label: this.$t("changeBookInfo.orderDor"),
        key: 5,
        name: "profile",
      });
      sortOptions = [...sortOptions, ...custom];
      return sortOptions;
    },
    showSearch() {
      return true;
      // return false;+
    },
    checkMinus() {
      let booksCount = this.currentListLength;
      let checksCount = this.getChecksCount;
      return checksCount > 0 && checksCount < booksCount;
      //if (Length != this.getLengthListCheckFree) return true;
      //return false;
    },
    showActions() {
      return this.getChecksCount > 0;
    },
  },

  methods: {
    ...mapActions("freeSearchBookList", [
      "removeBooks",
      "saveFsList",
      "checkAllBooks",
      "revertChecks",
    ]),
    ...mapActions("userFavoriteBooks", [
      "addFavoriteBook",
      "removeFavoriteBook",
    ]),
    async createCustomBookFromResults() {
      let payload = {
        title: "",
        content: this.$t("createBook.enterNameBook"),
        btns: [this.$t("general.confirm"), this.$t("general.cancel")],
        input: true,
      };

      let act = await this.$msg(payload);
      if (act == "" || act.btn == this.$t("general.cancel")) return;

      let bookName = act.msgInput;
      if (!bookName.trim()) {
        if (globalThis.ELECTRON_ENV) globalThis.SHOW_MSG("לא הכנסת שם ספר");
        else alert("לא הכנסת שם ספר");
        return;
      }
      this.$store.state.progressWindow.show = true;
      exportFsResults(false, true, bookName)
        .then(() => {
          this.$store.state.progressWindow.show = false;
          this.$store.state.progressWindow.bottomMessage = "";
          this.showFsExport = false;
        })
        .catch((ex) => {
          console.error(ex);
          this.$store.state.progressWindow.show = false;
          this.$store.state.progressWindow.bottomMessage = "";
          this.showFsExport = false;
        });
    },
    exportResults() {
      this.$store.state.progressWindow.show = true;
      // this.showFsExport = true;
      exportFsResults()
        .then(() => {
          this.$store.state.progressWindow.show = false;
          this.$store.state.progressWindow.bottomMessage = "";
          this.showFsExport = false;
        })
        .catch((ex) => {
          console.error(ex);
          this.$store.state.progressWindow.show = false;
          this.$store.state.progressWindow.bottomMessage = "";
          this.showFsExport = false;
        });
    },
    async printResults(type) {
      try {
        await printResultsList(type);
        //this.$store.state.progressWindow.show = false;
      } catch (ex) {
        this.$store.state.progressWindow.show = false;
        store.state.progressWindow.bottomMessage = "";
      }
    },
    async doRemoveBooks() {
      let booksIndex = this.getListCheckBooksIndex;
      let books = this.getListCheckBooksFree;
      if (books.length == 0) return;

      //ask before removing
      let payload = {
        title: this.$t("selectBook.deleteBookInList"),
        content: this.$t("selectBook.removeBookQ"),
        btns: [this.$t("general.yes"), this.$t("general.no")],
      };

      if (books.length > 1)
        payload.content = this.$t("selectBook.removeBooksQ");
      let act = await this.$msg(payload);
      if (act == this.$t("general.no") || act == "") return;

      let type = "search";
      if (this.isSavedList) type = "list";
      let fsData = { type, id: this.getCurrentFSName };

      this.removeBooks({ books, booksIndex, fsData });
    },
    doAddToFavorites() {
      let books = this.getListCheckBooksFree;
      this.getFavoriteCheckBooksCount == 1
        ? this.removeFavoriteBook({ books })
        : this.addFavoriteBook({ books });
    },
    doSaveFSList() {
      this.$store.dispatch("folders/setOpenTypePopup", "export").then(() => {
        this.$store.dispatch("folders/setListType", "free").then(() => {
          this.$store.dispatch("folders/togglePopupFolder", true);
        });
      });
    },
    doSort($event) {
      this.userSettings.setSettings("defaultCustomSort", $event.name);
      this.$store.dispatch("freeSearchBookList/setSortByList", $event.name);
    },
    txtSearchIn(e) {
      let lastSearch = e.target.value.trim();
      searchTimeout = setTimeout(() => {
        if (e.target.value.trim() == lastSearch) {
          this.$store.state.freeSearchBookList.listFromSearchIn = true;
          this.$emit("search", lastSearch);

          clearTimeout(searchTimeout);
        }
        //
      }, 200);

      // setBooksListSearchTo
      // this.$store.dispatch("bookList/setBooksListSearchTo", e.target.value);
    },
    checkAll($event, check) {
      if (check == undefined) check = $event.target.checked;
      this.$emit("checkall", check);
    },
    revert() {
      this.revertChecks();
    },
    exitSearch() {
      this.inSearch = false;
      this.$emit("search", "");
    },
    searchInList() {
      this.inSearch = !this.inSearch;
      if (!this.inSearch) this.$emit("search", "");
      else {
        if (this.$refs.inputSearch) this.$refs.inputSearch.value = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header-book-list {
  // padding: 6px 12px;
  // height: 33px;
  display: flex;
  margin: 0;
  align-items: center;
  height: 37px;
  position: relative;
  .icon-pin {
    position: absolute;
    top: 5px;
    right: 28px;
  }
}

.header-book-list .title {
  //   padding: 3.1px 4px 0 0;
  font-size: 15px;
  font-weight: 500;
  color: var(--custom-color1);
  line-height: 20.3px;
  height: 20.3px;
  padding-top: 0px;
  // padding-right: 17px;
  width: auto;
  flex-grow: 1;
}
.action-list {
  // height: 31px;
  // padding: 0px 9px 0 4px;
  display: flex;
  justify-content: space-between;
}
.div-input-search {
  position: absolute;
  top: 0;
  width: calc(100% - 75px);
  left: 32px;
  background-color: var(--bg-color8);
  text-align: right;
  height: 100%;
  border: 0;
  border-bottom: 1px solid;
}
.div-search {
  position: absolute;
  z-index: 4;
  left: 0;
  width: calc(100% - 50px);
  direction: ltr;
  left: 5px;
  background-color: var(--bg-color8);
  height: 30px;
  .icon-search-in.search {
    display: flex;
    align-items: center;
    justify-content: center;
    .div-input-search {
      width: calc(100% - 25px);
      left: 21px;
      height: 21px;
      bottom: 5px;
      top: auto;
      direction: rtl;
      color: var(--text-color1);
    }
  }
}
</style>
