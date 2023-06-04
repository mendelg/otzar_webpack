<template>
  <div class="outer-results-print">
    <div class="inner-results-print ">
      <span class="text-title">{{
        $store.state.freeSearch.currentResultExporting.name +
          "/" +
          $store.state.freeSearch.currentResultExporting.author
      }}</span>
      <freeSearchProgress
        :percent="$store.state.freeSearch.currentPercentExporting"
        :search="progressTxt"
        :seconds="false"
        @stop="stop()"
        class="export-fs"
        message=""
      />
      <span>{{ message }}</span>
    </div>
  </div>
</template>
<script>
import freeSearchProgress from "@/components/listBookArea/freeSearchBarContainer/freeSearchProgress.vue";
import { exportFsResults, stopExport } from "@/services/freeSearch.js";

export default {
  components: {
    freeSearchProgress,
  },
  data() {
    return {
      percent: 0,
      seconds: 0,
      message: "",
    };
  },
  computed: {
    progressTxt() {
      return " - " + this.$store.state.freeSearch.currentResultExporting.name;
    },
  },
  methods: {
    stop() {
      this.message = this.$t("bookPrint.exportActionStop");
      stopExport();
    },
    close() {},
  },
  mounted() {
    this.message = "";
    //exportFsResults();
  },
};
</script>
<style lang="scss" scoped>
.inner-results-print {
  text-align: center;
  padding: 40px 0;
}
.text-title {
  color: var(--custom-color1);
  font-weight: 500;
}
</style>
