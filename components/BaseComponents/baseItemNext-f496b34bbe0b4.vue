<template>
  <div class="dropdwon next ">
    <div class="btn-dropdown 3">
      <slot name="title"></slot>
      <slot name="next"></slot>
      <div class="arrow-next otz-icon no-bg">M</div>
    </div>
    <div class="list-dropdown">
      <slot name="list"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    disable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      open: false,
    };
  },
  methods: {
    toggle() {
      if (this.disable) return;
      this.open = !this.open;
    },
    toggleOut() {
      this.open = false;
    },
  },
};
</script>

<style lang="scss" scoped>
$bg-color1: #fff;
$bg-hover2: #00000020;
.next {
  &:hover {
    .list-dropdown {
      display: block;
      animation: showToLeft ease 0.3s;
    }
  }
  .list-dropdown {
    display: none;
  }
}
.theme-color .otz-icon.arrow-next,
.arrow-next {
  position: absolute;
  left: 0;
  top: 0;
  transform: rotate(90deg);
  color: #b2b2b2 !important;
  height: 100%;
}
.btn-dropdown {
  transition: 0.3s;
  &.active .otz-icon {
    transition: 0.3s;
    background-color: $bg-hover2;
  }
}
.list-dropdown {
  position: absolute;
  right: 100%;
  top: 0;
  z-index: 2;
  overflow: auto;
  text-align: right;
  background-color: $bg-color1;
  box-shadow: 0 2px 3px 1px #0000005c;

  transition: 0.3s;
}
.left .list-dropdown {
  left: 0;
}
</style>
