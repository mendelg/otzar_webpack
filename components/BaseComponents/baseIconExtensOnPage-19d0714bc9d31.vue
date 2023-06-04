<template>
  <div v-cdrag.self="{ id, parent: true, disable: type == 'marker' }">
    <slot></slot>
    <BaseIcon
      width="28"
      height="28"
      v-on="$listeners"
      :nameIcon="nameIcon"
      pathIcon="icons-ganeral"
      v-if="type != 'marker'"
      v-tooltip="{
        content: data,
        placement: 'right',
        classes: 'extens-tooltip1',
      }"
    />
    <!--   <base-extended-tool-tip v-if="type != 'marker'" :data="data" /> -->
    <div
      class="remove-marker otz-icon no-bg"
      v-if="type == 'marker'"
      v-on="$listeners"
    >
      F
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: ["type", "id", "item"],
  computed: {
    active() {},
    nameIcon() {
      return `icon-${this.type}-page`;
    },
    data() {
      if (this.type == "key") return this.item.key + " | " + this.item.value;
      if (this.type == "comment") return this.item.data;
      if (this.type == "link") {
        let bookName =
          this.item.bookName == this.item.linkedTo.bookName
            ? ""
            : this.item.linkedTo.bookName + " | ";
        let page = this.$t("general.page") + " " + this.item.linkedTo.letter;
        let note = this.item.note ? " | " + this.item.note : "";
        return bookName + page + note;
      }
    },
  },
  methods: {
    ...mapActions("userPersonalExtensions", ["deleteUserMarker"]),
    edit() {
      // this.$emit("click", this.item, this.type);
    },
    remove() {
      this.$emit("click", this.item, this.type);
      //   this.deleteUserMarker(this.item.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.remove-marker {
  position: absolute;
  left: 5px;
  top: 5px;
  font-size: 10px;
  color: #000;
  line-height: 12px;
  height: 10px;
}
</style>
