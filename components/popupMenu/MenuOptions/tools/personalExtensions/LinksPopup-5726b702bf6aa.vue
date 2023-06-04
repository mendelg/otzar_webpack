<template>
  <popupUserExtensions
    @close="$emit('close')"
    :title="$t('personalExtensions.LinksTitle')"
    name="link"
    :list="getUserLinksList"
    :status="status"
    :listCheckedIds="listCheckedIds"
    icon="5"
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
  components: {
    popupUserExtensions,
  },
  mixins: [persPopup],
  data() {
    return { searchValue: "" };
  },
  //menuPersonalExtentions
  computed: {
    ...mapGetters("menuPersonalExtentions", [
      "getUserLinksList",
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
    listCheckedIds() {
      return this.getListCheckedIds;
    },
    totalRows() {
      if (this.getUserLinksList.length == 0) return 0;
      return this.getUserLinksList[0].totalRows;
    },
    status() {
      let comments = this.getUserLinksList;

      if (comments.length == 0) return "";
      let commentsStatus =
        this.totalRows +
        " " +
        this.$t("personalExtensions.linkIn") +
        " " +
        comments[0].totalBooks +
        " " +
        this.$t("general.books") +
        " ";
      return commentsStatus;
    },
  },
  methods: {
    ...mapActions("userPersonalExtensions", ["loadUserLinksList"]),
    doSearch(txt) {
      this.searchValue = txt;
      /* this.setOffset(0);
      this.loadUserCommentsList({
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
      this.loadUserLinksList({
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
