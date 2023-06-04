<template>
  <div class="main-setting-menu">
    <HeaderMenu
      :arrow="arrow"
      :title="$t('licenseCode.name')"
      :routeBackName="routeBackName"
    />
    <div class="item">
      <div class="bold mrg-b-3">{{ $t("licenseCode.enterCode") }}</div>
      <div>
        <input
          @keyup.enter="updateLic"
          class="w-100 input-border"
          v-model="code"
          @input="updateTyped"
        />
      </div>
      <div class="flex flex-bet">
        <span class="text-gray">{{ typedMsg }}</span>
        <baseButton class="mrg-t-6" @click="updateLic()">{{
          $t("licenseCode.update")
        }}</baseButton>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapGetters, mapActions } from "vuex";
import menuService from "@/services/menu";
import { updateLicense } from "@/services/offline/license.js";
import { doHardReload } from "@/services/bookData.js";

export default {
  data() {
    return {
      routeBackName: "help",
      code: "",
      codeTyped: 0,
    };
  },
  props: {
    arrow: { default: true },
  },
  computed: {
    typedMsg() {
      return this.codeTyped === 0
        ? ""
        : this.codeTyped + " " + this.$t("about.characters");
    },
  },
  methods: {
    updateLic() {
      if (!this.code) return;
      let message = "",
        type = "";
      let packageChange =
        this.code.toLowerCase().indexOf("a0") > -1
          ? this.$t("about.refreshNow")
          : "";

      updateLicense(this.code).then((res) => {
        if (res) {
          menuService.closeMenu();
          type = "success";
          message = this.$t("about.succedUpdateLicens") + packageChange;

          //refresh list if needed
          if (packageChange) doHardReload();
        } else {
          message = this.$t("about.errorUpdate");
          type = "error";
        }
        const notification = {
          type,
          message,
          timeout: 3000,
        };
        this.$notify(notification);
      });
    },
    updateTyped($event) {
      this.codeTyped = $event.target.value.length;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.item {
  padding: 20px;
}
</style>
