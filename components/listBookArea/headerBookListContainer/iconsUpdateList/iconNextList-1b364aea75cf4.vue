<template>
  <div>
    <iconCircle :nameIcon="nameIcon" @click="nextList" :class="{disable: !disableIcon}" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      nameIcon: "icon-next"
    };
  },
  computed: {
    ...mapGetters("bookList", ["getDataOfCurrentList"]),

    disableIcon() {
      if (this.getDataOfCurrentList.current < this.getDataOfCurrentList.length)
        return true;
      return false;
    }
  },
  methods: {
    nextList() {
      this.$store.dispatch("bookList/goForword");
    }
  }
};
</script>

<style lang="scss" scoped>
.disable {
  opacity: 0.3;
  cursor: default;
}
</style>