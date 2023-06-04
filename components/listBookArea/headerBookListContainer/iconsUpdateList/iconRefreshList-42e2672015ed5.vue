<template>
  <div class="h-100 flex align-item-center">
    <iconCircle
      class="h-100 flex align-item-center icon-refresh"
      :nameIcon="nameIcon"
      @click="refreshList"
      v-tooltip="{ content: this.$t('tooltip.refresh'), placement: 'top' }"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      nameIcon: "icon-refresh",
    };
  },
  methods: {
    refreshList() {
      let payload = {
        type: "ALL",
        content: "",
      };
      // this.$store.dispatch("bookList/addUserActionToHistory", payload);
      this.$store.dispatch("bookList/goToHistory", { id: 1 });
      //this.$store.state.currentActiveListIndex = "0";
      //this.$store.state.lastActiveList = 1;
      this.$store.dispatch(
        "booklistComp/setFirstActive",
        new Date().getMilliseconds()
      );
      //this.setFirstActive(true);
    },
  },
};
</script>

<style lang="scss" scoped></style>
