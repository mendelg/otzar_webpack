<template>
  <div
    v-body
    v-click-outside="() => (this.show = false)"
    v-if="show"
    class="flex-column menu"
    v-on="$listeners"
    @click="closeMenu"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ["noBubble"],
  data() {
    return {
      show: false,
    };
  },
  destroyed() {
    this.$parent.$el.removeEventListener("contextmenu", this.openMenu);
  },
  methods: {
    openMenu(e) {
      if (this.noBubble) e.stopPropagation();
      //this for v-click-outside
      document.body.click();
      this.show = true;
      //wait for render of html
      this.$nextTick(() => {
        let w = this.$el.clientWidth;
        let h = this.$el.clientHeight;
        if (e.pageY + h > document.body.offsetHeight) {
          this.$el.style.top = document.body.offsetHeight - h - 10 + "px";
        } else {
          this.$el.style.top = e.pageY + "px";
        }
        if (e.pageX + w > document.body.offsetWidth) {
          this.$el.style.right = document.body.offsetWidth - e.pageX + "px";
          this.$el.style.left = "auto";
        } else {
          this.$el.style.left = e.pageX + "px";
          this.$el.style.right = "auto";
        }
      });

      e.preventDefault();
    },
    closeMenu() {
      this.$emit("close");
      this.show = false;
    },
  },
  mounted() {
    this.$parent.$el.addEventListener("contextmenu", this.openMenu);
  },
  beforeDestroy() {
    this.$parent.$el.removeEventListener("contextmenu", this.openMenu);
  },
};
</script>

<style lang="scss" scoped>
.menu {
  text-align: right;
  background-color: #fff;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.46);
  position: fixed;
  min-width: 100px;
  z-index: 1000000001 !important;
}
</style>
