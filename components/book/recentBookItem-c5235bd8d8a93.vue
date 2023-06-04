<template>
  <div v-if="bookExists" class="book-name">
    <svg class="switch-button">
      <use v-bind="{ href: '#icons_recent-book' }" />
    </svg>
    <span @click="openBook()" class="text">
      <span class="bold">{{ bookName }}&nbsp;</span>
      <span>{{ author }}</span>
    </span>
    <div @click="removeRecentBook" class="otz-icon remove no-bg">F</div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { openBook as open, getBookName } from "@/services/bookData.js";
export default {
  props: ["book", "id"],
  computed: {
    ...mapGetters("books", ["getBookbyId"]),
    ...mapGetters("tabsManager", ["isCurrentTabPinned"]),

    bookExists() {
      return this.getBookbyId(this.book) != undefined;
    },
    bookName() {
      try {
        let book = this.getBookbyId(this.book);
        return getBookName(book.name, book.volume, true);
        return book.volume != "" ? book.name + " - " + book.volume : book.name;
      } catch (ex) {
        console.error(ex.message, this.book);
      }
    },
    author() {
      try {
        let book = this.getBookbyId(this.book);
        if (book.authors_length == 0) {
          return null;
        }
        return book.mainAuthorName;
      } catch (ex) {
        console.error(ex.message, this.book);
      }
    },
    tabIdForOpenBook() {
      let tab = null;
      if (
        (this.userSettings.settings.newTabMode &&
          this.userSettings.settings.newTabMode == "1") ||
        this.isCurrentTabPinned
      ) {
        tab = new Date().getTime();
      }
      return tab;
    },
  },
  methods: {
    ...mapActions("tabsManager", ["setBook"]),
    ...mapActions("userRecentBooks", ["delRecentBook"]),

    async openBook() {
      this.$store.state.homePage = false;
      open(this.book, 0, this.tabIdForOpenBook);
      this.$emit("click");
    },
    async removeRecentBook() {
      let deleted = await this.delRecentBook({ id: this.id });
    },
  },
};
</script>

<style lang="scss" scoped>
.book-name {
  padding: 0 8px 0 0;
  .text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 100%;
    width: 90%;
    text-align: right;
  }
  .remove {
    font-size: 7px;
    line-height: 28px;
    height: 28px;
    width: 20px;
    opacity: 0;
  }
  &:hover {
    .remove {
      opacity: 1;
    }
  }
}
</style>
