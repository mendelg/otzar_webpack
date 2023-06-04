<template>
  <div
    ref="item"
    class="row-item"
    :style="{ 'flex-basis': (!showGrid || fullPage ? 100 : 33) + '%' }"
  >
    <div
      @mouseenter="hover = true"
      @mouseleave="hover = false"
      style="height: 100%; display: flex"
    >
      <div :class="{ 'card-bottom-big-space': !minimize }" class="card">
        <div class="secCcontainer">
          <CardHeader
            v-if="loadContent"
            :ishover="hover"
            :book="book"
            :subBook="subBook"
            :shasSecSelected="shasSecSelected"
            :fullPage="fullPage"
            :shiurTitle="mefSection.title"
            :firstPageNum="getFirstPageNum"
            :minimize="minimize"
            @toggleFullPage="fullPage = !fullPage"
            @toggleMinimize="toggleMinimize"
            @toggleBookInfo="openBookInfo(book.id)"
            @print="printSec"
            :gridMode="showGrid"
          ></CardHeader>
          <div style="flex-grow: 1; display: flex" v-if="!minimize">
            <div
              class="subSectionsContainer"
              :class="{ 'no-limit': fullPage }"
              :style="{ 'min-height': '40px', 'max-height': maxHeight }"
              @click="toggleHeight()"
            >
              <h2 v-if="mefSection.deny" style="color: red; text-align: center">
                {{ $t("mefo.noViewLicense") }}
              </h2>
              <!-- <template v-else-if="mefSection.type == 's'">
                <div>שיעור: {{ mefSection.title }}</div>
              </template> -->
              <!-- SectionContent -->
              <SectionContent
                v-else-if="loadContent"
                :book="book"
                @myHeight="addToContentHeight"
                :loadFullSection="showFullSection || loadFullSection"
                :mefSectionOrdered="mefSectionOrdered"
                @setSecCanvass="setSecCanvass"
                @saveTempImg="(i, b, p) => $emit('saveTempImg', i, b, p)"
                :tempBookImages="tempBookImages"
                :fullPage="fullPage"
                :allowed="isAllowedBook"
                :resize_trigger="resize_trigger"
              ></SectionContent>
              <ExpandIcon
                v-if="
                  !showFullSection &&
                  canvases.length &&
                  !fullPage &&
                  contentHeight > maxContentHeight
                "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ExpandIcon from "./ExpandIcon.vue";
import CardHeader from "./CardHeader.vue";
import SectionContent from "./SectionContent.vue";
import mixNetTimer from "@/mixing/mixNetTimer";
import { getBookPermission, isPackageBook } from "@/services/license";

let netInform = null;

export default {
  mixins: [mixNetTimer],
  props: [
    "resize_trigger",
    "shasSecSelected",
    "mefSection",
    "bookView",
    "showGrid",
    "minimizeAll",
    "loadContent",
    "tempBookImages",
  ],
  components: { ExpandIcon, CardHeader, SectionContent },
  data() {
    return {
      maxContentHeight: 0,
      contentHeight: 0,
      observer: null,
      secHeight: "20rem",
      hover: false,
      canvases: [],
      fullPage: false,
      minimize: false,
      loadFullSection: false,
    };
  },
  beforeDestroy() {
    clearTimeout(netInform);
  },
  async mounted() {
    this.maxContentHeight = this.convertRemToPixels(20);
    const handleIntersection = (entries) => {
      if (entries[0]?.isIntersecting) {
        //trigger net msg to inform we use mef (if we not in net mode then its does nothing)
        clearTimeout(netInform);
        netInform = setTimeout(() => {
          this.$socket.client.emit("mef_ping");
          this.triggerNetwork();
        }, 3000);
        this.$emit("enter");
      }
    };

    this.observer = new IntersectionObserver(handleIntersection);
    this.observer.observe(this.$el);
  },
  destroyed() {
    if (this.observer) this.observer.disconnect();
  },
  computed: {
    getFirstPageNum() {
      return this.mefSection.rects[0]?.pageNum || 0;
    },
    isAllowedBook() {
      //check book allowed fro user
      if (globalThis.SERVER_MODE == "online") {
        let permissions = getBookPermission(
          this.mefSection.book
        ).bookPermissions;

        let maxPages =
          isPackageBook(permissions) ||
          this.$store.state.user.userType == "GUEST"
            ? globalThis.DEV_ALLOWED_PAGES_PACKAGE
            : globalThis.DEV_ALLOWED_PAGES_BASIC;

        if (Object.keys(this.mefSection.pages)[0] <= maxPages) return true;

        let userPermissions = this.$store.state.user.permissions;

        return (permissions & userPermissions) > 0;
      }

      let book = this.getBookbyId(this.mefSection.book, true);
      return book ? (book.NA && !book.removed ? false : true) : false;
    },
    book() {
      return this.getBookbyId(this.mefSection.book, true);
    },
    subBook() {
      return this.mefSection.rects[0] ? this.mefSection.rects[0].subbook : 0;
    },
    maxHeight() {
      return this.fullPage ? "75rem" : this.secHeight;
    },
    mefSectionOrdered() {
      let sec = this.mefSection;
      if (sec.deny) return;
      sec = this.sortSubSections(sec);
      sec = this.orderSubSectionsRects(sec);
      return sec;
    },
    showFullSection() {
      return this.secHeight == "unset";
    },
  },
  methods: {
    convertRemToPixels(rem) {
      return (
        rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
      );
    },
    addToContentHeight(h) {
      //because we dont really know in this time what the real h so if it fit all then probably its big
      if (h >= 317) h = 617;
      this.contentHeight = h;
    },
    toggleMinimize() {
      if (!this.showGrid) this.minimize = !this.minimize;
    },
    openBookInfo(id) {
      this.$store.dispatch("bookPopups/showBookDetailsVisible", id);
    },
    toggleHeight() {
      if (this.secHeight == "unset") {
        this.secHeight = "20rem";
        // this.$refs.item.scrollIntoView({
        //   behavior: "smooth",
        //   block: "nearest",
        // });
      } else {
        this.secHeight = "unset";
      }
    },
    getBookbyId(bookId, getNABooks) {
      let book = this.$store.getters["books/getBookbyId"](bookId, getNABooks);

      return book;
    },
    sortSubSections(sec) {
      sec.rects.sort((a, b) => {
        return a.order - b.order;
      });
      sec.rects.sort((a, b) => {
        return a.pageNum - b.pageNum;
      });
      return sec;
    },
    orderSubSectionsRects(sec) {
      try {
        let allOrderedmarks = Object.values(sec.pages)
          .map((p) => Object.values(p.columns))
          .flat()
          .map((c) => c.marks)
          .flat();
        if (allOrderedmarks.length == sec.rects.length) return sec;
      } catch (error) {
        //do nothing
      }

      const fillObj = (obj, curMark, clIndx) => {
        let p = obj.pages || {};

        p[curMark.pageNum] = p[curMark.pageNum] || {};
        p[curMark.pageNum].page = curMark.page;
        p[curMark.pageNum].pageNum = curMark.pageNum;
        p[curMark.pageNum].columns = p[curMark.pageNum].columns || {};
        p[curMark.pageNum].columns[clIndx] =
          p[curMark.pageNum].columns[clIndx] || {};
        p[curMark.pageNum].columns[clIndx]["marks"] =
          p[curMark.pageNum].columns[clIndx]["marks"] || [];
        p[curMark.pageNum].columns[clIndx]["marks"].push(curMark);
        return p;
      };
      function isNewColumn(prevMark, curMark) {
        var theSamePage = curMark.pageNum == prevMark.pageNum;
        var isCurLower = curMark.y - prevMark.y > 0;
        let isCurLefter = curMark.x + curMark.w <= prevMark.x;
        if (theSamePage && (!isCurLower || isCurLefter)) return true;
      }

      let columnIndx = 0;
      let marks = sec.rects;

      // sec.pages = {};
      sec.pages = fillObj(sec, marks[0], columnIndx);
      for (let i = 1; i < marks.length; i++) {
        var prevMark = marks[i - 1],
          curMark = marks[i];
        if (curMark.pageNum !== prevMark.pageNum) columnIndx = 0;
        if (isNewColumn(prevMark, curMark)) columnIndx++;
        sec.pages = fillObj(sec, curMark, columnIndx);
      }
      for (const p of Object.values(sec.pages)) {
        let pageMarks = Object.values(p.columns)
          .map((c) => c.marks)
          .flat();
        let sum = pageMarks.reduce((sum, i) => sum + i.w, 0) / pageMarks.length;
        let toLargDiff =
          Math.min(...pageMarks.map((m) => m.w)) <
          Math.max(...pageMarks.map((m) => m.w)) / 2.5;
        if (toLargDiff) {
          let pm = pageMarks.filter(
            (m) => m.w > Math.min(...pageMarks.map((m) => m.w))
          );
          sum = pm.reduce((sum, i) => sum + i.w, 0) / pm.length;
        }
        p.maxWidthAbleOfPage = sum >= 0.8 ? 1.1 : 0.8;
        for (const col of Object.values(p.columns)) {
          let noKoteretMarks = [];
          for (const m of col.marks) {
            if (
              ["left", "right", "center", "original"].includes(m.manualPosition)
            ) {
              noKoteretMarks.push(m);
            } else if (m.manualPosition === "fill") {
              m.isKoteret = true;
            } else {
              //## לאחר הפעלת הסקריפט בצד שרת
              // אמור נתון הכותרת להגיע ישירות מהמסד נתונים
              //במקום החישוב הידני להלן:
              if (m.w <= p.maxWidthAbleOfPage) {
                noKoteretMarks.push(m);
              } else if (m.w > p.maxWidthAbleOfPage) {
                m.isKoteret = true;
              }
              //############
            }
          }

          col.x = Math.min(...noKoteretMarks.map((m) => m.x));
          //המרחק בין הקצה השמאלי ביותר לקצה הימני ביותר של הטור
          let mostRightOfCol = Math.max(
            ...noKoteretMarks.map((m) => m.w + m.x)
          );
          col.w = mostRightOfCol - col.x;
          //תיקון למקרה שהוא הריבוע היחיד בעמוד
          if (pageMarks.length === 1) {
            col.x = pageMarks[0].x;
            col.w = pageMarks[0].w;
          }
        }
      }
      //הטור הרחב ביותר
      sec.widestColWidth = Math.max(
        ...Object.values(sec.pages)
          .map((p) => Object.values(p.columns))
          .flat()
          .map((col) => col.w)
      );
      return sec;
    },
    setSecCanvass(canvases) {
      this.canvases = canvases;
    },
    async printSec() {
      let sw = 0;
      let sh = 0;
      this.canvases.forEach((e) => {
        sw = sw < e.width ? e.width : sw;
        sh += e.height;
      });
      const canvas = document.createElement("canvas");
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext("2d");
      let lastY = 0;
      this.canvases.forEach((e) => {
        ctx.drawImage(e, 0, lastY, e.width, e.height);
        lastY += e.height;
      });

      canvas.toBlob(function (blob) {
        // const b = new Blob(["hello\r\n"], { type: "text/plain" });
        const item = new ClipboardItem({
          "image/png": blob,
        });
        navigator.clipboard.write([item]);
      });
      const msg = this.$t("mefo.successfullyCopied");
      const notification = {
        type: "success",
        message: msg,
        timeout: 2000,
        setting: {
          grid: "icon",

          position: "center",
        },
      };
      this.$notify(notification);
      // canvas.className = "xxxaa";
      // document.body.append(canvas);
      // let selection = window.getSelection();
      // let container = document.querySelector(".xxxaa");

      // if (selection.rangeCount > 0) {
      //   selection.removeAllRanges();
      // }

      // const range = document.createRange();
      // range.selectNode(container);
      // selection.addRange(range);
      // document.execCommand("copy");
      // selection.removeAllRanges();

      // this.loadFullSection = true;
      // this.$store.dispatch("mefoPrinter/setShowMefoPrinter", true);
      // this.$store.dispatch("mefoPrinter/addSecToPrinter", {
      //   id: this.mefSection.id,
      //   canvases: this.canvases,
      //   book: this.book,
      // });
    },
  },
  created() {
    this.minimize = this.minimizeAll;
    this.fullPage = this.bookView;
  },
  watch: {
    bookView: function (val, oldV) {
      this.fullPage = val;
    },
    minimizeAll: function (val, oldV) {
      this.minimize = val;
    },
    showGrid: function (val, oldV) {
      if (val) this.minimize = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.row-item {
  /* flex-basis: 22rem; */
  flex-basis: 33%;
  flex-grow: 1;
  max-width: 100%;
}
.secCcontainer {
  // padding: 8px;
  // // margin: 10px;
  // // float: right;
  // // -webkit-box-flex: 1;
  // // flex-grow: 1;
  // max-width: 100%;
  // max-height: 20rem;
  // overflow: hidden;
  // cursor: pointer;

  margin-right: 11px;
  margin-left: 11px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.secCcontainer:hover {
  // border: #dedede solid 1px;
}
.subSectionsContainer {
  width: 100%;
  border-color: #d2d2d2;
  border-width: 2px;
  background-color: #ffffff;
  border-style: solid;
  margin-top: 3px;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}
.card:hover {
  // background-color: #bcb17f;
  // background-color: var(--custom-color1);
}
.no-limit {
  max-height: auto !important;
}
.card-bottom-big-space {
  padding-bottom: 12px !important;
}
.card {
  direction: rtl;
  background-color: var(--main-bg-color);
  padding-top: 2.5px;
  padding-bottom: 2.5px;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 30px;
  cursor: pointer;
  border-width: 1px;
  border-color: transparent;
  border-bottom-color: #dedede;
  border-style: solid;
  border-top-width: 0px;
}
</style>
