<template>
  <div @click="clickIcon">
    <svg class="icon-type-folder">
      <use v-bind="{'href':'#icon-list-selected_' + nameIcon+'-icon'}" />
    </svg>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["nameIcon"],
  methods: {
    clickIcon() {
      this.$emit("click", this.nameIcon);
    }
  }
};
</script>

<style lang="scss" scoped>
.icon-type-folder {
  width: 36px !important;
  height: 26.4px;
  margin-right: 10px;
}
</style>