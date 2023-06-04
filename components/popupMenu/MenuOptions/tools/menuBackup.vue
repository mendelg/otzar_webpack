<template>
  <div class="main-setting-menu">
    <HeaderMenu :title="title" :routeBackName="routeBackName" />

    <ul class="list-main-setting list-menu">
      <li>{{ $t("backupSetting.savePlace") }}</li>
      <li class="item item-check" :class="{ checked: backupType === 'system' }">
        <RowItem
          @click="setBackupLocationTo('system')"
          :title="$t('backupSetting.driveBackupName')"
          :HasIconItem="backupType === 'system'"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
        />
      </li>
      <li class="item item-check" :class="{ checked: backupType === 'custom' }">
        <RowItem
          @click="setBackupLocationTo('custom')"
          :title="$t('backupSetting.localBackupName')"
          :HasIconItem="backupType === 'custom'"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
        />
      </li>
      <div
        class="text-en-left flex  flex-bet rtl dir-rtl"
        style="padding:0px 30px 10px 10px;"
        v-if="backupType === 'custom'"
      >
        <div class="flex-g-1 location-class">
          <div class="color-black">{{ $t("files1.place") }}:</div>
          <div style="line-break: anywhere;">
            {{ cusBackupLocation }}
          </div>
          <!-- <input type="text" disabled :value="cusBackupLocation" /> -->
        </div>
        <div
          class="btn btn-row-item"
          :class="{
            btnDisable: backupType != 'custom',
          }"
          @click="browseAndSetLocation"
        >
          {{ $t("general.change") }}
        </div>
      </div>
      <li class="underline-separate"></li>
      <li>{{ $t("mainSettings.backupSettingName") }}</li>
      <li class="item item-check" :class="{ checked: autoBackup }">
        <RowItem
          @click="setAutoBackupTo(1)"
          :title="$t('backupSetting.autoBackupOnName')"
          :HasIconItem="autoBackup"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
        />
      </li>
      <li class="item item-check" :class="{ checked: !autoBackup }">
        <RowItem
          @click="setAutoBackupTo(0)"
          :title="$t('backupSetting.autoBackupOffName')"
          :HasIconItem="!autoBackup"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
        />
      </li>
      <li class="underline-separate"></li>
      <!-- <li>{{ $t("backupSetting.playNowBackup") }}</li> -->
      <li class="item item-btn">
        <div>
          {{ $t("backupSetting.playNowBackup") }}
        </div>
        <div class="btn btn-row-item " @click="runBackup">
          {{ $t("backupSetting.nowBackup") }}
        </div>
      </li>
      <li v-if="backupProgress">
        {{
          $t("backupSetting.backupProgressMsg")
            .replace("$1", backupProgress.processed)
            .replace("$2", backupProgress.total)
        }}
      </li>

      <li class="item  item-btn">
        <div>{{ $t("backupSetting.restoeExistingBackup") }}</div>
        <div class="btn btn-row-item " @click="restore">
          {{ $t("backupSetting.restore") }}
        </div>
      </li>
      <li class="underline-separate"></li>
      <div class="last-backup">
        <span class="bold">{{ $t("backupSetting.lastRestore") }}</span>
        <span>&nbsp;</span>
        <span>
          {{
            lastBackupFile
              ? new Date(lastBackupFile.time).toLocaleString()
              : $t("backupSetting.notFind")
          }}
        </span>
      </div>
    </ul>
    <BaseExplorer
      v-if="showFileExplore"
      :openAt="backupLocation"
      @close="closeExplorer"
      @selected="locationSelected"
    />
    <restorePopup
      v-if="showRestorePopup"
      @close="closeRestorePopup"
      :backupLocation="backupLocation"
      :lastBackupFile="lastBackupFile"
    />
  </div>
</template>

<script>
// import { mapGetters, mapActions } from "vuex";

import backupService from "@/services/offline/backup.js";
import restorePopup from "@/components/popupMenu/MenuOptions/tools/restorePopup.vue";
import { mapGetters } from "vuex";

// import mixCreateBook from "@/mixing/mixCreateBook.js";

export default {
  components: { restorePopup },

  data() {
    return {
      // title: ,
      routeBackName: "tools",
      iconV: "3",
      showFileExplore: false,
      resolveLocationSelected: null,
      showRestorePopup: false,
      backupProgress: null,
    };
  },

  created() {
    if (!this.backupProgress) backupService.updateLastBackupFile();
  },

  sockets: {
    connect: function() {},
    backupSucceed: function() {
      this.backupProgress = null;
      backupService.updateLastBackupFile();
      let notification = {
        type: "success",
        message: this.$t("backupSetting.succeededFinshedBackup"),
        timeout: 4000,
      };
      this.$notify(notification);
    },
    backupProgress: function(progress) {
      const { total, processed } = progress.entries;
      this.backupProgress = { total, processed };
    },
  },

  methods: {
    locationSelected(location) {
      this.closeExplorer();
      if (this.resolveLocationSelected) this.resolveLocationSelected(location);
    },
    closeExplorer() {
      this.showFileExplore = false;
    },
    async browseAndSetLocation() {
      if (this.backupType === "custom") {
        this.showFileExplore = true;
        let location = await new Promise((resolve, reject) => {
          this.resolveLocationSelected = resolve;
        });
        this.setCustomBackupLocation(location);
      }
    },
    runBackup() {
      const notification = {
        type: "simple",
        message:
          this.$t("backupSetting.restoreTo") + this.backupLocation + "...",
        await: true,
        timeout: 2000,
      };
      this.$notify(notification);
      this.doBackup();
    },
    restore() {
      this.showRestorePopup = true;
    },
    closeRestorePopup() {
      this.showRestorePopup = false;
    },
    //path
    setCustomBackupLocation(location) {
      this.userSettings.setSettings("customBackupLocation", location);
    },
    //custom|system
    setBackupLocationTo(saveBackupLocation) {
      this.userSettings.setSettings("backupLocationType", saveBackupLocation);
    },
    //on|off
    setAutoBackupTo(autoBackup) {
      this.userSettings.setSettings("autoBackup", autoBackup);
    },
    async doBackup() {
      await backupService.startBackup(true);
      return;
    },
  },
  computed: {
    ...mapGetters("backup", [
      "lastBackupFile",
      "backupType",
      "autoBackup",
      "cusBackupLocation",
      "backupLocation",
    ]),
    title() {
      return this.$t("backupSetting.title");
    },
  },
  watch: {
    backupType: function() {
      if (this.backupType === "custom" && !this.cusBackupLocation) {
        this.setBackupLocationTo("system");
        this.browseAndSetLocation().then(() => {
          this.setBackupLocationTo("custom");
        });
      }
    },
    backupLocation: function() {
      backupService.updateLastBackupFile();
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
.underline-separate {
  // border-bottom: 1px solid rgb(221, 187, 187);
  // margin: 0;
  // padding: 0;
}
.list-folder {
  .item {
    display: flex;
    align-items: center;
    height: 30px;
    padding: 0 20px;

    &:hover {
      background-color: #f4f4f4;
    }
  }
}
.list-menu .item.item-btn {
  margin: 0;
  padding: 0 25px 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #000;
  .btn.btn-row-item {
    margin: 0;
  }
}
.location-class {
  font-size: 11px;
  color: #000;
  line-height: 17px;
  max-width: 220px;
  padding-right: 20px;
}
.last-backup {
  display: flex;
  color: #000;
  padding: 0 20px;
}
.text-en-left {
  text-align: right;
}
</style>
