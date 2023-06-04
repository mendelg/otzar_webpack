<template>
  <div class="main-setting-menu">
    <HeaderMenu
      :title="$t('mainLanguage.title')"
      :routeBackName="routeBackName"
    />

    <ul class="list-main-setting list-menu">
      <li>
        <b>{{ $t("advMenuSettings.quailty") }}</b>
      </li>

      <li class="item item-check" :class="{ checked: UserLang == 'he' }">
        <RowItem
          @click="setLanguageTo(he)"
          :title="$t('advMenuSettings.hquailty')"
          :HasIconItem="UserLang == 'he'"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
        />
      </li>
      <li class="item item-check" :class="{ checked: UserLang == 'en' }">
        <RowItem
          v-disable
          @click="setLanguageTo(en)"
          :title="$t('advMenuSettings.mquailty')"
          :HasIconItem="UserLang == 'en'"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
        />
      </li>
      <li class="item item-check" :class="{ checked: UserLang == 'en' }">
        <RowItem
          v-disable
          @click="setLanguageTo(en)"
          :title="$t('advMenuSettings.lquailty')"
          :HasIconItem="UserLang == 'en'"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
        />
      </li>
    </ul>
    <li class="underline-separate"></li>
    <ul class="list-main-setting list-menu">
      <li>
        <b>{{ $t("advMenuSettings.pdfZoom") }}</b>
      </li>
      <div class="flex flex-center" style="margin-top:5px">
        <input type="number" class="scale-input" value="100" />
      </div>
    </ul>
  </div>
</template>

<script>
import { loadLanguageAsync } from "@/localization/local";
export default {
  data() {
    return {
      routeBackName: "settings",
      iconV: "3",
      he: "he",
      en: "en",
    };
  },
  computed: {
    // ...mapGetters("userSetting", ["getUserLanguageSetting"])
    UserLang() {
      return this.userSettings.settings.language
        ? this.userSettings.settings.language
        : "he";
    },
  },
  methods: {
    setLanguageTo(language) {
      // this.$store.dispatch("userSetting/setLanguage", language);
      this.userSettings.setSettings("language", language);
      loadLanguageAsync(language);

      // htmlElement.setAttribute("language", language);
    },
  },
};
</script>

<style lang="scss" scoped>
.scale-input {
  padding: 2px;
  font-size: 13px;
  border-width: 1px;
  border-color: #cccccc;
  background-color: #ffffff;
  color: #000000;
  border-style: solid;
  border-radius: 0px;
  /* box-shadow: 0px 0px 5px rgb(66 66 66 / 75%); */

  width: 50%;
}
.main-setting-menu {
  width: -webkit-fill-available;
  z-index: 3;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}
.list-main-setting {
  display: flex;
  flex-direction: column;
  // margin: 0;
  // padding: 0;
  list-style-type: none;
}
.underline-separate {
  border-bottom: 1px solid #ececec;
  margin-top: 13px;
  margin-bottom: 16px;
  list-style-type: none;
}
</style>
