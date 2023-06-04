<template>
  <div class="checkbox c-box-small" :class="{ checked: checked }">
    <label @click.stop="click">
      <div class="icon">{{icon}}</div>
      <input :checked="checked" type="checkbox" name="checkBook" @change="check($event)" />
      <span class="checkmark">
        <BaseIcon
          class="icon-checked"
          v-if="checkIcon"
          :width="wCheck"
          :height="hCheck"
          :nameIcon="nameIcon"
          pathIcon="icons-ganeral"
        />
      </span>
      <span v-if="text" class="text">{{ text }}</span>
    </label>
  </div>
</template>

<script>
export default {
  props: ["text", "checked", "size", "minus", "icon"],
  data() {
    return {
      wCheck: 7,
      hCheck: 6,
      checkIcon: this.checked,
      checkMinus: this.minus
    };
  },
  computed: {
    min() {
      if (this.checkMinus) return this.checkMinus;
      return false;
    },
    nameIcon() {
      if (this.size == "larg") {
      }
      if (this.minus) {
        this.wCheck = 9;
        this.hCheck = 2;
        return "check-minus";
      }
      if (this.size == "small") return "check-small";
      if (this.size == "larg") {
        this.wCheck = 10;
        this.hCheck = 8;
        return "check-larg";
      }
      this.wCheck = 7;
      this.hCheck = 6;
      return "check-small";
    }
  },
  methods: {
    click() {
      this.$emit("click");
    },
    check($event) {
      this.$emit("change", $event.target.checked);
    }
  },
  watch: {
    checked: function() {
      this.checkIcon = this.checked;
    }
  }
};
</script>

<style lang="scss" scoped></style>