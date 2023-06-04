<template>
  <div class="sideLeft">
    <marquee-text v-if="appMode.online() && !$_mobile" />
    <div ref="listtab" class="list-tab">
      <tabsContainer v-if="!mobile" />
      <!-- <booksContainer /> -->
      <router-view name="book" />
    </div>
  </div>
</template>

<script>
import tabsContainer from "@/components/book/tabsContainer.vue";
import booksContainer from "@/components/book/booksContainer.vue";
import bookListHandle from "@/components/listBookArea/freeSearchBarContainer/bookListHandle.vue";
import { mapActions } from "vuex";
import marqueeText from "@/components/marqueeText.vue";
export default {
  components: {
    tabsContainer,
    booksContainer,
    bookListHandle,
    marqueeText,
  },
  data() {
    return {
      active: false,
    };
  },
  computed: {
    // ...mapGetters("userFolders", ["getFoldersBySearchInput"]),
    //  ...mapState("userFolders", ["textSearch"])
    mobile() {
      return this.$_mobile;
    },
  },
  methods: {
    ...mapActions("tabsManager", ["toggleSplitter", "toggleShowBookLists"]),
    toggleList() {
      this.active = !this.active;
      this.toggleShowBookLists();
      this.toggleSplitter();
    },
  },
};
</script>

<style lang="scss" scoped>
.sideLeft {
  height: calc(100vh - 37px);
  height: 100%;
  position: relative;
}
.inp {
  height: 25px;
  width: 200px;
  position: relative;
  left: -300px;
  top: -480px;
}
.bof {
  height: 555px;
  width: 200px;
  position: relative;
  left: -300px;
  top: -450px;
  overflow: scroll;
}
.fold {
  height: 30px;
  width: 200px;
  font-size: 16px;
}
</style>
