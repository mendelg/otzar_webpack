<template>
  <div class="item item-symbole">
    <div class="icon">
      <baseIcon class="popup-icon-folder" :nameIcon="'icon-folder'" />
    </div>
    <div class="text">
      <!-- <input ref="createFolderRef" @keyup.enter="createFolder($event)" value="תיקיה חדשה" /> -->
      <baseInputEdit
        :valueInput="valueInput"
        @edit="editFolder"
        @blur="editFolder"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
export default {
  props: ["icon"],
  computed: {
    ...mapGetters("folders", ["getModeEdit"]),
    valueInput() {
      return this.getModeEdit.value;
    },
  },
  methods: {
    createFolder(e) {
      e.preventDefults();
      let value = e.target.value;
      if (!value) value = this.$t("files1.newFolder");
      this.$emit("input");
    },
    editFolder() {
      this.$emit("edit-folder");
    },
    applyEdit(e) {},
  },
};
</script>

<style lang="scss" scoped></style>
