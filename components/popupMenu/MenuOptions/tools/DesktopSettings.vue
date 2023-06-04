<template>
  <div class="main-setting-menu">
    <HeaderMenu :title="title" :routeBackName="routeBackName" />
    <ul class="list-main-setting list-menu">
      <li class="item">
        <RowItem
          @click="goToDesktopWindow"
          :title="openDesktopName"
          :HasIconItem="false"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
        />
        <router-view />
      </li>
      <li class="row-in-setting item">
        <RowItem
          @click="goToDesktopWindow('save')"
          :title="saveDesktopName"
          :HasIconItem="false"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
        />
      </li>

      <li class="item">
        <RowItem
          @click="goToDesktopWindow('default')"
          :title="setDefaultDesktopName"
          :HasIconItem="false"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
        />
        <router-view />
      </li>
      <li class="item">
        <RowItem
          @click="saveLastDesk"
          @toggle="saveLastDesk"
          :title="$t('desktops.lastDesk')"
          :HasIconItem="false"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="true"
          :displayCheckbox="!lastDesk"
          type="checkbox"
        />
        <!-- <RowItem
          @click="setViewPlacesTo"
          :title="$t('mainSettings.viewPlacesRegularlygName')"
          :HasIconItem="false"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="true"
          :displayCheckbox="getviewPlaces"
          type="checkbox"
        /> -->
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { postUserSetting } from "@/services/userSettingsData.js";
import deskMix from "@/mixing/mixDesktop.js";
import menuService from "@/services/menu";
export default {
  computed: {
    ...mapState("user", { state: (state) => state.settings }),
    lastDesk() {
      let mode =
        !this.state.lastDesk || this.state.lastDesk == "0" ? false : true;
      return mode;
    },
  },
  data() {
    return {
      //fa fa-comment-o הערות
      //fa fa-key מפתחות
      //fa fa-paint-brush הדגשות
      //fa fa-link קישורים
      title: this.$t("mainTools.desktopPath"),
      routeBackName: "tools",
      saveDesktopName: this.$t("mainTools.saveDesktop"),
      openDesktopName: this.$t("mainTools.openDesktop"),
      setDefaultDesktopName: this.$t("mainTools.setDefaulteDesktop"),
    };
  },
  methods: {
    saveLastDesk() {
      let current = this.lastDesk;
      postUserSetting({ key: "lastDesk", value: !current });
    },
    goToDesktopWindow(mode = "open") {
      this.$store.dispatch("desktop/setSaveMode", mode);
      this.$store.dispatch("desktop/setVisible", true);
      menuService.closeMenu();
      // this.$router.push({ name: "desktop-window", meta: { save: true } });
    },
  },

  watch: {
    lastDesk() {},
  },
};
</script>

<style lang="scss" scoped></style>
