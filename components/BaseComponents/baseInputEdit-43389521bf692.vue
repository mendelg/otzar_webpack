<template>
  <div class="input-edit">
    <!-- <input
      ref="input"
      @keyup.enter="edit($event)"
      :value="valueInput"
      @blur.native="handleBlur($event)"
      @input="setValueFolder($event.target.value)"
    />-->

    <input
      class="input-edit-folder"
      ref="input"
      @blur="handleBlur($event)"
      @input="setValueFolder($event.target.value)"
      :value="valueInput"
      @keyup.enter.stop="edit($event)"
      @keyup.stop="keyupFun($event)"
      @click.stop="click"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: ["valueInput"],
  mounted: function() {
    this.$nextTick(function() {
      // Code that will run only after the
      // entire view has been rendered
      this.$refs.input.focus();
      this.$refs.input.select();
    });
  },
  methods: {
    ...mapActions("folders", ["setValueFolder"]),
    edit(e) {
      let value = e.target.value;
      //   if (!value) value = "תיקיה חדשה";
      console.dir(value);
      this.$emit("edit", value);
    },
    handleBlur(e) {
      this.$emit("blur", e);
    },
    click() {},
    keyupFun(e) {
      this.$emit("keyup", e.code);
    },
  },
};
</script>

<style lang="scss" scoped></style>
