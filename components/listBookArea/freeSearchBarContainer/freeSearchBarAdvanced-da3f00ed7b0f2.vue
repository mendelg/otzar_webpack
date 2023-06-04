<template>
  <div :class="['advanced-search']" @click="open()" v-if="!$_mobile">
    <!-- <div @click="open()"> -->
    {{ $t("freeSearchInput.advancedSearch") }}
    <svg
      class="arrow-icon"
      width="9.451"
      height="7.516"
      viewBox="0 0 9.451 7.516"
    >
      <use v-bind="{ href: '#icons_arrow-advanced-search' }" />
    </svg>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  methods: {
    ...mapActions("freeSearch", ["setShowAdvPopup", "toggleShowAdvPopup"]),
    ...mapActions("freeSearchBookList", ["setInputTxt"]),
    open() {
      let search = this.getSearchString;
      this.setInputTxt(search);
      // /this.setShowAdvPopup(true);
      this.toggleShowAdvPopup();
    },
  },
  computed: {
    ...mapGetters("freeSearch", ["getSearchString"]),
    btnTitle() {
      if (this.width == "narrow") return "";
      else return this.$t("freeSearchInput.advancedSearch");
    },
  },
  props: ["width"],
};
</script>

<style lang="scss" scoped>
.narrow {
  width: 30px !important;
}
.advanced-search {
  display: flex;
  flex-direction: row;
  padding: 0;
  line-height: 16px;
  // padding: 5px 8px 0 3px;
  color: #fff;
  height: 20px;
  height: 18px;
  line-height: 18px;
  /* margin-bottom: 7px; */
  font-size: 12px;
  background-color: #00000030;
  width: 65.66px;
  padding: 0 5px;
  border-radius: 15px;
  position: absolute;
  left: 10px;
  bottom: 5px;
  transition: 0.3s;
  min-width: fit-content;
  cursor: pointer;
  &:active {
    background-color: #00000060;
    transform: scale(0.97);
  }
  &:hover:not(:active) {
    background-color: #00000040;
    .arrow-icon {
      // margin-right: 3.5px;
      transform: translateX(-1.5px);
      transition: 0.3s;
    }
  }
  .arrow-icon {
    width: 10px;
    height: 8px;
    margin-top: 4.5px;
    margin-right: 6.5px;
    transition: 0.3s;
  }
}
</style>
