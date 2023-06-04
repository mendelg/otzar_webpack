<template>
  <div class="input input-icon-search w-100">
    <input
      ref="input"
      type="text"
      :placeholder="placeholder"
      :value="textSearch"
      @input="keyupInput($event)"
      @blur="handleBlur($event)"
      @keydown.enter="search"
      @focus="setVKB(false)"
      class="w-100"
      v-focus="{ nofocus: this.nofocus != undefined ? nofocus : false }"
      @dblclick.stop
      v-select.focus="{ nofocus: this.nofocus != undefined ? nofocus : false }"
    />

    <BaseIcon
      class="keyboard-icon"
      nameIcon="keyboard"
      pathIcon="k"
      :height="20"
      :width="20"
      v-tooltip="{
        content: $t('mainTools.keyboardOnScreen'),
        placement: 'right',
      }"
      @click="setVKB"
    />
    <div
      v-if="fill"
      class="icon-cancel otz-icon no-bg clear-input"
      @click="clear"
    >
      F
    </div>
    <div class="icon-general icon-search" @click="search">d</div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  props: ["placeholder", "text", "nofocus", "showPageIcon"],
  data() {
    return {
      textSearch: "",
      searchCurrentPage: false,
      // textValue: ""
    };
  },
  computed: {
    ...mapState("vKeyBoard", ["vKeyBoardInput", "vKeyBoardInputName"]),
    fill() {
      //
      if (this.textSearch != "") return true;
      return false;
    },
  },
  methods: {
    ...mapActions("vKeyBoard", [
      "setKeyBoardDisplay",
      "setKeyBoardInputName",
      "setKeyBoardInput",
    ]),

    setVKB(showKB = true) {
      this.setKeyBoardInputName(this.$refs.input.id);
      if (showKB) this.setKeyBoardDisplay(true);
    },
    keyupInput(e, str) {
      let txt;
      if (e) {
        txt = e.target.value.replace(/\s\s/g, "-");

        this.textSearch = txt;
        this.setKeyBoardInput(this.textSearch);
        this.$emit("input", e);
      } else {
        str = str.replace(/\s\s/g, "-");

        this.textSearch = str;
        this.setKeyBoardInput(str);
        this.$emit("input", str);
      }
    },
    handleBlur(e) {
      this.$emit("blur", e);
    },
    clear() {
      this.textSearch = "";
      this.$refs.input.focus();
      this.setKeyBoardInput("");
      this.$emit("clear");
    },
    search() {
      this.$emit("search");
    },
  },
  mounted() {
    this.$nextTick(function() {
      // Code that will run only after the
      // entire view has been rendered
      this.textSearch = this.text || "";
      // this.$refs.input.focus();
      // this.$refs.input.select();

      this.$refs.input.id = `base_input_${Math.random(1 % 10000000)}`;
    });
  },
  watch: {
    text: function(v, ov) {
      this.textSearch = v;
    },
    vKeyBoardInput: function(val) {
      if (this.$refs.input.id == this.vKeyBoardInputName) {
        this.keyupInput(null, val);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$bg-color1: #fff;
.icon-cancel {
  cursor: pointer;
  width: 20px;
  border-radius: 50%;
  height: 20px;
  text-align: center;
  transition: 0.3s;
  font-size: 8px;
  position: absolute;
  top: 2.5px;
  left: 50px;
  &:hover {
    background-color: #00000014;
  }
}
.input-icon-search.input {
  margin: 0;
  position: relative;
  .icon-general {
    position: absolute;
    height: 25px;
    line-height: 25px;
    top: 0;

    &.icon-search {
      left: 13px;
      color: var(--custom-color1);
      transition: 0.3s;
      border-radius: 50%;
      width: 25px;
      left: 11px;
      cursor: pointer;
      &:hover {
        background-color: #d1d1d1;
      }
      &.active {
        background-color: #a7a7a7;
      }
    }
  }

  input {
    display: block;
    // padding: 0 15px 0 40px; VERY DANGER CHANGE
    border: 1px solid var(--custom-color1);
    background-color: $bg-color1;
    height: 25px;
    font-size: 13px;
    font-weight: bold;
    color: #000;
    line-height: 25px;
    transition: 0.3s;
    margin: 0;
    &:focus {
      border-color: var(--custom-color1);
    }
    &::placeholder {
      font-size: 13px !important;
      font-weight: 300 !important;
      color: var(--text-color2) !important;
    }
  }
}
.keyboard-icon {
  position: absolute;
  left: 33px;
  top: 3px;
  cursor: pointer;
}
.page-icon {
  position: absolute;
  left: 60px;
  top: 6px;
  cursor: pointer;
}
</style>
