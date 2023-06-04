<template>
  <div @click="toggle()" class="container-switch-button">
    <svg class="switch-button">
      <use v-bind="{'href':'#icons_' + getIconName}" />
    </svg>
  </div>
</template>

<script>
export default {
  props: ["nameIconTrue", "nameIconFalse", "switchState"],
  data() {
    return {
      switch: this.switchState
    };
  },
  computed: {
    getIconName() {
      return this.switch ? this.nameIconTrue : this.nameIconFalse;
    }
  },
  methods: {
    toggle() {
      this.switch = !this.switch;
      this.$emit("click", this.switch);
    }
  }
};
</script>

<style lang="scss" scoped>
.container-switch-button {
  height: 100%;
}
</style>