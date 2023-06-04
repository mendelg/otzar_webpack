<template>
  <div class="main-setting-menu">
    <HeaderMenu
      :title="$t('mainLanguage.title')"
      :routeBackName="routeBackName"
    />

    <ul class="list-main-setting list-menu">
      <li class="item item-check" :class="{ checked: UserLang == 'he' }">
        <RowItem
          @click="setLanguageTo(he)"
          :title="$t('mainLanguage.he')"
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
          :title="$t('mainLanguage.en')"
          :HasIconItem="UserLang == 'en'"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
        />
      </li>
      <li class="item item-check" :class="{ checked: UserLang == 'fr' }">
        <RowItem
          v-disable
          @click="setLanguageTo(fr)"
          :title="$t('mainLanguage.fr')"
          :HasIconItem="UserLang == 'fr'"
          :iconItem="iconV"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
        />
      </li>
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
      fr: "fr",
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
</style>
