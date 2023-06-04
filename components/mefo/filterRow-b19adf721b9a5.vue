<template>
  <div>
    <div class="filter-body">
      <div class="firstRow">
        <div class="font-icon">
          <ComboboxInput
            class="fit-height fit-history"
            :items="filterTypeItems"
            @input="filterType"
            :labelStart="0"
            :labal="'aaa'"
            :labelKey="1"
          />
        </div>
        <div
          class="font-icon"
          :style="{ color: filters.enabled ? 'var(--custom-color2)' : '' }"
          v-tooltip="$t('mefo.toggleFilter')"
          @click="toggleEnableFilters"
        >
          t
        </div>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <div
          class="filter-type-btn-circle"
          @click="selectGen(null)"
          :style="filters.gen == null ? 'background-color: white;' : ''"
        >
          <span class="filterButtonText">
          {{$t("mefo.allResults")}}
          </span>
          <span class="filterButtonText">
            {{ filteredMefarshim.all }}
          </span>
        </div>
        <template v-for="(dor, key) in dorot">
          <div
            :key="key"
            v-if="filteredMefarshim.dorot[key]"
            class="filter-type-btn-circle"
            :style="filters.gen == key ? 'background-color: white;' : ''"
            @click="selectGen(key)"
          >
            <span class="filterButtonText">
              {{ dor }}
            </span>
            <span class="filterButtonText">
              {{ filteredMefarshim.dorot[key] }}
            </span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["mefarshim"],
  data() {
    return {
      enableFilters: true,
      filters: { type: ["s", "d", "p", "z", "h"], gen: null, enabled: true },
      dorot: {
        1: 'מקרא וחז"ל',
        2: "ראשונים וקדמונים",
        3: 'אחרונים ש-ת"ר',
        4: 'אחרונים ת"ר -ת"ש',
        5: "אחרוני זמנינו",
        6: "אחרים",
      },
      dorSelected: null,
    };
  },
  methods: {
    toggleEnableFilters() {
      this.enableFilters = !this.enableFilters;
      this.filters.enabled = this.enableFilters;
      this.$emit("filter", this.filters);
    },
    selectGen(gen) {
      this.filters.gen = gen;
      this.$emit("filter", this.filters);
    },
    filterType(e) {
      if (e.name == "default") {
        if (this.filters.type.length == 5) this.filters.type = [];
        else this.filters.type = ["s", "d", "p", "z", "h"];
      } else {
        if (this.filters.type.includes(e.name))
          this.filters.type = this.filters.type.filter((t) => t != e.name);
        else this.filters.type.push(e.name);
      }
      this.$emit("filter", this.filters);
    },
  },
  computed: {
    filterTypeItems() {
      const chb = (name) => {
        return (name == "default" && this.filters.type.length == 5) ||
          this.filters.type.includes(name)
          ? `A `
          : "";
      };
      return [
        { label: chb("default") + "הכל", key: 0, name: "default" },
        { label: chb("s") + "שיעור", key: 1, name: "s" },
        { label: chb("d") + "דרוש", key: 2, name: "d" },
        { label: chb("p") + "פירוש", key: 3, name: "p" },
        { label: chb("z") + "ציון", key: 4, name: "z" },
        { label: chb("h") + "הגהה", key: 5, name: "h" },
      ];
    },
    filteredMefarshim() {
      let mefarshim = this.mefarshim;
      if (this.filters.type)
        mefarshim = mefarshim.filter((s) => this.filters.type.includes(s.type));

      const dorot = {};
      for (const dor in this.dorot) {
        dorot[dor] = mefarshim.filter(
          (m) => m.otzarBook && m.otzarBook.dor == dor
        ).length;
      }
      return { all: mefarshim.length, dorot };
    },
  },
};
</script>

<style lang="scss" scoped>
.filter-body {
  //   display: flex;
  //   justify-content: space-between;
}
.filter-type-btn-circle {
  box-sizing: border-box;
  border-radius: 50%;
  background-color: #f1f1f1;
  border-color: #dedede;
  border-width: 1px;
  border-style: solid;
  text-align: center;
  vertical-align: middle;
  margin: 3px;
  cursor: pointer;
  position: relative;
  display: inline-block;
  padding: 10px;
}
.filter-type-btn-circle:hover {
  background-color: #dedede;
}
.filterButtonText {
  //   padding-left: 9.22px;
  //   padding-right: 9.22px;
  //   padding-bottom: 14.34px;
  width: 51.2px;
  font-size: 13px;
  line-height: 14px;
  display: inline-block;
  //   height: 40.96px;
}
.firstRow {
  display: flex;
  justify-content: space-between;
}
</style>
