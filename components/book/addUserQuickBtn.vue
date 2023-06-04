<template>
  <div>
    <main class="main-tziyun">
      <div class="div-input">
        <input
          v-focus
          ref="input"
          :value="name"
          v-bind:placeholder="$t('quickBtn.placeholder')"
          @keyup.enter="addQuickBtn"
          @input="setName"
        />
      </div>
    </main>
    <footer class="footer-tziyun">
      <BaseButton @click="addQuickBtn">{{ $t("quickBtn.btn") }}</BaseButton>
    </footer>
  </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
import { IPUserNoPersDataMsg } from "@/services/userBooksData.js";
export default {
  props: {
    close: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return { pageLetter: "", name: "" };
  },
  computed: {
    ...mapGetters("user", ["isIPLimited"]),
    ...mapGetters("quickButtons", ["getBooks"]),
    ...mapState("popupOnceComp", ["visible"]),
  },
  watch: {
    visible: function() {
      this.name = "";
    },
  },
  methods: {
    ...mapActions("popupOnceComp", [
      "setVisible",
      "setInvisible",
      "toggleVisible",
    ]),
    ...mapActions("quickButtons", ["add", "showAddQuickBtn", "addBooks"]),
    ...mapActions("userFolders", ["refreshFolders"]),

    addQuickBtn() {
      if (this.isIPLimited) {
        IPUserNoPersDataMsg();

        return;
      }
      let title = this.name;
      if (!title) return;
      let books = [];
      if (this.getBooks.length > 0) {
        books = this.getBooks;
      }
      //add quick button to database
      let currDate = new Date();
      this.add({ title, books, currDate })
        .then((r) => {
          //update user folders to get new button in folders
          this.refreshFolders();
          this.addBooks([]);
          if (!this.close) {
            this.$emit("added");
            return;
          }
          //close popup
          this.setInvisible();
          this.showAddQuickBtn(false);
          const notification = {
            type: "success",
            message:
              this.$t("quickBtn.successAddMessage1") +
              "<b> " +
              title +
              "</b> " +
              this.$t("quickBtn.successAddMessage2"),
            timeout: 4000,
          };
          this.$notify(notification);
        })
        .catch((err) => {
          const notification = {
            type: "success",
            message: this.$t("quickBtn.קיים כפתור מהיר בשם זה"),
            timeout: 4000,
          };
          this.$notify(notification);
        });
    },
    setName(event) {
      this.name = event.target.value;
    },
  },
};
</script>
