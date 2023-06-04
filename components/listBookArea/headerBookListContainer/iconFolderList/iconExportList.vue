<template>
  <div class="icon" v-tooltip="this.$t('folders.saveList')">
    <BaseIconOpenFolder :nameIcon="nameIcon" @click="exportList" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  props: {
    listType: {
      type: String,
      default: "book",
    },
    disable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      nameIcon: "v",
      state: "export",
    };
  },
  computed: {
    ...mapGetters("bookList", ["getCheckedBooks"]),
    hasExport() {
      if (this.getCheckedBooks.length > 0) return true;
      return false;
    },
  },
  methods: {
    exportList() {
      // if (this.disable) return;
      this.$store.dispatch("folders/setOpenTypePopup", "export").then(() => {
        this.$store.dispatch("folders/setListType", this.listType).then(() => {
          this.$store.dispatch("folders/togglePopupFolder", true);
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  padding-top: 8.75px;
}
</style>
