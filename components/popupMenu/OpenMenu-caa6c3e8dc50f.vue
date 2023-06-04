<template>
  <div id="main-menu" class="open-menuu">
    <!-- <i @click="goToMainMenu" class="fa fa-align-justify"></i> -->
    <div style="width:100%" @click="goToMainMenu">
      <BaseIcon
        class="icon-menu-outer"
        width="5"
        height="20"
        nameIcon="icon-menu"
        pathIcon="icons-ganeral"
      />
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goToMainMenu() {
      // this.$router.push({ name: "menu-options" });
      this.$store.dispatch("menu/openMenu");
    },
  },
};
</script>

<style lang="scss">
.fa {
  justify-content: flex-start;
  font-size: 26px;
  cursor: pointer;
}

.open-menuu {
  cursor: pointer;
  margin: 0%;
  display: flex;
  z-index: 4;
  width: 36px;
  height: 36px;
  background-color: var(--custom-color1);
  background-image: linear-gradient(
    to right,
    var(--custom-color1),
    var(--custom-color2)
  );
  position: absolute;
  left: 0;
  top: auto;
  .icon-menu-outer {
    height: 100%;
    width: 100%;
    position: relative;
    &:hover {
      box-shadow: 3px 3px 6px #00000029;
    }
    svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  }
}
</style>
