//

<template>
  <div class="input-search-in">
    <baseIcon
      class="icon-search-in"
      nameIcon="icon-search-in"
      width="14"
      height="14"
    />

    <!-- <input
      v-bind="$attrs"
      v-on="$listeners"
      type="text"
      :placeholder="$attrs.placeholder"
      ref="input"
    /> -->
    <input
      v-bind="$attrs"
      @input="$emit('input')"
      type="text"
      :placeholder="$attrs.placeholder"
      ref="input"
    />
    <baseIcon
      class="icon-search-btn"
      nameIcon="icon-search-in-color"
      @click="searchBtn"
      width="14"
      height="14"
      v-if="$attrs.btnSearch"
      pathIcon="icons-ganeral"
    />
    <div v-show="$refs.input" class="otz-icon no-bg clear-input" @click="clear">
      F
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    placeholder: {
      type: String,
      default: "",
    },
  },
  computed: {
    showClear() {
      if (this.$refs.input.value) {
        return true;
      }
      return false;
    },
  },
  methods: {
    clear() {
      this.$refs.input.value = "";
      this.$emit("input");
    },
    searchBtn() {},
  },
};
</script>

<style lang="scss" scoped></style>
