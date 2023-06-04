<template>
  <div class="license-error-container font">
    <Menu
      v-if="appMode.offline() && $store.state.menu.show"
      v-zindex.fixed
      :arrow="false"
    />
    <div v-if="appMode.offline()" class="go-lic" @click="goToLic">
      <baseIcon pathIcon="icons" nameIcon="support" />
    </div>
    <div class="license-error-inner">
      <h1>{{ $t("errors.errorMsg") }}</h1>
      <h2>{{ $t("errors.errorMsg2") }}</h2>

      <div class="error-desc">
        <span class="bold"> {{ $route.params.err || "" }}</span>
      </div>
      <div class="error-code">
        {{ $t("errors.code") }}: &nbsp;

        <span class="bold">
          {{ $route.params.code || $route.params.err || 0 }}</span
        >
      </div>
      <button
        v-if="appMode.online()"
        class="btn-border"
        type="button"
        v-on:click="reload()"
      >
        {{ $t("errors.reloadPage") }}
      </button>
      <div class="contact">
        <span>{{ $t("errors.contactSupport") }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import menuService from "@/services/menu";
import Menu from "@/components/popupMenu/MainMenu.vue";
import { getAppInfo } from "@/services/offline/license.js";
export default {
  components: {
    Menu,
  },
  methods: {
    goToLic() {
      this.$store.dispatch("menu/openMenu");
      menuService.openLicenceCodeMenu();
    },
    reload() {
      location = "/";
    },
  },
  created() {
    if (this.$route.params.code) {
      //start timer to check every 3 secs
      setInterval(async () => {
        let x = await getAppInfo();
        if (x.otzarVer && x.LicType != 3) {
          if (globalThis.ELECTRON_ENV) globalThis.RELOAD_APP();
          else location.reload();
        }
      }, 10000);
    }
  },
};
</script>
<style lang="scss" scoped>
.btn-border {
  width: 180px;
}
.go-lic {
  position: absolute;
  left: 0;
  /* top: 5px; */
  background-color: var(--custom-color3);
  padding: 15px 20px;
  border-radius: 0 50px 50px 0;
  width: 90px;
  border: 1px solid var(--custom-color1);
  transition: 0.3s;
  &:hover {
    width: 93px;
    box-shadow: 1px 2px 6px rgb(0 0 0 / 31%);
  }
  svg {
  }
}
.license-error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-color: #f7f7f7;
}
h1 {
  margin: 0;
  font-size: 35px;
  font-weight: bolder;
}
h2 {
  font-size: 35px;
  margin-top: 17px;
  font-weight: normal;
}
.error-desc {
  color: var(--custom-color1);

  display: flex;
  align-items: center;
  width: fit-content;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin: 0 auto 50px auto;
  font-size: 20px;
}
.error-code {
  color: var(--custom-color1);
  border-top: 1px solid;
  border-bottom: 1px solid;
  display: flex;
  align-items: center;
  width: fit-content;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin: 0 auto 50px auto;
  font-size: 20px;
}
.contact {
  font-size: 16px;
}
</style>
