<template>
  <div>
    <label class="switch" @change="check">
      <input :checked="checked" type="checkbox" name="checkBook" />
      <span class="slider round"></span>
    </label>
  </div>
</template>

<script>
export default {
  props: ["checked"],
  methods: {
    check(e) {
      this.$emit("toggle", e);
    },
  },
};
</script>

<style lang="scss" scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 28px;
  height: 16px;
  top: 0;
  transform: translateY(0);
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #dedede;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  left: 2.5px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: var(--custom-color1);
}

input:focus + .slider {
  box-shadow: 0 0 1px var(--custom-color1);
}

input:checked + .slider:before {
  -webkit-transform: translateX(11.5px);
  -ms-transform: translateX(11.5px);
  transform: translateX(11.5px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
