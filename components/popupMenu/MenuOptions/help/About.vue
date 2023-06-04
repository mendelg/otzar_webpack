<template>
  <div class="main-setting-menu">
    <HeaderMenu :title="$t('about.name')" :routeBackName="routeBackName" />
    <div class="about">
      <div class="item" @click="openDevOnClicks">
        <div>{{ clientId }}</div>
      </div>
      <div class="item" @click="openDevOnClicks">
        <div>{{ getLicType }}</div>
        <div>{{ getVersion }}</div>
        <div>{{ getUpdateVersion }}</div>
      </div>

      <div class="item" v-if="packageData != 'NA'">
        <div class="title">
          {{ $t("about.edition") }}
        </div>
        <p cl v-for="(item, index) in getEdition" :key="index">
          {{ item }}
        </p>
      </div>
      <div class="item" v-if="mefLicense">
        <p>
          מפרשי האוצר
        </p>
      </div>

      <div class="item" v-if="packageData != 'NA'">
        <div class="title">
          {{ $t("about.package") }}
        </div>
        <span v-if="getPackages.length == 0"> {{ $t("about.nopackage") }}</span>

        <p cl v-for="(item, index) in getPackages" :key="index">
          {{ item }}
        </p>
      </div>

      <div
        style="padding-top:5px"
        class="item"
        v-kiosk.remove
        v-if="
          appMode.offline() &&
            !noProductsData &&
            $store.state.hasInternet &&
            packageData != 'NA' &&
            (missingPackages.length > 0 || upgradeData.length) &&
            !isNetwork
        "
      >
        <p v-if="errorMessage1 != ''" class="error">{{ errorMessage1 }}</p>
        <p v-if="errorMessage1 != ''" class="error">{{ errorMessage2 }}</p>

        <div class="item" v-if="upgradeData.length">
          <div>
            {{ $t("myProfile.upgrade") }} {{ upgradeData[0].Product_key }}
            {{ $t("myProfile.availableNow") }}
          </div>
          <div class="flex-center" style="padding-top: 10px;">
            <span class="btn btn-larg" @click="purchaseUpgrade">
              {{ $t("myProfile.purchaseUpgrade") }}
              {{ upgradeData[0].Product_key }} /
              {{ getPrice(upgradeData[0]) }}
            </span>
          </div>
        </div>
        <!-- <div class="item" v-if="packageData != 'NA' && mefLicense"></div>
        <div class="item" v-else>
         
          <div class="flex-center" style="padding-top: 10px;">
            <span class="btn btn-larg" @click="purchaseMef">
              {{ $t("myProfile.toPurchaseMef") }} /
              {{ getPrice(mefData[0]) }}
            </span>
          </div>
        </div> -->
        <div class="title" style="padding-top:15px">
          {{ $t("myProfile.messageCanPurchase") }}
        </div>

        <p v-for="(item, index) in missingPackages" :key="item.licCode">
          <span v-show="item.selected" class="font-icon check-icon">A</span>
          <span
            :class="{ selected: item.selected, upgrade: item.licCode == -1 }"
            class="pack-item"
            @click="togglePackage(item)"
          >
            <span> {{ item.desc }} / </span>
            <span style="direction:ltr">
              {{
                userSettings.settings["language"] == "en"
                  ? "$ " + item.priceDollar.toLocaleString()
                  : "₪ " + item.priceNis.toLocaleString()
              }}</span
            ></span
          >
        </p>

        <p v-for="(item, index) in notAvailablePackages" :key="item.licCode">
          <span v-show="item.selected" class="font-icon check-icon">A</span>
          <span class="pack-item-no">
            <span v-tooltip="{ content: packageToolTip(item) }">
              {{ item.desc }}
              ({{
                $t("myProfile.availableFromVersion").replace(
                  "%1%",
                  item.version
                )
              }})/
            </span>
            <span style="direction:ltr">
              {{
                userSettings.settings["language"] == "en"
                  ? "$ " + item.priceDollar
                  : "₪ " + item.priceNis
              }}</span
            ></span
          >
        </p>

        <div class="flex-center" style="padding-top: 10px;">
          <span
            class="btn btn-larg"
            v-if="packageData != 'NA' && packagesToPurchase.length > 0"
            @click="purchasePackages"
          >
            {{ $t("myProfile.toPurchase") }} / {{ totalPrice }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAppInfo } from "@/services/offline/license.js";
import init from "@/config/init.js";
import errorsMgr from "@/helper/errorCodes";
import { openStore, getDiskProductsInfo } from "@/services/purchase";
import { mapState } from "vuex";

export default {
  data() {
    return {
      routeBackName: "help",
      licenseType: 0,
      expireDate: "",
      counter: 0,
      version: 0,
      updateVer: 0,
      mefotzarLicence: 0,
      packageData: 0,
      packages: [],
      missingPackages: [],
      packagesToPurchase: [],
      productsData: [],
      mefData: [],
      errorMessage1: "",
      errorMessage2: "",
      noProductsData: false,
      notAvailablePackages: [],
      upgradeData: [],
    };
  },
  computed: {
    ...mapState("user", ["licenseInfo"]),
    totalPrice() {
      let lang = this.userSettings.settings["language"] || "he";
      const sum = this.missingPackages
        .filter((p) => p.selected)
        .map((p) => (lang == "en" ? p.priceDollar : p.priceNis))
        .reduce((partialSum, a) => partialSum + a, 0);
      return `${sum.toLocaleString()} ${lang == "en" ? "$" : "₪"}`;
    },
    isNetwork() {
      return globalThis.OTZAR_BASIC_INFO.networkMode != "off";
    },
    clientId() {
      return (
        this.$t("about.userId") +
        ": " +
        (this.$store.state.user.stickerId
          ? String(this.$store.state.user.stickerId).padStart(5, "0")
          : "מידע לא זמין")
      );
    },
    getLicType() {
      return typeof this.licenseType === "string"
        ? this.licenseType
        : this.licenseType == 0
        ? this.$t("about.notFindInfo")
        : this.licenseType == 1
        ? this.$t("about.permanentLicense")
        : this.$t("about.temporaryLicense") + " " + this.expireDate;
    },
    getVersion() {
      return this.version == 0
        ? ""
        : this.$t("about.version") + "  " + this.version;
    },
    getUpdateVersion() {
      return this.updateVer == 0
        ? ""
        : this.$t("about.updateversion") + "  " + this.updateVer;
    },
    mefLicense() {
      let licensePackages = init.licensePackages;

      let pack = this.packageData;
      if (pack == 0) return false;

      return (pack & licensePackages.MEF_OTZAR) == licensePackages.MEF_OTZAR;
    },
    getPackages() {
      let licensePackages = init.licensePackages;
      let tempArr = [];
      this.missingPackages = [];
      let pack = this.packageData;

      /*  if (this.upgradeData[0]) {
        let obj = {
          licCode: -1,
          desc: "עדכון " + this.upgradeData[0].Product_key,
          packKey: this.upgradeData[0].Product_key,
          selected: false,
          priceNis: this.upgradeData[0].Nis || 0,
          priceDollar: this.upgradeData[0].Dollar || 0,
        };
        this.missingPackages.push(obj);
      } */

      const activeProducts = this.productsData;
      for (let i = 0; i < activeProducts.length; i++) {
        let productData = activeProducts[i];
        this.isPackageExists(
          pack,
          licensePackages[productData["Product_key"]],
          productData["Name"],
          productData["Product_key"],
          tempArr,
          productData
        );
      }

      this.packages = tempArr;

      this.missingPackages = this.missingPackages.filter(
        (m) => m.desc != "עוז והדר" && m.Active
      );

      let hasMachon = this.missingPackages.find(
        (m) => m.desc == "מכון ירושלים"
      );

      if (hasMachon)
        this.missingPackages = this.missingPackages.filter(
          (m) => m.desc != "אוצר מפרשי התלמוד"
        );

      /*  if (this.version < 20)
        this.missingPackages = this.missingPackages.filter(
          (m) => m.desc != "מאור ישראל"
        ); */

      return this.packages;
    },
    getEdition() {
      let licensePackages = init.licensePackages;
      let tempArr = [];

      let pack = this.packageData;
      if (pack == 0) return [];

      if ((pack & licensePackages.ALL) == licensePackages.ALL)
        tempArr.push(this.$t("about.licensePackagesFull"));
      //if ((pack & licensePackages.BT) == licensePackages.BT)
      else tempArr.push("בני תורה");

      // this.packages = tempArr;
      return tempArr;
    },
  },
  methods: {
    getPrice(prices) {
      return this.userSettings.settings["language"] == "en"
        ? "$ " + prices.Dollar.toLocaleString()
        : "₪ " + prices.Nis.toLocaleString();
    },
    packageToolTip(item) {
      return item.packKey == "OVADIA"
        ? `ספרי הגאון הרב עובדיה יוסף זצ&quot;ל `
        : "";
    },
    async purchaseUpgrade() {
      this.errorMessage1 = "";
      this.errorMessage2 = "";
      let URL = await openStore({
        SN: this.licenseInfo.serialNumber,
        products: [this.upgradeData[0].Product_key],
        details: [`עדכון גירסה ${this.upgradeData[0].Product_key}`],
        lang: this.userSettings.settings["language"] || "he",
      });

      if (URL) window.open(URL);
      else {
        this.errorMessage1 = this.$t("mefo.purchaseMefError1");
        this.errorMessage2 = this.$t("mefo.purchaseMefError2");
      }
    },
    async purchaseMef() {
      this.errorMessage1 = "";
      this.errorMessage2 = "";
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
    async purchasePackages() {
      this.errorMessage1 = "";
      this.errorMessage2 = "";
      let URL = await openStore({
        SN: this.licenseInfo.serialNumber,
        products: this.packagesToPurchase.map((p) => p.packKey),
        details: this.packagesToPurchase.map((p) => p.desc),
        lang: this.userSettings.settings["language"] || "he",
      });

      if (URL) window.open(URL);
      else {
        this.errorMessage1 = this.$t("mefo.purchaseMefError1");
        this.errorMessage2 = this.$t("mefo.purchaseMefError2");
      }
    },
    togglePackage(packageData) {
      this.errorMessage1 = "";
      this.errorMessage2 = "";
      if (
        this.packagesToPurchase.find((p) => p.packKey == packageData.packKey)
      ) {
        this.packagesToPurchase = this.packagesToPurchase.filter(
          (p) => p.packKey != packageData.packKey
        );
        let pack = this.missingPackages.find((p) => p.desc == packageData.desc);
        if (pack) pack.selected = false;
      } else {
        this.packagesToPurchase.push(packageData);
        let pack = this.missingPackages.find((p) => p.desc == packageData.desc);
        if (pack) pack.selected = true;
      }
    },
    getInfo(name) {},
    isPackageExists(pack, packCode, packDesc, packKey, tempArr, productData) {
      if ((pack & packCode) == packCode) tempArr.push(packDesc);
      else {
        if (
          !productData.Package_version ||
          productData.Package_version <= this.version
        )
          this.missingPackages.push({
            licCode: packCode,
            desc: packDesc,
            packKey,
            selected: false,
            priceNis: productData.Nis || 0,
            priceDollar: productData.Dollar || 0,
          });
        else
          this.notAvailablePackages.push({
            licCode: packCode,
            desc: packDesc,
            packKey,
            selected: false,
            priceNis: productData.Nis || 0,
            priceDollar: productData.Dollar || 0,
            version: productData.Package_version,
          });
      }
    },
    openDevOnClicks() {
      this.counter++;
      if (this.counter == 7) {
        if (globalThis._elwin) globalThis._elwin.webContents.openDevTools();
        this.counter = 0;
      }
    },
  },
  async created() {
    if (globalThis.SERVER_MODE == "online") return;
    getAppInfo(false)
      .then(async (res) => {
        if (res) {
          if (typeof res === "number") {
            this.licenseType =
              (errorsMgr.errorCodes[res - 1] || "UNKNOWN") +
              " " +
              this.$t("errors.code") +
              " " +
              res;
            this.expireDate = "";
            this.version = "";
            this.packageData = "NA";
            return;
          }
          this.updateVer = res.updatesVer;
          this.licenseType = res.LicType;
          this.expireDate = res.Day + "/" + res.Month + "/" + res.Year;
          this.version = res.otzarVer;
          this.packageData = res.packages;
          this.mefotzarLicence = res.mefotzarLicence;

          //get products data from office
          let productsData = await getDiskProductsInfo();

          if (!Array.isArray(productsData)) {
            this.noProductsData = true;
            this.productsData = [
              { Product_key: "CHABAD", Name: 'חב"ד' },
              { Product_key: "KOOK", Name: "מוסד הרב קוק" },
              { Product_key: "MACHON", Name: "מכון ירושלים" },
              { Product_key: "SHLOMO", Name: "מכון חכמת שלמה" },
              { Product_key: "SHALOM", Name: "מכון אהבת שלום" },
              { Product_key: "OFEK", Name: "מכון אופק" },
              { Product_key: "OZ", Name: "עוז והדר" },
              { Product_key: "ENC", Name: "האנציקלופדיה התלמודית" },
              { Product_key: "MEF_OTZAR", Name: "מפרשי האוצר" },
              { Product_key: "AHARON", Name: "זכרון אהרן" },
              {
                Product_key: "OTZAR_MEFHARSHI_HATLMOD",
                Name: "אוצר מפרשי התלמוד",
              },
              {
                Product_key: "OVADIA",
                Name: "מאור ישראל",
              },
            ];
          } else {
            this.upgradeData = productsData.filter(
              (p) =>
                p.Product_level == 5 &&
                p.Active &&
                p.Package_version == this.version
            );

            this.productsData = productsData.filter(
              (p) => p.Product_level == 2
            );

            try {
              let _t = this;
              this.productsData.forEach(function(p, i) {
                if (p.Product_key == "OVADIA") {
                  _t.productsData.splice(i, 1);
                  _t.productsData.unshift(p);
                }
              });

              this.productsData.forEach(function(p, i) {
                if (p.Product_key == "MEF_OTZAR") {
                  _t.productsData.splice(i, 1);
                  _t.productsData.unshift(p);
                }
              });
            } catch (ex) {
              console.log(ex);
            }

            /*   this.productsData = productsData.filter(
              (p) => p.Product_key != "MEF_OTZAR"
            );
            this.mefData = productsData.filter(
              (p) => p.Product_key == "MEF_OTZAR"
            ); */
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  },
};
</script>

<style lang="scss" scoped>
.pack-item {
  margin-right: 20px;
  padding: 5px;
  color: #7f7f7f;
  cursor: pointer;

  &.selected {
    color: var(--custom-color1) !important;
  }
}
.pack-item-no {
  margin-right: 20px;
  padding: 5px;
  color: #7f7f7f;
}

.main-setting-menu {
  overflow: auto;
  color: var(--custom-color1);
  .title {
    color: #7f7f7f;
    font-weight: bold;
    font-size: 13px;
  }
  .item {
    border-bottom: 1px solid #ececec;
    padding: 20px;
  }
}
.error {
  color: var(--custom-color1);
  font-weight: 600;
}
.upgrade {
  color: red !important;
  font-size: 15px;
}
</style>
