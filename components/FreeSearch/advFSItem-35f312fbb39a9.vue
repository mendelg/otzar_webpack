<template>
  <div class="item-container">
    <div
      :class="{ 'padd-b-0': show }"
      class="flex flex-bet flex-rev hdr-adv"
      @click="parentClick"
    >
      <div class="flex flex-rev">
        <slot class="desc" name="description"></slot>
      </div>
      <div
        v-if="arrow"
        class="icon-circle otz-icon icon-bg arrow-toggle no-mrg"
        @click.stop="parentClick"
        :class="{ open: open }"
      >
        o
      </div>

      <!-- <iconCircle nameIcon="arrow-open-close" @click="parentClick" /> -->
    </div>
    <div
      class="flex flex-rev padd-b-12 padd-h-3 padd-v-30 line-h-p adv-line"
      v-if="show"
    >
      <div class="description">{{ desc }}</div>
      <slot class="checks" name="checks"></slot>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
import advFSItem from "./advFSItem.vue";
import itemGeneral from "./itemGeneral.vue";

export default {
  props: {
    arrow: { type: Boolean, default: true },
    desc: { type: String },
  },

  data() {
    return {
      open: false,
      show: false,
    };
  },
  methods: {
    parentClick1() {
      // this.$emit("click");
      // this.open = !this.open;
    },
    parentClick(target) {
      // if (this.open) return;

      // this.$emit("click");
      // this.open = !this.open;
      this.show = !this.show;
    },
    toggleAdv() {
      this.show = !this.show;
    },
  },
};
</script>
<style lang="scss" scoped>
$bg-color3: #e5e5e5;
.arrow-history-search-icon {
  position: relative;
  width: 8px;
  height: 13px;
  svg {
    width: 8px;
    height: 5px;
    position: absolute;
    opacity: 1;
  }
}
.item-container {
  position: relative;
  // display: flex;
  // flex-direction: row;
  padding: 21px 21px 21px 14px;
  align-items: flex-start;
  // width: 845.6px;
  padding: 0 !important;
  overflow: auto;
  &.space {
    padding: 18px 11px 15px 14px;
  }
  &.add-search .item-container-inner {
    // padding-right: 25px;
    width: 218px;
  }
}
.item-container-inner {
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  &.space {
    padding: 18px 11px 15px 0;
  }
  &.add-search .item-container-inner {
    // padding-right: 25px;
    width: 218px;
  }
}
.item-container-inner {
  display: flex;
  flex-direction: row;

  &.space {
    padding: 18px 11px 15px 0;
  }

  .hdr-adv {
    // border-bottom: 1px solid #e8e4e4;
    padding-bottom: 10px;
    padding-right: 21px;
    padding-left: 14px;
    // background-color: #eeeeee;
    padding-top: 15px;

    cursor: pointer;
  }
}
.complet-word {
  .hdr-adv {
    // padding-right: 42px;
  }
}
.hdr-adv {
  // border-bottom: 1px solid #e8e4e4;
  padding-bottom: 10px;
  padding-right: 21px;
  padding-left: 14px;
  // background-color: #eeeeee;
  padding-top: 15px;
  cursor: pointer;
}
.no-check .hdr-adv {
  padding-right: 43px;
}
.space .hdr-adv {
  padding-right: 11px;
}
.item-container-inner {
  display: flex;
  flex-direction: row;
}
.desc {
  flex-basis: 25%;
}

.checks {
  flex-grow: 1;
}

.arrow-btn {
  width: 20.3px;
  height: 20.3px;
  position: absolute;
  left: 15px;
  top: 17px;
  transition: 0.3s;
  background-color: $bg-color3;
  border-radius: 50%;
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
}
.flex.flex-rev {
  flex-direction: row;
}
.description {
  max-width: 25%;
}
.adv-line {
  font-size: 12px;
  padding-right: 43px;
}
</style>
