<template>
  <div class="dropdwon" v-click-outside="onOutside" @close="closeMe">
    <div class="btn-dropdown" :class="{ active: open }" @click="toggle">
      <slot name="title"></slot>
      <slot name="button"></slot>
    </div>
    <div
      :class="dynamicClass"
      class="list-dropdown"
      v-zindex.fixed
      v-if="open"
      @click="closeMe"
      @close="closeMe"
    >
      <slot name="list" :clicked="handleClick"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    closeOnOutside: {
      type: Boolean,
      default: true,
    },
    disable: {
      type: Boolean,
      default: false,
    },
    selfClose: {
      type: Boolean,
      default: true,
    },
    close: {
      type: Boolean,
      default: true,
    },
    dynamicClass: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      open: false,
    };
  },
  watch: {
    close: function(val, oldVal) {
      this.toggleOut();
    },
    open: function(val, oldVal) {
      if (oldVal && !val) this.$emit("closed");
    },
  },
  methods: {
    handleClick() {
      this.toggleOut();
    },
    toggle() {
      if (this.disable) return;
      this.open = !this.open;
    },
    toggleOut() {
      this.open = false;
    },
    closeMe() {
      if (this.selfClose) {
        this.toggleOut();
      }
    },
    onOutside() {
      if (this.closeOnOutside) this.toggleOut();
    },
  },
};
</script>

<style lang="scss" scoped>
$bg-color1: #fff;
$bg-hover2: #00000020;
.btn-dropdown {
  transition: 0.3s;
  &.active .otz-icon {
    transition: 0.3s;
    background-color: $bg-hover2;
  }
}
.list-dropdown {
  position: absolute;
  z-index: 3;
  // overflow: auto;
  text-align: right;
  background-color: $bg-color1;
  box-shadow: 0 2px 3px 1px #0000005c;

  animation: dropdown 0.1s;
  transition: 0.3s;
}
.left .list-dropdown {
  left: 0;
}
.dropdwon {
  position: relative;
}
.settings .list-content {
  max-height: 200px;
}
.limit-height {
  max-height: 300px;
  overflow: auto;
}
</style>
