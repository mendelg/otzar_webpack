<template>
  <div style="height:100%">
    <pagesContainer
      @addexten="$emit('addexten')"
      :tabId="tabId"
      :list="pages.filter((p) => !p.empty)"
      :drawData="drawData"
      @toggleocr="toggleOCR"
      :mm="mm"
      :drawFs="drawFs"
      @print="emitPrint"
      @login="$emit('login')"
      :rotateImage="rotateImage"
    ></pagesContainer>
  </div>
</template>
<script>
import pagesContainer from "@/components/book/pagesContainer.vue";

export default {
  props: ["pages", "tabId", "drawData", "mm", "drawFs", "rotateImage"],
  components: {
    pagesContainer,
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    toggleOCR(show) {
      this.$emit("toggleocr", show);
    },
    emitPrint(data) {
      this.$emit("print", data);
    },
  },
};
</script>
