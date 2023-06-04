<template>
  <div>
    <template v-for="bookTab in openbooks">
      <!-- <p @click="resize(bookTab)">resize ttttttttttttttt</p> -->
      <BaseCleanPopup
        :headerColor="true"
        :y="32"
        :key="bookTab"
        :tabId="bookTab"
        v-zindex
        @resize="resize(bookTab)"
        @close="removeBookTab(bookTab)"
        :h="37"
        :maxi="true"
        :mini_title="bookTitle(bookTab)"
        :mini="true"
        :pin="true"
        :usemodeprop="true"
        @minimize="setMinimize(bookTab, $event)"
        :minicb="toggleMinimize"
        :mode="tabData(bookTab).minimize"
        :winh="tabData(bookTab).winHeight"
        :winw="tabData(bookTab).winWidth"
        :indent="true"
        :noneOverlay="true"
        :toggleMaxi="toggleMaxi"
        :toggleId="toggleId"
      >
        <template v-slot:header>
          <span class="flex flex-align-center h-100">{{
            bookTitle(bookTab)
          }}</span>
        </template>

        <div
          @click="setTopWindow(bookTab)"
          style="width: 100%; height: 100%; overflow: hidden"
          @dblclick.stop="setIdToToggle(bookTab)"
        >
          <book-content :tabId="bookTab" />
        </div>
      </BaseCleanPopup>
    </template>
  </div>
</template>

<script>
import BookContent from "@/components/book/book.vue";
import bookVolumes from "@/components/book/bookVolumes.vue";
export default {
  inheritAttrs: false,
  data() {
    return {
      renderContent: true,
      toggleId: "0",
      toggleMaxi: false,
      topWindow: 0,
    };
  },
  computed: {
    openbooks() {
      let tabs = this.$store.getters["tabsManager/getOpenBooks"];

      return tabs;
    },
  },

  methods: {
    setTopWindow(tabId) {
      this.topWindow = tabId;
    },
    setIdToToggle(id) {
      this.toggleMaxi = !this.toggleMaxi;
      this.toggleId = id;
    },
    resize(tabId) {
      this.$store.dispatch(`tabs/${tabId}/triggerResize`);
      // this.$store.state[this.tabId].resize
    },
    setMinimize(tabId, mode) {
      this.$store.dispatch(`tabs/${tabId}/setMinimize`, mode);
      // this.$store.state[this.tabId].resize
    },
    toggleMinimize(tabId) {
      this.$store.dispatch(`tabs/${tabId}/toggleMinimize`);
      // this.$store.state[this.tabId].resize
    },
    removeBookTab(id) {
      this.$store.dispatch("tabsManager/delTab", id);
    },
    tabData(tabId) {
      return this.$store.state.tabs[tabId];
    },
    bookTitle(tabId) {
      return this.$store.state.tabs[tabId].title;
    },
  },
  components: { BookContent, bookVolumes },
};
</script>

<style lang="scss" scoped>
.volumes-list {
  width: 30%;
}
.combo-vol {
  position: absolute;
  right: calc(20% + 30px);
  top: 11px;
}
</style>
