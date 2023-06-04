<template>
  <div style="height:95%">
    <div
      tabIndex="1"
      @keydown="doKeyPress($event)"
      @wheel="wheeling"
      :id="'the-book' + tabId"
      ref="body"
      class="text-book-body"
      :style="{ 'font-size': fontSizeC }"
    >
      <BaseContextMenu>
        <div class="menu-item" @click="print">
          {{ $t("bookPrint.btnTxt") }}
        </div>
        <div class="menu-item" @click="selectAll">
          {{ $t("general.selectAll") }}
        </div>
        <div class="menu-item" @click="copyText">
          {{ $t("bookSelectArea.btnCopyTxt") }}
        </div>
        <div class="menu-item" @click="openBookInWin">
          {{ $t("toolbox.openBook") }}
        </div>
      </BaseContextMenu>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { getHtmlPage } from "@/services/bookData.js";
import winManager from "@/services/book_win";
import { startPrint } from "@/services/print.js";
let dynamicStyle = null;
export default {
  components: {},
  props: ["tabId", "tabData", "drawFs", "fontFamily1", "fontSize1"],
  data() {
    return {
      size: this.fontSize1,
    };
  },
  computed: {
    book() {
      return this.$store.state.tabs[this.tabId].book;
    },
    page() {
      return this.$store.state.tabs[this.tabId].page;
    },
    scrollTo() {
      return this.$store.state.tabs[this.tabId].scrollTo;
    },
    pages() {
      return this.$store.state.tabs[this.tabId].pages;
    },
    fontSizeC() {
      let size1 = "24";
      switch (this.size) {
        case "1":
          size1 = "11";
          break;
        case "2":
          size1 = "14";
          break;
        case "3":
          size1 = "17";
          break;
        case "4":
          size1 = "24";
          break;
        case "5":
          size1 = "30";
          break;
        case "6":
          size1 = "36";
          break;
        case "7":
          size1 = "42";
          break;
      }
      return size1;
    },
  },
  methods: {
    ...mapActions("userRecentBooks", ["addRecentBook"]),
    copyText() {
      //document.execCommand("copy");
      executeCopy2(window.getSelection());
    },
    selectAll() {
      this.$refs.body.focus();
      document.execCommand("selectAll", false, null);
    },
    print() {
      if (startPrint(this.tabId) === true) this.$emit("print", { show: true });
    },
    openBookInWin() {
      winManager.createWinBook(this.tabData.book, this.tabData.page);
    },
    incPage(num) {
      let goto = this.page + num;
      if (goto < 0) goto = 0;
      else if (goto > this.tabData.pages.length - 1)
        goto = this.pages.length - 1;
      this.$store.state.tabs[this.tabId].page = goto;
    },
    wheeling(event) {
      return true;
      let numPages = event.wheelDeltaY / event.wheelDelta;
      if (event.wheelDelta > 0) numPages *= -1;
      this.incPage(numPages);
      event.stopPropagation();
      event.preventDefault();
      return false;
    },
    doKeyPress(event) {
      const NumLockEnabled = event.getModifierState
        ? event.getModifierState("NumLock")
        : false;
      switch (event.code) {
        case "Numpad4":
        case "ArrowLeft":
          if (event.code == "Numpad4" && NumLockEnabled) break;
          this.incPage(1);
          break;
        case "Numpad6":
        case "ArrowRight":
          if (event.code == "Numpad6" && NumLockEnabled) break;
          this.incPage(-1);
          break;
        case "PageUp":
        case "Numpad9":
          if (event.code == "Numpad9" && NumLockEnabled) break;
          event.stopPropagation();
          event.preventDefault();
          this.incPage(-10);
          break;
        case "PageDown":
        case "Numpad3":
          if (event.code == "Numpad3" && NumLockEnabled) break;
          event.stopPropagation();
          event.preventDefault();
          this.incPage(10);
          break;
      }
    },
    async getText(main) {
      let book = this.book;
      let txt = await getHtmlPage(book, main);
      this.$refs.body.innerHTML = txt;
      if (this.userSettings.settings.fontSizeTxtBook)
        this.size = this.userSettings.settings.fontSizeTxtBook;
      if (!this.$refs.body.querySelector("font")) return;
      this.$refs.body.querySelector("font").style.fontSize =
        this.fontSizeC + "px";
      this.$refs.body.querySelector(
        "font"
      ).style.fontFamily = this.userSettings.settings.fontFamilyTxtBook;
    },
    async goToPage(page) {
      let pgs = this.tabData.pages;
      if (pgs.length == 0) return;
      let pageData = pgs[page];
      await this.getText(page);
      let _vm = this;
      // window.setTimeout(() => {
      let firstResult = null;
      //draw fs marks
      if (pageData) {
        if (pageData.words) {
          if (dynamicStyle != null) document.body.removeChild(dynamicStyle);

          let styleContent = "";

          pageData.words.forEach((word) => {
            if (firstResult == null && _vm.$refs.body) {
              firstResult = _vm.$refs.body.querySelector("#SPN" + (word - 1)); //.find("SPN" + word - 1);
            }
            //   firstResult = document.getElementById("SPN" + word - 1);
            styleContent += `#SPN${word -
              1} {opacity: 0.6; background-color: yellow;}`;
          });
          if (firstResult != null)
            firstResult.scrollIntoViewIfNeeded({ behavior: "smooth" });
          dynamicStyle = document.createElement("style");
          dynamicStyle.innerHTML = styleContent;
          document.body.appendChild(dynamicStyle);
        } else {
          //move to the top
          firstResult = _vm.$refs.body.querySelector(
            "#SPN" + (pageData.pagedata[0].firstWord + 8)
          );
          if (firstResult != null)
            firstResult.scrollIntoViewIfNeeded({ behavior: "smooth" });
        }
      }
    },
  },
  watch: {
    tabData: function() {
      this.goToPage(this.page - 1);
    },
    fontFamily1: function() {
      this.$refs.body.style.fontFamily = this.fontFamily1;
      // this.$refs.body.querySelector("font").style.fontFamily = this.fontFamily1;
      this.$refs.body.querySelector("a").style.fontFamily = this.fontFamily1;
      this.$refs.body.querySelector("span").style.fontFamily = this.fontFamily1;
      this.userSettings.setSettings("fontFamilyTxtBook", this.fontFamily1);
    },
    fontSize1: function() {
      this.size = this.fontSize1;
      let size1 = this.fontSizeC;
      this.$refs.body.querySelector("font").style.fontSize = size1 + "px";
      this.userSettings.setSettings("fontSizeTxtBook", this.fontSize1);
    },
    page: function(newV, oldV) {
      let currPage = newV;
      this.goToPage(newV - 1);
      var self = this;
      let tm = setTimeout(function() {
        if ((currPage == self.page) & (currPage > 1)) {
          self.addRecentBook({ bookId: self.book, pageId: currPage });
        }
      }, 2000);
    },
    scrollTo: function(newV, oldV) {
      if (newV > 0) this.goToPage(newV - 1);
    },
    pages: {
      handler: function(val, old) {
        this.goToPage(this.page - 1);
      },
      immediate: true,
    },
  },
  mounted() {
    this.goToPage(this.page - 1);
  },
};

// Copy text as text
function executeCopy(text) {
  var input = document.createElement("textarea");
  document.body.appendChild(input);
  input.value = text;
  input.focus();
  input.select();
  document.execCommand("Copy");
  input.remove();
}

// Copy HTML as text (without HTML tags)
function executeCopy2(html) {
  var doc = new DOMParser().parseFromString(html, "text/html");
  var text = doc.body.innerText;
  return executeCopy(text);
}
</script>

<style lang="scss" scoped>
body {
  direction: rtl;
  text-align: right;
}
* {
  font-family: inherit !important;
}
.text-book-body {
  min-height: 95%;
  text-align: right;
  width: 90%;
  margin: auto;
  // height: 100%;
  user-select: text;
  line-height: normal;
  font-family: "Heebo", Arial, Helvetica, sans-serif;
  font-size: 12px;
  padding: 5px 30px 30px;
  border: 1px solid #e4e4e4;
  -webkit-box-shadow: 1px 1px 4px #0000004a;
  box-shadow: 1px 1px 4px #0000004a;
  margin: 10px auto;
  b {
    font-size: 14px;
  }
}
font {
  font-size: 9px;
}
</style>
