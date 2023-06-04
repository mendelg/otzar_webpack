<template>
  <div class="container" :class="{ border: isFocus }">
    <!-- <freeSearchBarRecentSearches /> -->

    <freeSearchBarInput class="input" @focus="focusInput" />
    <freeSearchBarSearchIn class="search-in" />
  </div>
</template>

<script>
import freeSearchBarInput from "./freeSearchBarInput.vue";
import freeSearchBarSearchIn from "./freeSearchBarSearchIn.vue";
import freeSearchBarRecentSearches from "./freeSearchBarRecentSearches.vue";
export default {
  components: {
    freeSearchBarRecentSearches,
    freeSearchBarInput,
    freeSearchBarSearchIn,
  },
  data() {
    return {
      isFocus: false,
    };
  },
  methods: {
    focusInput(focus) {
      this.isFocus = focus;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
  border: 1.5px solid #00000000;
  transition: 0.3s;
  margin-right: 10px;
  padding-top: 0;
  margin-top: 15px;
  /* padding: 15px 0 10px 10px; */
  margin-left: 10px;
  margin-bottom: 6px;
  border-radius: 15px;
  &.border {
    border: 1.5px solid #00000020;
  }
}
.input {
  // width: 70%;
}
</style>
