<template>
  <div
    id="list-book-inner"
    class="list-book-inner"
    @scroll="scrollCheck"
    ref="containerScroller"
    @wheel="wheeling"
  >
    <div id="list-inner" class="inner-scroller" ref="innerScroller">
      <spinnerCircle v-show="showSpinner" />
      <div class="items-container" :style="listStyle">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
let lastY = 0;
let timeout = null;
let marginSize = 0;
export default {
  props: [
    "startBook",
    "startResult",
    "endBook",
    "endResult",
    "startRender",
    "endRender",
    "listLength",
    "numBooks",
    "listTop",
    "newList",
    "scrollTo",
  ],
  data() {
    return {
      lastScrollTop: 0,
      showSpinner: false,
    };
  },
  computed: {
    listStyle() {
      return `position:absolute;top:${this.listTop}px;left:0px;width:100%`;
    },
  },
  methods: {
    wheeling(event) {
      if (this.userSettings.settings.mouse_wheel === "scroll") return;
      let delta = event.wheelDeltaY / event.wheelDelta;
      let dir = "down";
      if (event.wheelDelta > 0) dir = "up";
      this.$emit("wheelScroll", { dir, delta });
      event.stopPropagation();
      event.preventDefault();
      return false;
    },
    scrollCheck(e, scroll = false) {
      let elem = this.$el;
      let scrollTop = elem.scrollTop;
      let dir = "UP";
      if (scrollTop > lastY) dir = "DOWN";
      if (scroll) {
        this.$el.scrollTop = this.startList;
        return;
      }
      if (lastY != scrollTop) {
        clearTimeout(timeout);
        lastY = scrollTop;
      }

      if (
        dir == "DOWN" &&
        scrollTop >= this.startRender &&
        scrollTop <=
          this.endRender -
            this.$refs.containerScroller.clientHeight -
            marginSize /* ||
          this.endBook == this.numBooks */
      ) {
        return;
      }

      if (
        dir == "UP" &&
        scrollTop >= this.startRender + marginSize &&
        scrollTop <= this.endRender /* ||
          this.startBook == 0 */
      ) {
        return;
      }

      this.showSpinner = true;
      let _vm = this;
      timeout = setTimeout(() => {
        _vm.$emit("calcScroll", scrollTop);
        _vm.showSpinner = false;
      }, 20);
      // }
    },
  },
  watch: {
    scrollTo: function(val, old) {
      this.$nextTick(() => {
        this.$refs.containerScroller.scrollTop = val;
      });
    },
    newList: function(val, old) {
      this.showSpinner = false;
      let _vm = this;

      if (!this.$store.state.freeSearchBookList.dontScroll) this.startList = 0;
      else this.$store.state.freeSearchBookList.dontScroll = false;

      this.$nextTick(() => {
        this.scrollCheck(null, true);
      });
    },
    listLength: function(val) {
      let elem = this.$refs.innerScroller;
      elem.style.height = val + "px";
      this.showSpinner = false;
    },
  },
  mounted() {
    // setTimeout(() => {
    let elem = document.getElementById("list-inner");
    elem.style.height = this.listLength + "px";
    lastY = this.$el.scrollTop;
    //}, 0);
  },
};
</script>

<style lang="scss" scoped>
.list-book-inner {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  position: relative;
}
.testtitle {
  position: absolute;
  background-color: red;
  top: 0;
  // left: 0;
}
.test {
  overflow: hidden;
}
.inner-scroller {
  position: relative;
}
</style>
