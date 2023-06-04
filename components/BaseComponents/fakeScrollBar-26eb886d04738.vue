<template>
  <div
    id="list-book-inner"
    class="list-book-inner"
    @scroll="scrollCheck"
    @wheel="wheeling"
  >
    <!-- <div class="testtitle">start:{{startList}} | end:{{endList}} | length:{{lengthArray}}</div> -->
    <!-- <spinnerCircle v-show="showSpinner" /> -->
    <div
      id="invisible-top"
      class="test"
      v-bind:style="{ height: calcHeightRectTop }"
    >
      <!-- <spinnerCircle /> -->
    </div>

    <slot :startAt="startList" :endAt="endList"></slot>

    <div
      id="invisible-bottom"
      class="test"
      v-bind:style="{ height: calcHeightRectBottom }"
    ></div>
  </div>
</template>

<script>
// let lastY = 0;
// let timeout = null;
export default {
  props: [
    "maxViewList",
    "startAt",
    "heightItem",
    "lengthArray",
    "refreshList",
    "newList",
    "scrollToTop",
  ],
  data() {
    let endList = this.maxViewList + this.startAt;
    let startList = this.startAt;
    //let maxAddToList = this.maxViewList / 2;
    let maxAddToList = 20;
    return {
      lastY: 0,
      timeout: null,
      showSpinner: false,
      maxAddToList,
      endList,
      startList,
      intersectionOptions: {
        root: null,
        rootMargin: "0px 0px 0px 0px",
        thresholds: [0],
      },
    };
  },
  computed: {
    // maxAddToList() {
    //   return this.maxViewList / 2;
    // },
    heightAllList() {
      //  if (this.lengthResultsArray != undefined)

      return this.lengthArray * this.heightItem;
      //  else return this.lengthResultsArray;
    },
    /*  heightAllList() {
      if (this.lengthArray > 0) return this.lengthArray * this.heightItem;
      return 0;
    }, */
    calcHeightRectTop() {
      if (this.lengthArray == 0) return "0";
      if (this.startList > 0) return this.startList * this.heightItem + "px";
      return "0";
    },
    calcHeightRectBottom() {
      if (this.lengthArray == 0) return "0";
      if (this.lengthArray <= this.maxViewList) return "0";
      let x = this.endList * this.heightItem;
      let heightRec = this.heightAllList - x;
      return heightRec + "px";
      // return "0";
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
    setScrollToTop() {
      this.$el.scrollTop = 0;
      this.startList = 0;
      this.endList = this.maxViewList;
    },
    scrollCheck(e, scroll = false) {
      clearTimeout(this.timeout);
      if (scroll) {
        this.$el.scrollTop = parseInt(this.startList) * this.heightItem;
        return;
      }
      let dir = "UP";
      if (this.$el.scrollTop >= this.lastY) dir = "DOWN";
      let topMargin = dir == "DOWN" ? 0 : this.maxAddToList;
      let bottomMargin = dir == "DOWN" ? this.maxAddToList : 0;
      this.lastY = this.$el.scrollTop;
      let elem = this.$el;
      let w = elem.width;

      let x = elem.scrollTop;

      x = x > 0 ? Math.round(x / this.heightItem) : 0;

      if (x > this.startList + topMargin && x < this.endList - bottomMargin)
        return;

      if (x < this.startList || x > this.endList) this.showSpinner = true;
      let _vm = this;
      this.timeout = setTimeout(() => {
        if (x < _vm.startList + topMargin || x > _vm.endList - bottomMargin) {
          // x = Math.round(x);

          let start, end;
          if (dir == "DOWN") {
            start = x - _vm.maxAddToList;
            end = start + _vm.maxViewList;
          } else {
            end = x + _vm.maxAddToList;
            start = end - _vm.maxViewList;
          }
          if (start < 0) {
            start = 0;
            end = _vm.maxViewList;
          } else if (end > _vm.lengthArray) {
            end = _vm.lengthArray;
            start = _vm.lengthArray - _vm.maxViewList;
            start = start < 0 ? 0 : start;
          }
          _vm.startList = start;
          _vm.endList = end;
        }

        _vm.showSpinner = false;
      }, 20);
    },
    resetValuesLoop() {},
  },
  watch: {
    scrollToTop: function() {
      this.setScrollToTop();
    },
    newList: {
      handler: function(val, old) {
        let _vm = this;
        this.$nextTick(() => {
          this.setScrollToTop();
        });
      },
      immediate: true,
    },
    startAt: function(val, old) {
      this.lastY = 0;
      if (val < 0) return;
      this.$nextTick(() => {
        this.startList = this.startAt;
        // if (this.startList == 0)
        this.endList = this.startList + this.maxViewList;
        //  else this.endList = 0;
        this.scrollCheck(null, true);
      });
    },
    lengthArray: function(val) {},
  },
  mounted() {
    this.lastY = this.$el.scrollTop;
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
  },
};
</script>

<style lang="scss" scoped>
#list-book-inner {
  overflow: auto;
  height: 100%;
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
</style>
