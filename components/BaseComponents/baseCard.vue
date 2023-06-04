<template>
  <div class="card fade-in-2 flex-column">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.card {
  //   padding: 25px 40px;
  background-color: #fff;
  box-shadow: 5px 3px 6px rgba(0, 0, 0, 0.16);
}
</style>
