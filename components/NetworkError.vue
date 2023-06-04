<template>
  <div class="flex-center main">
    <h2>{{ $t("networkComputer.connectError") }}</h2>
    <button :disabled="disable" class="btn" @click="connect">
      {{ $t("networkComputer.connectAgain") }}
    </button>
  </div>
</template>

<script>
import { Axios } from "@/services/_axios";
export default {
  data() {
    return {
      disable: false,
      timeout: null,
    };
  },
  methods: {
    connect() {
      if (this.disable) return;
      this.disable = true;
      Axios.post("/api/network/net-reconnect");
      this.timeout = setTimeout(() => {
        this.disable = false;
      }, 5000);
    },
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
    this.timeout = null;
  },
};
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
