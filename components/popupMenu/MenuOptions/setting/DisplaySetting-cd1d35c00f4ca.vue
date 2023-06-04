<template>
  <div class="main-setting-menu">
    <HeaderMenu
      :title="$t('mainDisplaySetting.title')"
      :routeBackName="routeBackName"
    />

    <ul class="list-display-setting list-menu">
      <li>{{ $t("mainDisplaySetting.colorfulness") }}</li>
      <li
        class="item item-check"
        :class="{ checked: this.userSettings.settings.theme == 'dark' }"
      >
        <RowItem
          @click="setBackgroundColorTo(dark)"
          :title="$t('mainDisplaySetting.dark')"
          :HasIconItem="this.userSettings.settings.theme == 'dark'"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
        />
      </li>
      <li
        class="item item-check"
        :class="{
          checked:
            this.userSettings.settings.theme == 'bright' ||
            userSettings.settings.theme == undefined,
        }"
      >
        <RowItem
          @click="setBackgroundColorTo(bright)"
          :title="$t('mainDisplaySetting.bright')"
          :HasIconItem="
            this.userSettings.settings.theme == 'bright' ||
              userSettings.settings.theme == undefined
          "
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
        />
      </li>

      <li
        class="item item-check"
        :class="{ checked: this.userSettings.settings.theme == 'archaic' }"
      >
        <RowItem
          @click="setBackgroundColorTo(archaic)"
          :title="$t('mainDisplaySetting.archaic')"
          :HasIconItem="this.userSettings.settings.theme == 'archaic'"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
        />
      </li>

      <li
        v-if="!(this.userSettings.settings.theme == 'archaic')"
        class="underline-separate"
      ></li>

      <li v-if="!(this.userSettings.settings.theme == 'archaic')">
        {{ $t("mainDisplaySetting.subColorfulness") }}
      </li>
      <div
        class="choose-sub-color flex flex-wrap"
        v-if="!(this.userSettings.settings.theme == 'archaic')"
      >
        <!-- <div
          class="circle-color"
          :class="{ active: userSettings.settings.subColor == '#b57730' }"
          @click="chooseSubColor('#b57730', '#81592a')"
          style="background:#b57730"
          color="default"
        ></div> -->
        <div
          class="circle-color"
          :class="{ active: userSettings.settings.subColor == '#4059F6' }"
          @click="chooseSubColor('#4059F6', '#2c3dab')"
          style="background:#4059F6"
          color="blue"
        ></div>

        <div
          :class="{ active: userSettings.settings.subColor == '#057CC6' }"
          class="circle-color"
          @click="chooseSubColor('#057CC6', '#044e7d')"
          style="background:#057CC6"
          color="blue2"
        ></div>

        <div
          :class="{
            active: userSettings.settings.subColor == '#C59A4F',
          }"
          class="circle-color"
          @click="chooseSubColor('#C59A4F', '#47381d')"
          style="background:#C59A4F"
          color="gold"
        ></div>
        <div
          :class="{ active: userSettings.settings.subColor == '#05C67C' }"
          class="circle-color"
          @click="chooseSubColor('#05C67C', '#047d4e')"
          style="background:#05C67C"
          color="green1"
        ></div>
        <div
          :class="{ active: userSettings.settings.subColor == '#05C628' }"
          class="circle-color"
          @click="chooseSubColor('#05C628', '#047d4e')"
          style="background:#05C628"
          color="green2"
        ></div>
        <div
          :class="{ active: userSettings.settings.subColor == '#E2D301' }"
          class="circle-color"
          @click="chooseSubColor('#E2D301', '#998f02')"
          style="background:#E2D301"
          color="yellow"
        ></div>
        <div
          :class="{
            active:
              userSettings.settings.subColor == '#C67F05' ||
              userSettings.settings.subColor == '#c67f05' ||
              userSettings.settings.subColor == undefined,
          }"
          class="circle-color"
          @click="chooseSubColor('#C67F05', '#7d5104')"
          style="background:#C67F05"
          color="blue1"
        ></div>
        <!-- <div
          :class="{ active: userSettings.settings.subColor == '#B57730' }"
          class="circle-color"
          @click="chooseSubColor('#B57730', '#81592a')"
          style="background:#B57730"
          color="blue2"
        ></div> -->
        <div
          :class="{ active: userSettings.settings.subColor == '#C65205' }"
          class="circle-color"
          @click="chooseSubColor('#C65205', '#4a1f02')"
          style="background:#C65205"
          color="blue3"
        ></div>
        <div
          :class="{ active: userSettings.settings.subColor == '#FF069C' }"
          class="circle-color"
          @click="chooseSubColor('#FF069C', '#b5046e')"
          style="background:#FF069C"
          color="pink1"
        ></div>
        <div
          :class="{ active: userSettings.settings.subColor == '#C60579' }"
          class="circle-color"
          @click="chooseSubColor('#C60579', '#7d044c')"
          style="background:#C60579"
          color="pink2"
        ></div>
        <div
          :class="{ active: userSettings.settings.subColor == '#8D05DB' }"
          class="circle-color"
          @click="chooseSubColor('#8D05DB', '#600396')"
          style="background:#8D05DB"
          color="pink3"
        ></div>
      </div>

      <li class="underline-separate"></li>
      <li>{{ $t("mainDisplaySetting.bookItemSize") }}</li>

      <li
        class="item item-check"
        :class="{ checked: getBookItemSize == 'large' }"
      >
        <RowItem
          @click="setBookItemSizeTo(large)"
          :title="$t('mainDisplaySetting.large')"
          :HasIconItem="getBookItemSize == 'large'"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
        />
      </li>
      <li
        class="item item-check"
        :class="{ checked: getBookItemSize == 'compact' }"
      >
        <RowItem
          @click="setBookItemSizeTo(compact)"
          :title="$t('mainDisplaySetting.compact')"
          :HasIconItem="getBookItemSize == 'compact'"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
        />
      </li>

      <li class="underline-separate"></li>
      <li>{{ $t("mainDisplaySetting.textSize") }}</li>

      <li class="item item-check" :class="{ checked: getTextSize == 'large' }">
        <RowItem
          @click="setTextSizeTo(large)"
          :title="$t('mainDisplaySetting.large')"
          :HasIconItem="getTextSize == 'large'"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
        />
      </li>
      <li
        class="item item-check"
        :class="{ checked: getTextSize == 'compact' }"
      >
        <RowItem
          @click="setTextSizeTo(compact)"
          :title="$t('mainDisplaySetting.compact')"
          :HasIconItem="getTextSize == 'compact'"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
        />
      </li>
      <!-- <li class="underline-separate"></li>
      <li>{{ $t("mainDisplaySetting.placementPopups") }}</li>
      <li
        class="item item-check"
        :class="{ checked: getUserDisplaySetting.placement == 'left' }"
      >
        <RowItem
          @click="setPlacementTo(left)"
          :title="$t('mainDisplaySetting.left')"
          :HasIconItem="getUserDisplaySetting.placement == 'left'"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
        />
      </li>
      <li
        class="item item-check"
        :class="{ checked: getUserDisplaySetting.placement == 'right' }"
      >
        <RowItem
          @click="setPlacementTo(right)"
          :title="$t('mainDisplaySetting.right')"
          :HasIconItem="getUserDisplaySetting.placement == 'right'"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
        />
      </li> -->
      <!-- <li class="underline-separate"></li>
      <li>{{ $t("mainDisplaySetting.scrollDirection") }}</li>
      <li
        class="item item-check"
        :class="{ checked: getUserDisplaySetting.scrollDirection == 'utd' }"
      > -->
      <!-- <RowItem
          @click="setPageScrollingDirectionTo(utd)"
          :title="$t('mainDisplaySetting.directionUTD')"
          :HasIconItem="getUserDisplaySetting.scrollDirection == 'utd'"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
        />
      </li> -->
      <!-- <li
        class="item item-check"
        :class="{ checked: getUserDisplaySetting.scrollDirection == 'rtl' }"
      >
        <RowItem
          @click="setPageScrollingDirectionTo(rtl)"
          :title="$t('mainDisplaySetting.directionRTL')"
          :HasIconItem="getUserDisplaySetting.scrollDirection == 'rtl'"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
        />
      </li> -->
      <li class="underline-separate"></li>
      <li>{{ $t("mainDisplaySetting.bookDisplayTab") }}</li>
      <li
        class="item item-check"
        :class="{
          checked: userSettings.settings.newTabMode == '1',
        }"
      >
        <RowItem
          @click="setBookDisplayTabTo(1)"
          :title="$t('mainDisplaySetting.dislayBookTabNewTab')"
          :HasIconItem="newTabMode"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
        />
      </li>
      <li
        class="item item-check"
        :class="{
          checked: userSettings.settings.newTabMode == '0',
        }"
      >
        <RowItem
          @click="setBookDisplayTabTo(0)"
          :title="$t('mainDisplaySetting.dislayBookTabInsteadOf')"
          :HasIconItem="!newTabMode"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
        />
      </li>
      <!-- 
      <li class="underline-separate"></li>

      <li>{{ $t("setting.titleFSResultsTrans") }}</li>
      <li class="text-xl" @click="changeFSTrans(1)">+</li>
      <li class="text-xl" @click="changeFSTrans(-1)">-</li> -->

      <li class="underline-separate"></li>

      <li>{{ $t("setting.titleHeightGzirim") }}</li>
      <li
        class="item item-check"
        :class="{
          checked: heightGzirim == 'low',
        }"
      >
        <RowItem
          @click="setSettingHeightGzir('low')"
          :title="$t('setting.gzirinLow')"
          :HasIconItem="heightGzirim == 'low'"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
        />
      </li>
      <li
        class="item item-check"
        :class="{
          checked: heightGzirim == 'medium',
        }"
      >
        <RowItem
          @click="setSettingHeightGzir('medium')"
          :title="$t('setting.gzirinMedium')"
          :HasIconItem="heightGzirim == 'medium'"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
        />
      </li>
      <li
        class="item item-check"
        :class="{
          checked: heightGzirim == 'high',
        }"
      >
        <RowItem
          @click="setSettingHeightGzir('high')"
          :title="$t('setting.gzirinHigh')"
          :HasIconItem="heightGzirim == 'high'"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
        />
      </li>
      <!-- ocr selection default -->
      <li class="underline-separate"></li>

      <li>{{ $t("setting.ocrSelectionDefault") }}</li>
      <li
        class="item item-check"
        :class="{
          checked: bookSelection,
        }"
      >
        <RowItem
          @click="setBookSelection(true)"
          :title="$t('setting.on')"
          :HasIconItem="bookSelection"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
        />
      </li>
      <li
        class="item item-check"
        :class="{
          checked: !bookSelection,
        }"
      >
        <RowItem
          @click="setBookSelection(false)"
          :title="$t('setting.off')"
          :HasIconItem="!bookSelection"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
        />
      </li>
      <!-- full screen options -->
      <li class="underline-separate"></li>

      <li>{{ $t("setting.fullScreen") }}</li>
      <li
        class="item item-check"
        :class="{
          checked: hideRightBarOnFullScreen,
        }"
      >
        <RowItem
          @click="setHideRigthBarOnFullScreen"
          :title="$t('setting.hideRightBar')"
          :HasIconItem="hideRightBarOnFullScreen"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
        />
      </li>
      <li
        class="item item-check"
        :class="{
          checked: hideSearchBarOnFullScreen,
        }"
      >
        <RowItem
          @click="setHideSearchBarOnFullScreen"
          :title="$t('setting.hideSearchBar')"
          :HasIconItem="hideSearchBarOnFullScreen"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
        />
      </li>
      <li
        class="item item-check"
        :class="{
          checked: hideTopBarOnFullScreen,
        }"
      >
        <RowItem
          @click="setHideTopBarOnFullScreen"
          :title="$t('setting.hideTopHeader')"
          :HasIconItem="hideTopBarOnFullScreen"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
        />
      </li>

      <!-- page preview options -->
      <li class="underline-separate"></li>

      <li>{{ $t("setting.pagePreview") }}</li>
      <li
        class="item item-check "
        :class="{ checked: showPagePreview == 'on' }"
      >
        <RowItem
          v-disable
          @click="setShowPagePreview(true)"
          :title="$t('mareiMekomotSettings.on')"
          iconItem="3"
          :HasIconItem="showPagePreview == 'on'"
          :HasIconArrow="false"
          :HasIconDisplay="false"
        />
      </li>
      <li
        class="item item-check"
        :class="{ checked: showPagePreview == 'off' }"
      >
        <RowItem
          v-disable
          @click="setShowPagePreview(false)"
          :title="$t('mareiMekomotSettings.off')"
          iconItem="3"
          :HasIconItem="showPagePreview == 'off'"
          :HasIconArrow="false"
          :HasIconDisplay="false"
        />
      </li>
      <template v-if="showPagePreview == 'on'">
        <li>{{ $t("setting.previewType") }}</li>
        <li
          class="item item-check"
          :class="{
            checked: pagePreviewType == 'full',
          }"
        >
          <RowItem
            @click="setPreviewPageType('full')"
            :title="$t('setting.fullPage')"
            :HasIconItem="pagePreviewType == 'full'"
            :iconItem="iconV"
            :HasIconArrow="false"
            :HasIconDisplay="false"
          />
        </li>
        <li
          class="item item-check"
          :class="{
            checked: pagePreviewType == 'header',
          }"
        >
          <RowItem
            @click="setPreviewPageType('header')"
            :title="$t('setting.headers')"
            :HasIconItem="pagePreviewType == 'header'"
            :iconItem="iconV"
            :HasIconArrow="false"
            :HasIconDisplay="false"
          />
        </li>

        <li>{{ $t("setting.previewSize") }}</li>
        <li
          class="item item-check"
          :class="{
            checked: previewSize == 'big',
          }"
        >
          <RowItem
            @click="setPreviewPageSize('big')"
            :title="$t('setting.big')"
            :HasIconItem="previewSize == 'big'"
            :iconItem="iconV"
            :HasIconArrow="false"
            :HasIconDisplay="false"
          />
        </li>
        <li
          class="item item-check"
          :class="{
            checked: previewSize == 'medium',
          }"
        >
          <RowItem
            @click="setPreviewPageSize('medium')"
            :title="$t('setting.medium')"
            :HasIconItem="previewSize == 'medium'"
            :iconItem="iconV"
            :HasIconArrow="false"
            :HasIconDisplay="false"
          />
        </li>
        <li
          class="item item-check"
          :class="{
            checked: previewSize == 'small',
          }"
        >
          <RowItem
            @click="setPreviewPageSize('small')"
            :title="$t('setting.small')"
            :HasIconItem="previewSize == 'small'"
            :iconItem="iconV"
            :HasIconArrow="false"
            :HasIconDisplay="false"
          />
        </li>
      </template>
      <!--Advanced options -->
      <template v-if="showAdvanced">
        <li class="underline-separate"></li>
        <li>{{ $t("setting.advancedSettings") }}</li>
        <li class="underline-separate"></li>
        <!--image quality -->
        <li>{{ $t("setting.imageQuality") }}</li>
        <li
          class="item item-check"
          :class="{
            checked: imageQuality == 'high',
          }"
        >
          <RowItem
            @click="setImageQuality('high')"
            :title="$t('setting.option1')"
            :HasIconItem="imageQuality == 'high'"
            :iconItem="iconV"
            :HasIconArrow="false"
            :HasIconDisplay="false"
          />
        </li>
        <li
          class="item item-check"
          :class="{
            checked: imageQuality == 'medium',
          }"
        >
          <RowItem
            @click="setImageQuality('medium')"
            :title="$t('setting.option2')"
            :HasIconItem="imageQuality == 'medium'"
            :iconItem="iconV"
            :HasIconArrow="false"
            :HasIconDisplay="false"
          />
        </li>
      </template>
    </ul>

    <div class="footer-menu flex flex-align-center flex-center">
      <div class="btn fit-content-w" @click="resetDefault">
        {{ $t("general.resetDefaults") }}
      </div>
      <!--  <div
        v-if="showAdvanced == false"
        class="btn fit-content-w"
        @click="showAdvanced = true"
      >
        {{ $t("setting.showAdvancedSettings") }}
      </div>
      <div
        v-if="showAdvanced == true"
        class="btn fit-content-w"
        @click="showAdvanced = false"
      >
        {{ $t("setting.hideAdvancedSettings") }}
      </div> -->
    </div>
  </div>
</template>

<script>
//compact

const minFSTrans = 0.2,
  maxFSTrans = 0.8;

import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      routeBackName: "settings",
      iconV: "3",
      insteadOf: "insteadOf",
      newTab: "newTab",
      utd: "utd",
      rtl: "rtl",
      left: "left",
      right: "right",
      compact: "compact",
      large: "large",
      bright: "bright",
      dark: "dark",
      archaic: "archaic",
      colors: {
        red: "red",
        blue: "#777",
        black: "#000",
      },
      showAdvanced: false,
    };
  },
  computed: {
    ...mapGetters("userSetting", ["getUserDisplaySetting"]),
    newTabMode() {
      let mode = this.userSettings.settings.newTabMode;
      return mode && mode == "1" ? true : false;
    },
    heightGzirim() {
      if (!this.userSettings.settings.height_gzir) return "low";
      return this.userSettings.settings.height_gzir;
    },
    fsResultsTrans() {
      if (!this.userSettings.settings.fsresult_color) return 2;
      return this.userSettings.settings.fsresult_color;
    },
    getTextSize() {
      if (!this.userSettings.settings.textSize) return "compact";
      return this.userSettings.settings.textSize;
    },
    getBookItemSize() {
      if (!this.userSettings.settings.bookItemSize) return "large";
      return this.userSettings.settings.bookItemSize;
    },
    bookSelection() {
      return this.userSettings.settings.book_selection_default &&
        this.userSettings.settings.book_selection_default == 1
        ? true
        : false;
    },
    hideRightBarOnFullScreen() {
      return this.userSettings.settings.full_screen_hide_right_bar &&
        this.userSettings.settings.full_screen_hide_right_bar == 1
        ? true
        : false;
    },
    hideSearchBarOnFullScreen() {
      return this.userSettings.settings.full_screen_hide_search_bar &&
        this.userSettings.settings.full_screen_hide_search_bar == 1
        ? true
        : false;
    },
    hideTopBarOnFullScreen() {
      return this.userSettings.settings.full_screen_hide_top_bar &&
        this.userSettings.settings.full_screen_hide_top_bar == 1
        ? true
        : false;
    },
    imageQuality() {
      return this.userSettings.settings.imgQuality || "high";
    },
    showPagePreview() {
      return this.userSettings.settings.showPagePreview || "on";
    },
    pagePreviewType() {
      return this.userSettings.settings.pagePreviewType || "full";
    },
    previewSize() {
      return this.userSettings.settings.pagePreviewSize || "medium";
    },
  },
  methods: {
    resetDefault() {
      this.$store.dispatch("userSetting/setSubColor", {
        color1: "#c67f05",
        color2: "#7d5104",
      });
      this.$store.dispatch("userSetting/setBackgroundColor", "bright");
      this.$store.dispatch("userSetting/setTextSize", "compact");
      this.userSettings.setSettings("newTabMode", "0");
      this.userSettings.setSettings("height_gzir", "low");
      this.userSettings.setSettings("book_selection_default", "0");
      this.userSettings.setSettings("full_screen_hide_right_bar", "0");
      this.userSettings.setSettings("full_screen_hide_search_bar", "0");
      this.userSettings.setSettings("full_screen_hide_top_bar", "0");
    },
    chooseSubColor(color, color2) {
      this.$store.dispatch("userSetting/setSubColor", {
        color1: color,
        color2: color2,
      });
    },
    setBackgroundColorTo(backgroundColor) {
      this.$store.dispatch("userSetting/setBackgroundColor", backgroundColor);
      // this.$store.dispatch("userSetting/setBackgroundColor",yyyy);
    },
    setTextSizeTo(textSize) {
      this.$store.dispatch("userSetting/setTextSize", textSize);
    },
    setBookItemSizeTo(bookItemSize) {
      this.$store.dispatch("userSetting/setBookItemSize", bookItemSize);
    },
    setPlacementTo(placement) {
      this.$store.dispatch("userSetting/setPlacement", placement);
    },
    //setPageScrollingDirectionTo
    setPageScrollingDirectionTo(scrollDirection) {
      this.$store.dispatch(
        "userSetting/setPageScrollingDirection",
        scrollDirection
      );
    },
    //setBookDisplayTabTo
    setBookDisplayTabTo(bookDisplayTab) {
      // this.$store.dispatch("userSetting/setBookDisplayTab", bookDisplayTab);
      this.userSettings.setSettings("newTabMode", bookDisplayTab);
    },
    setSettingHeightGzir(size) {
      this.userSettings.setSettings("height_gzir", size);
    },
    setBookSelection(val) {
      this.userSettings.setSettings("book_selection_default", val);
    },
    setImageQuality(val) {
      this.userSettings.setSettings("imgQuality", val);
    },
    setHideRigthBarOnFullScreen() {
      let setting = this.userSettings.settings.full_screen_hide_right_bar;
      setting = setting && setting == "1" ? "0" : "1";
      this.userSettings.setSettings("full_screen_hide_right_bar", setting);
    },
    setHideSearchBarOnFullScreen() {
      let setting = this.userSettings.settings.full_screen_hide_search_bar;
      setting = setting && setting == "1" ? "0" : "1";
      this.userSettings.setSettings("full_screen_hide_search_bar", setting);
    },
    setHideTopBarOnFullScreen() {
      let setting = this.userSettings.settings.full_screen_hide_top_bar;
      setting = setting && setting == "1" ? "0" : "1";
      this.userSettings.setSettings("full_screen_hide_top_bar", setting);
    },
    setSettingFSResultTrans(mode) {
      this.userSettings.setSettings("fsresult_color", mode);
    },
    changeFSTrans(dir) {
      let value = this.userSettings.settings.fsresult_color || 2;
      let fsresultTransparment = parseInt(value);

      if (dir === 1 && fsresultTransparment === 4) return;
      if (dir === -1 && fsresultTransparment === 0) return;
      fsresultTransparment += 1 * dir;
      this.userSettings.setSettings(
        "fsresult_color",
        fsresultTransparment.toString()
      );
    },
    setShowPagePreview(value) {
      this.userSettings.setSettings("showPagePreview", value ? "on" : "off");
    },
    setPreviewPageType(value) {
      this.userSettings.setSettings("pagePreviewType", value);
    },
    setPreviewPageSize(value) {
      this.userSettings.setSettings("pagePreviewSize", value);
    },
  },
};
</script>

<style lang="scss">
.main-setting-menu {
  width: -webkit-fill-available;
  z-index: 4;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.list-display-setting {
  display: flex;
  flex-direction: column;
  // margin: 0;
  // padding: 0;
  list-style-type: none;
  overflow: auto;
  flex-grow: 1;
}
.underline-separate {
  border-bottom: 1px solid #ececec;
  margin-top: 13px;
  margin-bottom: 16px;
}
.choose-sub-color {
  flex-wrap: wrap;
  padding: 0 20px 0 3px;
}
.footer-menu {
  background-color: #f4f4f4;
  height: 60px;
  border: 1px solid #dedede;
}
</style>
