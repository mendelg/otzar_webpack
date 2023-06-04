<template>
  <span dir="auto" class="name-author">{{ name }}</span>
</template>

<script>
export default {
  props: ["name"],
};
</script>

<style lang="scss" scoped>
.item-book .name-author {
  // color: #000;
  font-size: 12px;
  padding-right: 7px;
}
</style>
