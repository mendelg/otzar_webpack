<template>
  <div class="header-container">
    <div class="add-extensions" @click="addExtensions">
      <!--  <div class="icon-plus">+</div> -->
      <BaseIcon
        :class="{ active: crtExtentionsMode && addExtensType == type }"
        class="icon-add"
        :width="width"
        :height="height"
        :nameIcon="nameIcon"
        pathIcon="icons-ganeral"
      />
    </div>
    <div>{{ title }}</div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["title", "type"],
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
$bg-color1: #fff;
$custom-color: var(--custom-color1);
.header-container {
  display: flex;
  align-items: center;
  // justify-content: center;
  align-items: center;
  // flex-direction: column;
}
.icon-add {
  cursor: pointer;
  display: block;
  height: 27px;
  width: 27px;
  border: 1px solid #e5e5e5;
  text-align: center;
  line-height: 27px;
  background-color: $bg-color1;
  color: $custom-color;
  font-weight: 700;
  position: relative;
  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}
.icon-plus {
  position: absolute;
  color: var(--custom-color1);
}
</style>
