<template>
  <div @mouseenter="showme = true" @mouseleave="showme = false">
    <div
      class="main"
      :class="{ active: showme && color }"
      :style="{ color: fgcolor }"
    >
      <slot />
    </div>
    <transition name="fade">
      <div
        class="hover"
        v-show="showme"
        :style="{
          height: h + 'px',
          width: w + 'px',
          top: t + 'px',
          left: l + 'px',

          'background-color': bgcolor,
        }"
      ></div>
      <!-- v-show="showme" -->
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showme: false,
    };
  },
  props: {
    h: {
      default: 50,
    },
    w: {
      default: 50,
    },
    t: {
      default: 50,
    },
    l: {
      default: 50,
    },
    color: {
      default: true,
    },
    fgcolor: { default: "" },
    bgcolor: {
      type: String,
      default: "#dedede",
    },
  },
};
</script>

<style lang="scss" scoped>
.main {
  z-index: 1;
  cursor: pointer;
}
.active {
  color: black;
  // color: yellow;
}
div {
  height: inherit;
  width: inherit;
  font-family: inherit;
  color: inherit;
  background-color: inherit;
  position: relative;
}

.hover {
  color: inherit;
  // background-color: #;
  // background-color: red;
  border-radius: 50%;
  height: 50px;
  position: absolute;
  width: 50px;
  top: 9px;
  left: -15px;
  box-sizing: border-box;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
