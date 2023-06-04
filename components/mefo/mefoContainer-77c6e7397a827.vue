<template>
  <div class="font mefo-container">
    <mefHeader
      @closeMef="closeMefo()"
      @sortBy="sortName = $event"
      :minimizeAll="minimizeAll"
      @toggleFilters="showFilters = !showFilters"
      @toggleMini="minimizeAll = !minimizeAll"
      :gridMode="showGrid"
      @toggleGridMode="toggleGrid"
      :bookview="bookView"
      @toggleBookView="bookView = !bookView"
      :showFilters="showFilters"
    />
    <mefFilters
      @filter="(f) => (filters = f)"
      v-show="showFilters"
      :mefarshim="filters.txtFilter == '' ? mefarshim : mefarshimToshow"
    />
    <mefSectionsHeader
      v-show="showFilters"
      @sortBy="sortName = $event"
      :minimizeAll="minimizeAll"
      @toggleMini="minimizeAll = !minimizeAll"
      :gridMode="showGrid"
      @toggleGridMode="toggleGrid"
      :bookview="bookView"
      @toggleBookView="bookView = !bookView"
    />

    <div class="mef-scroller">
      <img v-if="$store.state.mefo.loading" src="@/assets/img/bookloader.svg" />

      <div ref="sectionsContaier" class="sectionsContaier">
        <div class="mef-net-msg" v-if="noPlaceOnTheServer || kickOut">
          <p v-if="noPlaceOnTheServer">{{ $t("mefo.noPlace") }}</p>
          <p v-if="kickOut">{{ $t("mefo.disconnected") }}</p>
        </div>

        <template v-else v-for="(mefSec, i) in mefarshimToshow">
          <mefSectionCard
            :resize_trigger="resize_trigger"
            @enter="insertIntoView(mefSec.index, i)"
            @saveTempImg="saveTempImg"
            :tempBookImages="tempImages[mefSec.book]"
            :shasSecSelected="shasSecSelected"
            :loadContent="
              intersected.sectionsToLoad[mefSec.id] || mefSec.index < 5
            "
            :key="'mc' + mefSec.id"
            :mefSection="mefSec"
            :bookView="bookView"
            :minimizeAll="minimizeAll"
            :showGrid="showGrid"
          ></mefSectionCard>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import * as mefo from "@/services/mefo/mefo.js";
import mefSectionCard from "@/components/mefo/mefSectionCard.vue";
import filterRow from "@/components/mefo/filterRow.vue";
import mefHeader from "./mefoHeaderBar.vue";
import mefFilters from "./mefoFilters.vue";
import mefSectionsHeader from "./mefSectionsHeader.vue";
//import * as mefConnection from "@/services/mefConnection.js";
import { mapActions } from "vuex";
const mefarshimData = new Map();
export default {
  components: {
    mefSectionCard,
    filterRow,
    mefHeader,
    mefFilters,
    mefSectionsHeader,
  },
  props: ["tabId", "resize_trigger"],
  data() {
    return {
      componentId: null,
      refreshDataTrigger: false, //changes to be reactive
      lastOne: [],
      tempImages: {},
      intersected: { sectionsToLoad: {}, index: 0 },
      mefarshim: [],
      showGrid: false,
      bookView: false,
      minimizeAll: false,
      showFilters: true,
      enableFilters: true,
      srchStr: "",
      applySearch: "",
      filters: { type: ["s", "d", "p", "z", "h"], gen: null, txtFilter: "" },
      sortName: "default",
    };
  },
  computed: {
    shasSecSelected() {
      //if (this._mobile) return this.$store.state.mefo.currentShasSectionId;
      let sec = this.$store.state.tabs[this.tabId].shasSecSelected;
      return sec;
    },
    showMefoArea() {
      return this.$store.state.mefo.showMefoArea;
    },
    noPlaceOnTheServer() {
      return this.$store.state.mefo.no_space;
    },
    kickOut() {
      return this.$store.state.mefo.kickout;
    },

    mefarshimToshow() {
      let mefarshim = this.mefarshim;
      if (this.mefarshim.length == 0) return [];
      mefarshim = mefarshim.filter((a) => {
        return (
          a.rects.length &&
          this.$store.getters["books/getBookbyId"](a.book, true)
        );
      });

      //filter by text

      this.applySearch = this.filters.txtFilter.trim();
      if (this.applySearch) {
        this.applySearch = this.applySearch.trim();
        mefarshim = mefarshim.filter((s) => {
          try {
            const subbook = s.rects[0] ? s.rects[0].subbook : 0;
            if (subbook) {
              return (
                !s.otzarBook || //TODO book not recognize
                s.otzarBook.subBooks[subbook].name.indexOf(this.applySearch) >
                  -1 ||
                s.otzarBook.subBooks[subbook].author.indexOf(this.applySearch) >
                  -1 ||
                s.otzarBook.subBooks[subbook].volume?.indexOf(
                  this.applySearch
                ) > -1
              );
            } else
              return (
                !s.otzarBook || //TODO book not recognize
                s.otzarBook.name.indexOf(this.applySearch) > -1 ||
                s.otzarBook.authors_0_name.indexOf(this.applySearch) > -1 ||
                s.otzarBook.volume?.indexOf(this.applySearch) > -1
              );
          } catch (error) {
            return s; //TODO
          }
        });
      }

      if (this.filters.type && this.filters.enabled)
        mefarshim = mefarshim.filter((s) => this.filters.type.includes(s.type));

      if (this.filters.gen && this.filters.enabled) {
        mefarshim = mefarshim.filter(
          (s) => !s.otzarBook || this.filters.gen.includes(s.otzarBook.dor)
        );
      }

      if (this.sortName == "default")
        mefarshim.sort((a, b) => a.level - b.level);
      if (this.sortName == "alefbet")
        mefarshim.sort((a, b) => {
          //TODO unknow book
          if (!(a.otzarBook && b.otzarBook)) return 0;
          return a.otzarBook.name < b.otzarBook.name
            ? -1
            : a.otzarBook.name > b.otzarBook.name
            ? 1
            : 0;
        });
      for (let i = 0; i < mefarshim.length; i++) mefarshim[i].index = i;

      return mefarshim; //.slice(0, 25);
    },
  },
  methods: {
    ...mapActions("tabsManager", ["toggleSplitter", "showSidebar"]),
    resetOptions() {
      //dont reset it
      this.showGrid = false;
      this.bookView = false;
      this.minimizeAll = false;
      /*  this.showFilters = true;
      this.enableFilters = true;
      this.srchStr = "";
      this.applySearch = "";
      this.filters = {
        type: ["s", "d", "p", "z", "h"],
        gen: null,
        txtFilter: "",
      };
      this.sortName = "default"; */
    },
    toggleGrid() {
      if (!this.showGrid && this.minimizeAll) this.minimizeAll = false;
      this.showGrid = !this.showGrid;
      this.userSettings.setSettings("mefoDefaultGrid", this.showGrid);
    },
    saveTempImg(img, book, pageId) {
      if (!this.tempImages[book]) this.tempImages[book] = {};
      this.tempImages[book][pageId] = img;
    },
    async insertIntoView(index, i) {
      if (i != index);
      this.intersected.index = index;
      const indxToShow = [];
      for (let i = index - 2; i < index + (this.minimizeAll ? 20 : 4); i++)
        indxToShow.push(i);

      //timeout - if quick scroll
      // maybe this.intersected.index changed
      await new Promise((res, rej) => setTimeout(res, 250));
      if (!indxToShow.includes(this.intersected.index)) return;

      for (const section of this.mefarshimToshow) {
        const isInNextGroup = indxToShow.includes(section.index);
        if (isInNextGroup) {
          this.$set(this.intersected.sectionsToLoad, section.id, true);
        }
      }
    },
    closeMefo() {
      this.$store.dispatch(`mefo/setShowMefoArea`, false);
    },
    async loadResults() {
      if (!this.shasSecSelected?.length) return;

      let res = await mefo.getMefoSectionsByShasId(
        this.shasSecSelected.map((a) => a.id)
      );

      mefarshimData.set(this.componentId, res);
      this.mefarshim = res;
      this.$store.dispatch("mefo/setLoading", false);
    },
  },
  created() {
    this.componentId = Math.random(1 % 10000000);
    mefarshimData.set(this.componentId, {});
  },
  beforeDestroy() {
    mefarshimData.delete(this.componentId);
    this.refreshDataTrigger = !this.refreshDataTrigger;
  },
  mounted() {
    this.loadResults();
    if (this.userSettings.settings.mefoDefaultGrid != undefined) {
      this.showGrid =
        this.userSettings.settings.mefoDefaultGrid == 1 ? true : false;
    }
  },
  watch: {
    shasSecSelected: function(val, oldV) {
      /*   //set mef connection
      mefConnection.connectToMef(); */
      let same = true;

      for (let i = 0; i < val.length; i++) {
        if (!this.lastOne[i] || this.lastOne[i].id != val[i].id) {
          same = false;
          break;
        }
      }

      if (!oldV || !same) {
        this.lastOne = [...val];
        //show lst always
        //disable by erez :-)
        // this.resetOptions();
        this.showSidebar();
        this.toggleSplitter();

        this.tempImages = {};
        this.mefarshim = [];
        this.intersected.sectionsToLoad = {};
        this.loadResults();
      }
    },
    showMefoArea: function(val, oldV) {
      this.toggleSplitter();
    },
  },
};
</script>

<style lang="scss" scoped>
.mefo-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--main-bg-color);
}
.mef-scroller {
  overflow: scroll;
  direction: ltr;
  flex-grow: 1;
  background-color: whitesmoke;
}
.sectionsContaier {
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  direction: ltr;
  background-color: var(--main-bg-color);
}
.FilterTitle {
  /* color: #00a6a6; */
  padding-left: 11px;
  padding-right: 11px;
  font-size: 14px;
  font-weight: 500;
  text-align: right;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #dedede;
  height: 39px;
  display: flex;
  /* align-content: center; */
  align-items: center;
}

.FilterContainer {
  text-align: center;
  direction: rtl;

  background-color: #f5f5f5;
  // position: sticky;
  height: fit-content;
  width: 100%;
  top: 0px;
  z-index: 3;
}
.header-buttons span {
  cursor: pointer;
  padding: 2px 4px;
  // margin: 0px 1px;
  border-radius: 0.1rem;
  // background-color: rgba(128, 128, 128, 0.247);
}
.header-buttons span:hover {
  background-color: rgba(128, 128, 128, 0.384);
}
.mef-net-msg {
  margin: 10px;
  font-size: 14px;
  font-weight: 600;
}
</style>
