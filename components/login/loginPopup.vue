<template>
  <div>
    <BaseCleanPopup
      v-body
      :h="37"
      :winh="winh"
      :winw="410"
      @close="hideLogin"
      :closeBtn="mode != 10"
      :reCenter="winh"
    >
      <template v-slot:header>
        <span class="flex flex-align-center h-100">
          <div v-if="mode == loginModes.LOGIN">
            <span
              :class="[
                'login-tab',
                { active: $store.state.user.loginTab == 1 },
              ]"
              @click="showTab(1)"
              >{{ $t("login.existUser") }}</span
            >
            <span> | </span>
            <span
              :class="[
                'login-tab',
                { active: $store.state.user.loginTab == 2 },
              ]"
              @click="showTab(2)"
              >{{ $t("login.newUser") }}</span
            >
          </div>
          <span v-else>{{ $t("login.login2") }}</span>
        </span>
      </template>
      <div class="flex-column h-100">
        <div id="login" class="container" v-if="mode == loginModes.LOGIN">
          <template v-if="$store.state.user.loginTab == 1">
            <div class="error-msg">{{ errorMsg }}</div>
            <input
              :placeholder="$t('login.user')"
              class="input-border"
              type="text"
              name="username"
              v-model="input.username"
              @input="errorMsg = ''"
              @keydown.enter="logUser"
            />

            <input
              :placeholder="$t('login.password')"
              class="input-border"
              type="password"
              name="password"
              @input="errorMsg = ''"
              v-model="input.password"
              @keydown.enter="logUser"
            />
            <div class="links-container">
              <div
                class="forgot-pass"
                @click="$store.state.user.loginTab = 2"
                style="text-align:right"
              >
                {{ $t("login.createAccount") }}
              </div>
              <div class="forgot-pass" @click="doForgotPassword">
                {{ $t("login.forgotPassword") }}
              </div>
            </div>
            <button class="btn-border" type="button" v-on:click="logUser()">
              {{ $t("login.login") }}
            </button>
          </template>
          <template v-else>
            <div class="error-msg">{{ errorMsg }}</div>

            <div class="input-container mandatory">
              <input
                :placeholder="$t('login.name')"
                class="input-border"
                type="text"
                name="firstname"
                @input="errorMsg = ''"
                v-model="input.firstname"
              />
            </div>

            <div class="input-container mandatory">
              <input
                :placeholder="$t('login.lastName')"
                class="input-border"
                type="text"
                name="lastname"
                @input="errorMsg = ''"
                v-model="input.lastname"
              />
            </div>
            <div class="input-container mandatory">
              <input
                :placeholder="$t('login.email')"
                class="input-border"
                type="email"
                name="email"
                @input="errorMsg = ''"
                v-model="input.email"
              />
            </div>

            <input
              :placeholder="$t('login.address')"
              class="input-border"
              type="address"
              name="address"
              @input="errorMsg = ''"
              v-model="input.address"
            />
            <input
              :placeholder="$t('login.city')"
              class="input-border"
              type="city"
              name="city"
              @input="errorMsg = ''"
              v-model="input.city"
            />
            <input
              :placeholder="$t('login.zipCode')"
              class="input-border"
              type="text"
              name="zipCode"
              @input="errorMsg = ''"
              v-model="input.zipCode"
            />

            <div class="input-border">
              <vue-country-dropdown
                @onSelect="onSelect"
                :preferredCountries="['IL', 'US', 'CA', 'GB']"
                :disabledFetchingCountry="true"
                :immediateCallSelectEvent="true"
                :enabledFlags="false"
                :enabledCountryCode="false"
                :showNameInput="true"
                :dropdownOptions="{ disabledDialCode: true }"
              >
              </vue-country-dropdown>
            </div>
            <input
              :placeholder="$t('login.phone')"
              class="input-border"
              type="text"
              name="phone"
              @input="errorMsg = ''"
              v-model="input.phone"
            />
            <input
              :placeholder="$t('login.cellPhone')"
              class="input-border"
              type="text"
              name="Mobile"
              @input="errorMsg = ''"
              v-model="input.Mobile"
            />
            <div class="input-container mandatory">
              <input
                :placeholder="$t('login.user')"
                class="input-border "
                type="text"
                name="username"
                v-model="input.username"
                @input="errorMsg = ''"
                autocomplete="nope"
              />
            </div>
            <div class="input-container mandatory">
              <input
                :placeholder="$t('login.password')"
                class="input-border"
                type="password"
                name="password"
                @input="errorMsg = ''"
                v-model="input.password"
                autocomplete="nope"
              />
            </div>
            <div class="input-container mandatory">
              <input
                :placeholder="$t('login.passwordValidation')"
                class="input-border"
                type="password"
                name="passwordagain"
                @input="errorMsg = ''"
                v-model="input.passwordagain"
                autocomplete="nope"
              />
            </div>

            <span
              style="padding-top:10px;width: 273px;margin: 0 auto;display: block;margin-bottom: 6px;"
            >
              {{ $t("login.permission") }}</span
            >

            <!--  <vue-recaptcha sitekey="dfewgfwa"></vue-recaptcha> -->

            <button class="btn-border" type="button" v-on:click="register">
              {{ $t("login.register") }}
            </button>
          </template>
        </div>

        <template
          v-if="
            mode == loginModes.STATIONS_FULL || mode == loginModes.SWITCHAPPS
          "
        >
          <div class="error-msg-mode2" v-if="getPendingUserName != ''">
            {{ `${$t("login.user")}: ${getPendingUserName}` }}
          </div>
          <div
            :class="{ 'only-message': mode == loginModes.SWITCHAPPS }"
            style="font-weight:500;color:red"
            class="error-msg-mode2"
          >
            {{ errorMsg }}
          </div>
          <div class="flex">
            <button
              v-if="mode != loginModes.SWITCHAPPS"
              class="btn-border"
              type="button"
              v-on:click="hideLogin()"
            >
              {{ $t("login.connectAsVisitor") }}
            </button>
            <button
              v-if="mode != loginModes.SWITCHAPPS"
              class="btn-border"
              style="width:auto"
              type="button"
              v-on:click="$store.state.user.showLoginMode = loginModes.LOGIN"
            >
              {{ $t("myProfile.connectAsUser") }}
            </button>
          </div>
        </template>
        <template
          v-if="
            mode == loginModes.DISCONNECT_NO_USE ||
              mode == loginModes.DISCONNECT_SINGLE
          "
        >
          <div class="title" v-if="getPendingUserName != ''">
            {{ `${$t("login.user")}: ${getPendingUserName}` }}
          </div>
          <div
            :class="{ 'only-message': mode == loginModes.DISCONNECT_SINGLE }"
            class="error-msg-mode2"
          >
            {{ errorMsg }}
          </div>
          <button
            v-if="mode != loginModes.DISCONNECT_SINGLE"
            class="btn-border"
            type="button"
            @click="
              loginOnline();
              hideLogin();
            "
          >
            {{ $t("softwareNotUsed.connectAgain") }}
          </button>
        </template>
        <template v-if="mode == loginModes.APP_CHOOSE">
          <div
            style="padding-top:10px"
            class="title"
            v-if="getPendingUserName != ''"
          >
            {{ `${$t("login.user")}: ${getPendingUserName}` }}
          </div>
          <!--  <div class="error-msg-mode2">{{ errorMsg }}</div> -->

          <div class="error-msg-mode2" style="padding-top:10px">
            {{ $t("login.selectApps") }}
          </div>
          <div class="apps-container">
            <div class="flex app-title">
              <baseCheckBox
                :checked="apps == 'both' || apps == 'otzar'"
                @change="setApps"
                size="larg"
                id="otzar"
                :disabled="isOtzarFull"
              />
              <span
                @click="setApps(null, 'otzar')"
                :class="{ disabled: isOtzarFull }"
                >{{ $t("apps.otzar") }}</span
              >
              <span class="full" v-if="isOtzarFull">{{
                $t("login.noFreeStation1")
              }}</span>
            </div>
            <div class="flex app-title">
              <baseCheckBox
                :checked="apps == 'both' || apps == 'mef'"
                @change="setApps"
                size="larg"
                id="mef"
                :disabled="isMefFull"
              />
              <span
                @click="setApps(null, 'mef')"
                :class="{ disabled: isMefFull }"
                >{{ $t("apps.mef") }}</span
              >
              <span class="full" v-if="isMefFull">{{
                $t("login.noFreeStation1")
              }}</span>
            </div>
          </div>

          <button
            :class="{ disabled: apps == '' }"
            class="btn-border"
            type="button"
            @click="
              if (apps != '') {
                loginOnline({
                  apps,
                  loginInfo: {
                    userName: input.username,
                    password: input.password,
                  },
                });
                hideLogin();
              }
            "
          >
            {{ $t("login.enter") }}
          </button>
        </template>
      </div>
    </BaseCleanPopup>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import VueCountryDropdown from "vue-country-dropdown";
import {
  loadAllUserData,
  forgotPassword,
  disconnectUser,
  createPendingUser,
  ENUM_LOGIN_WIN_MODES,
} from "@/services/login.js";
import LoginMix from "@/mixing/login";
// import { VueRecaptcha } from "vue-recaptcha";
export default {
  data() {
    return {
      input: {
        username: "",
        password: "",
        passwordagain: "",
        firstname: "",
        lastname: "",
        address: "",
        phone: "",
        email: "",
        Mobile: "",
        city: "",
        land: "ישראל",
        zipCode: "",
      },
      errorMsg: "",
      show: false,
      timer: null,
      loginModes: ENUM_LOGIN_WIN_MODES,
      apps: "",
      pendingToken: "",
    };
  },
  props: ["mode"],
  mixins: [LoginMix],
  components: { VueCountryDropdown },
  computed: {
    ...mapGetters("user", [
      "getUserName",
      "getPendingUserName",
      "isOtzarFull",
      "isMefFull",
    ]),
    winh() {
      if (this.$store.state.user.loginTab == 2) return 570;
      else return 210;
    },
    emptyPass() {
      if (this.input.password != "") return false;
      return true;
    },
    emptyUser() {
      if (this.input.username != "") return false;
      return true;
    },
  },
  created() {
    this.setMode(this.mode);
  },
  watch: {
    mode: function(oldV, newV) {
      this.setMode(newV);
    },
  },
  methods: {
    ...mapActions("user", ["login"]),
    onSelect(value) {
      console.log(value);
      this.input.land = value.name;
      if (this.input.land.includes("ישראל")) this.input.land = "ישראל";
    },
    async register() {
      if (!this.ValidateEmail(this.input.email)) {
        this.errorMsg = this.$t("login.mailError");
        return;
      }
      if (
        !this.input.username ||
        !this.input.password ||
        !this.input.firstname ||
        !this.input.lastname
      ) {
        this.errorMsg = this.$t("userContactDetails.requiredError");
        return;
      }

      if (this.input.password != this.input.passwordagain) {
        this.errorMsg = this.$t("login.passwordValidationFailed");
        return;
      }

      let result = await createPendingUser({
        info: JSON.stringify({
          ...this.input,
          lang: this.userSettings.settings["language"] || "he",
        }),
      });

      if (!result) this.errorMsg = this.$t("login.registerFailed");

      if (result == "USER_EXISTS") this.errorMsg = this.$t("login.userExists");
      if (result === true) this.errorMsg = this.$t("login.registerFlow");
    },
    showTab(tab) {
      this.errorMsg = "";
      this.$store.state.user.loginTab = tab;
    },
    setApps(e, app) {
      let checked;
      let elId;
      if (app == "otzar" && this.isOtzarFull) return;
      if (app == "mef" && this.isMefFull) return;
      if (app) {
        checked = !document.getElementById(app).checked;
        elId = app;
      } else {
        checked = e.target.checked;
        elId = e.target.id;
      }
      if (checked) {
        this.apps = this.apps == "" ? elId : "both";
      } else {
        this.apps = this.apps == elId ? "" : elId == "otzar" ? "mef" : "otzar";
      }
    },
    setMode(mode) {
      switch (mode) {
        case this.loginModes.STATIONS_FULL:
        case this.loginModes.SWITCHAPPS:
          this.errorMsg = this.$t("login.noFreeStation");
          break;
        case this.loginModes.NO_LICENSE:
          this.errorMsg = this.$t("login.noValidLicense");
          break;
        case this.loginModes.DISCONNECT_SINGLE:
          this.errorMsg = this.$t("login.discconctOtherConnection");
          break;
        case this.loginModes.DISCONNECT_NO_USE:
          this.errorMsg = this.$t("softwareNotUsed.disconnectMsg");
      }
    },
    ValidateEmail(mail) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return true;
      }

      return false;
    },
    /*     refuseLoginRequest() {
      clearTimeout(this.timer);
      this.$socket.client.emit("refuseRequest");
      this.$emit("closelogin");
    }, */
    async doForgotPassword() {
      if (!this.input.username) {
        this.errorMsg = this.$t("login.enterUserName1");
        return;
      }
      let res = await forgotPassword({ userName: this.input.username });
      if (res) {
        switch (res) {
          case "NO_MAIL":
            this.errorMsg = this.$t("login.noMail");
            break;
          case "NO_USER":
            this.errorMsg = this.$t("login.noUser");
            break;
          case true:
            this.errorMsg = this.$t("login.sentPasswordMail");
            break;
        }
      } else this.errorMsg = this.$t("login.errorRestorePass");
    },
    hideLogin() {
      this.$store.state.user.showLogin = false;
    },
    logUser() {
      if (!this.input.username || !this.input.password) {
        this.errorMsg = this.$t("login.enterAll");
        return;
      }
      this.errorMsg = "מתחבר...";
      this.login({
        username: this.input.username,
        password: this.input.password,
      })
        .then((user) => {
          if (!user.userData.connectionInfo?.full) {
            if (
              user.userData.connectionInfo?.type == "both" &&
              user.userData.connectionInfo?.chooseApps
            ) {
              this.pendingToken = user.token;
              this.$store.state.user.showLoginMode =
                ENUM_LOGIN_WIN_MODES.APP_CHOOSE;
              this.$store.state.user.showLogin = true;
            } else {
              this.$emit("closelogin");
              loadAllUserData();
            }
          } else {
            this.setMode(this.loginModes.STATIONS_FULL);
          }
        })
        .catch((error) => {
          let errorM = error.response
            ? error.response.statusText
              ? error.response.statusText
              : error.response.data
            : error;

          this.errorMsg =
            errorM == "Unauthorized"
              ? this.$t("login.invalidContactInfo")
              : errorM == "Forbidden"
              ? this.$t("login.noFreeStation")
              : this.$t("login.errorLogging") + errorM;
          //console.error(error);
        });
    },
    /*  showWelcome() {
      this.$store.dispatch("welcome/visible");
    },
    getFile() {},
    login() {
      alert("login");
    },
    logout() {
      alert("logout");
    }, */
  },
};
</script>

<style lang="scss" scoped>
.links-container {
  width: 273px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}
.input-container {
  position: relative;
  width: fit-content;
  margin: 0 auto;
}
.input-container.mandatory::after {
  content: "*";
  color: #e52530;
  position: absolute;
  left: 10px;
  top: 5px;
  font-weight: bold;
}
.login-tab {
  color: grey;
  cursor: pointer;
  &.active {
    color: black;
  }
}
.forgot-pass {
  width: 273px;
  margin: 0 auto;
  text-align: left;
  cursor: pointer;
  &:hover {
    font-weight: 600px;
  }
}
.container {
  padding-top: 15px;
}
.error-msg {
  color: red;
  font-size: 14px;
  margin: 0 auto;
  /* width: 100%; */
  text-align: center;
  height: auto;
  margin-bottom: 6px;
  width: 90%;
}
.error-msg-mode2 {
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 16px;
  margin: 0 auto;
  /* width: 100%; */
  text-align: center;
  height: 14px;
  margin-bottom: 6px;
}
.title {
  padding-top: 20px;

  font-size: 16px;
  margin: 0 auto;
  /* width: 100%; */
  text-align: center;
  height: 14px;
  margin-bottom: 6px;
}
.inputs-border {
  padding: 12px;
  padding-top: 15px;
}
.input-border {
  width: 273px;
  margin: 0 auto;
  display: block;
  margin-bottom: 6px;
}
.header-login-container {
  margin-left: 43px;
  padding: 5px 0;
  direction: rtl;
  margin-right: auto;
  .header-login-inner {
    display: flex;
    .text {
      text-align: left;
      font-size: 10px;
      color: #636363;
      line-height: 13px;
    }
    .icon-login {
      margin-right: 5px;
      height: 25px;
      width: 25px;
      text-align: center;
      line-height: 23px;
      border-radius: 50%;
      background-color: #e5e5e5;
      border: 1px solid #d8d8d8;
      font-size: 11px;
    }
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
.app-title {
  padding-top: 5x;
  font-size: 15px;
  .disabled {
    color: gray;
  }
  cursor: pointer;
}
.apps-container {
  padding-top: 0px;
  padding-right: 15px;
}
.full {
  color: red;
  padding-right: 10px;
  font-size: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.only-message {
  font-weight: 500;
  color: red;
  margin: auto;
  padding: 0;
  height: auto;
}
</style>
<style>
.vue-country-select {
  width: 100% !important;
  border: none !important;
  text-align: right !important;
}
.vue-country-select:focus-within {
  box-shadow: none !important;
  border-color: white !important;
}
.vue-country-select .dropdown-list {
  width: auto !important;
  /*     .open {
      background-color: white !important;
    } */
}
.vue-country-select .dropdown {
  padding: 0 !important;
}
.vue-country-select .dropdown .open {
  background-color: white !important;
}
.vue-country-select .country-name {
  font-size: 13px !important;
  margin-right: 0px !important;
}
</style>
