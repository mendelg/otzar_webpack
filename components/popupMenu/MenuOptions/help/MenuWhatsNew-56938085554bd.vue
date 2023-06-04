<template>
  <div class="main-setting-menu">
    <HeaderMenu :title="title" :routeBackName="routeBackName" />
    <div
      class="item whats-new-container"
      style="overflow:auto"
      v-if="whatsNew.length > 0"
    >
      <div class="title">
        {{ $t("about.whatsNewIn") }} {{ whatsNew[0].version }}?
      </div>
      <div class="underline-separate"></div>
      <div v-for="item in whatsNew" :key="item.id">
        <p>
          {{ item.title }}
        </p>
        <div class="underline-separate"></div>
      </div>
    </div>
    <div v-else>
      <div class="item">{{ $t("about.noData") }}</div>
    </div>
  </div>
</template>

<script>
import { Axios } from "@/services/_axios";

export default {
  data() {
    return {
      routeBackName: "help",
      iconV: "3",
      showFileExplore: false,
      resolveLocationSelected: null,
      showRestorePopup: false,
      backupProgress: null,
      whatsNew: [],
    };
  },

  async created() {
    try {
      let whatsNew = await Axios.get("/api/general/whats-new");
      if (whatsNew != "") whatsNew = whatsNew.data;
      else whatsNew = [];
      whatsNew.forEach((n) => {
        if (this.userSettings.settings.language == "en") n.title = n.title_eng;
        else n.title = n.title_heb;
      });
      this.whatsNew = whatsNew;
    } catch (ex) {
      console.log(ex);
    }
  },

  methods: {},
  computed: {
    title() {
      return this.$t("about.whatsNew");
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
.main-setting-menu {
  color: var(--custom-color1);
  .title {
    color: #7f7f7f;
    font-weight: bold;
    font-size: 13px;
  }
  .item {
    // border-bottom: 1px solid #ececec;
    padding: 20px;
  }
}
</style>
