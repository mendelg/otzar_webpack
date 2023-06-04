<template>
  <span dir="auto" class="publish-info">[{{ info }}]</span>
</template>

<script>
export default {
  props: ["info"],
};
</script>

<style lang="scss" scoped>
.publish-info {
  color: var(--text-color1);
  font-size: 13px;
  font-weight: 400;
  padding-right: 8px;
}
</style>
