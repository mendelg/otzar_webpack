<template>
  <div v-kiosk v-click-outside="closeList" class="free-history-container">
    <!-- <iconCircle class="h-100" nameIcon="arrow-circle" /> -->
    <div
      @click="toggleList()"
      class="icon-circle otz-icon icon-bg mrg-l-3 icon-arrow-recent"
      v-tooltip="{
        content: $t('freeSearchResults.recentSearches'),
        placement: 'left',
      }"
    >
      o
    </div>
    <div v-if="state" class="list">
      <titleAndXHeader
        @click="toggleList"
        :text="$t('freeSearchResults.recentSearches')"
      />
      <div class="list-content">
        <div
          class="pinned book-name"
          v-for="search in getPinned"
          :key="search.id"
        >
          <span
            class="text cliptxt"
            @click="
              setSearch(search.data, search.infoId, search.listType, search.id);
              toggleList();
            "
          >
            {{ search.data }}
          </span>

          <span class="text-gray">{{
            search.listType == "special"
              ? $t("freeSearchInput.searchIn.siyun_maf")
              : search.listType != ""
              ? $t("freeSearchInput.limitedList")
              : ""
          }}</span>
          <div class="del-history">
            <div class="icon flex">
              <BaseIconX nameIcon="x-list" @click="deleteHistory(search.id)" />
              <span
                @click.stop="pinHistory(search.id, false)"
                class="pin text-xxl mef-icon pin"
                v-tooltip="{
                  content: $t('tooltip.unpin'),
                  placement: 'top',
                }"
              >
                <BaseIcon
                  class="icon x-close"
                  width="13"
                  height="15"
                  nameIcon="pinter-active"
                  pathIcon="icons"
                />
              </span>
            </div>
          </div>
        </div>
        <div
          class="book-name"
          v-for="search in getUnPinned"
          :key="search.id"
          :search="search.data"
          @click="
            setSearch(search.data, search.infoId, search.listType, search.id)
          "
        >
          <span class="text cliptxt">
            {{ search.data }}
          </span>

          <span class="text-gray white-space-no-warp">{{
            search.listType == "special"
              ? "בציונים ומפתחות"
              : search.listType != ""
              ? $t("freeSearchInput.limitedList")
              : ""
          }}</span>
          <div class="del-history">
            <div class="icon flex">
              <BaseIconX nameIcon="x-list" @click="deleteHistory(search.id)" />
              <span
                @click.stop="pinHistory(search.id, true)"
                class="mef-icon text-xxl"
                v-tooltip="{ content: $t('tooltip.pin'), placement: 'top' }"
              >
                <BaseIcon
                  class="icon"
                  width="13"
                  height="15"
                  nameIcon="pinter-gray"
                  pathIcon="icons"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  doFreeSearch,
  setSearchType,
  deleteSearchFromHistory,
  getBooksToSearchIn,
} from "@/services/freeSearch.js";

import { setSearchHistoryPin } from "@/services/history.js";

export default {
  data() {
    return {
      state: false,
      nameIconRemove: "x-list",
    };
  },
  computed: {
    ...mapGetters("userSearchHistory", ["getUserSearchHistoryByType"]),
    getfreeSearchHistory() {
      let history = this.getUserSearchHistoryByType(["free"]);

      history = history.map((r) => {
        return {
          id: r.id,
          data: r.info,
          infoId: r.infoId,
          listType: r.listType,
          pin: r.pin,
          lastActive: r.lastActive,
        };
      });

      return history;
    },
    getPinned() {
      return this.getfreeSearchHistory.filter((h) => h.pin);
    },
    getUnPinned() {
      return this.getfreeSearchHistory.filter((h) => !h.pin);
    },
  },
  methods: {
    ...mapActions("freeSearchBookList", ["setInputTxt"]),
    ...mapActions("userSearchHistory", [
      "deleteSearchFromHistory",
      "setSearchHistoryList",
    ]),
    toggleList() {
      this.state = !this.state;
    },
    closeList() {
      this.state = false;
    },
    parentList() {
      this.$emit("click");
    },
    async setSearch(txt, historyId, listType, id) {
      this.setInputTxt(txt);
      let books = [];
      if (historyId == 0) books = await getBooksToSearchIn();
      if (listType === "special") {
        books = "special";
        setSearchType("special");
      } else setSearchType("classic");

      doFreeSearch(txt, books, historyId, false, null, id);
      this.toggleList();
    },
    deleteHistory(id) {
      this.deleteSearchFromHistory(id).then(() => {
        this.setSearchHistoryList();
      });
    },
    pinHistory(id, pin) {
      setSearchHistoryPin({ id, pin }).then(() => {
        this.setSearchHistoryList();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$text-color0: #fff;
.book-name {
  display: flex;
  flex-direction: row;
  padding: 0 8px;
  align-items: center;
}

.icon-container {
  display: flex;
  flex-direction: row;
  width: 200px;
  // height: 20px;
  cursor: pointer;
  // background-color: white;
  .title {
    line-height: 14px;
    padding: 0 8px 0 3px;
    color: $text-color0;
  }
  .arrow-history-search-icon {
    position: relative;
    width: 8px;
    height: 13px;
    svg {
      width: 8px;
      height: 5px;
      position: absolute;
      opacity: 1;
    }
  }
}

.freesearch-container {
  .free-history-container {
    // position: absolute;
    // width: 100%;
    height: 20px;
    padding: 5px;
    background-color: transparent;
    border: 0;
  }
}
.list {
  height: 170px;
  animation: dropdown 0.1s;
}
.cliptxt {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.list-content {
  overflow: auto;
  height: calc(100% - 22px);
}
.icon-pin {
  font-size: 28px;
}
</style>
