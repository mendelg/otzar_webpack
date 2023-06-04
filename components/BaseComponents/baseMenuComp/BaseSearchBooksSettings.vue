<template>
  <div class="div-input">
    <svg class="icon-search">
      <use v-bind="{ href: '#icons_' + nameIcon }" />
    </svg>
    <input
      @focus="loadIndex"
      @blur="freeIndex"
      type="text"
      :value="textSearchSettings"
      @input="setSettingsSearchTo($event.target.value)"
      v-bind:placeholder="$t('searchInput.placeHolder')"
      v-select.focus
    />
  </div>
</template>

<script>
// import store from "@/store/store";
import { mapActions, mapState } from "vuex";
import mixBooksIndexManager from "@/mixing/mixSearchIndexMemoryManager.js";
export default {
  mixins: [mixBooksIndexManager],
  data() {
    return {
      // txtSearch: "",
      nameIcon: "icon-input-search",
      nameopen: "open-list",
    };
  },
  computed: {
    ...mapState("bookList", ["textSearchSettings"]),
  },
  methods: {
    ...mapActions("bookList", ["setSettingsSearchTo"]),
  },
};
</script>

<style lang="scss" scoped>
.div-input {
  padding: 12px 12px 0 12px;
  position: relative;
}
.icon-search {
  height: 22.5px;
  width: 24px;
  position: absolute;
  right: 11px;
  top: 18.5px;
  position: absolute;
}
input {
  height: 30.54px;
  width: 100%;
  background-color: unset;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  font-size: 16px;
  font-weight: bold;
  color: #000;
  padding: 0 35px 0 22px;
  outline: 0;
}
input:focus {
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
}
input::placeholder {
  // font-size: 16px;
  font-weight: normal;
  color: rgba(0, 0, 0, 0.4);
}
</style>
