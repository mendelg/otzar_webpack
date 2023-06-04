<template>
  <div>
    <div
      v-zindex.fixed
      class="down-left fade-in-left "
      :class="{ 'close-outer': !showWin }"
    >
      <div v-if="!showWin" class="close otz-icon" @click="open">7</div>

      <div v-if="showWin">
        <div class="content">
          <div class="close otz-icon" @click="close">2</div>

          <div>
            <div v-if="getStage == ENUM_UPDATES_STAGES.UPDATES_AVAILABE">
              <p>
                {{ $t("updates.updatesAvailable").replace("%VER%", getVersion)
                }}<span
                  class="btn   btn-small  mrg-t-12"
                  @click="openInfo"
                  v-tooltip="{ content: this.$t('updates.whatsNew') }"
                  style="padding: 0 5px;margin-right:5px;"
                >
                  ?
                </span>
              </p>
              <div v-if="getExternalNotConnected">
                {{ $t("updates.externalDriveWarning") }}
              </div>
              <div class="flex-column btns-container full-width">
                <div class="flex-column" v-if="getMultiDisk">
                  {{ $t("updates.multiDisksFound") }}

                  <div
                    class="btn   btn-small mrg-right mrg-t-12"
                    :class="{ disable: btnDisabled }"
                    @click="updateNow(false)"
                  >
                    {{ $t("updates.downloadNowCurrentDisk") }}
                  </div>
                  <div
                    class="btn   btn-small mrg-right mrg-t-12"
                    :class="{ disable: btnDisabled }"
                    @click="updateNow(true)"
                  >
                    {{ $t("updates.downloadNowAllDisks") }}
                  </div>
                </div>
                <div class="flex" v-else>
                  <div
                    class="btn   btn-small mrg-right mrg-t-12"
                    :class="{ disable: btnDisabled }"
                    @click="updateNow"
                  >
                    {{ $t("updates.downloadNow") }}
                  </div>
                </div>
                <div
                  class="btn   btn-small mrg-right mrg-t-12"
                  :class="{ disable: btnDisabled }"
                  @click="notNow"
                >
                  {{ $t("updates.noDownloadNow") }}
                </div>
              </div>
            </div>
            <div v-if="getStage == ENUM_UPDATES_STAGES.READY">
              <div>{{ $t("updates.restartMsg") }}</div>
              <div class="flex">
                <div
                  class="btn   btn-small mrg-right mrg-t-12"
                  @click="restartApp"
                >
                  {{ $t("updates.restart") }}
                </div>
                <div class="btn   btn-small mrg-right mrg-t-12" @click="notNow">
                  {{ $t("updates.restartLater") }}
                </div>
              </div>
            </div>
            <div v-if="getStage == ENUM_UPDATES_STAGES.ERROR">
              <div>{{ $t("updates.errorMsg") }}</div>

              <div
                class="btn   btn-small mrg-right mrg-t-12"
                @click="openErrorLog"
              >
                {{ $t("support.openLogFile") }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import BaseButton from "../BaseComponents/BaseButton.vue";
import appUpdates from "@/mixing/appUpdates.js";
import menuService from "@/services/menu";
export default {
  data() {
    return {
      running: false,
      showWin: true,

      show: true,
      stopAnimation: false,
    };
  },
  mixins: [appUpdates],
  watch: {},
  components: { BaseButton },
  computed: {
    ...mapState("updatesCenter", ["ENUM_UPDATES_STAGES"]),
    ...mapGetters("updatesCenter", [
      "getPercentage",
      "getStage",
      "getVersion",
      "getExternalNotConnected",
      "getMultiDisk",
    ]),
    btnDisabled() {
      return false;
      return !this.enabled || this.running;
    },
    message() {
      let msg = "";

      switch (this.getStatus) {
        case "preparing":
          msg = this.$t("actionSoftware.preparListBook");
          break;
        case "ready":
          msg = this.$t("actionSoftware.finshedPreparedListBookClickForRefres");
          break;
        case "finished":
          msg = this.$t("actionSoftware.finishRefreshListBook");
          break;
        case "error":
          msg = "שגיאה, רענן שוב";
          break;
        default:
          msg = "";
      }
      return msg;
    },
    enabled() {
      return this.getStatus === "ready";
    },
  },
  methods: {
    ...mapActions("updatesCenter", ["setStage", "setPercentage"]),
    openInfo() {
      menuService.openAppUpdatesMenu();
    },
    close() {
      this.showWin = false;
    },
    open() {
      this.showWin = true;
    },
  },
};
</script>

<style scoped lang="scss">
.btns-container {
  width: 150px;
}
.text {
  font-size: 14px;
  font-weight: 500;
}
.down-left {
  margin-top: 10px;
  z-index: 9;

  background-color: #fff;
  box-shadow: 2px 3px 7px #000000a3;
  padding: 0px 20px 15px;
  top: auto !important;
  width: 270px;
  &.close-outer {
    width: 30px;
    padding: 0;
    border-radius: 0 12px 12px 0;
    left: 0;
    transition: 0.3s;

    .close {
      position: static;
      // left: 0;
    }
    &:hover {
      box-shadow: 2px 3px 7px #000000b7;
      width: 34px;
      transition: 0.3s;
    }
  }
  .text {
    padding-top: 10px;
  }
}
.close {
  position: absolute;
  left: 0;
}
.disable {
  cursor: default;
  opacity: 0.4;
}
.full-width {
  width: 100%;
}
</style>
