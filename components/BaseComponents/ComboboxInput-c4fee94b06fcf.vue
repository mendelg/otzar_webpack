<template>
  <div
    class="FilterCombo no-select"
    @click="toggleCombo"
    :class="{ FilterComboFocus: showMenu }"
    v-click-outside="closeCombo"
  >
    <div class="selected-text text-col">
      <template v-if="icons">
        <template v-if="items[start].icon == 'fr'">
          <img class="flag-icon" src="@/assets/img/fr.jpg" />
        </template>
        <template v-if="items[start].icon == 'us'">
          <img class="flag-icon" src="@/assets/img/us.jpg" />
        </template>
        <template v-if="items[start].icon == 'il'">
          <img class="flag-icon" src="@/assets/img/il.jpg" />
        </template>
      </template>

      {{ selected }}
    </div>
    <div class="arrow-down-col" :class="{ open: showMenu }">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="7.449"
        height="4.717"
        viewBox="0 0 7.449 4.717"
      >
        <g
          id="icon-arrow-combo"
          data-name="חץ לקומבחו"
          transform="translate(0.565 0.064)"
        >
          <path
            id="Path_23"
            data-name="Path 23"
            d="M127.4,52.591l2.654,2.885,2.675-2.907"
            transform="translate(-126.902 -51.573)"
            fill="none"
            stroke="#7b7b7b"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-miterlimit="10"
            stroke-width="1.5"
          />
        </g>
      </svg>
    </div>
    <div
      :style="listStyle"
      style="overflow:auto;z-index:3"
      :class="{
        'open-menu': showMenu && !grid,
        'open-menu-grid': showMenu && grid,
        'option-items': !grid,
        'option-items-grid': grid,
      }"
      @click.stop="selfCloseCombo"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        :class="{ 'combo-item': !grid, 'combo-item-grid': grid }"
        @click="triggerInput(item, index)"
      >
        <template v-if="icons">
          <template v-if="item.icon == 'fr'">
            <img class="flag-icon" src="@/assets/img/fr.jpg" />
          </template>
          <template v-if="item.icon == 'us'">
            <img class="flag-icon" src="@/assets/img/us.jpg" />
          </template>
          <template v-if="item.icon == 'il'">
            <img class="flag-icon" src="@/assets/img/il.jpg" />
          </template>
        </template>
        <template v-if="no_decoration">
          <span>{{ item.label }}</span>
        </template>
        <template v-else>
          <span
            class="font-icon selected-sign"
            v-if="item.label.indexOf('A') > -1"
            >A</span
          >
          <span :class="{ 'label-option': grid }">{{
            item.label.replace("A", "")
          }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ComboboxInput",
  props: {
    no_decoration: {
      default: false,
    },
    grid: {
      default: false,
    },
    selectedlist: { default: null },
    items: {},
    LabelKey: 0,
    value: {
      default: "",
    },
    labelStart: {
      default: 0,
    },
    listStyle: {
      default: "max-height:200px",
    },
    allSelectedLabel: {
      default: "",
    },
    selfClose: {
      default: true,
    },
    noTriggerInput: {
      default: false,
    },
    icons: {
      default: false,
    },
  },
  data() {
    return {
      showMenu: false,
      start: this.labelStart,
    };
  },
  computed: {
    selected() {
      // if (typeof this.value[this.LabelKey] === "undefined")
      //   return this.items[this.labelStart].label;
      if (this.selectedlist) {
        let ret = "";
        if (
          this.selectedlist.length == this.items.length - 1 ||
          this.selectedlist.length == 0
        )
          ret = this.allSelectedLabel;
        // this.$t("general.all");
        else
          this.items.forEach((e) => {
            if (this.selectedlist.includes(e.name))
              if (!this.no_decoration) {
                ret +=
                  ret == ""
                    ? e.label.replace("A ", "")
                    : ", " + e.label.replace("A ", "");
              } else {
                ret += ret == "" ? e.label : ", " + e.label;
              }
          });
        return ret;
      }
      if (!this.items.length) return "";
      return this.items[this.start] ? this.items[this.start].label : "";
    },
  },
  watch: {
    labelStart: function() {
      this.start = this.labelStart;
    },
  },
  methods: {
    openCombo() {
      this.showMenu = true;
    },
    toggleCombo() {
      if (this.showMenu) this.showMenu = false;
      else this.showMenu = true;
    },
    closeCombo() {
      this.showMenu = false;
    },
    selfCloseCombo() {
      if (this.selfClose) this.showMenu = false;
    },
    triggerInput(data, index) {
      if (!this.noTriggerInput) this.start = index;
      this.$emit("input", data);
    },
  },
};
</script>

<style scoped>
.ontop {
  position: relative;
  z-index: 3;
}
.selected-text {
  text-overflow: ellipsis;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.selected-sign {
  font-size: 15px;
  padding-left: 5px;
  padding-top: 2px;
}
.flag-icon {
  width: 25px;
  height: 15px;
  margin-left: 5px;
}
</style>
