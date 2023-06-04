<template>
  <div class="notification-bar font" :class="notificationTypeClass">
    <BaseIcon
      class="icon x-close"
      width="8"
      height="8"
      nameIcon="x-window-books"
      pathIcon="icons-book"
      @click="close"
    />

    <BaseIcon
      class="icon-header"
      width="19"
      height="19"
      :nameIcon="nameIcon"
      pathIcon="icons-ganeral"
    />
    <!-- <BaseIcon
      v-if="type == 'notAllowed'"
      class="icon-header"
      width="19"
      height="19"
      nameIcon="not-allowed"
      pathIcon="icons-ganeral"
    /> -->
    <progressBar v-if="grid == 'progress'" :time="time" :auto="autoProg" />
    <bounce-loader
      :loading="loading"
      :color="color"
      :size="size"
      v-if="notification.await"
    ></bounce-loader>

    <p v-html="notification.message"></p>
  </div>
</template>

<script>
import BounceLoader from "vue-spinner/src/BounceLoader.vue";
export default {
  components: {
    BounceLoader,
  },
  props: {
    notification: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      timeout: null,
      interval: null,
      percent: 0,
      stopAnimation: false,
      autoProg: true,

      loading: true,
      color: "var(--custom-color1)",
      size: "50px",
    };
  },

  computed: {
    notificationTypeClass() {
      let a = "top";
      if (this.notification.setting) {
        a = this.notification.setting.position;
      }
      return `notifi-${this.notification.type} notifi-${a} notifi-${this.grid}`;
    },
    grid() {
      if (this.notification.await) {
        return "await";
      }
      if (this.notification.setting) {
        return this.notification.setting.grid;
      }

      return "simple";
    },
    nameIcon() {
      if (this.notification.setting) return this.notification.setting.nameIcon;
      if (this.notification.type == "error") {
        return "not-allowed";
      }
      if (this.notification.type == "success") {
        return "icon-success";
      }
      if (this.notification.type == "warning") {
        return "icon-warning";
      }
      return "";
    },
    time() {
      if (this.notification.timeout) {
        return this.notification.timeout;
      }
      return 4000;
    },
  },
  methods: {
    close() {
      this.$removeNotify(this.notification);
    },
  },
};
</script>

<style lang="scss">
$bg-color1: #fff;
.icon-header {
  fill: var(--custom-color1);
  stroke: var(--custom-color1);
}
.notification-bar {
  position: relative;
  height: 97px;
  width: 440px;
  top: 10px;
  background-color: $bg-color1;
  line-height: 40px;
  padding: 19px 42px;
  /* border-radius: 11px; */
  // margin: 15px 0;
  direction: rtl;
  text-align: right;
  box-shadow: 2px 2px 8px #000000c4;
  &.notifi-simple {
    height: 77px;
  }
  &.notifi-await {
    height: 130px;
  }
  .icon-header {
    margin: 0 auto;
    height: 20px;
    width: fit-content;
    svg {
      stroke: var(--custom-color1);
      #fill {
        fill: var(--custom-color1);
      }
    }
  }
}
.notification-bar p {
  margin: 5px 0;
  color: #7b7b7b;
  font-size: 13px;
  line-height: 18px;
  text-align: center;
}
.notifi-error {
  /* background-color: #ff000029; */
}
.notifi-success {
  /* background-color: #0372a729; */
}
.notifi-warning {
  /* background-color: #dedb0033; */
}
.notification-bar .x-close {
  position: absolute;
  top: 2px;
  left: 2px;
  height: 19px;
  width: 18px;
  transition: 0.3s;
  border-radius: 3px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.14);
  }

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>
