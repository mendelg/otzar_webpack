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

          <div>🖨 {{ $t("bookPrint.printBackground") }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from "../BaseComponents/BaseButton.vue";
export default {
  data() {
    return {
      show: false,
      showWin: true,
    };
  },

  watch: {},
  components: { BaseButton },

  methods: {
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
  padding: 10px 10px 10px 10px;
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
