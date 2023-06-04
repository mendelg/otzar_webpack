<template>
  <div class="header-login-container" @click="getFile">
    <div class="header-login-inner">
      <!-- <div class="text">
        <div>שלום</div>
        <div>{{ getUserName }}</div>
      </div> -->
      <div style="width: 110px" v-if="appMode.online()">
        <langs-combo style="padding-left:5px" />
      </div>
      <div
        v-if="
          appMode.online() && $store.state.user.bothApps && userType.ipUser()
        "
      >
        <apps-combo style="padding-left:5px" />
      </div>
      <div v-if="appMode.offline() && $store.state.mefo.connected" class="">
        <div class="btn btn-small" @click="disconnectMe()">
          נתק חיבור מ"ה
        </div>
      </div>
      <span
        class="msg"
        v-if="appMode.online() && getSubUserData.subUserId != 0 && !showLogin"
        >{{ $t("login.subUserConnected") }}
        {{ getSubUserData.subUserName || "" }}</span
      >
      <div
        v-if="appMode.offline()"
        class="icon-login profile_icon"
        @click="showAbout"
      >
        <span>{{ getIconText }}</span>
      </div>
      <div
        v-if="showUserName"
        :class="['icon-login', 'profile_icon', { free: freeGuest }]"
        @click="freeGuest ? login() : showMyProfile()"
      >
        <span>{{ getIconText }}</span>
      </div>

      <div
        style="fill: var(--custom-color1);"
        v-if="showLogin"
        class="font-icon"
        v-tooltip="{
          content: this.$t('login.login'),
          placement: 'right',
        }"
        @click="login"
      >
        <Icons icon="signin" height="21px" width="21px" />
      </div>
      <baseIcon
        @click="showWelcome"
        class="icon-home"
        nameIcon="icon-home"
        pathIcon="icons"
        width="28.499"
        height="25.48"
      />
      <!-- <div class="icon-item opacity icon-home">o</div> -->
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Icons from "@/components/Icons/Icons.vue";
import menuService from "@/services/menu";
import { Axios } from "@/services/_axios";
import langsCombo from "@/components/langsCombo.vue";
import appsCombo from "@/components/appsCombo.vue";
export default {
  components: { Icons, langsCombo, appsCombo },
  computed: {
    ...mapGetters("user", ["getUserName", "getSubUserData"]),
    freeGuest() {
      return (
        this.userType.guestUser() && globalThis.DEV_CONNECT_USER_TO_FREE_AUTO
      );
    },
    getIconText() {
      if (this.freeGuest) return "V";
      let textIcon;
      let arr = this.getUserName.trim().split(" ");
      arr = arr.filter((a) => a.trim() != "");
      if (arr.length > 1) textIcon = arr[0][0] + arr[1][0];
      else textIcon = arr[0][0] + arr[0][1];
      return textIcon;
    },
    showUserName() {
      return (
        this.appMode.online() &&
        (!this.userType.guestUser() || globalThis.DEV_CONNECT_USER_TO_FREE_AUTO)
      );
    },
    showLogin() {
      return (
        this.userType.guestUser() && !globalThis.DEV_CONNECT_USER_TO_FREE_AUTO
      );
    },
  },
  methods: {
    disconnectMe() {
      Axios.post("/api/network/mef-disconnect-me");
    },
    showWelcome() {
      this.$store.dispatch("welcome/visible");
    },
    getFile() {},
    login() {
      this.$emit("login");
    },
    showMyProfile() {
      this.$store.dispatch("menu/openMenu");
      menuService.OpenMyProfileMenu();
      // }
    },
    showAbout() {
      this.$store.dispatch("menu/openMenu");
      menuService.openAboutAppMenu();
    },
  },
};
</script>

<style lang="scss" scoped>
.msg {
  width: fit-content;
  white-space: nowrap;
  color: var(--text-color1);
  padding-right: 5px;
}
.header-login-container {
  margin-left: 43px;
  padding: 5px 0;
  direction: rtl;
  margin-right: auto;
  .header-login-inner {
    display: flex;
    align-items: center;
    .text {
      text-align: left;
      font-size: 10px;
      color: #636363;
      line-height: 13px;
    }
    .icon-login {
      margin-right: 5px;
      height: 25px;
      min-width: 25px;
      text-align: center;
      line-height: 23px;
      border-radius: 50%;
      background-color: #e5e5e5;
      border: 1px solid #d8d8d8;
      font-size: 11px;
    }
  }
  .profile_icon {
    cursor: pointer;
    &:hover {
      background-color: #0000001f;
    }
  }
  .free {
    cursor: default !important;
  }
  .icon-home {
    top: 0;
    margin-top: 3px;
    color: #fff;
    fill: transparent;
    stroke: var(--custom-color1);
    &:hover {
      fill: var(--custom-color1);
    }
  }
}
</style>
