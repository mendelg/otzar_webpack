<template>
  <popupUserExtensions
    @close="$emit('close')"
    :title="$t('key.placeholder')"
    name="key"
    :list="getKeys"
    :status="status"
    :listCheckedIds="listCheckedIds"
    icon="0"
    :total="totalRows"
    :limit="limit"
    :offset="offset"
    @inc="getRows"
    @search="doSearch"
  />
</template>

<script>
import popupUserExtensions from "@/components/popupUserExtensions/popupUserExtensions.vue";
import { mapGetters, mapActions } from "vuex";
import persPopup from "@/mixing/mixPersonalAddPopup";
export default {
  mixins: [persPopup],
  components: {
    popupUserExtensions,
  },
  data() {
    return { searchValue: "" };
  },
  computed: {
    ...mapGetters("menuPersonalExtentions", [
      "getUserKeysList",
      "getListCheckedIds",
    ]),
    x() {
      let wWindow = window.winSizes.innerWidth;
      let left = wWindow / 2 - 500;
      return left;
    },
    y() {
      let hWindow = window.winSizes.innerHeight;
      let top = hWindow / 2 - 296;
      return top;
    },
    getKeys() {
      return this.getUserKeysList;
    },
    listCheckedIds() {
      return this.getListCheckedIds;
    },
    totalRows() {
      if (this.getUserKeysList.length == 0) return 0;
      return this.getUserKeysList[0].totalRows;
    },
    status() {
      let comments = this.getUserKeysList;

      if (comments.length == 0) return "";
      let commentsStatus =
        this.totalRows +
        " " +
        this.$t("personalExtensions.keyIn") +
        " " +
        comments[0].totalBooks +
        " " +
        this.$t("general.books") +
        " ";
      return commentsStatus;
    },
  },
  methods: {
    ...mapActions("userPersonalExtensions", ["loadUserKeysList"]),
    doSearch(txt) {
      this.searchValue = txt;
      /*  this.setOffset(0);
      this.loadUserKeysList({
        offset: this.offset,
        limit: this.limit,
        txt,
      }); */
    },
    getNext() {
      this.incOffset(1);
      this.getRows();
    },
    getPrev() {
      this.incOffset(-1);
      this.getRows();
    },
    getRows(val) {
      if (val) this.incOffset(val);
      else this.setOffset(0);
      this.loadUserKeysList({
        offset: this.offset,
        limit: this.limit,
        txt: this.searchValue,
      });
    },
  },
  created() {
    this.getRows();
  },
};
</script>

<style lang="scss" scoped>
.comments-pop {
  height: 100%;
  width: 100%;
  background-color: antiquewhite;
  position: absolute;
  z-index: 4;
}
</style>
