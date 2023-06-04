<template>
  <div class="main-setting-me">
    <HeaderMenu :title="title" :routeBackName="routeBackName" />
    <BaseHeaderHistoryListDisplay @change-type-search="changeTypeSearch" />
    <div class="list-menu list-history">
      <div v-for="search in userSearchHistory" :key="search.id + 'a'">
        <BaseHistorySearchRowItem
          v-if="
            search.pin == 1 &&
              (searchType == 'all' || searchType == search.type)
          "
          :search="search"
        />
      </div>
      <div v-for="(search, index) in userSearchHistory" :key="search.id">
        <baseHeaderHistoryDate
          class="title"
          v-if="
            index == 0 ||
              search.historyDate.getDate() !==
                userSearchHistory[index - 1].historyDate.getDate() ||
              search.historyDate.getFullYear() !==
                userSearchHistory[index - 1].historyDate.getFullYear() ||
              search.historyDate.getMonth() !==
                userSearchHistory[index - 1].historyDate.getMonth()
          "
          :historyDate="search.historyDate"
        />
        <BaseHistorySearchRowItem
          v-if="
            search.pin == 0 &&
              (searchType == 'all' || searchType == search.type)
          "
          :search="search"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Hebcal from "hebcal";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      //fa fa-genderless
      title: this.$t("mainTools.historyPath"),
      routeBackName: "main",
      searchType: "all",
    };
  },
  computed: {
    ...mapGetters("userSearchHistory", ["getUserSearchHistory"]),
    userSearchHistory() {
      return this.getUserSearchHistory;
    },
  },
  created() {
    //this.$store.dispatch("userSearchHistory/setSearchHistoryList");
  },
  methods: {
    changeTypeSearch(e) {
      this.searchType = e.name;
    },
  },
  //
};
</script>

<style lang="scss" scoped>
.list-history {
  overflow: auto;
}
</style>
