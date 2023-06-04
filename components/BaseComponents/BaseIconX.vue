<template>
  <div class="icon-del icon-close otz-icon no-bg" @click.stop="remove()">F</div>
</template>

<script>
export default {
  methods: {
    remove() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-del {
  &:hover {
    color: #000;
  }
}
</style>
