<template>
  <div class="container-new-tab m-9">
    <div class="content flex-column">
      <div class="w-100">
        <h1>{{ $t("tabs.newTab") }}</h1>
        <h2>{{ $t("tabs.openBookMsg") }}</h2>
        <h3 v-kiosk.remove>{{ $t("userDefaultFolders.recentbooks") }}</h3>
      </div>

      <div
        class="flex flex-center   m-9 w-100"
        :class="{
          'flex-nowrap': favoriteBooksCount > 0,
          'flex-wrap': favoriteBooksCount == 0,
        }"
        :style="{ maxWidth: maxContainerWidth }"
      >
        <newTabBookItem
          v-for="(book, i) in recentBooksList"
          :key="book.bookId + '_' + i"
          :book="book.bookId"
          :id="book.id"
          :allowDelete="true"
        />
      </div>
      <div class="w-100 mrg-t-12">
        <h3 v-if="favoriteBooksCount > 0">{{ $t("wellcome1.text17") }}</h3>
      </div>
      <div class="flex flex-nowrap flex-center   m-9 w-100">
        <newTabBookItem
          v-for="(book, i) in favoriteBooksList"
          :key="book.id + '_' + i"
          :book="book.id"
          :id="book.id"
          :allowDelete="false"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import newTabBookItem from "@/components/book/newTabBookItem.vue";
import { books, treeBooks } from "@/store/modules/books";
export default {
  props: ["book", "page"],

  components: { newTabBookItem },
  data() {
    return {
      favoriteBooksCount: 0,
      maxFavorites: 5,
      maxRecent: 5,
    };
  },
  computed: {
    ...mapGetters("userRecentBooks", ["getRecentBooks"]),
    ...mapGetters("userFavoriteBooks", ["getFavoriteBooks"]),
    maxContainerWidth() {
      return Math.round(this.userSettings.settings.widthBook) + "px";
    },
    recentBooksList() {
      let list = (this.getRecentBooks || [])
        .slice(
          0,
          this.favoriteBooksCount === 0
            ? this.maxBooksToShow + this.maxBooksToShow
            : this.maxBooksToShow
        )
        .filter((b) => {
          let book = this.$store.getters["books/getBookbyId"](b.bookId);
          if (book) return true;
        });

      return list;
    },
    favoriteBooksList() {
      let favBooks = [];

      for (
        var i = 0;
        i < books.length && favBooks.length < this.maxBooksToShow;
        i++
      ) {
        let b = treeBooks.get(treeBooks.root, books[i].id);
        if (b && b.favorite) {
          let book = this.$store.getters["books/getBookbyId"](b.id);
          if (book) favBooks.push(book);
        }
      }
      this.favoriteBooksCount = favBooks.length;
      return favBooks;
    },
    maxBooksToShow() {
      return this.userSettings.settings.widthBook
        ? Math.round(
            ((this.userSettings.settings.widthBook / 100) * 80) / 130
          ) - 2
        : 5;
    },
  },
  methods: {},
  mounted() {},
  created() {
    this.$nextTick(() => {
      this.$store.state.bookList.setFocusInInput++;
    });
  },
};
</script>
<style lang="scss" scoped>
.container-new-tab {
  width: 100%;
  h1,
  h2,
  h3 {
    text-align: right;
    margin: 0;
  }
  h1 {
    font-size: 21px;
  }
  h2 {
    margin-bottom: 15px;
    font-size: 17px;
    font-weight: normal;
  }
  h3 {
    color: var(--custom-color1);
    margin-bottom: 10px;
  }
  .content {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: fit-content;
    max-width: 80%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    margin: auto;
    .item {
      flex-basis: 33%;
    }
  }
}
</style>
