<template>
  <div>
    <div class="flex-row" style="width:100%" v-mobile.hide>
      <div class="combo-vol m-r-10">
        <bookVolumes
          :tabId="tabId"
          v-if="tabData(tabId).volumes.length > 1"
          :books="tabData(tabId).volumes"
        />
      </div>
      <div
        class="search search-in-book flex"
        v-if="!customBook"
        :class="{ 'mobile-search': $_mobile }"
      >
        <div style="padding:5px 8px">
          <div>
            <span
              class="page-icon"
              v-tooltip="
                searchCurrentPage
                  ? $t('freeSearchInput.searchInAllBook')
                  : $t('freeSearchInput.searchInCurrentPage')
              "
              @click.stop="searchCurrentPage = !searchCurrentPage"
            >
              <Icons
                class="btn-header"
                :icon="searchCurrentPage ? 'open-book' : 'open-section'"
                height="15px"
                width="15px"
              />
            </span>
          </div>
        </div>
        <baseInputIconSearch
          style="padding-right:3px"
          class="w-100"
          :placeholder="
            searchCurrentPage
              ? $t('freeSearchInput.searchInCurrentPage')
              : $t('freeSearchInput.placeHolderInBook')
          "
          @input="setTextSearch"
          :text="searchInBookTxt"
          @search="search"
          @clear="$store.state.freeSearch.searchInBookTxt = ''"
          :nofocus="true"
          :searchCurrentPage="searchCurrentPage"
        />
      </div>
    </div>
    <!-- not delete this div!!! -->
    <div class=""></div>
    <pagePicker
      :tabId="tabId"
      v-if="
        !$_mobile &&
          $store.state.tabs[this.tabId].SHAS_SECTION_LIST_ID &&
          !tabId.startsWith('win_')
      "
    />
    <pagesArrows
      v-if="numPages > 0 && !txtBook"
      :numPages="numPages"
      :page="page"
      :tabId="tabId"
    />

    <customText
      class="dir-l"
      @font-family="changeF"
      @font-size="changeS"
      v-if="txtBook"
    />
  </div>
</template>
<script>
import { doFreeSearch, setSearchType } from "@/services/freeSearch.js";
import pagesArrows from "@/components/book/pagesArrows.vue";
import customText from "@/components/book/customText.vue";
import bookVolumes from "@/components/book/bookVolumes.vue";
import pagePicker from "@/components/mefPagePicker/PagePickerContainer.vue";
import Icons from "@/components/Icons/Icons.vue";

export default {
  data() {
    return { searchCurrentPage: false };
  },
  props: ["hasTabs", "numPages", "page", "tabId", "book"],
  components: {
    pagesArrows,
    pagePicker,
    customText,
    bookVolumes,
    Icons,
  },
  computed: {
    customBook() {
      return this.otzarBook.type(this.book) == "custom";
    },
    txtBook() {
      return this.$store.state.tabs[this.tabId].txtBook;
    },
    searchInBookTxt() {
      return this.$store.state.freeSearch.searchInBookTxt;
    },
  },
  methods: {
    setTextSearch(e) {
      let txt = "";
      try {
        txt = e.target.value.replace(/\s\s/g, "-");
      } catch (ex) {
        txt = e.replace(/\s\s/g, "-");
      }
      this.$store.state.freeSearch.searchInBookTxt = txt;
    },

    search() {
      this.$store.state.freeSearch.inBook = true;
      if (this.searchInBookTxt != "") {
        this.$emit("search", {
          show: true,
          txt: this.searchInBookTxt,
        });
        setSearchType("classic");
        let books = [this.book];

        if (this.searchCurrentPage) {
          let pages = this.$store.state.tabs[this.tabId].pages;
          let currPage = pages.find((p) => p.position == this.page);
          if (currPage) {
            let { firstWord, numWords } = currPage.pagedata[0];
            books = {
              positions: `${firstWord}-${firstWord + numWords}`,
              book: this.book,
              id: this.page,
              currentPage: true,
            };
          }
        }
        doFreeSearch(
          this.searchInBookTxt.replace(/[\u0591-\u05C7]/g, ""), //remove niqud,
          books,
          0,
          true,
          this.tabId
        ).then(() => {
          this.$emit("search", {
            show: false,
            txt: this.searchInBookTxt,
          });
        });
      }
    },
    changeF(font) {
      this.$emit("font-family", font);
    },
    changeS(size) {
      this.$emit("font-size", size);
    },
    tabData(tabId) {
      return this.$store.state.tabs[tabId];
    },
  },
};
</script>
<style scoped lang="scss">
.m-r-10 {
  margin-right: 10px;
}
.combo-vol {
  // position: absolute;
}
.search {
  max-width: 350px;
  width: 100%;
}
.mobile-search {
  max-width: 30% !important;
}
.search-in-book {
  margin-bottom: 4px;
}
.page-icon {
  width: 25px;
  cursor: pointer;
}
</style>
