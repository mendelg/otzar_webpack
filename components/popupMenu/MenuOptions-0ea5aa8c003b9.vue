<template>
  <div class="menu-options" v-click-outside="closeMenu">
    <HeaderMenu :title="$t('mainMenu.title')" routeBackName="" />
    <div class="haeders-options-block" v-remove.offline>
      <div
        v-if="!userType.guestUser()"
        class="haeders-option"
        @click="goToProfileMenu"
      >
        <div class="inner-header-option">
          <span class="icon-item icon-home-page">o</span>
          <p>{{ $t("mainMenu.myProfile") }}</p>
        </div>
      </div>
      <div class="haeders-option" @click="showWelcom">
        <div class="inner-header-option">
          <span class="icon-item icon-home-page">o</span>
          <p>{{ $t("mainMenu.homePage") }}</p>
        </div>
      </div>
      <div
        @click="openStore"
        class="haeders-option"
        :style="{ cursor: storeCursor }"
      >
        <div class="inner-header-option">
          <span class="icon-item icon-online-store">c</span>
          <p>{{ $t("mainMenu.onlineStore") }}</p>
        </div>
      </div>
    </div>

    <div class="haeders-options-block">
      <div class="haeders-option" @click="OpenOtzarExplorer">
        <span class="icon-item">e</span>
        <OpenFoldersOption />
      </div>
      <div class="haeders-option" @click="openEncyclopPopup">
        <div class="inner-header-option">
          <div
            style="display: flex; align-items: center; justify-content: center"
          >
            <img src="~@/assets/img/en_menu.png" alt />
          </div>
          <p style="margin-top: 15px">{{ $t("mainTools.encyclopedia") }}</p>
        </div>
      </div>
    </div>

    <div v-kiosk class="haeders-options-block">
      <div class="haeders-option" @click="goToHistory">
        <div class="inner-header-option">
          <span class="icon-item icon-home-page">p</span>
          <p>{{ $t("mainTools.historyName") }}</p>
        </div>
      </div>
      <div class="haeders-option" @click="goToPersonalExtensions">
        <div class="inner-header-option">
          <span class="icon-item icon-home-page">q</span>
          <p>{{ $t("mainTools.personalExtensionsName") }}</p>
        </div>
      </div>
    </div>

    <ul class="list-main-menu list-menu">
      <li class="item row-in-menu" @click="showWelcom" v-remove.online>
        <span class="icon-item opacity">o</span>
        <p>{{ $t("mainMenu.homePage") }}</p>
        <!-- <BaseIconOpenFolder :nameIcon="nameIcon"  /> -->
      </li>
      <!--       <li class="item row-in-menu" @click="OpenOtzarExplorer">
        <span class="icon-item">e</span>
        <OpenFoldersOption />
     
      </li> -->
      <!--   <li class="item">
        <RowItem
          @click="openEncyclopPopup"
          :title="$t('mainTools.encyclopedia')"
          :HasIconItem="true"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
        >
          <div
            style="display: flex;
    align-items: center;
    justify-content: center;"
          >
            <img src="~@/assets/img/en_menu.png" alt />
          </div>
        </RowItem>
      </li> -->
      <!--  <li class="item">
        <RowItem
          v-kiosk
          @click="goToHistory"
          :title="$t('mainTools.historyName')"
          :HasIconItem="true"
          :HasIconArrow="true"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
          iconItem="p"
        />
        <router-view />
      </li> -->
      <li class="item">
        <RowItem
          v-kiosk
          @click="goToMainSetting"
          :title="$t('mainMenu.settingsName')"
          :HasIconItem="true"
          mainToop
          :HasIconArrow="true"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
          iconItem="f"
        />
        <!-- <router-view /> -->
      </li>
      <li class="item">
        <RowItem
          @click="goToMainTools"
          :title="$t('mainMenu.toolsName')"
          :HasIconItem="true"
          :HasIconArrow="true"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
          iconItem="g"
        />
        <!-- <router-view /> -->
      </li>
      <li class="item" v-hide.online v-if="!netmode">
        <RowItem
          v-kiosk
          @click="goToMainExtensions"
          :title="$t('mainMenu.extensionsName')"
          :HasIconItem="true"
          :HasIconArrow="true"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
          iconItem="h"
        />
        <!-- <router-view /> -->
      </li>
      <li class="item">
        <!-- when the training site will be prepared
        replace the  @click="downloadTrainningFilePDF" to-  @click="goToMainHelp"
        and :HasIconArrow="false" to- :HasIconArrow="true"
        -->
        <RowItem
          v-kiosk
          @click="goToMainHelp"
          :title="$t('mainHelp.name')"
          :HasIconItem="true"
          :HasIconArrow="true"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
          iconItem="i"
        />
        <!-- <router-view /> -->
      </li>
      <li class="item" v-remove.offline>
        <RowItem
          @click="goToReportingBugs"
          :title="$t('mainMenu.repoBugsName')"
          :HasIconItem="true"
          :HasIconArrow="true"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
          iconItem="j"
        />
      </li>
      <li class="item">
        <RowItem
          v-kiosk
          @click="goToSupportMenu"
          :title="$t('mainMenu.support')"
          :HasIconItem="true"
          :HasIconArrow="true"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
          iconItem="k"
        />
      </li>
      <li class="item">
        <RowItem
          v-kiosk
          @click="goToContactUs"
          :title="$t('mainMenu.contactName')"
          :HasIconItem="true"
          :HasIconArrow="true"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
          iconItem="l"
        />
        <!-- <router-view /> -->
      </li>

      <li class="item" v-if="netmode">
        <RowItem
          @click="goToNetworkMenu"
          :title="$t('networkComputer.itemMenu')"
          :HasIconArrow="true"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
          :HasIconItem="true"
        >
          <!-- <BaseIcon class="" width="19" nameIcon="calendar" pathIcon="k" /> -->
          <BaseIcon
            class="color-icon-gray"
            width="19"
            height="19"
            nameIcon="network-computer"
            pathIcon="icons"
          />
        </RowItem>
      </li>
      <li class="item" v-if="appMode.online()">
        <RowItem
          v-kiosk
          @click="goToOtzarSite"
          v-if="appMode.online()"
          :title="$t('mainMenu.otzarSite')"
          :HasIconItem="true"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
          iconItem="m"
        />
      </li>

      <li
        class="item"
        v-if="
          appMode.online() && userType.ipUser() && getSubUserData.subUserId == 0
        "
      >
        <RowItem
          @click="openManagePanel"
          :title="$t('mainMenu.managePage')"
          :HasIconItem="true"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
          iconItem="m"
        />
        <!-- <router-view /> -->
      </li>
      <li class="item" v-if="allowRefreshList">
        <RowItem
          v-kiosk
          v-disable
          @click="refreshList"
          :title="$t('mainTools.refreshListName')"
          :HasIconItem="true"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
          iconItem="v"
        />
      </li>
    </ul>
    <div
      v-kiosk.remove
      class="bottom flex-column purchase-container"
      v-if="appMode.offline() && showPurchaseMsg"
    >
      <div class="header">
        <p style="flex-grow: 1; padding-right: 10px">
          {{ $t("general.attention1") }}
        </p>
        <p
          @click.stop="$store.state.menu.showPurchaseMsg = false"
          class="x-close-menu close-popup otz-icon"
        >
          F
        </p>
      </div>
      <div style="padding: 15px; align-items: center" class="flex-column">
        <template v-if="upgradeData.length">
          <p class="bold-text" style="padding-top: 0">
            1.{{ $t("myProfile.upgrade") }} {{ upgradeData[0].Product_key }}
            {{ $t("myProfile.availableNow") }}
          </p>
        </template>
        <template
          v-if="!mefLic || missingPackages.length || unAvailablePackages.length"
        >
          <p class="bold-text" style="padding-top: 0">
            {{ upgradeData.length ? 2 : 1 }}.
            {{ $t("myProfile.messageNoPackages") }}<br />

            <span v-if="!mefLic"
              >מפרשי האוצר<span
                v-if="missingPackages.length || unAvailablePackages.length"
                >,
              </span></span
            >
            {{ missingPackages.join(", ") + "." }}
            <br />
            <br />
            <span class="rtl" v-if="unAvailablePackages.length">
              {{
                unAvailablePackages
                  .map(
                    (p) =>
                      `${p.name} (${$t(
                        "myProfile.availableFromVersion"
                      ).replace("%1%", p.version)})`
                  )
                  .join(", ") + "."
              }}<br />
              <br /> </span
            >{{ $t("myProfile.autoAdd") }}
          </p>
        </template>
        <!--  <p>{{ $t("myProfile.messageNoPackages") }}</p>
      <p class="bold-text" style="width:100%" v-if="!mefLic">מפרשי האוצר</p>
      <p class="bold-text" style="padding-top:0">
        {{ missingPackages.join(", ") + "." }}
      </p>
      <p
        v-if="unAvailablePackages.length"
        class="bold-text"
        style="padding-top:0"
      >
        {{
          unAvailablePackages
            .map(
              (p) =>
                `${p.name} (${$t("myProfile.availableFromVersion").replace(
                  "%1%",
                  p.version
                )})`
            )
            .join(", ") + "."
        }}
      </p>

      <p class="footer">{{ $t("myProfile.messagePurchase") }}</p>-->
        <div class="btn btn-larg" @click="goToAboutMenu">
          {{ $t("myProfile.toPurchase3") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { launchApp } from "@/services/general";
import menuService from "@/services/menu";
import { doHardReload } from "@/services/bookData";
import OpenFoldersOption from "./MenuOptions/openFoldersOption.vue";
import { getAppInfo } from "@/services/offline/license.js";
import { getDiskProductsInfo } from "@/services/purchase";
import init from "@/config/init.js";
import { IPUserNoPersDataMsg } from "@/services/userBooksData.js";
// import MainSetting from "./MenuOptions/setting/MainSetting.vue";
export default {
  components: {
    OpenFoldersOption,
    // MainSetting,
  },
  data() {
    return {
      title: this.$t("mainMenu.title"),
      routeBackName: "home",
      settingsName: this.$t("mainMenu.settingsName"),
      toolsName: this.$t("mainMenu.toolsName"),
      extensionsName: this.$t("mainMenu.extensionsName"),
      helpName: this.$t("mainMenu.helpName"),
      contactName: this.$t("mainMenu.contactName"),
      repoBugsName: this.$t("mainMenu.repoBugsName"),
      licenseErr: false,
      productsData: [],
      mefLic: false,
      version: 0,
      upgradeData: [],
    };
  },
  computed: {
    ...mapGetters("user", ["isIPLimited", "getSubUserData"]),
    allowRefreshList() {
      return (
        globalThis.SERVER_MODE != "online" ||
        globalThis.OTZAR_BASIC_INFO.OTZAR_SIF
      );
    },
    storeCursor() {
      return globalThis.DEV_CONNECT_USER_TO_FREE_AUTO
        ? "not-allowed"
        : "pointer";
    },
    netmode() {
      return globalThis.OTZAR_BASIC_INFO.networkMode != "off";
    },
    showPurchaseMsg() {
      return (
        this.$store.state.menu.showPurchaseMsg &&
        !this.licenseErr &&
        (this.missingPackages.length > 0 || this.upgradeData.length) &&
        !this.netmode
      );
    },
    unAvailablePackages() {
      let licensePackages = init.licensePackages;

      let mp = [];
      let pack = this.packageData;
      for (let i = 0; i < this.productsData.length; i++) {
        let productData = this.productsData[i];

        const packCode = licensePackages[productData["Product_key"]];
        if (
          (pack & packCode) != packCode &&
          productData.Package_version > this.version
        )
          mp.push({
            name: productData["Name"],
            version: productData.Package_version,
          });
      }

      return mp;
    },
    missingPackages() {
      let licensePackages = init.licensePackages;

      let mp = [];
      let pack = this.packageData;
      for (let i = 0; i < this.productsData.length; i++) {
        let productData = this.productsData[i];

        const packCode = licensePackages[productData["Product_key"]];
        if (
          (pack & packCode) != packCode &&
          (!productData.Package_version ||
            productData.Package_version <= this.version)
        )
          mp.push(productData["Name"]);
      }
      //remove OZ package for now
      mp = mp.filter((p) => p != "עוז והדר");
      if (mp.find((p) => p == "מכון ירושלים"))
        mp = mp.filter((p) => p != "אוצר מפרשי התלמוד");
      return mp;
    },
  },
  methods: {
    ...mapActions("encyclopedia", ["setVisible"]),

    openManagePanel() {
      this.$router.push({ name: "manage-panel" });
      // window.open("#/manage-panel");
    },
    openStore() {
      if (!globalThis.DEV_CONNECT_USER_TO_FREE_AUTO)
        window.open(this.$t("mainMenu.otzarStoreURL"));
    },
    goToPersonalExtensions() {
      if (this.isIPLimited) {
        IPUserNoPersDataMsg();
        return;
      }
      // this.$router.push({ name: "personal-extensions" });
      menuService.openPersonalExtenMenu();
    },
    openEncyclopPopup() {
      this.setVisible();
      menuService.closeMenu();
    },
    goToHistory() {
      if (this.isIPLimited) {
        IPUserNoPersDataMsg();
        return;
      }
      // this.$router.push({ name: "history" });
      menuService.openHistoryMenu();
    },
    refreshList() {
      doHardReload();
      menuService.closeMenu();
    },
    ...mapActions("bookList", ["setSettingsSearchTo"]),
    goToProfileMenu() {
      menuService.OpenMyProfileMenu();
    },
    showWelcom() {
      this.$store.dispatch("welcome/visible");
      this.setSettingsSearchTo("");
      // this.$router.push({ name: "main" });
      menuService.closeMenu();
    },
    goToMainSetting() {
      // this.$router.push({ name: "main-setting" });
      menuService.OpenSettingsMenu();
    },
    goToMainTools() {
      // this.$router.push({ name: "main-tools" });
      menuService.OpenToolsMenu();
    },
    //goToMainExtensions
    goToMainExtensions() {
      // this.$router.push({ name: "main-extensions" });
      menuService.OpenExtentionsMenu();
    },

    goToContactUs() {
      // this.$router.push({ name: "main-contact" });
      menuService.OpenContactMenu();
    },
    goToReportingBugs() {
      // this.$router.push({ name: "repo-bugs" });
      menuService.OpenBugsReportMenu();
    },
    goToSupportMenu() {
      menuService.OpenSupportMenu();
    },
    downloadTeamViewer() {
      //('../teamvieweroh.exe')

      if (globalThis.SERVER_MODE === "offline")
        launchApp("%CURRENT_DRIVE%\\utils\\TeamViewerQS_he-idcthfxpqu.exe");
      else
        window.open(
          location.protocol + "//" + location.host + "/static/tv_144.exe"
        );
    },
    downloadTrainningFilePDF() {
      window.open("https://tablet.otzar.org/he/documents/help_heb.pdf");
    },
    //will be in use when the training site will be prepared
    goToMainHelp() {
      // this.$router.push({ name: "main-help" });
      menuService.OpenHelpMenu();
    },
    goToOtzarSite() {
      if (globalThis.SERVER_MODE == "online")
        window.open("https://www.otzar.org/", "_blank");
      else launchApp("https://www.otzar.org/");
      menuService.closeMenu();
    },
    goToNetworkMenu() {
      menuService.OpenNetworkMenu();
    },
    goToAboutMenu() {
      menuService.openAboutAppMenu();
    },
    closeMenu() {
      menuService.closeMenu();
    },
    OpenOtzarExplorer() {
      // if (this.hasExport) return;
      this.$store.dispatch("folders/setOpenTypePopup", "import");
      this.$store.dispatch("folders/togglePopupFolder", true);
      menuService.closeMenu();
    },
  },
  async created() {
    if (globalThis.SERVER_MODE == "online") return;
    let licensePackages = init.licensePackages;
    getAppInfo()
      .then(async (res) => {
        if (res) {
          if (typeof res === "number") {
            this.licenseErr = true;
            return;
          }
          this.version = res.otzarVer;
          this.packageData = res.packages;
          this.mefLic =
            (this.packageData & licensePackages.MEF_OTZAR) ==
            licensePackages.MEF_OTZAR;
          //get products data from office
          let productsData = await getDiskProductsInfo();
          if (productsData) {
            this.upgradeData = productsData.filter(
              (p) =>
                p.Product_level == 5 &&
                p.Active &&
                p.Package_version == this.version
            );

            productsData = productsData.filter(
              (p) => p.Product_level == 2 && p.Active
            );

            this.productsData = productsData.filter(
              (p) => p.Product_key != "MEF_OTZAR"
            );

            /* if (res.otzarVer < 21)
              this.productsData = productsData.filter(
                (p) => p.Product_key != "OVADIA"
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

<style lang="scss">
$bg-color2: #f7f7f7;
.bottom {
  // border-top: 1px solid gray;
  // height: 60px;
  direction: rtl;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-bottom: 10px;
  .header {
    background-color: #dedede;
    width: 100%;
    font-weight: 500;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
  }
  .bold-text {
    font-weight: 500;
    font-size: 15px;
    padding: 10px;
  }
}
.haeders-options-block {
  display: flex;
  background-color: $bg-color2;
  height: 60px;
  cursor: pointer;

  p {
    //color: #afafaf;
  }
}
.haeders-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-bottom: 1px solid #dedede;
  width: 100%;
  &:hover {
    background-color: #00000014;
  }

  border-left: 1px solid #dedede;

  .inner-header-option {
    padding-top: 5px;
    span {
      display: block;
      margin: 0;
    }
    p {
      margin: 0;
      line-height: 12px;
    }
  }
}
.icon-location {
  display: flex;
  font-size: 100px;
  margin-top: 8px;
}
.icon-item.opacity {
  opacity: 0.4;
}
.color-icon-gray {
  opacity: 0.4;
}
</style>
