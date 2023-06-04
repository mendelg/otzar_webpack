<template>
  <BaseCleanPopup
    v-zindex
    v-body
    :h="30"
    :winh="257"
    :winw="410"
    @close="$emit('close')"
    :noneOverlay="true"
    :mini="true"
    :mini_title="$t('mainTools.keyboardOnScreen')"
  >
    <template v-slot:header>
      <span class="flex flex-align-center h-100 vk-header w-100">
        <span>{{ $t("mainTools.keyboardOnScreen") }}</span>
      </span>
    </template>
    <div :class="keyboardClass"></div>
  </BaseCleanPopup>
</template>

<script>
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";

export default {
  name: "SimpleKeyboard",
  props: {
    keyboardClass: {
      default: "simple-keyboard",
      type: String,
    },
    input: {
      type: String,
    },
    inputName: {
      type: String,
    },
  },
  data: () => ({
    keyboard: null,
  }),
  mounted() {
    this.keyboard = new Keyboard({
      onChange: this.onChange,
      onKeyPress: this.onKeyPress,
      inputName: this.inputName,
      layout: {
        default: [
          " 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
          "{tab} / ' \u05e7 \u05e8 \u05d0 \u05d8 \u05d5 \u05df \u05dd \u05e4 ] [ :",
          "{lock} \u05e9 \u05d3 \u05d2 \u05db \u05e2 \u05d9 \u05d7 \u05dc \u05da \u05e3 , {enter}",
          "{shift} \u05d6 \u05e1 \u05d1 \u05d4 \u05e0 \u05de \u05e6 \u05ea \u05e5 . {shift}",
          ".com @ {space}",
        ],
        shift: [
          "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
          "{tab} Q W E R T Y U I O P { } |",
          '{lock} A S D F G H J K L : " {enter}',
          "{shift} Z X C V B N M < > ? {shift}",
          ".com @ {space}",
        ],
      },
    });
  },
  methods: {
    onChange(input) {
      this.$emit("onChange", input);
    },
    onKeyPress(button) {
      this.$emit("onKeyPress", button);

      if (button === "{shift}" || button === "{lock}") this.handleShift();
    },
    handleShift() {
      let currentLayout = this.keyboard.options.layoutName;
      let shiftToggle = currentLayout === "default" ? "shift" : "default";

      this.keyboard.setOptions({
        layoutName: shiftToggle,
      });
    },
  },
  watch: {
    inputName(inputName) {
      this.keyboard.setOptions({ inputName });
    },
    input(input) {
      this.keyboard.setInput(input);
    },
  },
};
</script>

<style scoped>
.simple-keyboard {
  direction: ltr;
}

.window-border {
  border: 1px solid var(--custom-color1);
}
</style>
