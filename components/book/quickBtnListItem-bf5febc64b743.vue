<template>
  <div class="quick-book-container" @click="addBooks()">
    <div class="quick-book-item-title">
      <div class="btn">{{ title }}</div>
    </div>
    <div class="quick-book-item-date">{{ createdDate }}</div>
    <div class="quick-book-item-books">{{ booksCount }}</div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { openBook as open } from "@/services/bookData.js";
export default {
  props: ["item", "books"],
  data() {
    return { show: false };
  },
  computed: {
    ...mapGetters("books", ["getSystemBasicBookByFolderId"]),
    title() {
      return this.item.title;
    },
    createdDate() {
      var d = new Date(this.item.createdAt);
      return (
        "נוצר " +
        d.getDate() +
        "." +
        (d.getMonth() + 1) +
        "." +
        d.getFullYear() +
        " " +
        d.getHours() +
        ":" +
        d.getMinutes()
      );
      return d;
    },
    booksCount() {
      return this.$t("general.books") + " " + this.item.books;
    },
  },
  methods: {
    ...mapActions("tabsManager", ["setBook"]),
    addBooks() {
      let listId = this.item.id;
      let books = this.books;
      let title = this.title;
      if (books.length == 0) return;
      else if (books.length > 300) {
        const notification = {
          type: "error",
          message: this.$t("qckbtn1.maxLst"),

          timeout: 2000,
        };
        this.$notify(notification);
        return;
      }
      this.$store
        .dispatch("userFolders/userFolderListAddBooks", {
          id: listId,
          listType: "book",
          books,
          listType: "book",
        })
        .then(() => {
          let a = books.length;

          this.$store.dispatch("popupOnceComp/toggleVisible");
          const notification = {
            type: "success",
            message:
              this.$t("general.adding") +
              " " +
              books.length +
              " " +
              this.$t("qckbtn1.fileToQckBtn") +
              "<b>'" +
              title +
              "'</b>",
            timeout: 2000,
          };
          this.$notify(notification);
          this.$store.dispatch("quickButtons/setQuickButtonsData", null, {
            root: true,
          });
        });
    },
    toggleShow() {
      switch (this.type) {
        case "new": {
          this.$store.dispatch("popupOnceComp/setSlotShow", "add-quick");
          this.$store.dispatch("popupOnceComp/toggleVisible");
          break;
        }
        case "personal": {
          if (this.yesod.next == undefined) {
            //get books
            this.yesod.next = [
              { id: 10, title: "באר ישראל" },
              { id: 2, title: "אב בחכמה" },
            ];
          }
          this.show = !this.show;
          break;
        }
        case "system": {
          this.show = !this.show;
          break;
        }
      }
    },
    close() {
      //this.show = false;
      this.$emit("click");
    },
    async openBook(id) {
      this.$store.state.homePage = false;
      let book;

      if (this.yesod.type == "system")
        //sifrei yesod buttons

        book = this.getSystemBasicBookByFolderId(id).id;
      //personal button
      else book = id;

      if (book != undefined) open(book, -1);
      this.toggleShow();
    },
  },
};
</script>
<style lang="scss" scoped>
$border1: #e5e5e5;
$text-color3: #b2b2b2;

.quick-book-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding-right: 27px;
  padding-left: 27px;
  height: 33px;
  // border-bottom: 1px solid #ececec;
  border-bottom: 1px solid $border1;
  line-height: 32px;
  justify-content: space-between;
}
.quick-book-list {
  height: 165px;
  overflow: auto;
}
.quick-book-item-title {
  // width: 150px;
  padding-top: 4px;
  text-align: right;
  font: Regular 13px/14px Heebo;
  letter-spacing: 0px;
  color: #000000;
  opacity: 1;
  .btn {
    min-width: 92px;
  }
}
.quick-book-item-date {
  width: 156px;
  text-align: center;
  font-size: 12px;
  letter-spacing: 0px;
  color: $text-color3;
  opacity: 1;
}
.quick-book-item-books {
  width: 78px;
  text-align: center;
  font: Regular 12px/18px Heebo;
  letter-spacing: 0px;
  color: var(--custom-color1);
  opacity: 1;
}
</style>
