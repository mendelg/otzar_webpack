<template>
  <div>
    <ComboboxInput
      class="fit-height"
      :labal="label"
      :labelKey="label"
      :items="langs"
      @input="setLang($event)"
      :labelStart="labelStart"
      :no_decoration="true"
      :icons="true"
    />
  </div>
</template>

<script>
import { loadLanguageAsync } from "@/localization/local";
export default {
  data() {
    return {
      // label: this.$t("mainLanguage.he"),
      //  labelStart: 0,
    };
  },
  computed: {
    langs() {
      return [
        {
          label: this.$t("mainLanguage.he"),
          key: 0,
          name: "he",
          icon: "il",
        },
        {
          label: this.$t("mainLanguage.en"),
          key: 1,
          name: "en",
          icon: "us",
        },
        {
          label: this.$t("mainLanguage.fr"),
          key: 2,
          name: "fr",
          icon: "fr",
        },
      ];
    },
    label() {
      return this.$store.state.user.settings.language == "fr"
        ? 2
        : this.$store.state.user.settings.language == "en"
        ? 1
        : 0;
    },
    labelStart() {
      return this.$store.state.user.settings.language == "fr"
        ? 2
        : this.$store.state.user.settings.language == "en"
        ? 1
        : 0;
    },
  },
  methods: {
    setLang(e) {
      let language = e?.name || "he";
      this.userSettings.setSettings("language", language);
      loadLanguageAsync(language);
    },
  },
};
</script>

<style lang="scss" scoped>
.msg {
  width: fit-content;
  white-space: nowrap;
  color: var(--text-color1);
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
