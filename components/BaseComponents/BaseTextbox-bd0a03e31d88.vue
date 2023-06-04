<template >
  <div :width="$attrs.width">
    <input type="text" :value="$attrs.value">
  </div>
</template>

<script>
export default {
  inheritAttrs: false
};
</script>

<style lang="scss" scoped>
</style>