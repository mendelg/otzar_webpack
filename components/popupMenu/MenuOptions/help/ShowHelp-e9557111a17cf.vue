<template>
  <div class="main-setting-menu">
    <HeaderMenu :title="$t('showHelp.name')" :routeBackName="routeBackName" />

    <ul class="list-main-setting list-menu">
      <li class="item">
        <RowItem
          @click="downloadTrainningFilePDF"
          :title="$t('mainHelp.downloadPDF')"
          :HasIconItem="true"
          iconItem="y"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
        />
      </li>
      <li class="item">
        <RowItem
          @click="fff"
          :title="$t('mainHelp.trainningSite')"
          :HasIconItem="true"
          iconItem="m"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
        />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routeBackName: "help",
      stockIcon: "fa fa-server",
      pdfIcon: "fa fa-file-pdf-o",
      // cuurentLanguage:
    };
  },
  computed: {},
  methods: {
    fff() {},
    downloadTrainningFilePDF() {
      const helpFile = globalThis.ELECTRON_ENV
        ? "mainMenu.helpFileNameElectron"
        : "mainMenu.helpFileName";
      window.open(`${this.$t(helpFile)}`);
    },
    //
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
