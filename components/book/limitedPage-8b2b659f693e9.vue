<template>
  <div class="limited-container">
    <template v-if="hasOtzarConnection">
      <div class="content flex-column" v-if="userType.guestUser()">
        <div class="flex-column bold-part">
          <span>
            {{ $t("limitedPage.connectedAsVisitor") }}
          </span>
          <span v-if="OZ">
            {{ $t("limitedPage.noOZPurchase") }}
          </span>
          <template v-else>
            <span class="center-msg">
              {{ $t("limitedPage.shouldPurchase") }}
            </span>
            <span>
              {{ $t("limitedPage.shouldPurchase2") }}
            </span>
          </template>
          <span class="store-link" @click="showRegisterWin">
            {{ $t("limitedPage.toRegister") }}</span
          >
          <span class="store-link" @click="login">
            {{ $t("limitedPage.signIn") }}</span
          >
        </div>
        <span v-if="!OZ" class="store-link" @click="goToStore">
          {{ $t("limitedPage.toPurchase") }}</span
        >
      </div>
      <div class="content flex-column" v-else>
        <div class="flex-column bold-part">
          <span>
            {{ $t("limitedPage.bookBelongs") }}
            {{ bookPackage }}
          </span>
          <span v-if="OZ"> {{ $t("limitedPage.noOZPurchase") }} </span>
          <span v-else> {{ $t("limitedPage.shouldPurchasePackage") }}</span>
        </div>
        <span v-if="!OZ" class="store-link" @click="goToStore">
          {{ $t("limitedPage.toPurchase") }}</span
        >
      </div>
      <div class="contact-part flex-column">
        <span class="small-text"> {{ $t("limitedPage.contactDetails") }} </span>
        <span class="med-text"> {{ $t("limitedPage.blessing") }} </span>
        <span class="small-text"> {{ $t("limitedPage.workHours") }} </span>
      </div>
    </template>
    <template v-else>
      אינך מחובר לתוכנת אוצר החכמה
    </template>
  </div>
</template>
<script>
import LoginMix from "@/mixing/login";
import { ENUM_LOGIN_WIN_MODES } from "@/services/login.js";
import { mapGetters } from "vuex";
export default {
  props: ["bookPackage", "OZ"],
  mixins: [LoginMix],
  methods: {
    goToStore() {
      window.open(this.$t("mainMenu.otzarStoreURL"));
    },
    async login() {
      let user = await this.loginOnline({ autoConnect: false });
      if (!user) {
        this.showLoginWin();
      }
    },
    showLoginWin() {
      this.$store.state.user.loginTab = 1;
      this.$store.state.user.showLoginMode = ENUM_LOGIN_WIN_MODES.LOGIN;
      this.$store.state.user.showLogin = true;
    },
    showRegisterWin() {
      this.$store.state.user.loginTab = 2;
      this.$store.state.user.showLoginMode = ENUM_LOGIN_WIN_MODES.LOGIN;
      this.$store.state.user.showLogin = true;
    },
  },
  computed: {
    ...mapGetters("user", ["hasMefConnection", "hasOtzarConnection"]),
  },
};
</script>

<style lang="scss" scoped>
.center-msg {
  padding: 15px;
  text-align: center;
}
.limited-container {
  background-color: #f7f7f7;
  direction: rtl;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  font-size: 22px;
  padding-top: 50px;
}
.content {
  align-items: center;
}
.bold-part {
  font-weight: 600;
  font-size: 22px;
  align-items: center;
  line-height: 32px;
  color: var(--custom-color2);
}
.contact-part {
  padding-top: 40px;
  font-weight: normal;
  font-size: 22px;
  line-height: 28px;
  align-items: center;
}
.small-text {
  font-size: 16px;
}
.med-text {
  font-size: 20px;
  padding-top: 15px;
}
.store-link {
  padding-top: 30px;
  font-style: italic;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 400;
  &:hover {
    font-weight: 500;
  }
}
</style>
