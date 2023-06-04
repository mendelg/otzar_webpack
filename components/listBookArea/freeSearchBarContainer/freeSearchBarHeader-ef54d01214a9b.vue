<template>
  <div class="header dir-rtl" @click.self="toggleShowFreeSearchList">
    <div class="options-container">
      <freeSearchAdvOptions
        option="concat"
        :title="concatTitle"
        :message="concatMessage"
      />
      <freeSearchAdvOptions
        option="shimush"
        :title="shimushTitle"
        :message="shimushMessage"
        class="h-xs"
      />
      <freeSearchAdvOptions
        option="inOrder"
        :title="inOrderTitle"
        :message="inOrderMessage"
        class="h-larg"
      />
      <!-- v-if="width=='wide'" -->
    </div>
    <freeSearchBarAdvanced :width="width" />
  </div>
</template>

<script>
import freeSearchBarAdvanced from "./freeSearchBarAdvanced.vue";
import freeSearchAdvOptions from "./freeSearchAdvOptions.vue";
import { mapActions } from "vuex";
export default {
  components: {
    freeSearchBarAdvanced,
    freeSearchAdvOptions,
  },
  /*  data() {
    return {
      concatTitle: this.$t("freeSearchInput.advancedOptions.concatTitle"),
      concatMessage: this.$t("freeSearchInput.advancedOptions.concatMessage"),
      shimushTitle: this.$t("freeSearchInput.advancedOptions.shimushTitle"),
      shimushMessage: this.$t("freeSearchInput.advancedOptions.shimushMessage"),
      inOrderTitle: this.$t("freeSearchInput.advancedOptions.inOrderTitle"),
      inOrderMessage: this.$t("freeSearchInput.advancedOptions.inOrderMessage"),
    };
  }, */
  props: ["width"],
  computed: {
    concatTitle() {
      return this.$t("freeSearchInput.advancedOptions.concatTitle");
    },
    concatMessage() {
      return this.$t("freeSearchInput.advancedOptions.concatMessage");
    },
    shimushTitle() {
      return this.$t("freeSearchInput.advancedOptions.shimushTitle");
    },
    shimushMessage() {
      return this.$t("freeSearchInput.advancedOptions.shimushMessage");
    },
    inOrderTitle() {
      return this.$t("freeSearchInput.advancedOptions.inOrderTitle");
    },
    inOrderMessage() {
      return this.$t("freeSearchInput.advancedOptions.inOrderMessage");
    },
  },
  methods: {
    ...mapActions("freeSearchBookList", ["toggleShowFreeSearchList"]),
  },
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.options-container {
  display: flex;
  flex-direction: row;
  justify-content: right;
}
</style>
