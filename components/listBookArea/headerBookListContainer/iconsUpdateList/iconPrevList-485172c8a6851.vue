<template>
  <div>
    <iconCircle :nameIcon="nameIcon" @click="prevList" :class="{disable: !disableIcon}" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      nameIcon: "icon-prev"
    };
  },
  computed: {
    ...mapGetters("bookList", ["getDataOfCurrentList"]),

    disableIcon() {
      if (this.getDataOfCurrentList.current > 1) return true;
      return false;
    }
  },
  methods: {
    prevList() {
      this.$store.dispatch("bookList/goBack");
      //if obj.type = search -> setSear.. obj.content
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