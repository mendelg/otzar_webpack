<template>
  <div class="main-setting-menu">
    <HeaderMenu
      :arrow="arrow"
      :title="$t('mainTools.openBookFromLink')"
      :routeBackName="routeBackName"
    />
    <div class="item">
      <div class="bold mrg-b-3">{{ $t("mainTools.enterLink") }}</div>
      <div style="padding-top:10px">
        <input
          v-focus
          @keyup.enter="openBookInRealWin"
          class="w-100 input-border"
          v-model="link"
        />
      </div>
      <div class="flex flex-bet" style="padding-top: 20px;">
        <span class="text-gray">{{ typedMsg }}</span>
        <baseButton class="mrg-t-6" @click="openBookInRealWin()">{{
          $t("general.open")
        }}</baseButton>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapGetters, mapActions } from "vuex";
import menuService from "@/services/menu";

export default {
  data() {
    return {
      routeBackName: "tools",
      link: "",
      typedMsg: "",
    };
  },
  props: {
    arrow: { default: true },
  },
  methods: {
    openBookInRealWin() {
      this.typedMsg = "";
      if (!this.link) return;

      const tabId = Math.floor(Math.random() * 1000000);
      const params = ["height=" + screen.height, "width=" + screen.width].join(
        ","
      );
      this.link = this.link.replace("OtzarBook://", "file:///#/");
      if (!this.link.startsWith("file:///#/book/"))
        this.typedMsg = this.$t("mainTools.incorrectLink");
      else {
        menuService.closeMenu();
        let url = this.link.split("file:///");
        window.open(
          globalThis.APP_URL +
            // `#/book/${bookId}/p/${page}/t/${tabId}/fs/${fsName}/start/${start}/end/${end}/c`,
            `${url[1]}`,
          "_blank" + tabId,
          params
        );
      }
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.item {
  padding: 20px;
}
</style>
