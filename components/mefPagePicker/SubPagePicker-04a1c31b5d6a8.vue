<template>
  <div class="pagePicker" @click="toggleMenu" v-click-outside="closeMenu">
    <div class="selected-text">{{ innergetSelectedSubPage }}</div>
    <!-- <font-awesome-icon icon="caret-down" class="dropdown-icon" /> -->
    <span class="mef-font-default mef-font dropdown-icon">p</span>
    <div class="option-items" :class="{ 'mef-open-menu': showMenu }">
      <p @click.stop="setSubPageNumber(getSelectedPageNumber, 0)">א</p>
      <p @click.stop="setSubPageNumber(getSelectedPageNumber, 1)">ב</p>
    </div>
  </div>
</template>

<script>
import Menu from "@/mixing/mefMenuFunction.js";
import { mapGetters } from "vuex";
export default {
  mixins: [Menu],
  props: ["lazy", "num"],
  computed: {
    ...mapGetters("mefShas", [
      "getSelectedSubPage",
      "getSelectedPageNumber",
      "getSelectedBookNumber",
    ]),
    innergetSelectedSubPage() {
      if (this.lazy == "1") {
        if (this.num == 0) return 'ע"א';
        else if (this.num == 1) return 'ע"ב';
        // return "עמוד";
      }
      return this.getSelectedSubPage;
    },
  },
  methods: {
    setSubPageNumber(page, sp) {
      this.closeMenu();

      if (page % 2 == 0) {
        page = Number(page) + 1;
      } else page = Number(page) - 1;
      this.$emit("subpage", { sp, page });
    },
  },
};
</script>

<style scoped>
.pagePicker {
  font-size: 12px;
  border-left-color: #c6c6c6;
  border-width: 0px;
  display: flex;
  width: 47px;
  position: relative;
  justify-content: space-between;
  align-items: center;
  text-align: center;
}
.selected-text {
  width: 20px;
  padding-right: 5px;
}
.dropdown-icon {
  width: 13px;
  margin-top: 1.5px;
  line-height: 14px;
  margin-left: 6px;
}
.option-items {
  display: none;
  position: absolute;
  z-index: 2;
  width: 40px;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  padding: 0px 5px;
  top: 100%;
  width: 100%;
}
.mef-open-menu {
  display: block;
}
</style>
