<template>
  <div
    :style="{ height: getPageHeight + 'px' }"
    class="pageItem"
    ref="bookArea"
    @keydown="doKeyDown"
  >
    <pageImage
      v-if="allowedPage"
      @addexten="$emit('addexten')"
      @touchstart="saveStartTouch"
      @setscrolling="setScrolling"
      :raw="raw"
      :style="{ height: getImageHeight + 'px' }"
      :pageData="pageData"
      :tabId="tabId"
      @toggleocr="toggleOCR"
      :mm="mm"
      :scrolling="scrolling"
      :drawFs="drawFs"
      @topFs="setTopFs"
      :currPage="currPage"
      @scrollToResult="scrollToResult"
      :rotateImage="rotateImage"
      :pagepos="pagepos"
    ></pageImage>
    <limitedPage v-else :bookPackage="bookPermissionDesc" :OZ="isOZBook">
    </limitedPage>
  </div>
</template>
<script>
import pageImage from "@/components/book/pageImage.vue";
import limitedPage from "@/components/book/limitedPage.vue";
import pageHeader from "@/components/book/pageHeader.vue";
import { mapGetters, mapState, mapActions } from "vuex";
import { permissionsEnum } from "@/services/license.js";
let mouseX = 0;
let mouseY = 0;
export default {
  components: { pageHeader, pageImage, limitedPage },
  props: [
    "raw",
    "pageData",
    "tabId",
    "mm",
    "scrolling",
    "drawFs",
    "currPage",
    "offset",
    "rotateImage",
    "pagepos",
  ],
  data() {
    return {
      offsetEditor: {},
      topFs: 0,
      scrollToBottom: true,
    };
  },
  watch: {
    pageData: function() {
      this.topFs = 0;
      this.scrollToBottom = true;
    },
  },
  computed: {
    ...mapState("bookPersonalExtensions", ["openEditor", "type"]),
    ...mapGetters("bookPersonalExtensions", [
      "getUserCommentsListByPage",
      "getUserKeysListByPage",
      "getUserMarkerListByPage",
      "crtExtentionsMode",
    ]),
    allowedPage() {
      if (this.appMode.offline()) return true;
      //if (globalThis.DEV_CONNECT_USER_TO_FREE_AUTO) return true;

      let bookPermission = this.$store.getters[
        `tabs/${this.tabId}/isBookAllowedToUser`
      ];
      let maxFreePages = this.$store.getters[`tabs/${this.tabId}/maxFreePages`];
      return (
        this.appMode.online() &&
        (bookPermission || this.pageData.position <= maxFreePages)
      );
    },
    bookPermissionDesc() {
      let bookPermissionsData = this.$store.getters[
        `tabs/${this.tabId}/bookPermissionsData`
      ];
      //return general desc for books with SCHOOL permission
      let generalDesc = permissionsEnum["GENERAL"].description;
      return bookPermissionsData
        .map((p) => (p.value != 2 ? p.description : generalDesc))
        .join(", ");
    },
    isOZBook() {
      return this.$store.getters[`tabs/${this.tabId}/OZBook`];
    },
    listComment() {
      let a = this.getUserCommentsListByPage(this.pageData.id);

      return this.getUserCommentsListByPage(this.pageData.id);
    },
    listKey() {
      return this.getUserKeysListByPage(this.pageData.id);
    },
    listMarker() {
      return this.getUserMarkerListByPage(this.pageData.id);
    },
    getPageId() {
      return this.pageData.name;
    },
    getImageHeight() {
      return this.getPageHeight - 40; //substarct padding
    },
    getPageHeight() {
      let pageHeight = this.$store.state.tabs[this.tabId].pageHeight;
      return pageHeight;
    },
  },
  methods: {
    ...mapActions("bookPersonalExtensions", [
      "setOffset",
      "openEditorWin",
      "setAddEtensType",
      "toggleCrtExtensMode",
      "setModeEdit",
    ]),
    ...mapActions("userPersonalExtensions", ["deleteUserMarker"]),
    doKeyDown(event) {
      switch (event.code) {
        case "Space":
          // event.stopPropagation();
          // event.preventDefault();
          this.$emit("toggleUpDown", this.scrollToBottom);
          this.scrollToBottom = !this.scrollToBottom;

          break;
        case "KeyF":
          if (event.ctrlKey) {
            event.stopPropagation();
            event.preventDefault();
            this.$store.dispatch(`tabs/${this.tabId}/openFs`, true, {
              root: true,
            });
          }
          break;
      }
    },
    scrollToResult(value) {
      this.$emit("scrollToResult", value);
    },
    saveStartTouch(e) {
      mouseX = e.touches[0].clientX; // Save finger position
      mouseY = e.touches[0].clientY;
    },

    setTopFs(top) {
      this.topFs = top;
    },
    setScrolling(value) {
      this.$emit("setscrolling", value);
    },
    toggleOCR(show) {
      this.$emit("toggleocr", show);
    },
    openEditorPosition(e) {
      if (this.crtExtentionsMode) {
        this.offsetEditor.percentX =
          (e.offsetX / this.$refs.bookArea.clientWidth) * 100;
        this.offsetEditor.percentY =
          (e.offsetY / this.$refs.bookArea.clientHeight) * 100;
        this.offsetEditor.x = e.offsetX;
        this.offsetEditor.y = this.offsetEditor.percentY;

        this.setOffset(this.offsetEditor);
        this.openEditorWin();
        this.toggleCrtExtensMode(false);
      }
    },
    removeMarker(id, type) {
      this.deleteUserMarker(id);
    },
    openEditorWindow(item, type) {
      let offset;
      let x = (this.$refs.bookArea.clientWidth * item.x) / 100 + 72;
      let y = (this.$refs.bookArea.clientHeight * item.y) / 100 + 80;
      offset = { x: x, y: y };
      this.setOffset(offset);

      this.setAddEtensType(type);
      this.setModeEdit(item);
      this.openEditorWin();
    },
    closeEditor() {
      return;
    },
  },
  mounted() {
    this.topFs = 0;
  },
};
</script>
<style scoped>
.pageItem {
  padding: 20px 2px;
  border: lightgray 1px solid;
  background-color: white;
}
.icon-comment {
  position: absolute;
  display: block;
  width: 28px;
  height: 28px;
  background-color: var(--custom-color1);
  z-index: 2;
  opacity: 0.5;
}
</style>
