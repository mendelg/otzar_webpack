<template>
  <div class="item header-search-item">
    <baseCheckBox
      class="check-item "
      :checked="isCheck"
      @change="check(search.id)"
      @click="click"
      size="large"
    />
    <div class="content-row" @click="goAndSearch()">
      <div
        class=""
        v-bind:class="
          search.type == 'book'
            ? 'dot-yellow'
            : search.type == 'list'
            ? 'dot-blue'
            : 'dot-green'
        "
      ></div>
      <div class="hisoty-time">{{ hitoryTime }}</div>

      <div
        class="search-name"
        v-tooltip="{
          content: search.info,
          placement: 'bottom',
        }"
      >
        {{ search.info }}
      </div>
    </div>
    <span
      class="icon-general tack-icon-rotate"
      v-if="search.pin == 1 || search.pin == 'true'"
      >r</span
    >
    <div class="display-icons-box">
      <span class="icon-general" @click="deleteHistoryItem()">c</span>
      <span
        v-if="search.pin == 1 || search.pin == 'true'"
        class="icon-general"
        @click="setSearchItemPin()"
        >s</span
      >
      <span
        v-if="search.pin == 0 || search.pin == 'false'"
        class="icon-general"
        @click="setSearchItemPin()"
        >r</span
      >
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { doFreeSearch, getBooksToSearchIn } from "@/services/freeSearch.js";
export default {
  props: {
    search: Object,
  },
  data() {
    return {
      hasCheck: false,
      hitoryTime:
        this.search.historyDate.getHours() +
        ":" +
        (this.search.historyDate.getMinutes() < 10 ? "0" : "") +
        this.search.historyDate.getMinutes(),
    };
  },
  computed: {
    ...mapGetters("userSearchHistory", [
      "getUserSearchHistory",
      "getSearchHistoryListChecked",
    ]),
    userSearchHistoryListChecked() {
      return this.getSearchHistoryListChecked;
    },
    isCheck() {
      let hasChecked = false;
      this.userSearchHistoryListChecked.forEach((id) => {
        if (id == this.search.id) hasChecked = true;
      });
      return hasChecked;
    },
  },

  methods: {
    ...mapActions("bookList", ["setSearchTo", "goToHistory"]),
    ...mapActions("userSearchHistory", ["checkedSearchItem"]),
    ...mapActions("freeSearchBookList", ["setInputTxt"]),
    ...mapActions("freeSearch", ["setSearchString"]),
    async goAndSearch() {
      if (this.search.type == "book") {
        this.setSearchTo(this.search.info);
      } else if (this.search.type == "free") {
        this.setInputTxt(this.search.info);

        let historyId = this.search.infoId;
        this.setSearchString(this.search.info);
        this.setInputTxt(this.search.info);
        let books = [];
        if (historyId == 0) books = await getBooksToSearchIn();
        doFreeSearch(
          this.search.info,
          books,
          historyId,
          false,
          null,
          this.search.id
        );
      } else if (this.search.type == "list") {
        let listData = {};
        listData.id = this.search.id;
        listData.pin = this.search.pin;
        listData.created = this.search.historyDate;
        listData.content = this.search.info;
        listData.historyId = this.search.infoId;
        switch (this.search.listType) {
          case 1:
            listData.type = "SYSTEM_LIST";
            listData.listId = JSON.parse(this.search.listId);
            break;
          case 2:
            listData.type = "SAVED_LIST";
            listData.listId = JSON.parse(this.search.listId);

            break;
          case 3:
            listData.type = "SYSTEM_MULTIPLE_LISTS";
            listData.groups = JSON.parse(this.search.listId);

            break;
          case 4:
            listData.type = "CUSTOM_LIST";
            listData.ids = JSON.parse(this.search.listId);
            break;
          case 5:
            listData.type = "RECENT_BOOKS";
            break;
          case 6:
            listData.type = "AUTHOR_LIST";
        }

        this.goToHistory({ id: -1, listData });
      }
      // this.$router.push({ name: "home" });
    },
    click() {
      return;
    },
    check(id) {
      this.checkedSearchItem(id);

      this.hasCheck = !this.hasCheck;
    },
    setSearchItemPin() {
      let pin = 0;
      if (this.search.pin == 0) pin = 1;
      else pin = 0;
      let payload = {
        id: this.search.id,
        pin,
      };
      this.$store.dispatch("userSearchHistory/setSearchItemPin", payload);
    },
    //deleteSearchFromHistory
    deleteHistoryItem() {
      this.$store.dispatch(
        "userSearchHistory/deleteSearchFromHistory",
        this.search.id
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.check-item {
  display: flex;
  padding: 0 0 0 8px;
}
.dot-blue,
.dot-green,
.dot-yellow {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  text-align: center;
}
.fa-circle {
  font-size: 10px;
  display: flex;
  align-items: center;
}
.dot-yellow {
  background-color: #ffc107;
  color: yellow;
  margin-left: 10px;
}
.dot-green {
  background-color: #4caf50;
  color: green;
  margin-left: 10px;
}
.dot-blue {
  background-color: #e91e63;
  color: blue;
  margin-left: 10px;
}
.header-search-item {
  display: flex;
  // margin-left: 5px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  .tack-icon-rotate {
    display: flex;
    margin-right: auto;
    transform: rotate(-20deg);
  }
  .display-icons-box {
    display: none;
    .fa-thumb-tack {
      font-size: 23px;
      display: none;
      &:hover {
        background-color: rgba(0, 0, 0, 0.14);
      }
    }
    .fa-trash-o {
      font-size: 23px;
      display: none;
      &:hover {
        background-color: rgba(0, 0, 0, 0.14);
      }
    }
    .slash-tack-icon:after {
      content: "/";
      color: black;
      font-weight: 700;
      font-size: 23px;
      position: relative;
      left: 15px;
    }
  }
}

.header-search-item:hover {
  .fa-thumb-tack {
    display: flex;
  }
  .fa-trash-o {
    display: flex;
  }
  .tack-icon-rotate {
    display: none;
  }
  .display-icons-box {
    display: flex;
    margin-right: auto;
  }
}
.header-search-item > * {
  // margin-left: 5px;
}
.header-search-item > *:first-child {
  margin-left: 0px;
}
.hisoty-time {
  display: flex;
  font-size: 13px;
  color: #a7a7a7;
  margin-left: 14px;
  width: 33px;
}
.search-name {
  display: flex;
  max-width: 100%;
  overflow: hidden;
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 150px;
  height: auto;
}
.content-row {
  display: flex;
  flex-grow: 1;
  align-items: center;
}
// .tack-icon {
// font-size: 25px;
// }
// .display-icons-box {
// display: flex;
// margin-right: auto;
// }
// .fa-thumb-tack {
// font-size: 25px;
// }
// .slash-tack-icon:after {
// content: "/";
// color: black;
// font-weight: 700;
// font-size: 25px;
// position: relative;
// left: 15px;
// }
// .slash-tack-icon {
// font-size: 25px;
// }
</style>
