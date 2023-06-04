<template functional>
  <div
    v-bind="data.attrs"
    :style="data.staticStyle"
    :class="data.staticClass || ''"
    class="btn no-select"
    v-on="listeners"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  name: "BaseButton",
};
</script>

<style lang="scss" scoped></style>
