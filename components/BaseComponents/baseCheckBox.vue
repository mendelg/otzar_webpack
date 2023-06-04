<template>
  <!-- c-box-small -->
  <div
    class="checkbox"
    :class="[
      checked ? checked : '',
      'check-' + size,
      icon,
      minus ? 'check-minus' : '',
    ]"
  >
    <!-- <div class="contact">{{icon}}</div> -->
    <label @click.stop="click">
      <input
        :checked="checked"
        type="checkbox"
        name="checkBook"
        @change="check($event)"
        :id="id"
        :disabled="disabled"
      />
      <span class="checkmark">
        <!-- <BaseIcon
          class="icon-checked"
          v-if="checkIcon"
          :width="wCheck"
          :height="hCheck"
          :nameIcon="nameIcon"
          pathIcon="icons-ganeral"
        />-->
        <div v-if="checkIcon && !iconContactSvgStyle" class="otz-icon">
          {{ nameIcon }}
        </div>
        <div
          class="h-100 flex flex-align-center"
          v-if="checkIcon && iconContactSvgStyle"
        >
          <baseIcon
            nameIcon="contact"
            pathIcon="icons"
            :width="wIcon"
            :height="hIcon"
          />
        </div>
      </span>
      <!-- {{icon}} -->
      <span v-if="text != ''" class="text">{{ text }}</span>
    </label>
  </div>
</template>

<script>
export default {
  // props: ["text", "checked", "size", "minus","icon"],
  // props: {
  //   text: "",
  //   checked: false,
  //   size: "normal",
  //   minus: false,
  //   icon: "normal"
  // },
  props: {
    text: {
      type: String,
      default: "",
    },
    checked: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "normal",
    },
    minus: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      wCheck: 7,
      hCheck: 6,
      checkIcon: this.checked,
      checkMinus: this.minus,
    };
  },
  computed: {
    min() {
      if (this.checkMinus) return this.checkMinus;
      return false;
    },
    iconContactSvgStyle() {
      if (this.icon == "concat" && !this.minus) return true;
      return false;
    },
    hIcon() {
      if (this.size == "larg") {
        return "5";
      }
      return "5";
    },
    wIcon() {
      if (this.size == "larg") {
        return "10";
      }
      return "9";
    },
    nameIcon() {
      let concat = "";
      if (this.minus) return "B";
      if (this.icon == "concat") return "C";
      return "A";
      if (this.icon == "concat" && !this.minus) {
        this.wCheck = 10;
        this.hCheck = 5;

        // return "check-" + this.size + "-concat";
        return "C";
      }
      if (this.size == "medium") {
        this.wCheck = 7.5;
        this.hCheck = 6.5;
        if (this.minus) {
          this.wCheck = 7;
          this.hCheck = 2;
          // return "check-medium-minus";
          return "B";
        }
        return "A";
        // return "check-medium" + concat;
      }

      if (this.size == "small") return "check-small";
      if (this.size == "larg") {
        if (this.minus) {
          this.wCheck = 10;
          this.hCheck = 2;
          return "B";
          return "check-larg-minus";
        }
        this.wCheck = 10;
        this.hCheck = 9;
        return "A";
        return "check-larg";
      }
      if (this.size == "main_2") {
        if (this.minus) {
          this.wCheck = 10;
          this.hCheck = 2;
          return "B";
          return "check-main_2-minus";
        }
        this.wCheck = 10;
        this.hCheck = 9;
        return "A";
        return "check-main_2";
      }
      this.wCheck = 7;
      this.hCheck = 6;
      return "A";
      return "check-small";
    },
  },
  methods: {
    click() {
      this.$emit("click");
    },
    check(e) {
      this.checkIcon = e.target.checked;
      this.$emit("change", e);
    },
  },
  watch: {
    checked: function() {
      this.checkIcon = this.checked;
    },
  },
};
</script>

<style lang="scss" scoped></style>
