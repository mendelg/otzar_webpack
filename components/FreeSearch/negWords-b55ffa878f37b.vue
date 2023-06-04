<template>
  <div class="input-container-neg">
    <div class="input-container">
      <input
        class="input-border"
        type="text"
        v-model="newWord"
        @keyup.enter="addWord"
        :placeholder="$t('freeSearchInput.advancedOptions.placeNegInput')"
      />

      <div class="btn  " @click="addWord">
        {{ $t("freeSearchInput.advancedOptions.negBtn") }}
      </div>
    </div>
    <div>
      <div class="words-container">
        <!-- <negWordItem v-for="w in noWords" :key="w" :word="w" @remove="removeWord(w)" /> -->
        <baseLabel
          v-for="w in noWords"
          :key="w"
          :text="w"
          @remove="removeWord(w)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import negWordItem from "./negWordItem.vue";
export default {
  components: {
    negWordItem,
  },
  watch: {
    words: function(val, oldVal) {
      this.noWords = val;
    },
  },
  props: ["words"],
  data() {
    return {
      noWords: this.words,
      newWord: "",
    };
  },
  methods: {
    addWord() {
      if (this.newWord == "") return;
      if (!this.noWords.includes(this.newWord)) this.noWords.push(this.newWord);
      this.newWord = "";
      this.$emit("update", this.noWords);
    },
    removeWord(w) {
      this.noWords = this.noWords.filter((word) => word != w);
      this.$emit("update", this.noWords);
    },
  },
};
</script>

<style lang="scss" scoped>
.neg-btn {
  width: 48px;
  height: 25px;
  text-align: center;
  background-color: var(--custom-color1);
  border-radius: 17px;
  padding: 0 10px;
  font-size: 13px;
  border: 1px solid #dedede;
  line-height: 25px;
  margin-right: 6px;
  color: white;
  cursor: pointer;
  &:hover,
  &.active {
    background-color: var(--custom-color1);
  }
}
.input-container-neg {
  padding-right: 67px;
  padding-top: 10px;
  .input-container {
    display: flex;
    flex-direction: row;
    margin-bottom: 18px;
    input {
      width: 173px;
      height: 24px;
      border-radius: 15px;

      padding: 0 12px;
    }
  }
}

.words-container {
  display: flex;
  flex-direction: row;
}
</style>
