<template>
  <div class="item-container-inner">
    <slot name="input"></slot>
    <div class="desc-container">
      <div class="title">{{ title }}</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["title", "desc", "showDesc"],
};
</script>
<style lang="scss" scoped>
.desc-container {
  display: flex;
  flex-direction: column;
  width: 167px;
}
.neg-word .desc-container {
  // padding-right: 25px;
  .description {
    width: 120px;
  }
}
.item-container {
  display: flex;
  flex-direction: row;
  width: 25%;
}
.title {
  color: var(--custom-color1);
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  min-height: 16px;
}
.description {
  font-size: 12px;
  line-height: 14px;
  margin-top: 6px;
}
</style>
