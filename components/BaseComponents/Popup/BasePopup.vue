<template>
  <div class="outer-popup" :class="grid">
    <div id="inner-popup" class="inner-popup">
      <header class="title-popup drag font">
        <span class="title">{{ title }}</span>
        <div class="close-popup otz-icon" @click="close()">F</div>
      </header>
      <main style="height: calc(100% - 56px);">
        <slot name="content"></slot>
      </main>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
export default {
  props: ["header", "grid"],
  mounted() {
    let elem = this.$el.querySelector("#inner-popup");
    if (!elem) return;
    this.h = elem.width;
    this.w = elem.height;
  },
  data() {
    return {
      h: 591,
      w: 1010,
      showPopup: this.viewPopup,
    };
  },
  computed: {
    ...mapState("freeSearch", ["enumSearchInType"]),
    ...mapGetters("folders", ["viewPopup", "getTypePopup"]),
    ...mapGetters("booklistComp", ["getListCheckBooks"]),
    x() {
      let wWindow = window.winSizes.innerWidth;
      // let left = wWindow / 2 - this.w / 2;
      let left = wWindow / 2 - 500;
      if (left < 0) return 0;
      return left;
    },
    y() {
      let hWindow = window.winSizes.innerHeight;
      // let top = hWindow / 2 - this.h / 2;
      let top = hWindow / 2 - 296;
      if (top < 0) return 0;
      return top;
    },
    title() {
      switch (this.getTypePopup) {
        case "export":
          return this.$t("general.save2");
          break;
        case "import":
          return this.$t("general.openListBook");
          break;
        case "browse":
          return this.$t("general.selectListBook");
          break;
        case "activeStore":
          return this.$t("store.setActiveStore");
          break;
      }
    },
  },
  methods: {
    ...mapActions("freeSearchBookList", ["setSearchInType"]),
    close() {
      if (this.getTypePopup == "browse") {
        this.setSearchInType(this.enumSearchInType.all);
      }
      this.showPopup = false;
      this.$store.dispatch("folders/togglePopupFolder", false);
    },
  },
  watch: {
    viewPopup: function() {
      if (this.viewPopup == false) {
        this.showPopup = false;
        // this.$store.dispatch("folders/togglePopupFolder", false);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container-popup {
  position: absolute;
  // position: relative;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  // z-index: 7 !important;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.16);
}
.overlay {
  width: 100vw;
  position: absolute;
  height: 100vh;
  background-color: #0000006b;
  z-index: 9;
  top: 0;
}
</style>
