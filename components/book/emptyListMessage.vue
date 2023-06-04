<template>
  <div class="inner-empty rtl padd-v-12">
    <span>{{title}}</span>
      <span>{{ $t("extens1."+listType) }}</span>

     <span v-if="listType!='nothing'">{{ $t("contactUs.clickHere") }}</span>
  <div v-if="type">
     <div class="add-extensions add-tsiyun" @click="addExtensions">
       <span class="icon-plus" :class="{ active: crtExtentionsMode && getAddExtensType == type }">+</span>
      <!-- <BaseIcon
        :class="{ active: crtExtentionsMode && getAddExtensType == type }"
        class="icon-add"
        :width="width"
        :height="height"
        :nameIcon="nameIcon"
        pathIcon="icons-ganeral"
      /> -->
    </div>
  </div>
  </div>

  
</template>
<script>

import { mapActions, mapGetters } from "vuex";
export default {
  props: ["title","type"],
   data() {
    return {
      width: "16",
      height: "16",
    };
  },
   computed: {
    ...mapGetters("bookPersonalExtensions", [
      "crtExtentionsMode",
      "getAddExtensType",
    ]),
    listType(){
     return this.type!=undefined?this.type:"nothing"
    },
    addExtensType() {
      return this.getAddExtensType;
    },
     nameIcon() {
      if (this.type == "comment") {
        this.width = "16";
        this.height = "14";
        return "icon-add-comment";
      }
      if (this.type == "key") {
        this.width = "15";
        this.height = "15";
        return "icon-key-color";
      }
      if (this.type == "marker") {
        this.width = "25";
        this.height = "26";
        return "icon-marker-color";
      }
      if (this.type == "link") {
        this.width = "23.838";
        this.height = "24.824";
        this.width = "19.734";
        this.height = "20.55";
        return "icon-links-color";
      }
    },
   },
   methods: {
    ...mapActions("popupOnceComp", [
      "setVisible",
      "setInvisible",
      "toggleVisible",
    ]),
    addExtensions(event) {
      //   this.toggleVisible();
      this.$emit("add-exten", this.type);
    },
  },
};
</script>
<style lang="scss" scoped>
.inner-empty {
  background-color: white;
  width: 100%;
  height: 100%;
  position: relative;
  
}
.icon-plus{
    cursor: pointer;
    display: block;
    height: 27px;
    width: 27px;
    border: 1px solid #e5e5e5;
    text-align: center;
    line-height: 27px;
    background-color: #fff;
    color: var(--custom-color1);
    font-weight: 700;
    margin: 0 auto;
  }
</style