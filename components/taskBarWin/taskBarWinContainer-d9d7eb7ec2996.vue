<template>
  <div class="flex flex-row-reverse relative">
    <!-- <div class="outer-toggle-task" @click="toggleList" v-if="items.length > 0">
      <div class="toggle-task">
        <base-icon
          width="4"
          height="8"
          nameIcon="arrow-next"
          pathIcon="icons-ganeral"
        ></base-icon>
      </div>
    </div> -->
    <div
      class="flex flex-row-reverse padd-3 list list-no-overflow no-warp"
      :class="{ show: show }"
      style="direction:rtl"
    >
      <div
        class="small-font btn font-w-normal btn-outline btn-bg-white otz-icon close-all"
        v-if="items.length > 0"
        @click="closeAll"
        v-tooltip="{
          content: this.$t('tabs.closeAll'),
          placement: 'auto-end',
        }"
      >
        F
      </div>
      <div
        class="small-font btn font-w-normal btn-outline btn-bg-white"
        v-if="items.length > 0"
        @click="miniAll"
        v-tooltip="{
          content: hasOpenItem
            ? this.$t('tabs.minimAll')
            : this.$t('tabs.openAll'),
          placement: 'auto-end',
        }"
      >
        {{ hasOpenItem ? "-" : "+" }}
      </div>

      <baseDropDown
        :class="['top']"
        :selfClose="true"
        v-if="showMoreBtn"
        dynamicClass="limit-height"
      >
        <template #button class="list-dropdown">
          <div
            class="small-font flex flex-center flex-align-center btn font-w-normal btn-outline btn-bg-white"
            style="height:25px;width:25px"
          >
            <div class="show-more-win">
              <div class="otz-icon arrow-1">q</div>
              <div class="otz-icon arrow-2">q</div>
            </div>
          </div>
        </template>
        <template #list class="list-content disable">
          <template v-for="item in items.slice(numVisibleTaskItems)">
            <item
              :title="item.content"
              :id="item.id"
              :cb="item.cb"
              :mode="item.mode"
              :key="item.id"
              :tabId="item.tabId"
              :close="item.close"
              class="flex"
              :list="true"
            />
          </template>
        </template>
      </baseDropDown>
      <!--   <div class="arrow-scroll" @click="scrollBtns(-1)" v-if="showNavigateBtns">
        <div class="icon right">M</div>
      </div> -->

      <div
        class="list-task-container  flex-g-1 no-warp"
        ref="container"
        @resize="recalc = !recalc"
      >
        <template v-for="item in items.slice(0, numVisibleTaskItems)">
          <item
            :title="item.content"
            :id="item.id"
            :cb="item.cb"
            :mode="item.mode"
            :key="item.id"
            :tabId="item.tabId"
            :close="item.close"
            class="flex"
            :list="false"
          />
        </template>
      </div>

      <!-- <div class="arrow-scroll" @click="scrollBtns(1)" v-if="showNavigateBtns">
        <div class="icon">M</div>
      </div> -->
    </div>
  </div>
</template>

<script>
import item from "./taskbarItem";
export default {
  components: { item },
  data() {
    return {
      show: true,
      showNavigateBtns: false,
      recalc: false,
    };
  },
  computed: {
    items() {
      return this.$store.state.taskbar.items;
    },
    hasScroll() {
      return true;
    },
    hasOpenItem() {
      return this.$store.getters["taskbar/hasOpenItem"];
    },
    numVisibleTaskItems() {
      let react = this.items.length;
      let react2 = this.recalc;
      if (!this.$refs.container) return 0;
      let containerWidth = this.$refs.container.clientWidth;
      return parseInt(containerWidth / 100);
    },
    showMoreBtn() {
      return this.numVisibleTaskItems < this.items.length;
    },
  },
  methods: {
    toggleList() {
      this.show = !this.show;
    },
    miniAll() {
      if (this.hasOpenItem) this.$store.dispatch("taskbar/minimizeAll");
      else this.$store.dispatch("taskbar/openAll");
    },
    closeAll() {
      this.$store.dispatch("tabsManager/removeAllWindows");
    },
    /*    scrollBtns(dir) {
      if (this.$refs.container.scrollLeft < this.$refs.container.scrollWidth)
        this.$refs.container.scrollLeft +=
          dir * this.$refs.container.clientWidth;
    }, */
    /*   calcContainerWidth() {
      //show/hide navigating buttons according to number of buttons
      let containerWidth = this.$refs.container.clientWidth;
      let containerScrollWidth = this.$refs.container.scrollWidth;
      this.showNavigateBtns = containerScrollWidth > containerWidth;
    }, */
  },
  mounted() {
    this.$nextTick(() => {
      //  this.calcContainerWidth();
    });
  },
};
</script>

<style lang="scss" scoped>
.outer-toggle-task {
  width: 40px;
  height: 28px;
  border-right: 1px solid #e5e5e5;
  position: relative;
}
.toggle-task {
  position: absolute;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
  /* width: 100%; */
  left: 50%;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  padding: 3px 6px 0 0;
  div {
    stroke: #aaa;
    stroke: #626262;
  }

  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    // stroke:#aaa;
  }
}
.list {
  transition: 0.4s;
  width: 0;
  overflow: hidden;
  flex-grow: 0;
  &:not(.show) {
  }
  &.show {
    flex-grow: 1;
  }
}
.arrow-scroll .icon {
  font-family: otzar-new;
  font-size: 30px;
  color: var(--custom-color2);
  transform: rotate(-90deg);
  font-weight: 100;
  height: 100%;
  &:hover {
    color: var(--custom-color2);
  }
  &.right {
    transform: rotate(90deg);
  }
}
.list-task-container {
  width: calc(100% - 180px);
  overflow: auto;
  flex-direction: row-reverse;
  display: flex;
}
.list-task-container::-webkit-scrollbar {
  overflow: hidden;
  width: 0px;
  height: 0px;
  // background-color: #f1f1f1;
}
.btn-bg-white {
  background-color: #fff;
  padding: 0 7px;
  font-size: 40px;
  font-weight: 400 !important;
}
.small-font {
  font-size: 20px !important;
}
.close-all {
  font-family: otzar-new;
  color: var(--custom-color1);
  font-size: 9px !important;
}
.arrow-1,
.arrow-2 {
  transform: rotate(90deg) translateY(3px);
  position: absolute;
  top: 0;
  font-size: 23px;
  background-color: transparent !important;
  color: var(--custom-color1) !important;
  &:hover {
    color: #fff !important;
  }
}
.arrow-1 {
  transform: rotate(90deg) translateY(-1px);
}
.show-more-win {
  position: relative;
  height: 100%;
  width: 100%;
  left: 8px;
  &:hover {
    .arrow-1,
    .arrow-2 {
      color: #fff !important;
    }
  }
}
</style>
