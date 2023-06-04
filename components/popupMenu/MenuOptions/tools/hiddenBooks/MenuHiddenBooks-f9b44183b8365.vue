<template>
  <div class="main-setting-menu">
    <HeaderMenu
      :title="$t('hiddenbooks.menuTitle')"
      :routeBackName="routeBackName"
    />
    <ul class="list-main-setting list-menu">
      <li class="item">
        <RowItem
          v-disable
          @click="enableHiddenBooks"
          :title="$t('hiddenbooks.enable')"
          :HasIconItem="false"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          iconItem="8"
          :HasIconCheckbox="true"
          :displayCheckbox="hideMode"
          type="checkbox"
        />
        <router-view />
      </li>
      <li class="row-in-setting item" :class="{ disable: !hideMode }">
        <RowItem
          v-disable
          @click="showHiddenList()"
          :title="$t('hiddenbooks.showList')"
          :HasIconItem="false"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
        />
        <router-view />
      </li>

      <li class="item" :class="{ disable: !hideMode }">
        <RowItem
          v-disable
          @click="resetHideBooks()"
          @change="resetHideBooks"
          :title="$t('hiddenbooks.reset')"
          :HasIconItem="false"
          :HasIconArrow="false"
          :HasIconDisplay="false"
          :HasIconCheckbox="false"
        />
        <router-view />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from "vuex";

import { books } from "@/store/modules/books";
export default {
  data() {
    return {
      routeBackName: "tools",
      commentsIcon: "fa fa-comment-o",
      keysIcon: "fa fa-key",
      markersIcon: "fa fa-paint-brush",
      linksIcon: "fa fa-link",
    };
  },
  computed: {
    hideMode() {
      const mode = this.userSettings.settings.enableHidden != "0";
      return mode;
    },
  },
  methods: {
    ...mapActions("bookList", ["setShowHiddenBooks", "addUserActionToHistory"]),
    showHiddenList() {
      if (!this.hideMode) return;
      let ids = books.filter((a) => a._hide).map((a) => a.id);
      this.addUserActionToHistory({
        type: "HIDDEN_LIST",
        content: this.$t("userDefaultFolders.hiddenbooks"),
        ids,
      });
    },
    enableHiddenBooks() {
      let mode = this.userSettings.settings.enableHidden != "0";
      this.userSettings.setSettings("enableHidden", !mode);
    },
    async resetHideBooks() {
      if (!this.hideMode) return;
      books.forEach((a) => {
        if (1 || a._inHide) {
          a._inHide = false;
          a._hide = 0;
        }
      });
      this.$nextTick(async () => {
        await this.userSettings.setSettings("hiddenBooks", JSON.stringify([]));

        this.$store.state.booksChanged++;
        const notification = {
          type: "success",
          message: this.$t("resetHideBook"),
          timeout: 2000,
        };
        this.$notify(notification);
      });
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
