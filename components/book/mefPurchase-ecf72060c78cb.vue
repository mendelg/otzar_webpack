<template>
  <div class="container mef-purchase" v-show="show && showMefPurchaseMsg">
    <div class="header">
      <span class="title">{{ $t("general.mef") }}</span>
      <div class="close-btn" @click="closeMsg">
        <Icons icon="exit" height="10px" width="10px" fill="white" />
      </div>
    </div>
    <!-- <div class="store-content" v-if="showIFrame">
      <p @click="showIFrame = false">X</p>
      <iframe width="100%" height="100%" :src="storeURL" />
    </div> -->
    <div class="content" v-if="hasMefConnection || !userType.ipUser()">
      <p v-if="errorMessage1 != ''" class="error">{{ errorMessage1 }}</p>
      <p v-if="errorMessage2 != ''" class="error">{{ errorMessage2 }}</p>
      <p>{{ $t("mefo.dearCust") }}</p>
      <p>{{ $t("mefo.noLicense") }}</p>
      <p>{{ $t("mefo.onlyFirstPage") }}</p>
      <p>
        {{ $t("mefo.purchaseDetails") }}
      </p>
      <p class="link btn" @click="purchaseMef">{{ $t("mefo.purchase") }}</p>
      <p v-if="appMode.offline()">{{ $t("mefo.purchaseDetailsOffice") }}</p>
      <p v-if="appMode.offline()">{{ $t("mefo.purchaseTel") }}</p>
    </div>
    <div v-else class="content" style="padding-top:20px;padding-bottom:20px;">
      <div v-if="!hasMefLicense">אין לך מנוי למפרשי האוצר</div>
      <div v-else>
        אינך מחובר לתוכנת מפרשי האוצר
      </div>
    </div>
  </div>
</template>
<script>
import { openStore } from "@/services/purchase";
import { mapState, mapGetters, mapActions } from "vuex";
import Icons from "@/components/Icons/Icons.vue";
export default {
  components: { Icons },
  data() {
    return {
      show: true,
      storeURL: "",
      showIFrame: false,
      errorMessage1: "",
      errorMessage2: "",
    };
  },
  computed: {
    ...mapState("user", ["licenseInfo"]),
    ...mapGetters("user", [
      "hasMefConnection",
      "hasOtzarConnection",
      "hasMefLicense",
    ]),
    ...mapGetters("mefo", ["showMefPurchaseMsg"]),
  },
  methods: {
    ...mapActions("mefo", ["setShowMefPurchaseMsg"]),
    closeMsg() {
      this.setShowMefPurchaseMsg(false);
      this.show = false;
    },
    async purchaseMef() {
      this.errorMessage1 = "";
      this.errorMessage2 = "";
      if (this.appMode.online()) {
        window.open(this.$t("mainMenu.otzarStoreURL"));
        return;
      }
      let URL = await openStore({
        SN: this.licenseInfo.serialNumber,
        products: ["MEF_OTZAR"],
        details: ["מפרשי האוצר"],
        lang: this.userSettings.settings["language"] || "he",
      });

      if (URL) window.open(URL);
      else {
        this.errorMessage1 = this.$t("mefo.purchaseMefError1");
        this.errorMessage2 = this.$t("mefo.purchaseMefError2");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.header {
  width: 100%;
  height: 40px;
  background-color: var(--custom-color1);
}
.error {
  color: var(--custom-color1);
  font-weight: 600;
}
.container {
  font-size: 15px;
  border: 0px solid black;
  -webkit-box-shadow: 2px 2px 10px 8px rgb(0 0 0 / 41%);
  box-shadow: 2px 2px 10px 8px rgb(0 0 0 / 41%);
  height: fit-content;
  width: 350px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 10px;
  box-sizing: content-box;
  bottom: 10px;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 4;
}
.content {
  font-weight: 400;
  line-height: 14px;
  font-size: 14px;
  background-color: white;
  width: 80%;
  flex-grow: 1;
  height: 50%;
  line-height: 16px;
  text-align: center;
  color: black;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.title {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: white;
  font-size: 13px;
}
.store-content {
  width: 100%;
  height: 100%;
}
.close-btn :hover {
  cursor: pointer;
  font-weight: 600;
}

.close-btn {
  position: absolute;
  left: 15px;
  color: white;
  top: 8px;
}
.link {
  text-decoration: none;
  color: white;
  cursor: pointer;
}
</style>
