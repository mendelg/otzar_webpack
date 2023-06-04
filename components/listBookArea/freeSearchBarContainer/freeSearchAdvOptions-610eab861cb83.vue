<template>
  <div>
    <div class="icon-container icon-fast-setting-search">
      <div class="icon">
        <baseCheckBox
          class="check-item"
          :class="{ 'check-minus': checkMinus }"
          @change="checkAll"
          :checked="checkChecked"
          size="medium"
          :minus="checkMinus"
          :icon="option"
        />
      </div>
      <div class="flex pointer flex-rev" @click="toggleList()">
        <span class="title">{{ title }}</span>
        <baseIcon
          :class="{ active: listState }"
          v-if="option != 'inOrder'"
          class="arrow-history-search-icon"
          nameIcon="arrow-history-search-icon"
          width="8"
          height="5"
        />
      </div>
    </div>
    <div
      v-if="listState && option != 'inOrder'"
      class="advList"
      :class="{ 'adv-mobile': $_mobile }"
      v-click-outside="closeList"
    >
      <div class="header-list padd-v-9">
        <span>{{ message }}</span>
        <div class="icon">
          <BaseIconX nameIcon="x-list" @click="closeList" />
        </div>
      </div>
      <div class="list-content">
        <div class="dir-rtl center-y flex padd-v-9">
          <!-- <span class="separator"></span> -->

          <div
            class="item-adv flex"
            :class="option"
            v-for="(word, index) in getWords"
            :key="word.id"
          >
            <div
              class="flex flex-align-center"
              :class="{ 'dir-ltr': option == 'concat' }"
            >
              <baseCheckBox
                v-if="!((index == getWords.length - 1) & (option == 'concat'))"
                class="check-item"
                :class="{ concat: option == 'concat' }"
                :checked="word[option]"
                :icon="option"
                size="larg"
                @change="checkCurrent($event, word.id)"
              />
              <span
                style="padding: 3px"
                v-if="(word[option] == -2) & (option == 'concat')"
                >{ {{ word.space }} }</span
              >
              <span class="text">{{ word.w }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <span>{{ getSearchString }}</span>
        <span class="text-color"
          >{{ $t("freeSearchInput.advancedOptions.keyboardSC") + " : " + sign }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["option", "title", "message"],
  data() {
    return {
      listState: false,
      nameIconRemove: "x-list",
      words: [],
      inOrder: false,
    };
  },
  computed: {
    sign() {
      return this.option == "concat" ? "-" : "+";
    },
    ...mapGetters("freeSearch", ["getSearchWords", "getSearchString"]),

    rawSearchTxt() {
      return this.getSearchWords.words.map((w) => w.w).join(" ");
    },
    checkMinus() {
      if (this.option == "inOrder") return false;
      let option = this.option;
      let length = this.getWords.filter((w, i) => w[option] == true).length;

      let lengthToCheck = this.words.length;
      if (this.option == "concat") lengthToCheck--;
      if ((length < lengthToCheck) & (length > 0)) return true;
      return false;
    },
    checkChecked() {
      if (this.option == "inOrder") return this.getOrder;
      let length = this.getWords.filter((w, i) => w[this.option] == true)
        .length;

      let lengthToCheck = this.words.length;
      if (this.option == "concat") lengthToCheck--;
      if ((length <= lengthToCheck) & (length > 0)) return true;
      return false;
    },
    getWords() {
      this.words = this.getSearchWords.words;
      return this.words;
    },
    getOrder() {
      return this.getSearchWords.order;
    },
    getRt() {
      return this.getSearchWords.rasheitevot;
    },
    getNirdafot() {
      return this.getSearchWords.nirdafot;
    },
    Ocr() {
      return this.getSearchWords.ocr;
    },
    getMaleChaser() {
      return this.getSearchWords.malechaser;
    },
    getOrder() {
      return this.getSearchWords.order;
    },
    getNegWords() {
      return this.getSearchWords.no;
    },
    getGlobalSpace() {
      return this.getSearchWords.globalSpace;
    },
  },
  methods: {
    ...mapActions("freeSearchBookList", ["setInputTxt"]),
    ...mapActions("freeSearch", [
      "setSearchString",
      "createSearchTxtFromArray",
    ]),
    toggleList() {
      this.listState = !this.listState;
    },
    closeList() {
      this.listState = false;
    },
    setOrder($event) {
      let moreOptions = [
        $event.target.checked,
        this.Ocr,
        this.getRt,
        this.getNirdafot,
        this.getMaleChasers,
      ];
      this.createSearchTxtFromArray({
        words: this.getWords,
        moreOptions,
        no: this.getNegWords,
        globalSpace: this.getGlobalSpace,
      }).then((txt) => {
        this.setSearchString(txt.trim());
        this.setInputTxt(txt.trim());
      });
    },
    checkAll($event) {
      if (this.option == "inOrder") {
        this.setOrder($event);
        return;
      }

      if (this.getWords.length == 0) {
        return false;
      }
      let order = "";

      this.words.forEach((w) => {
        w[this.option] = $event.target.checked;
      });
      let moreOptions = [
        this.getOrder,
        this.Ocr,
        this.getRt,
        this.getNirdafot,
        this.getMaleChaser,
      ];
      this.createSearchTxtFromArray({
        words: this.getWords,
        moreOptions,
        no: this.getNegWords,
        globalSpace: this.getGlobalSpace,
      }).then((txt) => {
        this.setSearchString(txt);
        this.setInputTxt(txt);
      });
    },

    checkCurrent(event, index) {
      this.getWords[index][this.option] = event.target.checked;
      let moreOptions = [
        this.getOrder,
        this.Ocr,
        this.getRt,
        this.getNirdafot,
        this.getMaleChaser,
      ];
      this.createSearchTxtFromArray({
        words: this.getWords,
        moreOptions,
        no: this.getNegWords,
        globalSpace: this.getGlobalSpace,
      }).then((txt) => {
        this.setSearchString(txt.trim());
        this.setInputTxt(txt.trim());
      });
    },

    parentList() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss">
$bg-color1: #fff;
$bg-color4: #ececec;
$text-color: #fff;
.icon-container {
  .icon {
    // height: 100%;
    // width: 15px;
  }
  display: flex;
  flex-direction: row;
  width: 120px;
  // height: 20px;

  // background-color: white;
  .title {
    line-height: 14px;
    padding: 0 8px 0 3px;
    color: $text-color;
  }
  .arrow-history-search-icon {
    cursor: pointer;
    position: relative;
    width: 8px;
    height: 12px;
    svg {
      width: 8px;
      height: 5px;
      position: absolute;
      opacity: 1;
    }
  }
}

.freesearch-container {
  .list-content {
    flex-direction: column !important;
  }
  .div-input {
    margin-bottom: 9px;
    padding-right: 10px;
    padding-top: 15px;
    // padding: 0;
    // margin: 0;
  }
  .icon-search {
    // top: 18px !important;
    // right: 0px !important;
  }
  input {
    padding-right: 6px !important;
    border: 0 !important;
    outline: 0;
    padding-left: 0;
    margin-bottom: 0;
    &::placeholder {
      font-size: 16px !important;
      color: #b2b2b2 !important;
      font-weight: 400 !important;
    }
  }
  .free-history-container {
    // position: absolute;
    // width: 100%;
    height: 28px;
    width: 28px;
    padding: 5px;
    background-color: transparent;
    border: 0;
    margin: 12px 0;
  }
  .header {
    // height: 24px;
    padding: 0 7px;
    margin-bottom: 6px;
  }
  .icon-checked {
  }
}

.advList {
  max-width: 800px;
  min-width: 350px;
  height: 110px;
  position: absolute;
  z-index: 3;
  margin: 0 10px;
  overflow: auto;
  right: 0;
  background-color: $bg-color1;
  font-size: 13px;
  box-shadow: 0 2px 3px 1px #00000040;
  animation: dropdown 0.1s;
  &.adv-mobile {
    max-width: 95%;
    min-width: 95%;
    left: 50%;
    transform: translateX(-50%);
    margin: auto;
    right: auto;
  }
}
.footer {
  background-color: $bg-color4;
  background-color: #f4f4f4;
  display: flex;
  flex-direction: row;
}

.list-content {
  display: flex;
  flex-direction: column;
  // height: calc(100% - 22px);
  overflow: auto;
}
.separator {
  border-right: $bg-color4 1px solid;
  margin-right: 5px;
}
</style>
