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
            <div class="text" v-html="message"></div>
            <div
              class="btn   btn-small mrg-right mrg-t-12"
              :class="{ disable: btnDisabled }"
              @click="doReload"
            >
              {{ $t("mainTools.refresh") }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import BaseButton from "../BaseComponents/BaseButton.vue";
import { reloadAllBooksAndInx } from "@/services/bookData";
export default {
  data() {
    return {
      running: false,
      showWin: true,
    };
  },
  watch: {
    getStatus: function() {
      this.showWin = true;
    },
  },
  components: { BaseButton },
  computed: {
    ...mapGetters("bookListRefresh", ["getStatus"]),
    btnDisabled() {
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
    ...mapActions("bookListRefresh", ["setStatus"]),
    doReload() {
      if (!this.enabled) return;
      this.running = true;
      reloadAllBooksAndInx().then(() => {
        this.setStatus("finished");
        this.running = false;
        setTimeout(() => {
          this.setStatus("done");
        }, 1000);
      });
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
.text {
  font-size: 14px;
  font-weight: 500;
}
.down-left {
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
</style>
