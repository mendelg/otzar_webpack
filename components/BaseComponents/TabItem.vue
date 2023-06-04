<template>
  <div>
    <div @click="showMe=true">{{tabName}}</div>
    <div v-show="showMe">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TabItem",
  props: ["tabName"],
  data() {
    return {
      showMe: false
    };
  }
};
</script>

<style lang="scss" scoped>
</style>