<template>
  <div class="radio-btn" :class="{ checked: checked }">
    <label @click.stop="click">
      <input class="radio" :checked="checked" type="radio" @change="check($event)" :name="name" />

      <span class="rdo">
        <!-- <BaseIcon
          class="icon-radio"
          v-if="checked"
          :width="wCheck"
          :height="hCheck"
          :nameIcon="nameIcon"
          pathIcon="icons-ganeral"
        />-->
      </span>
      <span v-if="text" class="text">{{ text }}</span>
    </label>
  </div>
</template>

<script>
export default {
  props: ["text", "checked", "size", "name"],
  data() {
    return {
      wCheck: 7,
      hCheck: 6,
      checkIcon: this.checked
    };
  },
  computed: {
    nameIcon() {
      if (this.size == "small") return "check-small";
      if (this.size == "larg") {
        this.wCheck = 10;
        this.hCheck = 8;
        return "check-larg";
      }
      return "check-small";
    }
  },
  methods: {
    click() {
      this.$emit("click");
    },
    check(e) {
      this.checkIcon = e.target.checked;
      this.$emit("change", e);
    }
  }
};
</script>

<style lang="scss" scoped>
$bg-color1: #fff;
.radio-btn {
  position: relative;
  width: 15px;
  .radio {
    position: static;
    width: 0;
    height: 0;
  }
}
.radio-btn .radio:checked + .rdo:after,
.radio-btn .radio:not(:checked) + .rdo:after {
  content: "";
  width: 5px;
  height: 5px;
  background: var(--custom-color1);
  position: absolute;
  top: 8px;
  right: 3px;
  border-radius: 100%;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
  opacity: 0;
  transform: scale(0);
}
.radio-btn .radio:checked + .rdo:after {
  opacity: 1;
  -webkit-transform: scale(1);
  transform: scale(1);
}
.radio-btn .radio:checked + .rdo:before,
.radio-btn .radio:not(:checked) + .rdo:before {
  background-color: $bg-color1;
  color: #d4d4d4;
}
.radio-btn .radio:checked + .rdo:before {
  border: 1px solid #d4d4d4 !important;
}
.radio-btn .radio:checked + .rdo:before,
.radio-btn .radio:not(:checked) + .rdo:before {
  content: "";
  position: absolute;
  right: 0;
  top: 5px;
  width: 11px;
  height: 11px;

  border-radius: 100%;
  color: #514b46;
  border: 1px solid #d4d4d4 !important;
  //   background-color: #322e2b;
  /* border: 1px solid #514b46; */
}
</style>
