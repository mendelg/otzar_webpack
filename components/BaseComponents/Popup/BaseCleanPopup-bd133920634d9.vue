<template>
  <div
    @contextmenu="disableContextMenu"
    tabindex="0"
    @keydown="keydown"
    :class="{
      'modal-mask': mask,
      'container-overlay': !noneOverlay,
      'none-overlay': noneOverlay,
    }"
  >
    <!-- not working with full screen -->
    <div
      @keydown.esc="close"
      class="overlay fade-animate"
      v-if="!noneOverlay"
      tabindex="1"
      v-focus
      @click.stop="$emit('c-outside')"
    ></div>
    <div
      ref="popup"
      v-cdrag.parent
      class="pop-win "
      v-zindex.fixed
      tabindex="0"
      :class="{
        show: show && !isItemMinimize,
        nominimize: mini,
        minimize: isItemMinimize,
        mini: mini,
        //animate: animate,
        //'animate-scale-center': hasCenter,
      }"
      @keydown.esc="close"
      @mouseenter="() => (showMiniBar = true)"
      @click="setTopItem()"
      v-click-outside="() => (showMiniBar = false)"
    >
      <!-- :style="{ width: miniw + 'px', height: minih + 'px' }" -->
      <BaseResizeable
        ref="resizeElem"
        :w="$_mobile ? wMobile : windowWidth"
        :h="$_mobile ? hMobile : windowHeight"
        :parentcontrol="true"
        :active="showMiniBar"
        @resize="$emit('resize')"
      >
        <div class="outer-popup rtl-cls" v-on="$listeners">
          <div id="inner-popup" class="inner-popup inner-popup-overide">
            <header
              @dblclick="toggleMaximize"
              class="title-popup title-override drag font"
              :class="{ 'header-color': headerColor }"
              :style="{ height: h + 'px' }"
            >
              <span v-cdrag="{ rm: 150, bm: 100 }" class="title title-override">
                <slot name="header">{{ title }}</slot>
              </span>
              <div class="flex h-100 icons-header">
                <div
                  v-if="pin"
                  class="close-popup-internal otz-icon text-xl"
                  @click="pinToTab"
                  :style="{ width: h + 'px' }"
                  v-tooltip="{ content: $t('tabs.toTab') }"
                  :class="{ 'dark-icon': headerColor }"
                >
                  p
                </div>
                <div
                  v-if="mini"
                  class="close-popup-internal otz-icon"
                  @click="setItemMinimize(true)"
                  :style="{ width: h + 'px' }"
                  :class="{ 'dark-icon': headerColor }"
                >
                  B
                </div>
                <div
                  v-if="maxi"
                  class="close-popup-internal otz-icon mef-icon"
                  @click="toggleMaximize"
                  :style="{ width: h + 'px' }"
                  :class="{ 'dark-icon': headerColor }"
                >
                  {{ maxiIcon }}
                </div>
                <div
                  v-if="closeBtn"
                  class="close-popup-internal otz-icon"
                  @click="close"
                  :style="{ width: h + 'px' }"
                  :class="{
                    'dark-icon': headerColor,
                    'red-icon': maximum && headerColor,
                  }"
                >
                  F
                </div>
              </div>
            </header>
            <main
              class="flex-column relative"
              :style="{ height: 'calc(100% - ' + h + 'px', overflow: overflow }"
            >
              <slot></slot>
            </main>
          </div>
        </div>
      </BaseResizeable>
    </div>
  </div>
</template>

<script>
let moment = require("moment");
let pastYear = moment().subtract(1, "years");
let plus = 10;
import taskbar from "@/mixing/taskbar";
import { mapState } from "vuex";
export default {
  mixins: [taskbar],
  props: {
    overflow: {
      type: String,
      default: "hidden",
    },
    center: {
      type: Boolean,
      default: true,
    },
    indent: { type: Boolean, default: false },
    show: { type: Boolean, default: true },
    showfn: { type: Function, default: () => {} },
    title: { type: String },

    resizable: {
      type: Boolean,
      default: true,
    },
    winh: {
      type: Number,
      default: 500,
    },
    winw: {
      type: Number,
      default: 500,
    },
    w: Number,
    h: Number,
    x: Number,
    y: Number,
    maxi: {
      type: Boolean,
      default: false,
    },
    closeBtn: {
      type: Boolean,
      default: true,
    },
    mask: {
      type: Boolean,
      default: false,
    },
    noneOverlay: false,
    toggleMaxi: true,
    headerColor: false,
    toggleId: { type: String, default: "" },
    reCenter: { type: Number, default: 1 },
  },

  data() {
    return {
      showMiniBar: false,
      first: true,
      showPopup: this.viewPopup,
      maximum: false,
      windowHeight: 0,
      windowWidth: 0,
      oldHeight: 0,
      oldWidth: 0,
      animate: false,
      hasCenter: false,
    };
  },
  computed: {
    ...mapState("taskbar", ["topItem"]),
    maxiIcon() {
      return this.maximum ? "T" : "S";
    },
    wMobile() {
      if (this.$_mobile) {
        let w = document.body.clientWidth;
        w = (w * 85) / 100;
        if (this.windowWidth < w) return this.windowWidth;
        return w;
      }
    },
    hMobile() {
      if (this.$_mobile) {
        let h = document.body.clientHeight;
        h = (h * 70) / 100;
        if (this.windowHeight < h) return this.windowHeight;
        return h;
      }
    },
  },

  watch: {
    reCenter: function(val) {
      this.moveCenter();
    },
    toggleMaxi: function(n, v) {
      if (this.tabId == this.toggleId) this.toggleMaximize();
    },
    show: function(nval, oval) {
      if (nval && this.center) {
        this.moveCenter();
        this.doSizeFirstTime();
      }
      if (nval) this.showfn();
    },
    isItemMinimize: function(val, oVal) {
      if (!val) {
        let secs = moment().diff(pastYear, "seconds");
        // add last zindex
        this.$refs.popup.style.zIndex = secs;
        this.setTopItem();
      }
      this.setItemMinimize(val);
    },
    topItem: function(val, oVal) {
      // ;
      if (val != this.__taskbar_id) return;
      let secs = moment().diff(pastYear, "seconds");
      // add last zindex
      this.$refs.popup.style.zIndex = secs;
      this.setTopItem();
    },
    winh: function(val, oVal) {
      let h = document.body.clientHeight;
      if (h <= this.winh) this.windowHeight = h - 30;
      else this.windowHeight = this.winh;
    },
  },
  created() {
    let h = document.body.clientHeight;
    if (h <= this.winh) this.windowHeight = h - 30;
    else this.windowHeight = this.winh;
    this.windowWidth = this.winw;
  },
  methods: {
    disableContextMenu(e) {
      try {
        let a = e.target.className.includes("selectable-text");
        let b = e.target instanceof HTMLInputElement;

        if (!a && !b) {
          e.preventDefault();
          return false;
        }
      } catch {
        e.preventDefault();
        return false;
      }
    },
    keydown(event) {
      switch (event.code) {
        case "F11":
          event.stopPropagation();
          event.preventDefault();
          event.cancelBubble = true;
          this.toggleMaximize();
          break;
      }
    },
    toggleMaximize() {
      if (!this.maxi) return;
      // this.$refs.popup.classList.add("animate");
      let vm = this;
      this.animate = true;
      this.$nextTick(() => {
        this.animate = false;
        vm.$emit("resize");
      });
      this.maximum = !this.maximum;
      if (this.maximum) {
        let screenHeight = document.body.clientHeight;
        /*   if (window._isElectron) {
          screenHeight -= 32;
        } */
        let screenWidth = document.body.clientWidth;
        /**@type {HTMLElement} */
        let elem = this.$refs.resizeElem.$el;

        this.oldHeight = elem.clientHeight;
        this.oldWidth = elem.clientWidth;

        // elem.style.height = screenHeight - 31 + "px";
        // elem.style.width = screenWidth + "px";
        this.windowHeight = screenHeight - 31;
        this.windowWidth = screenWidth;
        this.$refs.popup.style.top = "0px";
        this.$refs.popup.style.left = "0px";
      } else {
        this.windowHeight = this.oldHeight;
        this.windowWidth = this.oldWidth;
        this.moveCenter();
      }
    },
    close() {
      this.$emit("close");
    },

    moveCenter() {
      let vm = this;
      if (!vm.$refs.popup || !this.show) return;

      this.$nextTick(() => {
        let screenHeight = Math.max(
          window.winSizes.innerHeight,
          document.body.clientHeight
        ); //document.body.clientHeight;
        let screenWidth = document.body.clientWidth;

        let popHeight = vm.winh; //vm.$refs.popup.clientHeight;
        let popWidth = vm.winw; //vm.$refs.popup.clientWidth;
        let h = document.body.clientHeight;
        if (h <= this.winh) popHeight = h - 30;
        let top = screenHeight * 0.5 - popHeight / 2;
        let left = screenWidth * 0.5 - popWidth / 2;
        if (this.$_mobile) {
          popHeight = vm.hMobile; //vm.$refs.popup.clientHeight;
          popWidth = vm.wMobile; //vm.$refs.popup.clientWidth;
          top = screenHeight * 0.5 - popHeight / 2;
          left = screenWidth * 0.5 - popWidth / 2;
        }

        let indent = 0;
        if (this.indent) {
          plus = ~plus;
          indent = plus;
        }
        if (!vm.$refs.popup) return;
        vm.$refs.popup.style.top = indent + top + "px";
        vm.$refs.popup.style.left = indent + left + "px";
        this.hasCenter = true;

        if (vm.x != undefined) vm.$refs.popup.style.left = vm.x + "px";
        if (vm.y != undefined) vm.$refs.popup.style.top = vm.y + "px";
      });
    },
    doSizeFirstTime() {
      if (this.first && this.show && !this.isItemMinimize) {
        this.first = false;
      }
    },
  },

  mounted() {
    this.setTopItem();
    this.setItemContent(this.mini_title);
    this.doSizeFirstTime();
    if (this.center) {
      this.moveCenter();
    }
  },
};
</script>

<style lang="scss" scoped>
.container-overlay {
  // z-index: 1000000000 !important;
  position: absolute;
  width: 100%;
  top: 0 !important;
  left: 0 !important;
  height: 100%;
}
.pop-win {
  display: none;
  opacity: 0;
  transform: scale(0, 0);
  &.animate {
    // transition: transform 0.6s, left 0, opacity 0.3s;
  }

  &.mini {
    opacity: 0;
    transform: scale(0, 0);
    &:not(.show) {
      left: 70px !important;
      opacity: 0;
      display: block;
      top: 100vh !important;
      transform: scale(0, 0);
      transition: transform 0.6s, top 0.3s, opacity 0.3s;
    }
  }
  &.show {
    display: block;
    opacity: 1;
    transform: scale(1);
    // transition: opacity 9.3s, transform 9.3s;
    &.mini {
      // left: 70px;
      opacity: 1;
      display: block;
      // top: inherit !important;
      transform: scale(1);
    }
  }
}
.close-popup-internal {
  display: flex;
  font-size: 11px;
  width: 52px;
  height: 100%;
  justify-content: center;
  align-items: center;
  &.text-xl {
    font-size: 17px;
  }
}
.inner-popup-overide {
  height: 100%;
  width: 100%;
  line-height: normal;
  display: flex;
  flex-direction: column;
}
.icons-header.flex {
  flex-direction: row;
}
.title-override {
  line-height: normal;
  margin: 0px;
  display: flex;
  align-items: center;
  width: 100%;
  // flex-grow: 1;
  // padding: 0px;
}
.mef-icon {
  font-size: 60px !important;
  font-weight: 100;
}
.pop-win {
  position: fixed;
  direction: ltr;
  // transition: width 0.3s, height 0.3s;
}

main {
  flex-grow: 1;
}
.rtl-cls {
  direction: rtl;
}
.animate {
  // transition: 0.3s;
}
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0 !important;
  left: 0 !important;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  // transition: opacity 0.3s ease;
}
.overlay {
  width: 100vw;
  position: absolute;
  height: 100vh;
  background-color: #0000006b;
  z-index: 9;
  top: 0;
}
.none-overlay {
  .inner-popup {
    box-shadow: 2px 2px 13px 3px rgb(0 0 0 / 75%);
  }
}
.header-color {
  background-color: var(--custom-color1) !important;
}
.dark-icon {
  color: black;
}
.red-icon {
  color: white !important;
  background-color: red !important;
}
</style>
