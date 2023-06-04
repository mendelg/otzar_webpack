<template>
  <div class="auto-complete">
    <div class="item" v-for="(item, index) in list" :key="index">
      {{ item }}
      <div class="icons flex">
        <div
          class="otz-icon edit no-bg mrg-l-3"
          v-tooltip="{
            content: this.$t('itemBook1.editNameAuthor'),
            placement: 'right',
          }"
        >
          c
        </div>
        <div
          class="otz-icon remove no-bg mrg-l-3"
          v-tooltip="{
            content: this.$t('itemBook1.deleteAuthor'),
            placement: 'right',
          }"
        >
          F
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["list"],
};
</script>

<style lang="scss" scoped>
.auto-complete {
  overflow: auto;
  text-align: right;
  background-color: #fff;
  box-shadow: 0 2px 3px 1px #00000038;
  color: #000;
  max-height: 300px;
}
.item {
  padding: 0 8px;
  position: relative;
  height: 28px;
  line-height: 28px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: #ececec;
  }
}
.icons {
  position: absolute;
  left: 5px;
}
</style>
