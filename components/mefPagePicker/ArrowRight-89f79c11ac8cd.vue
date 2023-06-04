<template>
  <div class="mef-font mef-font-default arrows arrow-right flex full-center">
    <div class="flex full-center">
      <span
        v-tooltip="'לעמוד הקודם'"
        class="mef-font mef-font-default"
        @click="prevPage"
        style="line-height: 24px;
    width: 26px;"
        :class="{ disabled: !isActive }"
      >
        <HoverGray
          h="25"
          w="25"
          t="0"
          l="0"
          fgcolor="white"
          bgcolor="rgb(0,0,0,0.1)"
          >J</HoverGray
        >
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { ShasBooks } from "@/services/mefo/shasService";

export default {
  computed: {
    ...mapGetters("mefShas", [
      "getSelectedPageNumber",
      "getSelectedBookNumber",
    ]),
    isActive() {
      let page = this.getSelectedPageNumber;
      let bookid = this.getSelectedBookNumber;
      if (bookid == null) return false;
      page = Number(page);
      let bookData = ShasBooks[bookid];
      if (page <= bookData.firstPage) {
        return false;
      }
      return true;
    },
  },
  methods: {
    prevPage() {
      let page = this.getSelectedPageNumber;
      // let tab = this.$store.getters.getCurrentTab.tabId;
      page = Number(page) - 1;
      // this.$router.push({
      //   name: "n-main-page",
      //   params: { bookid: this.getSelectedBookNumber, page, tab },
      // });
    },
    checkKey(e) {
      if (e.key == "ArrowRight" && e.ctrlKey) this.prevPage();
    },
  },
  beforeDestroy() {
    document.removeEventListener("keyup", this.checkKey, false);
  },
  created() {
    document.addEventListener("keyup", this.checkKey, false);
  },
};
</script>

<style>
.disabled {
  color: white;
  opacity: 0.5;
}
.arrow-hover:hover {
  height: 25px;
  width: 26px;
  border-radius: 50%;
  /* background-color: rgba(0, 0, 0, 0.1); */

  position: absolute;
}
.arrow-right {
  width: 24px;
  margin-left: 5px;
  height: 31px;
  line-height: 31px;
  color: white;
  /* transform: rotate(180deg); */
}
</style>
