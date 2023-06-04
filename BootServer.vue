<template>
  <div id="app">
    <center>
      Please Wait
    </center>
  </div>
</template>

<script>
export default {
  mounted() {
    setTimeout(() => {
      window.location.hash = "#/network";
    }, 10000);
  },
};
</script>

<style lang="scss" scoped>
#app {
  height: calc(100vh - 20px);
}
</style>
