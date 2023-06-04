<template>
  <div>
    <header class="header-title">
      {{ $t("tsiyunim.addTsiyunHeader") + " " + pageLetter }}
    </header>
    <main class="main-tziyun">
      <div class="div-input">
        <input
          ref="input"
          :value="name"
          v-focus
          v-bind:placeholder="$t('tsiyunim.addplaceholder')"
          @keyup.enter="addTsiyun"
          @input="setName"
        />
      </div>
    </main>
    <footer class="footer-tziyun footer-msg">
      <BaseButton @click="addTsiyun">{{ $t("tsiyunim.addBtn") }}</BaseButton>
    </footer>
  </div>
</template>
<script>
import pagesContainer from "@/components/book/pagesContainer.vue";
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data() {
    return { name: "" };
  },
  computed: {
    ...mapState("popupOnceComp", ["visible"]),
    ...mapState("popupOnceComp", ["tabId"]),
    pageLetter() {
      try {
        let currTab = this.$store.state.tabs[this.tabId];
        let page = currTab.page - 1;
        let pages = currTab.pages;
        return !pages[page].pagedata || pages[page].pagedata[0].letter == ""
          ? pages[page].position
          : pages[page].pagedata[0].letter;
      } catch (ex) {
        return "";
      }
    },
  },
  watch: {
    visible: function(val) {
      this.name = "";
      this.$refs.input.focus();
    },
  },
  methods: {
    ...mapActions("popupOnceComp", [
      "setVisible",
      "setInvisible",
      "toggleVisible",
    ]),
    ...mapActions("tabsManager", ["setCurrentTabUserTsiyuns", "addUserTsiyun"]),
    addTsiyun() {
      let title = this.name;
      if (!title) return;
      let currTab = this.$store.state.tabs[this.tabId];
      let bookId = currTab.book;
      let page = currTab.page;
      let pages = currTab.pages;
      let pageId = pages[page - 1].id;

      //add tsiyun to database
      this.addUserTsiyun({
        bookId,
        pageId,
        title,
        tabId: this.tabId,
        page,
      }).then((r) => {
        //refresh tsiyuns array
        let userTsiyuns = currTab.userTsiyunim;
        this.$store.dispatch(
          "tabs/" + this.tabId + "/setUserTsiyuns",
          userTsiyuns
        );
        // this.setCurrentTabUserTsiyuns({ userTsiyuns });
        //close popup
        this.setInvisible();
        const notification = {
          type: "success",
          message:
            this.$t("tsiyunim.successAddMessage1") +
            "<b>" +
            title +
            "</b>" +
            this.$t("tsiyunim.successAddMessage2"),
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
