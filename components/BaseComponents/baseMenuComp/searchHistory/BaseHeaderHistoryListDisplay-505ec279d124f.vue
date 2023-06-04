<template>
  <div class="header-history-list-display rtl">
    <div class="outer-header">
      <div class="flex rtl dir-rtl">
        <baseCheckBox
          class="check-item check-larg"
          :class="{ 'check-minus': checkMinus }"
          @change="checkAll"
          :checked="hasCheckedTop"
          size="larg"
          :minus="checkMinus"
        />
        <div v-if="hasCheckedTop" class="icons-header-top">
          <span
            class="icon-otzar icon-trash"
            :class="{ active: hasCheckedTop }"
            @click="deleteCheckedListSearchItems()"
            >9</span
          >
          <span
            class="icon-general icon-pin"
            :class="{ disable: hasPin && hasntPin }"
            @click="setSearchItemsPinList(1)"
            >r</span
          >
          <span
            class="icon-general icon-cancel-pin"
            :class="{ disable: !hasPin && !hasntPin }"
            @click="setSearchItemsPinList(0)"
            >s</span
          >
        </div>
        <div
          class="icon-otzar icon-trash remove-all"
          @click="deleteCheckedListSearchItems(-1)"
          v-tooltip="{
            content: $t('general.removeAllList'),
            placement: 'top',
          }"
        >
          9
        </div>
      </div>

      <div class="filter-history" :class="'combo-' + labelType">
        <ComboboxInput
          class="fit-height fit-history"
          :items="filterHistory"
          @input="filterByTypeSearch($event)"
          :labelStart="labelStart"
          :labal="label"
          :labelKey="label"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      label: this.startLabel,
      labelType: "all",
      labelKey: 0,
      labelStart: 0,
    };
  },
  computed: {
    ...mapGetters("userSearchHistory", [
      "getUserSearchHistory",
      "getSearchHistoryListChecked",
    ]),
    startLabel() {
      return this.$t("hisory.showAll");
    },
    userSearchHistory() {
      return this.getUserSearchHistory;
    },
    userSearchHistoryListChecked() {
      return this.getSearchHistoryListChecked;
    },
    hasPin() {
      let isPin = false;
      this.userSearchHistory.forEach((sl) => {
        if (this.userSearchHistoryListChecked.find((id) => id == sl.id)) {
          if (sl.pin == 1) isPin = true;
        }
      });
      return isPin;
    },
    hasntPin() {
      let isntPin = true;
      this.userSearchHistory.forEach((sl) => {
        if (this.userSearchHistoryListChecked.find((id) => id == sl.id)) {
          if (sl.pin == 0) isntPin = false;
        }
      });
      return isntPin;
    },
    checkMinus() {
      if (
        this.userSearchHistoryListChecked.length > 0 &&
        this.userSearchHistoryListChecked.length !==
          this.userSearchHistory.length
      )
        return true;
      return false;
    },
    hasCheckedTop() {
      if (this.userSearchHistoryListChecked.length > 0) {
        return true;
      }
      return false;
    },
    filterHistory() {
      return [
        { label: this.$t("hisory.showAll"), key: 0, name: "all" },
        { label: this.$t("hisory.inContentBook"), key: 1, name: "free" },
        { label: this.$t("hisory.inNameBookAndAuthor"), key: 2, name: "book" },
        { label: this.$t("hisory.isList"), key: 3, name: "list" },
      ];
    },
  },
  methods: {
    ...mapActions("userSearchHistory", [
      "checkAllListSearch",
      "setSearchItemPinList",
      "deleteCheckedListSearch",
      "setHistoryType",
    ]),
    filterByTypeSearch(e) {
      this.labelType = e.name;
      this.setHistoryType(e.name);
      this.$emit("change-type-search", e);
    },
    checkAll($event) {
      if ($event.target.checked) this.checkAllListSearch(true);
      else this.checkAllListSearch(false);
    },
    setSearchItemsPinList(isPin) {
      this.setSearchItemPinList(isPin);
    },
    async deleteCheckedListSearchItems(item) {
      if (item === -1) {
        //deleting all the history
        let act = await this.$msg({
          title: this.$t("historyMenu.deleteAllHistory"),
          content: this.$t("historyMenu.youSureToDeleteAll"),
          btns: [this.$t("general.yes"), this.$t("general.no")],
        });
        if (act === this.$t("general.yes")) this.deleteCheckedListSearch(item);
      } else this.deleteCheckedListSearch();
    },
  },
};
</script>
<style lang="scss" scoped>
.filter-history .fit-height.fit-history {
  width: 190px;
}

.header-history-list-display {
  display: flex;
  // margin-left: 5px;
  align-items: center;
  background-color: rgb(241, 245, 247);
}
.slash-tack-icon:after {
  content: "/";
  color: black;
  font-weight: 700;
  font-size: 35px;
  position: relative;
  left: 15px;
}
.icon-otzar.icon-trash.remove-all {
  color: var(--custom-color1);
  line-height: 24px;

  width: 24px;
  border-radius: 24px;
  margin: 0 3px;
  transition: 0.3s;
  &.active {
    background-color: #0000001f;
  }
  &:hover {
    background-color: #00000038;
  }
}
</style>
