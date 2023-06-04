<template>
  <div
    @mouseenter="bookIn"
    class="scroller wide-scroll"
    :class="{ scrollerhide: $_mobile }"
    @scroll="renderPages"
    ref="scroller"
    v-dragscroll="enableDragging"
    @wheel="wheeling"
    :id="'the-book' + tabId"
    tabindex="0"
  >
    <div
      class="container pages-container"
      :style="{ height: containerHeight, width: '100%' }"
      ref="container"
    >
      <div
        v-if="$store.state.tabs[this.tabId].showEmptyPage"
        ref="emptyPage"
        :style="emptyPageStyle"
      >
        <div class="txt">
          דף ריק
        </div>
      </div>
      <pageItem
        @toggleUpDown="toggleUpDown"
        @addexten="$emit('addexten')"
        :raw="raw"
        @setscrolling="setScrolling"
        :pageData="getItem(i)"
        :tabId="tabId"
        class="page"
        :style="{ top: getItemTop(i) + 'px' }"
        v-for="i in getNumItems"
        :key="i"
        @toggleocr="toggleOCR"
        :mm="mm"
        :scrolling="scrolling"
        :drawFs="drawFs"
        :currPage="currentPage"
        @scrollToResult="scrollToResult"
        @login="$emit('login')"
        :rotateImage="rotateImage"
        :pagepos="getItem(i).position"
      />
    </div>
  </div>
</template>
<script>
let recentPageTimer = null;
import { mapState, mapGetters, mapActions } from "vuex";
import pageItem from "@/components/book/pageItem.vue";

export default {
  components: {
    pageItem,
  },
  props: [
    "raw",
    "mm",
    "items",
    "tabId",
    "scrollToPosition",
    "scrollToItem",
    "offset",
    "refresh",
    "drawFs",
    "isscrolling",

    "rotateImage",
  ],
  data() {
    return {
      currentItem: 0,
      firstTop: 0,
      numItems: 0,
      scrollTo: 0,
      page: 0,
      firstItem: 0,
      currentPages: [],
      maxPageIndex: 0,
      minPageIndex: 0,
      timer: null,
      manualClick: false,
      rat: 1.5,
      itemHeight: 0,
      refreshing: false,
      renderAgain: false,
      scrolling: false,
      dontLoad: false,
      scrollOffset: 0,
      currentPage: 0,
      scrollToBottom: true,
      scrollDown: true,
      lastScroll: 0,
      currScrollPercent: 0,
      dontRender: false,
    };
  },
  computed: {
    ...mapGetters("bookPersonalExtensions", ["crtExtentionsMode"]),
    ...mapState("bookPopups", ["OCREnabled"]),
    ...mapState("tabsManager", ["currentTabId", "scrollToFsResult"]),
    ...mapState("bookPersonalExtensions", ["dragging"]),
    emptyPageStyle() {
      let i = this.currentPages.findIndex((p) => p == this.currentPage);
      if (!i) i = 0;
      return (
        "position:absolute;top:" +
        this.getItemTop(i + 1) +
        "px;left:0px;width:100%;height:100%;background-color:white;z-index:99999"
      );
    },
    getPageHeight() {
      let pageHeight = this.$store.state.tabs[this.tabId].pageHeight;
      return pageHeight;
    },
    enableDragging() {
      return (
        !this.OCREnabled &&
        !this.crtExtentionsMode &&
        !this.$_mobile &&
        !this.dragging
      );
    },
    containerHeight() {
      return this.items.length * this.itemHeight + "px";
    },
    getNumItems() {
      if (this.currentPages.length == 0) return 0;
      else return this.numItems;
    },

    zoom() {
      return this.$store.state.tabs[this.tabId].zoom;
    },
    getBookFit() {
      return this.$store.getters[`tabs/${this.tabId}/getBookFit`];
    },
    currPage() {
      return this.$store.state.tabs[this.tabId]?.page;
    },
    userClick() {
      return this.$store.state.tabsManager.userClick;
    },
  },
  methods: {
    ...mapActions("books", ["setVisitedPage"]),
    ...mapActions("tabsManager", ["setResizeToggle"]),
    ...mapActions("userRecentBooks", ["addRecentBook"]),
    bookIn() {
      return; //making problems with the scroll of the  page
      this.$el.focus();
    },

    toggleUpDown(scrollToBottom) {
      //let scrollerHeight = this.$refs.scroller.scrollHeight;
      let pageHeight = this.getPageHeight;
      let scrollTop = this.$refs.scroller.scrollTop;
      let containerHeight = this.$refs.scroller.clientHeight;
      let mod = scrollTop % pageHeight;
      if (scrollToBottom) {
        this.$refs.scroller.scrollTop += pageHeight - mod - containerHeight;
      } else {
        this.$refs.scroller.scrollTop -= mod;
      }
    },
    scrollToResult(value) {
      if (this.$refs.scroller) this.$refs.scroller.scrollTop += value;
    },
    setScrolling(value) {
      this.scrolling = value;
    },
    wheeling(event) {
      if (this.getBookFit == "height") {
        let numPages = event.wheelDeltaY / event.wheelDelta;
        if (event.wheelDelta > 0) numPages *= -1;
        this.$emit("inc-page", numPages);
        event.stopPropagation();
        //   $('#test').on('mousewheel DOMMouseScroll wheel', function(e) {
        event.preventDefault();
        //e.stopPropagation();

        // return false;
        //});
        return false;
      }
    },
    toggleOCR(show) {
      this.$emit("toggleocr", show);
    },
    initPages() {
      if (!this.$refs.scroller) return;
      let currItems = this.numItems;
      let containerHeight = this.$refs.scroller.clientHeight;

      this.numItems = Math.floor(containerHeight / this.itemHeight) + 1;
      if (this.numItems < 3 || !isFinite(this.numItems))
        this.items.length >= 3
          ? (this.numItems = 3)
          : (this.numItems = this.items.length);
      if (currItems < this.numItems) {
        this.refreshing = true;
      }
      //this.currentPages = [];
    },
    getItem(i) {
      try {
        if (this.currentPages.length == 0) return this.items[0];

        let item = this.currentPages[i - 1];
        return this.items[item];
      } catch (ex) {
        console.error(ex.message, ex);
      }
    },
    getItemTop(i) {
      try {
        if (this.currentPages.length == 0) return 0;
        let item = this.currentPages[i - 1];

        return item * this.itemHeight;
      } catch (ex) {
        console.error(ex.message, ex);
      }
    },
    renderPages() {
      this.$store.state.tabs[this.tabId].showEmptyPage = false;

      if (this.dontRender) return;

      //save last scroll to detect scroll direction
      if (!this.$refs.scroller) return;
      let currScroll = this.$refs.scroller.scrollTop;

      this.scrollDown = currScroll > this.lastScroll;
      let bookScroller = document.getElementById("the-book" + this.tabId);
      if (bookScroller) {
        this.currScrollPercent =
          bookScroller.scrollTop / bookScroller.scrollHeight;
      }
      this.lastScroll = currScroll;

      if (this.dontLoad) {
        if (this.userClick) this.$store.state.tabsManager.userClick = false;
        this.dontLoad = false;
        return;
      }
      let interval = this.$_mobile ? 100 : 15;
      interval = globalThis.SERVER_MODE == "offline" ? 15 : 100;
      if (this.userClick) {
        this.scrolling = false;
        this.scrollEnd(true);
        this.$store.state.tabsManager.userClick = false;
      } else {
        this.scrolling = true;
        clearTimeout(this.timer);
        this.timer = setTimeout(this.scrollEnd, interval);
      }
    },
    scrollEnd(manual = false) {
      //console.log("scrollend", this.$refs.scroller.scrollTop);
      if (!this.$refs.scroller) return;

      this.getPagesAtPos(this.$refs.scroller.scrollTop, manual);
    },

    getPagesAtPos(pos, fromScroll = false) {
      /*  if (this.scrollDown)
        pos += this.$refs.scroller.clientHeight - this.itemHeight / 2;
      else pos += this.itemHeight / 2; */

      let page = pos / this.itemHeight;

      if (isNaN(page)) {
        this.renderAgain = true;
        return;
      }
      if (!fromScroll) {
        if (Math.round(page) - page < 0.1) page = Math.round(page);
        else page = Math.floor(page);
      } else page = Math.round(page);

      this.$store.state.tabs[this.tabId].page = page + 1;
      this.setCurrentPages(page);

      //set timer to add recent page
      let book = this.$store.state.tabs[this.tabId].book;
      var self = this;
      clearTimeout(recentPageTimer);
      recentPageTimer = setTimeout(function() {
        self.addRecentBook({ bookId: book, pageId: page + 1 });
        self.setVisitedPage({ book, page: page + 1 });
      }, 2000);
    },
    getPagesByPage(page, fromScroll = true) {
      if (page < 0) return;
      if (this.numItems == 0) return;
      try {
        if (page == 0) page = 1;
        if (page > this.items.length) page = this.items.length;
        // this.manualClick = true;
        this.dontLoad = true;
        let scrollTo = (page - 1) * this.itemHeight;

        //check if page exists
        let found = this.currentPages.findIndex(
          (element) => element == page - 1
        );
        if (found >= 0)
          this.scrollOffset = this.$children[found].topFs
            ? this.$children[found].topFs
            : 0;

        if (
          found >= 0 &&
          this.$store.state.tabsManager.scrollToFsResult === true
        ) {
          scrollTo += this.scrollOffset;
          this.$store.state.tabsManager.scrollToFsResult = false;
        }

        this.$refs.scroller.scrollTop = scrollTo;

        let interval = this.userClick ? 0 : 100;
        this.$store.state.tabsManager.userClick = false;
        if (this.renderTimer) clearTimeout(this.renderTimer);
        this.renderTimer = setTimeout(() => {
          this.$store.state.tabsManager.showSpinner = false;
          this.setCurrentPages(page - 1);
        }, interval);

        //   if (found >= 0) this.$store.state.tabsManager.scrollToFsResult = false;
        this.$store.state.tabs[this.tabId].page = page;
        this.scrolling = false;
      } catch (ex) {
        console.error(ex);
      }
      //set timer to add recent page
      let book = this.$store.state.tabs[this.tabId].book;
      var self = this;
      clearTimeout(recentPageTimer);
      recentPageTimer = setTimeout(function() {
        if (!fromScroll) return;
        self.addRecentBook({ bookId: book, pageId: page });
        self.setVisitedPage({ book, page: page });
      }, 2000);
    },
    setCurrentPages(page) {
      this.scrollOffset = 0;
      try {
        this.currentPage = page < 1 ? 0 : page;
        if (page < 1) page = 1;

        if (this.items.length - page < this.numItems)
          page = this.items.length - this.numItems + 1;
        if (page < 1) page = 1;

        const isPageExist = (element) => element == page;
        let found = this.currentPages.findIndex(isPageExist);
        let tempArr = [];
        // found = -1;
        if (
          found == -1 ||
          this.refreshing ||
          this.items.length <= this.numItems
        ) {
          for (let i = page - 1; i < this.numItems + page - 1; i++)
            if (i < this.items.length) tempArr.push(i);
          this.currentPages = tempArr;
          this.refreshing = false;
        } else {
          this.scrollOffset = this.$children[found].topFs
            ? this.$children[found].topFs
            : 0;

          let maxPage = Math.max(...this.currentPages);
          let minPage = Math.min(...this.currentPages);
          if (page == maxPage) {
            let minIndex = this.currentPages.indexOf(minPage);
            this.currentPages.splice(minIndex, 1, page + 1);
          } else if (page == minPage) {
            let maxIndex = this.currentPages.indexOf(maxPage);
            this.currentPages.splice(maxIndex, 1, page - 1);
          }
          return found;
        }
      } catch (ex) {
        console.error(ex.message, ex);
      }
    },
    calcPageHeight() {
      if (!this.$refs.container) return;

      let currentPage = this.$store.state.tabs[this.tabId].page;
      if (currentPage === "") return;
      this.$store.state.tabs[this.tabId].tempPage = currentPage;
      let h;
      if (this.getBookFit == "width")
        h = this.$refs.container.clientWidth * this.rat;
      else h = this.$refs.scroller.clientHeight;

      this.$store.dispatch(`tabs/${this.tabId}/setPageHeight`, h, {
        root: true,
      });
      this.itemHeight = h;
    },
  },
  updated() {
    if (this.renderAgain && this.$el.offsetParent != null) {
      let vm = this;
      vm.calcPageHeight();
      this.$nextTick(() => {
        vm.initPages();

        vm.getPagesByPage(vm.scrollToItem);
        vm.renderAgain = false;
      });
    }
  },
  watch: {
    isscrolling: function(val) {
      this.scrolling = val;
    },
    getBookFit: function(val) {
      this.$refs.container.style.width = val == "height" ? "98%" : "100%";
    },
    currPage: function(val) {
      let bookScroller = document.getElementById("the-book" + this.tabId);
      if (bookScroller) {
        this.currScrollPercent =
          ((val - 1) * this.getPageHeight) / bookScroller.scrollHeight;
      }
    },
    rotateImage: function() {
      this.$store.dispatch(
        `tabs/${this.tabId}/setRotatePage`,
        this.currentPage
      );
    },
    currentTabId: function(val, oldVal) {
      if (!this.$refs.container) return;
      if (val == this.tabId) {
        let originPage = this.$store.state.tabs[this.tabId].page;
        if (this.$refs.container.clientHeight == 0) {
          this.calcPageHeight();
          let _t = this;

          this.$nextTick(function() {
            _t.initPages();

            _t.getPagesByPage(originPage);
          });
        } else {
          if (this.$refs.scroller.scrollTop == 0 && originPage > 1) {
            let _t = this;

            this.$nextTick(function() {
              _t.getPagesByPage(originPage);
            });
          }
        }
      }
    },
    zoom: function(val, oldVal) {
      this.$refs.container.style.width = val + "%";
    },
    scrollToPosition: {
      handler(val, oldVal) {
        if (this.$refs.scroller) this.$refs.scroller.scrollTop = val;
      },
    },
    scrollToItem: {
      handler(val, oldVal) {
        //this.$store.state.tabsManager.scrollToFsResult = true;
        this.getPagesByPage(val);
      },
    },
    moveToOffset(val) {
      this.$refs.scroller.scrollTop += val;
    },
    refresh: {
      handler(val, oldVal) {
        if (!this.$refs.container) return;

        let originPage = this.$store.state.tabs[this.tabId].page;
        this.dontRender = true;
        this.calcPageHeight();
        let _t = this;

        this.$nextTick(function() {
          _t.initPages();
          _t.dontRender = false;
          _t.$nextTick(() => {
            if (_t.currScrollPercent != 0) {
              _t.$el.scrollTop = _t.$el.scrollHeight * _t.currScrollPercent;
            } else _t.getPagesByPage(originPage);
          });
        });
      },
    },

    offset: {
      handler(val, oldVal) {
        this.getPagesByPage(this.scrollToItem);
        //this.getPagesByPage(this.scrollToItem);
      },
    },
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  mounted() {
    this.scrolling = this.isscrolling;
    this.$refs.container.style.width =
      this.getBookFit == "height" ? "98%" : "100%";
    //this.$store.state.tabsManager.scrollToFsResult = true;
    let _t = this;

    this.calcPageHeight();
    this.$nextTick(function() {
      _t.initPages();

      _t.getPagesByPage(_t.scrollToItem, false);
    });
  },
};
</script>
<style lang="scss" scoped>
.scroller {
  position: relative;
  height: 100%;
  direction: ltr;
  overflow: auto;
}
.container {
  position: relative;
}
.pages-container {
  margin: auto;
  position: relative;
}
.page {
  position: absolute;
  width: 100%;
  left: 0px;
  overflow: hidden;
}
.grab-bing {
  cursor: -webkit-grab;
  cursor: -moz-grab;
  cursor: -o-grab;
  cursor: grab;
}
.scrollerhide::-webkit-scrollbar {
  width: 0px;
}
.grab-bing:active {
  cursor: -webkit-grabbing;
  cursor: -moz-grabbing;
  cursor: -o-grabbing;
  cursor: grabbing;
}
.txt {
  width: 200px;
  height: 100px;
  transform: rotate(45deg);
  top: 300px;
  position: absolute;
  font-size: 50px;
  /* Safari */
  -webkit-transform: rotate(-90deg);

  /* Firefox */
  -moz-transform: rotate(-90deg);

  /* IE */
  -ms-transform: rotate(-90deg);

  /* Opera */
  -o-transform: rotate(-90deg);
}
</style>
