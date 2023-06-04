<template>
  <div
    v-if="allowedListTypes && allowedFolderTypes"
    class="item item-symbole"
    @click="selectFolder"
    @click.right="selectFolder"
    @dblclick="openFolder"
    :class="{ check: isCheck, active: active, pin: pin }"
    ref="item"
    v-tooltip="{
      content: this.listParents,
      placement: 'bottom',
      classes: 'max-w',
    }"
  >
    <!-- v-click-outside="unSelectFolder" DISABLE FOR NOW -->
    <!-- {{listParents}} -->
    <!-- <div class="checkbox">
      <baseCheckBox
        v-if="hasCheckBox"
        class="check-item "
        :checked="isCheck"
        @change="checkFolder()"
        @click="click"
        size="large"
      />
    </div>-->

    <div class="icon">
      <baseIconFolder
        class="popup-icon-folder"
        :nameIcon="type + '-symbol'"
        :width="widthIcon"
        :height="heightIcon"
      />
    </div>
    <div v-if="!edit" class="text">
      <span v-if="!inSearch" class>{{ title }}</span>
      <span class="res" v-if="inSearch">
        <span>{{ title.a }}</span>
        <span class="mark-search">{{ title.b }}</span>
        <span>{{ title.c }}</span>
      </span>
    </div>
    <baseInputEdit
      v-if="edit"
      :valueInput="valueInput"
      @edit="editFolder"
      @blur="editFolder"
      @keyup="keyupInputFunc"
    />
  </div>
</template>

<script>
import mixin from "@/mixing/mixModeViewItem.js";
export default {
  mixins: [mixin],

  data() {
    return {
      widthIcon: 69,
      heightIcon: 58,
      hasChecked: false,
    };
  },

  computed: {
    type() {
      if (this.systemFile == "true") {
        if (this.item.next.length == 0) {
          if (this.item.categoryTypeId == 1 && this.item.level == 2) {
            return "book";
          }
          this.widthIcon = 53;
          this.heightIcon = 55;
          return "list-system";
        }
        //   else if (
        //     this.item.categoryTypeId == 2 &&
        //     this.item.level == 2 &&
        //     this.item.parent &&
        //     this.item.parent.level == 1
        //   ) {
        //     return "list-folder-system";
        //   }
        this.widthIcon = 62;
        this.heightIcon = 55;
        return "system";
      }
      if (this.item.icon && this.item.icon.length > 0) return this.item.icon;
      if (this.item.listable == "userbooks") {
        this.widthIcon = 53;
        this.heightIcon = 55;
        return "userbooks";
      }
      if (this.item.listable == "pdfbooks") {
        this.widthIcon = 53;
        this.heightIcon = 55;
        return "pdfbooks";
      }
      if (this.item.listable == "hiddenbooks") {
        this.widthIcon = 53;
        this.heightIcon = 55;
        return "hiddenbooks";
      }
      if (this.item.listable == "favorites") {
        this.widthIcon = 53;
        this.heightIcon = 55;
        return "star";
      }
      if (this.item.listable == "recentbooks") {
        this.widthIcon = 53;
        this.heightIcon = 55;
        return "history";
      }
      if (this.item.listable == "qckbtn") {
        this.widthIcon = 61.5;
        this.heightIcon = 59.5;
        return "quick";
      }

      if (this.item.parent && this.item.parent.listable == "qckbtn") {
        this.widthIcon = 52.646;
        this.heightIcon = 57;
        return "quick-list";
      }
      if (this.item.folderTypeId == 1) {
        this.widthIcon = 62;
        this.heightIcon = 57;
        return "normal";
      } else if (this.item.folderTypeId == 2) {
        this.widthIcon = 53;
        this.heightIcon = 57;
        return "list";
      } else if (this.item.folderTypeId == 3) {
        this.widthIcon = 53;
        this.heightIcon = 57;
        return "search-list";
      }
      this.widthIcon = 62;
      this.heightIcon = 57;
      return "normal";
    },
    isCheck() {
      return this.hasChecked;
    },
  },
  methods: {
    click() {
      return;
    },
    checkFolder() {
      this.hasChecked = !this.hasChecked;
    },
    checkKeyArrow(dir) {
      if (this.getSelectFolder.length == 0 || this.getSelectFolder.length > 1)
        return;
      let sOffset = this.getSelectFolder[0].positionElem;
      let element = this.$el;
      if (dir == "bottom")
        if (sOffset.offsetLeft == element.offsetLeft) {
          if (sOffset.offsetTop < element.offsetTop) {
            this.$emit("addtempselect", this.item, element, dir);
            return;
          }
        }
      if (dir == "top")
        if (sOffset.offsetLeft == element.offsetLeft) {
          if (sOffset.offsetLeft == element.offsetLeft)
            if (sOffset.offsetTop > element.offsetTop) {
              this.$emit("addtempselect", this.item, element, dir);
              return;
            }
        }
      this.$emit("addtempselect", null, element, dir);
      // console.dir("checkKeyArrow");
    },
  },
  watch: {
    isKeyArrow: function() {
      if (!this.isKeyArrow.isKey) return;
      if (!this.getIdSelectFolder) return;
      if (this.active) {
        return;
      }
      if (this.isKeyArrow.isKey) {
        if (this.isKeyArrow.dir == "top" || this.isKeyArrow.dir == "bottom") {
          this.checkKeyArrow(this.isKeyArrow.dir);
          return;
        }
        if (this.isKeyArrow.dir == "left" || this.isKeyArrow.dir == "right") {
          //       return this.getCurrentListFolderSystem;
          //   return this.getCurrentListFolder;
          let find = this.getAllListCurrent.findIndex(
            (c) => c.id == this.item.id
          );
          let find2 = this.getAllListCurrent.findIndex(
            (c) => c.id == this.getSelectFolder[0].id
          );
          if (this.isKeyArrow.dir == "left")
            if (find - 1 == find2)
              this.$emit(
                "addtempselect",
                this.item,
                this.$el,
                this.isKeyArrow.dir
              );
          if (this.isKeyArrow.dir == "right")
            if (find + 1 == find2)
              this.$emit(
                "addtempselect",
                this.item,
                this.$el,
                this.isKeyArrow.dir
              );
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.item-symbole {
  user-select: none;
  .check-item {
    opacity: 0;
    margin-right: 13px;
  }
  &.check {
    .check-item {
      opacity: 1;
    }
  }
}
.item-symbole:hover,
.item-symbole.active {
  .check-item {
    opacity: 1;
  }
}
.item.pin::after {
  content: "p";
  display: block;
  font-family: otzar-new;
  font-size: 20px;
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
