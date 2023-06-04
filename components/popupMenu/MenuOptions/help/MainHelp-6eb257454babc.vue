<template>
  <div class="main-setting-menu">
    <HeaderMenu :title="$t('mainHelp.name')" :routeBackName="routeBackName" />

    <ul class="list-main-setting list-menu">
      <li class="row-in-setting item">
        <RowItem
          v-disable
          @click="downloadTrainningFilePDF()"
          :title="$t('showHelp.name')"
          :HasIconItem="false"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
        />
        <router-view />
      </li>
      <li class="item" v-remove.online>
        <RowItem
          v-disable
          @click="goToAboutApp()"
          :title="$t('about.name')"
          :HasIconItem="false"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
        />
        <router-view />
      </li>
      <li class="item" v-remove.online>
        <RowItem
          v-kiosk
          v-disable
          @click="goToLic()"
          :title="$t('licenseCode.name')"
          :HasIconItem="false"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
        />
        <router-view />
      </li>
      <li class="item" v-remove.online>
        <RowItem
          v-disable
          @click="goToWhatsNew()"
          :title="$t('about.whatsNew')"
          :HasIconItem="false"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
        />
        <router-view />
      </li>
    </ul>
  </div>
</template>

<script>
// import { mapGetters, mapActions } from "vuex";
import menuService from "../../../../services/menu";

export default {
  data() {
    return {
      routeBackName: "main",
      stockIcon: "fa fa-server",
      pdfIcon: "fa fa-file-pdf-o",
      // cuurentLanguage:
    };
  },
  computed: {},
  methods: {
    downloadTrainningFilePDF() {
      const helpFile = globalThis.ELECTRON_ENV
        ? "mainMenu.helpFileNameElectron"
        : "mainMenu.helpFileName";
      window.open(`${this.$t(helpFile)}`);
    },
    goToAboutApp() {
      menuService.openAboutAppMenu();
    },
    goToHelp() {
      menuService.openHelpDocsMenu();
    },
    goToLic() {
      menuService.openLicenceCodeMenu();
    },
    goToWhatsNew() {
      menuService.openWhatsNewMenu();
    },
  },
};
</script>

<style lang="scss" scoped>
.main-setting-menu {
  width: -webkit-fill-available;
  z-index: 3;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.list-main-setting {
  display: flex;
  flex-direction: column;
  // margin: 0;
  // padding: 0;
  list-style-type: none;
}
</style>
