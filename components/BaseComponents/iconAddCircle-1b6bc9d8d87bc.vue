<template>
  <div v-kiosk @click="clicAdd" class="quick-book-item">
    <span>+</span>
  </div>
</template>

<script>
export default {
  methods: {
    clicAdd() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
$bg-hover2: #00000020;
$bg-active2: #00000030;
$bg-color3: #e5e5e5;
$text-color2: #7b7b7b;
.quick-book-item {
  border: 1px solid var(--custom-color1);
  width: 22px;
  height: 22px;
  text-align: center;
  background-color: var(--custom-color1);
  border-radius: 17px;
  position: relative;
  font-size: 13px;
  // border: 1px solid var(--custom-color1);
  line-height: 20px;
  padding: 0 6px;
  color: #fff;
  // margin-left: 6px;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    // font-weight: bold;
    background-color: var(--custom-color2);
    // padding: 0 9.5px;
  }
}
.add-circle {
  width: 17.5px;
  height: 17.5px;
  min-width: auto;
  line-height: 17.5px;
  background-color: $bg-color3;
  border: 0;
  font-size: 16px;
  font-weight: 500;
  color: $text-color2;
  margin: auto 0;
  transition: 0.3s;
  &:hover:not(:active) {
    background-color: $bg-hover2;
  }
  &:active {
    background-color: $bg-active2;
  }
}
</style>
