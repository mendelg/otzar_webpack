<template>
  <div class="outer-popup" :class="grid">
    <div class style="width:100vw; height:100vh; overflow:hidden">
      <vue-draggable-resizable
        :parent="true"
        :resizable="false"
        drag-handle=".drag"
        :h="h"
        :w="w"
        :x="x"
        :y="y"
        class-name="drag-popup container-popup"
      >
        <div id="inner-popup" class="inner-popup">
          <header class="title-popup drag font">
            <span class="title">hey</span>
            <baseIcon class="close-popup" nameIcon="x-popup" @click="close()" />
            <div class="otz-icon" @click="close()">F</div>
          </header>
          <main>{{ this.$t("desktop.desktop") }}</main>
        </div>
      </vue-draggable-resizable>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["header", "grid"],
  mounted() {
    let elem = this.$el.querySelector("#inner-popup");
    if (!elem) return;
    this.h = elem.width;
    this.w = elem.height;
  },
  data() {
    return {
      h: 591,
      w: 1000,
      showPopup: this.viewPopup,
    };
  },
  computed: {
    x() {
      let wWindow = window.winSizes.innerWidth;
      let left = wWindow / 2 - 500;
      return left;
    },
    y() {
      let hWindow = window.winSizes.innerHeight;
      let top = hWindow / 2 - 296;
      return top;
    },
  },
  methods: {
    close() {
      this.$router.push({ name: "home" });
    },
    onDragged({
      el,
      deltaX,
      deltaY,
      offsetX,
      offsetY,
      clientX,
      clientY,
      first,
      last,
    }) {
      if (first) {
        this.dragged = true;
        return;
      }
      if (last) {
        this.dragged = false;
        return;
      }
      var l = +window.getComputedStyle(el)["left"].slice(0, -2) || 0;
      var t = +window.getComputedStyle(el)["top"].slice(0, -2) || 0;
      el.style.left = l + deltaX + "px";
      el.style.top = t + deltaY + "px";
    },
  },
};
</script>

<style lang="scss" scoped>
.container-popup {
  position: absolute;
  // height: 100%;
  // width: 100%;
  top: 0;
  left: 0;
  top: 0;
  left: 0;
  // background-color: rgba(0, 0, 0, 0.4);
  z-index: 7 !important;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.16);
}
</style>
