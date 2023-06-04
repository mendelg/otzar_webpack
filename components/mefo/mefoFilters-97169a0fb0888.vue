<template>
  <div class="flex mef-filters mef-splitter">
    <div class="flex mef-header-filters">
      <div class="flex filter-mef-by-name">
        <!-- <p class="lbl-filter-name">
          {{ $t("mefo.filterOptions") }}
        </p> -->
        <div style="width:100%">
          <baseInputIconSearch
            :placeholder="$t('mefo.searchPlaceHolder')"
            @input="setTxtFilter($event)"
            @search="setTxtFilter($event)"
            @clear="setTxtFilter($event)"
          />
        </div>
      </div>
      <div class="flex filter-mef-sort-by">
        <ComboboxInput
          class="fit-height max-width-combo"
          :items="filterTypeItems"
          :selectedlist="filters.type"
          @input="filterType"
          :labelStart="0"
          :labal="''"
          :labelKey="1"
          :allSelectedLabel="$t('mefo.filterByCategory')"
          :selfClose="false"
        />
      </div>
      <div class="flex buttons-filter">
        <BaseOverCircle>
          <span
            class="btn-header"
            v-tooltip="
              !enableFilters ? $t('mefo.doFilter') : $t('mefo.stopFilter')
            "
            @click="toggleEnableFilters"
          >
            <!-- <div
              style="width:18px;height:18px;display: flex;align-items: center;"
            > -->
            <!-- <div
                
                style="width:16px;height:16px"
                :style="{
                  fill: filters.enabled ? 'var(--text-color2)' : '#626262',
                  stroke: filters.enabled ? 'var(--text-color2)' : '#626262',
                }"
              >
                <Icons icon="filter" height="16px" width="16px" />
              </div> -->
            <div
              v-if="enableFilters"
              class="mef-font"
              style="font-size: 65px;color:var(--text-color2)"
            >
              k
            </div>
            <div
              v-else
              class="mef-font"
              style="font-size: 65px;color:var(--text-color2)"
            >
              U
            </div>
            <!-- </div> -->
          </span>
        </BaseOverCircle>
      </div>
    </div>
    <div
      class="flex mef-generation-filters"
      :style="{ overflow: $_mobile ? 'auto' : '' }"
    >
      <div
        class="mef-circle"
        @click="selectGen(null)"
        :style="
          filters.gen == null
            ? 'background-color: var(--custom-color2);border-color: var(--custom-color2);'
            : ''
        "
      >
        <span class="mef-circle-title">{{ $t("mefo.allResults") }} </span>
        <span class="mef-circle-count">
          {{ filteredMefarshim.all }}
        </span>
      </div>
      <template v-for="(dor, key) in dorot">
        <div
          class="mef-circle"
          :key="key"
          v-if="filteredMefarshim.dorot[key]"
          :style="
            filters.gen == key ? 'background-color:  var(--custom-color2);' : ''
          "
          @click="selectGen(key)"
        >
          <span class="mef-circle-title">
            {{ dor }}
          </span>
          <span class="mef-circle-count">
            {{ filteredMefarshim.dorot[key] }}
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Icons from "@/components/Icons/Icons.vue";
export default {
  props: ["mefarshim"],
  components: { Icons },
  data() {
    return {
      enableFilters: true,
      filters: {
        type: ["s", "d", "p", "z", "h"],
        gen: null,
        enabled: true,
        txtFilter: "",
      },
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
    setTxtFilter(e) {
      let txt = "";
      try {
        txt = e ? e.target.value : "";
      } catch {
        txt = e;
      }
      this.filters.txtFilter = txt;
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
.mef-filters {
  flex-direction: column;
  padding: 6.5px 11px;
}
.mef-splitter {
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #dedede;
}
.mef-header-filters {
  align-items: center;
  margin: 10px 0px;
}
.mef-circle-count {
  color: white;
  position: absolute;
  left: 50%;
  width: 47.1px;
  font-size: 11px;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  bottom: 8.19px;
  height: 16.38px;
}
.mef-generation-filter {
  flex-wrap: wrap;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  padding-top: 9px;
  padding-bottom: 10.96px;
  border-bottom-color: #dedede;
  flex-wrap: wrap;
  justify-content: center;
}
.mef-header-filters {
  .filter-mef-sort-by {
    .FilterCombo {
      height: 26px;
      width: 110px;
    }
  }
}
.mef-circle:hover {
  background-color: var(--custom-color2);
  border-color: var(--custom-color2);
}
.mef-circle-title {
  padding-left: 9.22px;
  padding-right: 9.22px;
  padding-bottom: 14.34px;
  font-size: 13px;
  line-height: 14px;
  display: inline-block;
  height: 40.96px;
  padding-top: 10.24px;
  text-align: center;
}
.filter-mef-by-name {
  align-items: center;
  flex-grow: 1;
  .input {
    padding-right: 0;
  }
}
.buttons-filter {
  flex-wrap: wrap;
  justify-content: center;
}
.lbl-filter-name {
  margin: 0px;
  color: var(--text-color1);
  line-height: 16px;
}
.mef-generation-filters {
  flex-wrap: nowrap;
}
.mef-circle {
  color: white;
  height: 65.54px;
  width: 69.63px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 50%;
  background-color: var(--custom-color1);
  border-color: var(--custom-color1);
  border-width: 1px;
  border-style: solid;
  text-align: center;
  vertical-align: middle;
  margin: 3.37px;
  margin-right: 0;
  cursor: pointer;
  position: relative;
  display: inline-block;
}
[size-width-area-list="larg"],
[size-width-area-list="normal"],
[size-width-area-list="small"] {
  .flex.mef-filters.mef-splitter {
    .mef-circle {
      height: 60px;
      width: 60px;
      margin: 2.5px;
      margin-right: 0;
      font-size: 12px;
      .mef-circle-title {
        padding-right: 3px;
        padding-left: 3px;
      }
    }
  }
}

[size-width-area-list="normal"],
[size-width-area-list="small"] {
  .flex.mef-filters.mef-splitter {
    .mef-circle {
      border-radius: 10px;
    }
  }
}
</style>
