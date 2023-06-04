<template>
  <div
    z-index
    v-if="visible"
    class="popup-msg"
    :class="{ fproperties: showslot('folder-properties') }"
  >
    <div class="close-popup-outer">
      <!-- <baseIcon class="close-popup" nameIcon="x-popup" @click="toggleVisible" /> -->
      <div
        class="icon-del icon-close icon-circle otz-icon"
        @click="toggleVisible"
      >
        F
      </div>
    </div>
    <slot v-if="showslot('add-tsiyun')" name="content"></slot>
    <slot v-if="showslot('folder-properties')" name="folder-properties"></slot>
    <slot v-if="showslot('add-quick')" name="add-quick"></slot>
    <slot v-if="showslot('add-quick-books')" name="add-quick-books"></slot>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  computed: {
    ...mapState("popupOnceComp", ["visible", "show"]),
  },
  methods: {
    ...mapActions("popupOnceComp", [
      "setVisible",
      "setInvisible",
      "toggleVisible",
    ]),
    showslot(txt) {
      return this.show == txt;
    },
  },
  watch: {
    close: function(val, oldVal) {
      this.scrollToPage(val);
    },
  },
};
</script>

<style lang="scss" scoped>
$bg-color1: #fff;
@keyframes transTop {
  0% {
    top: 0;
  }

  100% {
    top: 5px;
  }
}

.popup-msg {
  width: 440px;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 6;
  // animation: transTop 9s ease-out infinite normal;
  animation: transTop ease 0.3s;
  box-shadow: 2px 4px 6px 1px rgb(0 0 0 / 40%);
  position: absolute;
  background-color: $bg-color1;
  // transition: 3s;
  &.fproperties {
    border: 1px solid #00000059;
    width: 340px;
    height: 300px;
    left: 50%;
    top: 50%;
    // z-index: 999999999;
    transform: translateX(-50%) translateY(-50%);
    .close-popup-outer .icon-del {
      font-size: 11px;
      width: 56px;
      height: 56px;
      line-height: 56px;
      position: absolute;
      left: 0;
      top: 0;
      transform: translate(0);
      border-radius: 0;
      &::before {
        display: none;
      }
    }
  }
}
.close-popup-outer {
  position: absolute;
  top: 0;
  left: 0;
}
.close-popup-outer .icon-del {
  top: 0;
  left: 0;
  font-size: 8px;
  z-index: 999;
}
</style>
