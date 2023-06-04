<template>
  <div class="item" @click="clickItem($event)">
    <slot></slot>
  </div>
</template>

<script>
export default {
  methods: {
    clickItem($event) {
      this.$emit("click", $event.target);
    },
  },
};
</script>

<style lang="scss" scoped>
$bg-hover3: #f4f4f4;

.item {
  white-space: nowrap;
  padding: 0 8px;
  text-align: right;
  height: 28px;
  line-height: 28px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;

  &.item-pin {
    color: var(--custom-color1);
  }
  .mef-icon {
    color: var(--custom-color1);
    opacity: 1;
    align-items: center;
    display: flex;
    justify-content: center;
    &.pin {
      opacity: 1;
    }
  }
  .mef-icon {
    // opacity: 0;
    &.pin {
      opacity: 1;
      align-items: center;
      display: flex;
      justify-content: center;
    }
  }
  &:hover {
    background-color: $bg-hover3;
    .mef-icon {
      opacity: 1;
    }
  }
}
.a {
  background-color: #000 !important;
}
</style>
