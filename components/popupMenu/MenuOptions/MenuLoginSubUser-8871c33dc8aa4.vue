<template>
  <div class="contact-main-block w-100 relative" @keydown="keyDownEvent">
    <HeaderMenu :title="title" :routeBackName="routeBackName" />
    <div class="item">
      <div>
        <input
          class="input-border"
          v-model="userName"
          :placeholder="$t('login.enterUserName')"
          @input="errorMessage = ''"
          type="mail"
        />
      </div>
      <div>
        <input
          class="input-border"
          v-model="password"
          :placeholder="$t('login.enterPassword')"
          @input="errorMessage = ''"
          @keydown.enter="loginSubUser"
        />
      </div>
      <div class="flex-column flex-bet">
        <div class="forgot-pass" @click="doForgotPassword">
          {{ $t("login.forgotPassword") }}
        </div>
        <div
          class="btn btn-larg create-btn"
          :class="{ disable: dataNotFilled }"
          @click="loginSubUser"
        >
          {{ $t("login.login") }}
        </div>
      </div>
    </div>
    <span class="text-gray error-msg">{{ errorMessage }}</span>
  </div>
</template>

<script>
import { getSubUser, forgotPassword } from "@/services/login";
import menuService from "@/services/menu";
import { mapActions } from "vuex";
import deskMix from "@/mixing/mixDesktop.js";
import deskLoaderMix from "@/mixing/mixDesktopLoader.js";
export default {
  data() {
    return {
      title: this.$t("login.login2"),
      routeBackName: "savePersonalData",
      userName: "",
      password: "",
      errorMessage: "",
    };
  },
  mixins: [deskMix, deskLoaderMix],
  computed: {
    dataNotFilled() {
      return this.userName.trim() == "" || this.password.trim() == "";
    },
  },
  methods: {
    ...mapActions("user", ["setSubUser"]),

    async doForgotPassword() {
      if (!this.userName) {
        this.errorMessage = this.$t("login.enterUserName");
        return;
      }
      let res = await forgotPassword({ userName: this.userName });
      if (res) {
        switch (res) {
          case "NO_MAIL":
            this.errorMessage = this.$t("login.noMail");
            break;
          case "NO_USER":
            this.errorMessage = this.$t("login.noUser");
            break;
          case true:
            this.errorMessage = this.$t("login.sentPasswordMail");
            break;
        }
      } else this.errorMessage = this.$t("login.errorRestorePass");
    },
    keyDownEvent(e) {
      switch (e.code) {
        case "Tab":
          e.cancelBubble = true;
      }
    },
    async loginSubUser() {
      if (!this.userName.trim() || !this.password.trim()) return;
      let subUser = await getSubUser({
        username: this.userName,
        password: this.password,
      });
      if (!subUser) this.errorMessage = this.$t("login.noUser");
      else {
        menuService.openSavePersonalData();
        this.$notify({
          type: "success",
          message: this.$t("login.successLoginSubUser"),
          timeout: 2000,
        });
        this.setSubUser({
          subUserId: subUser.user.subUserId,
          subUserName: this.userName,
          token: subUser.token,
        });
        this.$store.state.desktop.doneLoadDesks = false;
        this.loadDesks();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$bg-color2: #f7f7f7;
$bg-color5: #f4f4f4;
.error-msg {
  color: red;
  font-size: 14px;
  padding-right: 20px;
}
.item {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.create-btn.disable {
  background-color: gray !important;
}
.input-border {
  margin-bottom: 10px;
}
.colum1 {
  .row {
    margin-bottom: 12px;
  }
}
.contact-main-block {
  // overflow-y: scroll;
  // overflow-x: hidden;
}
.go-to-company-staff-block {
  display: flex;
  margin-top: auto;
  height: 60px;
  background-color: $bg-color5;
  border-top: 1px solid #dedede;
  height: 60px;
  background-color: $bg-color5;
  border: 1px solid #dedede;
  padding: 0 20px;
  position: absolute;
  width: 100%;
  bottom: 0;
  justify-content: space-between;
  p {
    margin: 0;
    line-height: 60px;
    font-weight: bold;
  }
}
.go-to-comp-staff-btn {
  width: auto;
  padding: 0 10px;
  // margin: 3px 0;
  // margin-right: auto;
}
.company-details-block {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .company-location-block {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 30px;
    padding-right: 20px;
    .company-location {
      display: flex;
      flex-direction: column;
      line-height: 0px;
      p {
        margin: 0;
        line-height: 18px;
        font-size: 13px;
      }
    }
    .icon-location {
      display: flex;
      font-size: 100px;
      margin-top: 8px;
      width: 50px;
      opacity: 0.5;
    }
  }
  .company-activity-block {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 30px;
    padding-right: 20px;
    .icon-activity {
      display: flex;
      font-size: 100px;
      margin-top: 8px;
      width: 50px;
      opacity: 0.5;
    }
    .company-activity {
      display: flex;
      flex-direction: column;
      line-height: 0px;
    }
    p {
      margin: 0;
      line-height: 18px;
      font-size: 13px;
    }
  }
  .company-contant-block {
    display: flex;
    justify-content: flex-start;
    padding-right: 20px;
    margin-bottom: 30px;
    .icon-contant {
      display: flex;
      font-size: 100px;
      margin-top: 8px;
      width: 50px;
      opacity: 0.5;
    }
    .company-contant {
      display: flex;
      flex-direction: column;
      line-height: 0px;
    }
    p {
      margin: 0;
      line-height: 18px;
      font-size: 13px;
    }
  }
}
.email-error {
  color: red;
  padding: 0 20px;
}

.contact-container {
  display: flex;
  padding: 0px 10px 0px 10px;
  overflow: auto;
  box-sizing: border-box;
  width: 100%;
  padding: 34px 20px 0px;
  input.input-border.filled + span {
    margin-bottom: 20px !important;
  }
  input.input-border.filled + span span {
    height: 14px;
    line-height: 14px;
    font-size: 10px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.3);
  }
  .input-border.filled:focus + span span {
    color: var(--custom-color1);
  }
}
.input-data {
  width: 90%;
  display: flex;
  border: none;
  //margin: 0px 4px 0px 0px;
  border-bottom: 1px solid #afafaf;
  background: none;
  padding: 0;
  margin-left: 18px;
  //width: -webkit-fill-available;
}

.send-block {
  display: flex;
  justify-content: space-between;
  margin: 0 6px;
}
.send-email {
  margin-right: auto;
  margin-left: 20px;
}
.text-area-container {
  padding: 0 20px 0;
  p {
    margin: 0;
    font-weight: 300;
    color: var(--custom-color1);
    font-size: 12px;
    padding-bottom: 10px;
    font-weight: bold;
  }
  .inputs-data-bloke {
    resize: none;
    width: 97%;
    height: 150px;
    // margin: 6px;
    line-height: 20px;
    background-color: $bg-color2;
    // margin-top: 3px;
    border: 1px solid #afafaf;
    // margin-bottom: 13px;
    &::placeholder {
      color: var(--text-color3) !important;
    }
  }
}
.waiting {
  display: flex;
  justify-content: center;
  font-weight: bold;
  padding-top: 40px;
  font-size: 32px;
}
.contact-support-team {
  //     display: flex;
  //   justify-content: center;
  //   font-weight: bold;
  padding-top: 40px;
  //   font-size: 32px;
  text-align: center;
  color: var(--custom-color1);
  &.code-support {
    font-size: 22px;
  }
}
.contact-support {
  display: flex;
  justify-content: center;
  //   font-weight: bold;
  padding-top: 50px;
  font-size: 16px;
  flex-direction: column;
  align-items: center;
  color: var(--custom-color2);
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
</style>
