<template>
  <div @click="$emit('click')">
    <div>{{ $t("folders.exploreOtzar") }}</div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      nameIcon: "icon-import-list",
    };
  },
  computed: {
    ...mapGetters("bookList", ["getCheckedBooks"]),
    hasExport() {
      if (this.getCheckedBooks.length > 0) return true;
      return false;
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>
