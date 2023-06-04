<template>
  <div
    v-if="bookExists"
    class="book-name relative"
    @click="openBook()"
    v-kiosk.remove
    v-tooltip="{ content: `${bookName} (${author})`, placement: 'right' }"
  >
    <canvas v-if="showShaar" class="book-image" />
    <div v-else>
      <span class="bold">{{ bookName }}</span>
    </div>
    <!-- <div class="flex"> -->
    <!-- <svg class="icon" width="90">
        <use v-bind="{ href: '#icons_recent-book' }" />
      </svg> -->
    <span class="text flex-column">
      <span class="bold name-book">{{ bookName }}</span>
      <span>{{ author }}</span>
    </span>
    <div
      v-if="allowDelete"
      @click.stop="removeRecentBook"
      class="otz-icon remove no-bg remove-tab"
    >
      F
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import {
  openBook as open,
  getBookName,
  getImageObject,
} from "@/services/bookData.js";
import { Axios } from "@/services/_axios";

export default {
  props: ["book", "id", "allowDelete"],
  data() {
    return { showShaar: true };
  },
  computed: {
    ...mapGetters("books", ["getBookbyId"]),
    bookExists() {
      return this.getBookbyId(this.book) != undefined;
    },
    bookName() {
      try {
        let book = this.getBookbyId(this.book);
        return getBookName(book.name, book.volume, true);
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
  },
  methods: {
    ...mapActions("tabsManager", ["setBook"]),
    ...mapActions("userRecentBooks", ["delRecentBook"]),

    async openBook() {
      this.$store.state.homePage = false;
      open(this.book, 0, null, null, true);
    },
    removeRecentBook() {
      this.delRecentBook({ id: this.id });
    },
  },
  async mounted() {
    let canvasDom = this.$el.getElementsByTagName("canvas")[0];
    canvasDom.width = 140;
    canvasDom.height = 202;
    let pageId = 1;
    // if (this.otzarBook.type(this.book) == "system") {
    let pageName = await Axios.get(`/api/books/pageName/${this.book}/1`);

    if (pageName.data) {
      pageId = pageName.data;

      let imageData;
      try {
        try {
          imageData = await getImageObject(
            this.book,
            pageId,
            "url",
            false,
            {
              resize: canvasDom.width - 10,
            },
            "",
            1
          );
        } catch (ex) {
          console.error(ex);
          this.showShaar = false;
          return;
        }

        if (!imageData) return;
        if (imageData.imageMetaData.error) return;

        let width = 0;
        let height = 0;
        let left = 0;

        const img = imageData.picture;
        let imgRatio = img.height / img.width;

        let canvasWidth = canvasDom.width;
        let canvasHeight = canvasDom.height;

        //set size of drawing - A4 ratio
        if (imgRatio > 1.41) {
          height = canvasHeight;
          width = height / imgRatio;
          left = (canvasWidth - width) / 2;
        } else {
          width = canvasWidth;
          height = width * imgRatio;
        }

        canvasDom.getContext("2d").drawImage(img, left, 0, width, height);
      } catch (ex) {
        console.error(ex);
        this.showShaar = false;
        return false;
      }
    } else {
      //no data found for first page - so put book name instead

      this.showShaar = false;
    }
    // }
  },
};
</script>

<style lang="scss" scoped>
.book-image {
  width: auto;
  height: calc(100% - 10px);
  margin: 0 auto;
  display: block;
  cursor: pointer;
}
.icon {
  width: 20px;
  height: 20px;
}
.book-name {
  position: relative;
  padding: 8px;
  margin-left: 25px;
  margin-bottom: 45px;

  height: 190px;
  max-width: 130px;
  box-shadow: 1px 1px 6px #00000068;
  &:hover {
    box-shadow: 1px 1px 6px #00000088;
    .text {
      // height: 100%;
      // background-image: linear-gradient(180deg, #00000090, transparent);
      // color: #fff;
    }
  }
  .text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 100%;
    width: 90%;
    text-align: right;
    position: absolute;
    width: 100%;
    z-index: 1;

    top: 0;
    left: 0;
    padding: 5px;
    position: absolute;
    top: calc(100% + 1px);
    line-height: 14px;
  }
  .remove {
    font-size: 12px;
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
.name-book {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.remove-tab {
  position: absolute;
  top: 0px;
  left: 0px;
}
</style>
