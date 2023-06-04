<template>
  <div class="icons-free">
    <div
      @click="toggleGzirim"
      class="icon-otzar otz-icon-square otz-icon"
      v-if="!isSpecialSearch && gzirim && !$_mobile"
      v-tooltip="{ content: this.$t('tooltip.gzirim'), placement: 'top' }"
    >
      w
    </div>
    <div
      @click="toggleGzirim"
      class="icon-otzar otz-icon-square otz-icon"
      v-if="!isSpecialSearch && !gzirim"
      v-tooltip="{ content: this.$t('tooltip.list'), placement: 'top' }"
    >
      I
    </div>

    <div
      class="icon-otzar otz-icon-square otz-icon"
      @click="filterFSResults"
      v-tooltip="{ content: this.$t('tooltip.filter'), placement: 'top' }"
    >
      J
    </div>

    <!-- <baseDropDown :class="['left settings']" :selfClose="false">
      <template #button class="list-dropdown">
        <div
          class="icon-pin mrg-l-3 mef-icon icon-circle"
          style="font-size: 48px;line-height: 21px;"
        >
          6
        </div>
      </template>
      <template #list="{ clicked }" class="list-dropdown disable 777">
        <div class="">
          <titleAndXHeader @click="clicked">{{
            $t("setting.settingListFree")
          }}</titleAndXHeader>
          <div class="list-content">
            <div>
              <div class="title">
                {{ $t("setting.titleHeightGzirim") }}
              </div>
              <li
                class="item item-check"
                @click="setSettingHeightGzir('low')"
                :class="{ checked: heightGzirim == 'low' }"
              >
                <div class="row-menu">
                  <span
                    v-if="heightGzirim == 'low'"
                    class="font-icon check-icon"
                    >A</span
                  >
                  <div class="row-title">{{ $t("setting.gzirinLow") }}</div>
                </div>
              </li>
              <li
                class="item item-check"
                :class="{ checked: heightGzirim == 'medium' }"
                @click="setSettingHeightGzir('medium')"
              >
                <div class="row-menu">
                  <span
                    v-if="heightGzirim == 'medium'"
                    class="font-icon check-icon"
                    >A</span
                  >
                  <div class="row-title">{{ $t("setting.gzirinMedium") }}</div>
                </div>
              </li>
              <li
                class="item item-check"
                :class="{ checked: heightGzirim == 'high' }"
                @click="setSettingHeightGzir('high')"
              >
                <div class="row-menu">
                  <span
                    v-if="heightGzirim == 'high'"
                    class="font-icon check-icon"
                    >A</span
                  >
                  <div class="row-title">{{ $t("setting.gzirinHigh") }}</div>
                </div>
              </li>
            </div>
            <div class="underline-separate" style="display:none"></div>
            <div style="display:none">
              <div class="sub-title">
                {{ $t("setting.titleSortList") }}
              </div>

              <li
                class="item item-check"
                :class="{
                  checked: userSettings.settings.sortBookList == 'book',
                }"
              >
                <div class="row-menu">
                  <span
                    v-if="userSettings.settings.sortBookList == 'book'"
                    class="font-icon check-icon"
                    >A</span
                  >
                  <div class="row-title">
                    {{ $t("changeBookInfo.bookName") }}
                  </div>
                </div>
              </li>
              <li
                class="item item-check"
                :class="{
                  checked: userSettings.settings.sortBookList == 'author',
                }"
              >
                <div class="row-menu">
                  <span
                    v-if="userSettings.settings.sortBookList == 'author'"
                    class="font-icon check-icon"
                    >A</span
                  >
                  <div class="row-title">
                    {{ $t("changeBookInfo.authorName") }}
                  </div>
                </div>
              </li>
              <li
                class="item item-check"
                :class="{
                  checked: userSettings.settings.sortBookList == 'author',
                }"
              >
                <div class="row-menu">
                  <span
                    v-if="userSettings.settings.sortBookList == 'author'"
                    class="font-icon check-icon"
                    >A</span
                  >
                  <div class="row-title">
                    {{ $t("changeBookInfo.deskResults") }}
                  </div>
                </div>
              </li>
              <li
                class="item item-check"
                :class="{
                  checked: userSettings.settings.sortBookList == 'author',
                }"
              >
                <div class="row-menu">
                  <span
                    v-if="userSettings.settings.sortBookList == 'author'"
                    class="font-icon check-icon"
                    >A</span
                  >
                  <div class="row-title">
                    {{ $t("changeBookInfo.numResults") }}
                  </div>
                </div>
              </li>
              <li
                class="item item-check"
                :class="{
                  checked: userSettings.settings.sortBookList == 'author',
                }"
              >
                <div class="row-menu">
                  <span
                    v-if="userSettings.settings.sortBookList == 'author'"
                    class="font-icon check-icon"
                    >A</span
                  >
                  <div class="row-title">
                    {{ $t("changeBookInfo.orderDor") }}
                  </div>
                </div>
              </li>
            </div>
          </div>
        </div>

      </template>
    </baseDropDown> -->
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      gzirim: true,
      filter: "filter-search-free",
    };
  },
  computed: {
    ...mapState("freeSearchBookList", ["currentFsName", "resultsType"]),
    isSpecialSearch() {
      return this.resultsType == "special";
    },
    heightGzirim() {
      if (!this.userSettings.settings.height_gzir) return "low";
      return this.userSettings.settings.height_gzir;
    },
  },
  methods: {
    ...mapActions("freeSearchBookList", [
      "toggleShowResultsPopup",
      "setGzirim",
    ]),
    toggleGzirim() {
      this.gzirim = !this.gzirim;
      this.setGzirim(!this.gzirim);
    },
    filterFSResults() {
      this.toggleShowResultsPopup();
    },
    setSettingHeightGzir(size) {
      this.userSettings.setSettings("height_gzir", size);
    },
  },
  watch: {
    currentFsName: function() {
      this.gzirim = true;
      this.setGzirim(!this.gzirim);
    },
  },
};
</script>

<style lang="scss" scoped>
.icons-free {
  // width: 170px;
  display: flex;
}
.icon-div {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0);
  transition: 0.3s;
  position: relative;
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
  .icon-outer {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>
