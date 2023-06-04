<template>
  <div class="inner-empty rtl padd-v-12">
      <span>{{ $t("tsiyunim.noMine") }}</span>
      <span>{{ $t("tsiyunim.toAddMine") }}</span>
      <span>{{ $t("tsiyunim.newMine") }}</span>
    <div class="add-tsiyun" @click.stop="addTsiyun">

      <span class="plus-tsiyun">+</span>

    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  props: ["title","tabId"],
  methods: {
    ...mapActions("popupOnceComp", [
      "setVisible",
      "setInvisible",
      "toggleVisible",
      "setSlotShow",
      "setTabId"
    ]),
    addTsiyun(event) {
      this.setTabId(this.tabId)
      this.setSlotShow("add-tsiyun");
      this.toggleVisible();
  
    }
  }
};
</script>
<style lang="scss" scoped>
.inner-empty {
 background-color: white;
 width:100%;
 height:100%;
 position: relative;
}
</style