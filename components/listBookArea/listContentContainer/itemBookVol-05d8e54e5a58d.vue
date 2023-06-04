<template>
  <div class="item-book item-vol" :class="{ check: checked, active: active }">
    <baseCheckBox
      class="check-item"
      @change="check($event, book.id)"
      @click="click"
      size="small"
    />
    <div
      @click="clickBook()"
      class="container-text-item"
      :class="{ red: hasVolumes }"
    >
      <nameBook :name="bookName" />
      <nameAuthor :name="author" />
    </div>
    <div class="icons">
      <baseIcon
        class="icon-outer"
        nameIcon="books-author"
        pathIcon="icons-ganeral"
        width="11"
        height="15"
        @click="openListBooksAuthor"
      />
      <baseIcon
        class="icon-outer"
        nameIcon="book-info"
        pathIcon="icons-ganeral"
        width="6"
        height="15"
        @click="toggleBookDetailsVisible"
      />
      <baseIcon
        class="icon-outer favorites-icon"
        :class="{ favorite: favoriteBooksById }"
        nameIcon="favorites-list-book"
        pathIcon="icons-ganeral"
        width="16"
        height="16"
        @click="toggleFavorites"
      />
    </div>
  </div>
</template>

<script>
import nameBook from "@/components/listBookArea/listContentContainer/nameBook.vue";
import nameAuthor from "@/components/listBookArea/listContentContainer/nameAuthor.vue";
import { openBook as open } from "@/services/bookData.js";

import { mapActions, mapGetters } from "vuex";

export default {
  props: ["book", "checked"],
  data() {
    return {
      // checkedBook: []
      hasCheck: false,
    };
  },
  computed: {
    ...mapGetters("books", [
      "getVolumeByIdBook",
      "getAllVolumesById",
      "getBookbyId",
    ]),
    ...mapGetters("bookList", ["getNameListBook"]),
    ...mapGetters("userFavoriteBooks", ["getFavoriteBooksById"]),
    ...mapGetters("tabsManager", ["getCurrentBook"]),
    active() {
      if (this.getCurrentBook && this.getCurrentBook == this.book.id)
        return true;
      return false;
    },
    favoriteBooksById() {
      return this.getFavoriteBooksById(this.book.id);
    },
    drawInfo() {
      return this.book.words ? { fs: this.book.words } : {};
    },
    hasVolumes() {
      //
      if (this.book.volumes_length > 0) {
        return true;
      }
      return false;
    },
    author() {
      if (this.book.authors_length == 0) {
        return null;
      }

      return this.book.mainAuthorName;
    },
    bookName() {
      return this.book.volume != ""
        ? this.book.name + " - " + this.book.volume
        : this.book.name;
    },
  },
  components: {
    nameBook,
    nameAuthor,
  },
  methods: {
    ...mapActions("tabsManager", ["setBook"]),
    ...mapActions("booklistComp", ["addListBooks"]),
    ...mapActions({ bookCheck: "bookList/checkBook" }),
    click() {
      return;
    },
    addHistory() {
      this.$emit("click");
    },
    async clickBook() {
      let bookId = this.book.id;
      let page = -1;

      if (this.book.page) page = this.book.page;
      if (this.page) page = "P" + this.page;

      this.addHistory();

      open(bookId, page);
    },
    check($event, book) {
      this.bookCheck({ book, check: $event.target.checked });
    },
    openListBooksAuthor() {
      this.$emit("click-icon-vol", "author", this.book.id, this.author);
    },
    toggleBookDetailsVisible() {
      this.$emit("click-icon-vol", "details", this.book.id);
    },
    toggleFavorites() {
      this.$emit("click-icon-vol", "favorites", this.book.id);
    },
  },
};
</script>

<style lang="scss" scoped>
body {
  direction: rtl;
  text-align: right;
}
.red {
  // background-color: red;
}
.item-book {
  display: flex;
  width: 100%;
  height: 37px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0 11px;
  line-height: 37px;
  color: #000;
  font-size: 13px;
  cursor: pointer;
  direction: rtl;
  max-width: 100%;

  .container-text-item {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 100%;
    width: 100%;
    color: rgba(0, 0, 0, 0.5);
    font-size: 12px;
  }
  .check-item {
    opacity: 0;
    transition: 0.3s;
  }
  &.check {
    .check-item {
      opacity: 1;
      transition: 0.3s;
    }
  }
}
.item-book:hover,
.item-book.active {
  box-shadow: inset 1px 0 0 #dadce0, inset -1px 0 0 #dadce0,
    0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
  // border: 1px solid #d4d4d4;
  border-left: 0;
  // background-color: var(--text-color7);
  border-right: 0;
  .check-item {
    opacity: 1;
  }
}

.item-book .name-author {
  // color: #000;
  font-size: 12px;
  padding-right: 7px;
}
.item-book .name-book {
  // color: #000;
  font-size: 13px;
  font-weight: bold;
}
</style>
