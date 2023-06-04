<template>
  <div class="main-setting-menu main-network-menu">
    <HeaderMenu
      :title="$t('networkComputer.itemMenu')"
      :routeBackName="routeBackName"
    />
    <div v-if="connected">
      <div class="title-menu bold">
        <BaseIcon
          class="icon-header mrg-l-6"
          width="24"
          height="24"
          nameIcon="network-computer"
          pathIcon="icons"
        />
        {{ $t("networkComputer.titleMenu") }} : {{ max }}<br />
        {{ $t("networkComputer.titleMenuMef") }} : {{ maxMef }}
      </div>

      <div class="header-content dir-rtl rtl">
        <div class="name">{{ $t("networkComputer.nameComputer") }}</div>
        <!-- <div class="time">{{ $t("networkComputer.connect") }}</div> -->
        <div></div>
      </div>
      <div class="content">
        <div class="item-comp-net" v-for="client in clients" :key="client.id">
          <span class="name">
            {{ client.address }}
          </span>
          <!-- <span class="time">
            2:45:09
          </span> -->
          <div
            class="btn btn-small"
            @click="disconnectStation(client.id, false)"
          >
            נתק
          </div>
          <div
            v-if="client.mef"
            class="btn btn-small"
            @click="disconnectStation(client.id, true)"
          >
            נתק את מ"ה
          </div>
        </div>
      </div>
    </div>
    <div v-else class="enter-pass">
      <h1 class="title-color mrg-b-0">{{ $t("general.enterPassword") }}</h1>
      <input type="password" class="input-border" v-model="psw" v-focus />

      <div class="btn" style="margin:10px 0px" @click="checkPassword">
        {{ $t("general.confirm") }}
      </div>
      <div v-if="err" class="color-red">{{ $t("general.errorPassword") }}</div>
    </div>
  </div>
</template>

<script>
import mixnet from "@/mixing/mixNet";
import { Axios } from "@/services/_axios";
import enc from "@/utils/simpleEnc";
import { getAppInfo } from "@/services/offline/license.js";

export default {
  mixins: [mixnet],
  data() {
    return {
      routeBackName: "main",
      connected: false,
      err: false,
      timer: null,
      max: 0,
      maxMef: 0,
    };
  },
  methods: {
    async checkPassword() {
      let codePsw = this.psw;
      codePsw = enc.crypt(enc.salt, codePsw);
      let result = await Axios.post("/api/network/check-psw", {
        psw: codePsw,
      });
      if (result.data) {
        this.connected = true;
        this.getClients();
      } else {
        this.err = true;
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.err = false;
        }, 6000);
      }
    },
  },
  async created() {
    try {
      const data = await getAppInfo();

      this.max = data.Stations;
      this.maxMef = data.MefStation;
    } catch (ex) {
      console.error(ex);
    }
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
.title-menu {
  margin-top: 16px;
  padding: 0 20px 0 25px;
  margin-bottom: 20px;
  display: flex;
  color: var(--custom-color1);
  align-items: center;
}
.item-comp-net {
  padding: 10px 20px;
  min-height: 47px;
  height: auto;
  border-bottom: 1px solid rgba(158, 158, 158, 0.267);
  align-items: center;
  display: flex;
  .btn {
    margin-right: auto;
  }
  &:hover {
    background-color: rgb(242, 241, 241);
    // cursor: pointer;
  }
}
.header-content {
  padding: 0 20px;
  font-size: 12px;
  font-weight: bold;
  border-bottom: 1px solid rgba(184, 184, 184, 0.267);
  display: flex;
  color: rgb(177, 177, 177);
  & > div {
    flex-grow: 1;
  }
}
.name {
  max-width: 150px;
  width: 150px;
}
.time {
  color: rgb(177, 177, 177);
  padding-right: 15px;
}
.enter-pass {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 50px 0;
}
</style>
