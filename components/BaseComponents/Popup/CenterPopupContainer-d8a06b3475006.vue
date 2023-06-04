<template>
  <!-- style="position: absolute;bottom: 0;left: 50%;height: 1px;width: 1px;" -->
  <div id="centerpopcontainer">
    <template v-for="child in pops">
      <component :is="child.pop" :key="child.id"></component>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("centerPopContainer", ["pops"]),
  },
};
</script>

<style lang="scss" scoped></style>
