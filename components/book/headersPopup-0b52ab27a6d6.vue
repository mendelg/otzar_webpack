<template>
  <BaseCleanPopup
    v-body
    v-zindex
    :h="40"
    :winh="550"
    :winw="550"
    :noneOverlay="true"
    :mini="true"
    :mini_title="$t('book.headers')"
    @close="$store.state.tabsManager.showHeadersTabId = null"
    @resize="resize++"
  >
    <template v-slot:header>
      <span class="flex flex-align-center h-100">
        {{ $t("book.bookPagesHeaders") }}
      </span>
    </template>
    <div
      ref="container"
      style="
        height: 100%;
        background-color: #f7f7f7;
        padding-right: 5px;
        padding-top: 5px;
      "
    >
      <RecycleScroller
        class="wide-scroll"
        :buffer="2"
        style="height: 100%"
        :items="headersData"
        :item-size="itemHeight + 11"
        v-slot="{ item, index, active }"
        keyField="id"
        ref="headers"
      >
        <div class="header-item-container">
          <headerItem
            :book="item.bookId"
            :currentHeaderData="{
              pageId: item.name,
              top: 0,
              left: 0,
              pos: item.originPosition || item.position,
            }"
            :delay="true"
            @click="navToPage(item.position, tabId)"
            @resize="setHeight"
            :resize="resize"
            :full="false"
          />
        </div>
      </RecycleScroller>
    </div>
  </BaseCleanPopup>
</template>

<script>
import headerItem from "./headerItem.vue";
import { goToPage } from "@/services/bookData.js";
import Vue from "vue";
export default {
  data() {
    return {
      img: "",
      headerTop: 0,
      headerLeft: 0,
      timer: null,
      resize: 0,
      itemHeight: 50,
    };
  },
  props: ["tabId"],
  components: { headerItem },
  computed: {
    getTabData() {
      return this.$store.getters[`tabs/${this.tabId}/getTabData`];
    },
    headersData() {
      return this.maxAllowedPage > -1
        ? this.getTabData.pages
            .filter((p) => !p.empty)
            .slice(0, this.maxAllowedPage)
        : this.getTabData.pages.filter((p) => !p.empty);
    },
    bookId() {
      return this.getTabData.book;
    },
    maxAllowedPage() {
      if (this.appMode.offline()) return -1;
      if (globalThis.DEV_CONNECT_USER_TO_FREE_AUTO) return -1;

      let bookPermission =
        this.$store.getters[`tabs/${this.tabId}/isBookAllowedToUser`];
      if (bookPermission) return -1;
      return this.$store.getters[`tabs/${this.tabId}/maxFreePages`];
    },
  },
  mounted() {},
  watch: {
    tabId: function (val) {
      this.enterItem();
    },
  },
  methods: {
    setHeight(val) {
      this.itemHeight = val;
    },
    navToPage(position, tabId) {
      goToPage(position, tabId);
    },
    enterItem() {
      let _t = this;
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        await this.getHeader();

        this.setHeaderLocation();
        Vue.nextTick(() => {
          _t.draw();
        });
      }, 100);
    },
    leaveItem() {
      clearTimeout(this.timer);
    },
    setHeaderLocation() {
      setTimeout(() => {
        if (!this.$refs.container) return;

        this.$refs.container.style.top = this.currentHeaderData.top + "px";
        this.$refs.container.style.left =
          this.currentHeaderData.left - this.$refs.container.offsetWidth + "px";
      }, 100);
    },
    async getHeader() {
      //   if (this.img != "") return;

      await this.getImg({ x: 0, y: 1, h: 50, w: 0, resize: 500 });
    },
    async goToPage() {
      this.$emit("click", this.id);
    },
    async getImg(cropRect) {
      try {
        let img;
        try {
          img = await getImageObject(
            this.book,
            this.currentHeaderData.pageId,
            "image",
            false,
            cropRect,
            null,
            this.currentHeaderData.pos
          );
        } catch (ex) {
          console.error("gzir error>>", ex);
          //this.showSpinner = false;
        }

        this.img = img;
        //this.showSpinner = false;
      } catch (ex) {
        console.error("gzir error>>", ex);
        //this.showSpinner = false;
      }
    },
    draw() {
      // if (this.img == "") return;

      let topCoord;

      let canvas = this.$refs.image;
      if (canvas == undefined) return;
      let canvasCtx = canvas.getContext("2d");

      let img = this.img.picture;
      let imageMetaData = this.img.imageMetaData;
      let originWidth =
        imageMetaData.width && imageMetaData.width != 0
          ? imageMetaData.width
          : this.img.width;
      let originHeight =
        imageMetaData.height && imageMetaData.height != 0
          ? imageMetaData.height
          : this.img.height;

      let marginTop = imageMetaData.top;
      let originImgRatio = originWidth / originHeight;

      let canvasWRatio = canvas.width / originWidth;
      let canvasFullHeight = originHeight * canvasWRatio;
      let canvasHRatio = canvasFullHeight / originHeight;

      let w;
      let h;
      let top = 0,
        ctop = 0;
      let height = (canvas.height / canvasFullHeight) * originHeight;

      canvasCtx.fillStyle = "white";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      //canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

      canvasCtx.drawImage(
        img,
        0,
        0,
        img.width,
        height,
        1,
        1,
        canvas.width,
        canvas.height
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  text-align: right;
}
.header-popup {
  width: 502px;
  height: 500px;
  border: 1px solid black;
  position: absolute;
  top: 100px;
  left: 50px;
  z-index: 9999999;
}
.header-item-container {
  border: 1px solid lightgrey;
  margin-bottom: 5px;
  background-color: white;
  cursor: pointer;
}
</style>
