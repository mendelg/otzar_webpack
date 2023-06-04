<template>
  <div>
    <BaseExplorer
      v-if="showFileExplore"
      :openAt="backupLocation"
      :showfiles="true"
      @close="closeExplorer"
      @selected="locationSelected"
    />
    <BaseCleanPopup
      v-body
      :title="$t('restorBackup.restorData')"
      @close="$emit('close')"
      :h="40"
      :w="300"
      :winh="320"
      :winw="500"
      v-zindex
    >
      <div class="content h-100 margin-auto rtl">
        <div class="flex-column h-100" v-if="!restoreStatus">
          <div class="flex-g-1 flex-column ">
            <div class="warning flex-g-1 padd-24 rtl">
              {{ $t("restorBackup.title") }}
              <p>
                {{ $t("restorBackup.warning") }}
              </p>
              <p>
                {{ $t("restorBackup.setDefulte") }}
              </p>
            </div>
            <!-- @TODO הכפתור צריך להיות באותה שורה עם האינפוט -->
            <div class="border-t-light flex flex-align-center padd-6 padd-l-12">
              <p>{{ $t("restorBackup.fileBackup") }}</p>
              <BaseInput
                class="flex-g-1"
                :disabled="true"
                :text="
                  fileToRestore
                    ? fileToRestore.path + '\\' + fileToRestore.name
                    : $t('restorBackup.notFindBackupFind')
                "
              />
              <div class="btn btn-row-item" @click="browseForFileToRestore">
                {{ $t("restorBackup.uploadOtherFile") }}
              </div>
            </div>
            <div v-if="fileToRestore" class="date">
              {{ $t("restorBackup.createInDate") }}
              {{ new Date(fileToRestore.time).toLocaleString() }}
            </div>
          </div>

          <div
            class=" border-t-light padd-12 flex justify-center flex-align-center bg-gray-3 "
          >
            <div
              class="btn"
              :class="{ btnDisable: !fileToRestore }"
              @click="doRestore"
            >
              {{ $t("restorBackup.restorData") }}
            </div>
            <!-- <baseButton :class="{ btnDisable: !fileToRestore }" @click="doRestore"
          >שחזר נתונים</baseButton
        > -->
            <baseButton @click="$emit('close')">{{
              $t("general.cancel")
            }}</baseButton>
          </div>
        </div>
        <div v-else-if="restoreStatus === 'running'">
          {{ $t("restorBackup.restorFromFile") }} "{{ fileToRestore.name }}"
          <p v-html="restoreMsg"></p>
          <div style="margin: auto;">
            <p class="small-spinner">
              <spinnerCircle />
            </p>
          </div>
        </div>
        <div v-else-if="restoreStatus === 'finished'">
          {{ $t("restorBackup.succeedFinshedRestore") }}
          <BaseButton @click="relodeSystem">{{
            $t("restorBackup.reloadSoftwear")
          }}</BaseButton>
        </div>
      </div>
    </BaseCleanPopup>
  </div>
</template>

<script>
import backupService from "@/services/offline/backup.js";
import * as advLocalStorage from "localforage";
export default {
  props: ["backupLocation", "lastBackupFile"],
  data() {
    return {
      restoreStatus: false,
      restoreMsg: "",
      showFileExplore: false,
      resolveLocationSelected: null,
      fileToRestore: null,
    };
  },
  created() {
    this.restoreStatus = false;
    this.updateFileToRestor();
  },
  sockets: {
    connect: function() {},
    restoreFinished: function(res) {
      this.restoreFinished();
    },
    restoreProgress(status) {
      if (status == 100) return this.restoreFinished();
      this.restoreMsg = this.restoreStatusMsg(status);
    },
  },
  methods: {
    restoreFinished() {
      this.restoreMsg = "";
      this.restoreStatus = "finished";
    },
    doRestore() {
      if (!this.fileToRestore) return;
      this.restoreMsg = "";
      this.restoreStatus = "running";
      this.$socket.client.emit("startRestroe", this.fileToRestore.path);
    },
    restoreStatusMsg(statusCode) {
      if (statusCode === 404)
        return this.$t("restorBackup.failedRestoreNotFindFile");
      else if (statusCode === 500) return this.$t("restorBackup.failRestore");
      else if (statusCode === 501) return this.$t("restorBackup.failRestore");
      else if (statusCode === 502) return this.$t("restorBackup.failRestore");
      else if (statusCode === 503) return this.$t("restorBackup.failRestore");
      else if (statusCode === 1) return this.$t("restorBackup.checkBackupFile");
      else if (statusCode === 2) return this.$t("restorBackup.restorDB");
      else if (statusCode > 2 && statusCode < 3) {
        let sub = String(statusCode).match(/^2\.(\d+)$/)[1];
        return this.$t("restorBackup.restorDB") + " " + sub;
      } else if (statusCode === 3)
        return this.$t("restorBackup.restoreUserFile");
      else if (statusCode > 3 && statusCode < 4) {
        let sub = String(statusCode).match(/^3\.(\d+)$/)[1];
        return (
          this.$t("restorBackup.restoreUserFile") +
          "<br>" +
          this.$t("restorBackup.sumRestorinfFiles").replace("$1", sub)
        );
      }
    },
    updateFileToRestor() {
      if (this.lastBackupFile) {
        backupService
          .getFileDetails(this.backupLocation + "\\" + this.lastBackupFile.name)
          .then((file) => {
            this.fileToRestore = file;
          })
          .catch(() => {
            this.fileToRestore = null;
          });
      } else this.fileToRestore = null;
    },
    closeExplorer() {
      this.showFileExplore = false;
    },
    locationSelected(location) {
      this.closeExplorer();
      if (this.resolveLocationSelected) this.resolveLocationSelected(location);
    },
    async browseForFileToRestore() {
      this.showFileExplore = true;
      let location = await new Promise((resolve, reject) => {
        this.resolveLocationSelected = resolve;
      });
      backupService
        .getFileDetails(location)
        .then((file) => {
          this.fileToRestore = file;
        })
        .catch(() => {
          this.fileToRestore = null;
        });
    },

    async relodeSystem() {
      //reset all localstorages
      localStorage.clear();
      await advLocalStorage.clear();
      if (globalThis.ELECTRON_ENV) globalThis.RELOAD_APP();
      else location.reload();
    },
  },
  watch: {
    lastBackupFile: function() {
      this.updateFileToRestor();
    },
    // fileToRestore: function() {},
  },
};
</script>

<style lang="scss" scoped>
.date {
  padding: 0 20px 3px;
  color: #707070;
}
</style>
