<template>
  <div v-on="$listeners" class="icon-outer cus-icon">
    <svg class="icon" :width="width" :height="height" :viewBox="viewBox">
      <use v-bind="{ href: '#' + pathIcon + '_' + nameIcon }" />
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    nameIcon: {
      type: String,
      default: "normal-symbol",
    },
    viewBox: {
      type: [String],
    },
    width: {
      type: [Number, String],
      default: 66,
    },
    height: {
      type: [Number, String],
      default: 54,
    },
    pathIcon: {
      type: String,
      default: "icons",
    },
  },
  methods: {
    click() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped></style>
