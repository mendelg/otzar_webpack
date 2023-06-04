<template>
  <div class="properties-folder-container">
    <div class="header flex">
      <header class="title-popup drag font">
        <!-- <slot name="header"></slot> -->
        <span class="title">{{ $t("files1.propertiesFolder") }}</span>

        <!-- <baseIcon class="close-popup" nameIcon="x-popup" @click="close()" /> -->
      </header>
    </div>
    <div class="content content-proper">
      <!-- {{item}} -->
      <div>
        <span class="title">{{ $t("files1.fullNameFolder") }}</span>
        <span class="content">{{ name }}</span>
      </div>

      <div>
        <span class="title">{{ $t("files1.dateCreateFolder") }}</span>
        <span class="content">{{ dateCreate }}</span>
      </div>
      <div>
        <span class="title">{{ $t("files1.typeFolder") }}</span>

        <span class="content">{{ typeList }}</span>
      </div>
      <div>
        <span class="title">{{ $t("files1.placeFolder") }}: </span>

        <!-- <breadCrumbs
            v-for="(item, index) of bread"
            :key="index"
            :title="item.title"
            :id="item.id"
            @click="prevFolder(item.id)"
        />-->

        <span v-if="!getParentsFolderTree">{{ $t("files1.mainFolder") }}</span>

        <span v-for="(item, index) of getParentsFolderTree" :key="index">
          <span v-if="index > 0 && index != getParentsFolderTree.length"
            >></span
          >
          <span v-if="index != getParentsFolderTree.length">{{
            item.title
          }}</span>
        </span>
        <!-- <span class="content">תיקיה ראשית > ספרי מערכת > נושאים > תלמוד בבלי</span> -->
      </div>
      <div>
        <span class="title">{{ $t("files1.numFileFolder") }}</span>

        <span class="content">{{ numBooks }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("folders", [
      "getSelectFolder",
      "hasSelectSystemFolder",
      "getParentsFolderTree",
    ]),
    item() {
      if (this.getSelectFolder.length == 1) return this.getSelectFolder[0];

      if (this.getParentsFolderTree && this.getParentsFolderTree.length > 0)
        return this.getParentsFolderTree[this.getParentsFolderTree.length - 1];
      else return null;
    },
    name() {
      if (!this.item) return "";
      return this.item.title;
    },
    dateCreate() {
      if (!this.item) return null;
      if (this.item.createdAt) {
        let mydate = new Date(this.item.createdAt);
        let time = new Date(this.item.createdAt);
        time = time.toLocaleTimeString();
        time = time.slice(0, 5);
        return mydate.toLocaleDateString() + "     " + time;
      } else return "-";
    },
    numBooks() {
      if (!this.item) return;
      if (this.item.next.length > 0) {
        return this.item.next.length + " " + this.$t("folders.files");
      } else return "0";
    },
    typeList() {
      if (!this.item) return;
      if (this.hasSelectSystemFolder == "true" || this.hasSelectSystemFolder)
        return this.$t("folders.folderSystemList");
      if (this.item.folderTypeId == 1) return this.$t("folders.folderLists");
      else if (this.item.folderTypeId == 2)
        return this.$t("folders.normalListBooks");
    },
  },
};
</script>

<style lang="scss" scoped>
.title-popup {
  width: 100%;
  .title {
    width: 100%;
    height: 56px;
    line-height: 56px;
    padding: 0 20px;
    display: block;
    background-color: #f1f1f1;
    color: #000;
    position: relative;
  }
}
.properties-folder-container .title {
  font-weight: bold;
}
.properties-folder-container .content {
  padding: 15px 20px;
}
.content-proper div {
  display: flex;
  justify-content: space-between;
  height: 25px;
  align-items: center;
  padding: 0 30px;
  .content {
    padding: 0;
  }
}
.properties-folder-container .content {
  padding-top: 12px;
}
</style>
