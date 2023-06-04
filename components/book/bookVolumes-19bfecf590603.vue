<template>
  <div>
    <ComboboxInput
      class="fit-height g"
      listStyle="max-height:300px"
      labal=""
      :labelKey="label"
      :labelStart="label"
      :items="volumes"
      @input="showBook"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { getBookName } from "@/services/bookData.js";
import winManager from "@/services/book_win";
export default {
  props: ["tabId", "books"],
  components: {},

  data() {
    return { label: 1, labelStart: "" };
  },
  computed: {
    ...mapGetters("books", ["getBookbyId"]),
    // volumes() {
    //   let volumesArr = [];
    //   let mainVol = this.getBookbyId(this.tabData(this.tabId).book).mainVolume;
    //   let vols = this.getBookbyId(mainVol).volumes;
    //   if (!vols) return volumesArr;
    //   vols.forEach((v) => {
    //     let book = this.getBookbyId(v.id);
    //     if (book)
    //       volumesArr.push({
    //         label: this.bookName(book),
    //         bookId: v.id,
    //       });
    //   });
    //   return volumesArr;
    // },
    luach() {
      return this.books[0].correct_page !== undefined;
    },
    volumes() {
      if (this.luach) {
        return this.books.map((b) => ({
          bookId: b.id,
          pageId: b.correct_page,
          label: b.label, // this.bookName(b),
        }));
      } else
        return this.books.map((b) => ({
          bookId: b.bookId,
          pageId: b.pageId,
          label: this.bookName(b),
        }));
    },
  },
  created() {
    if (this.luach) {
      let currBook = this.$store.state.tabs[this.tabId].book;
      let bookVol = this.books.filter((b) => b.bookid === currBook);
      if (bookVol.length > 0) {
        this.label = bookVol[0].key;
        this.labelStart = bookVol[0].label;
      }
    }
  },
  methods: {
    tabData(tabId) {
      return this.$store.state.tabs[tabId];
    },
    async showBook(bookItem) {
      if (this.luach)
        this.userSettings.setSettings("luach_city", bookItem.label);
      let position = 1;
      if (bookItem.pageId) {
        let page = await this.$store.getters["books/getPageById"](
          bookItem.pageId
        );
        position = page.position;
      }
      winManager.createWinBook(
        bookItem.bookId,
        position,
        null,
        null,
        this.tabId,
        this.books
      );
    },
    bookName(book) {
      return getBookName(book.name, book.volume, true);
    },
  },
};
</script>

<style lang="scss" scoped></style>
