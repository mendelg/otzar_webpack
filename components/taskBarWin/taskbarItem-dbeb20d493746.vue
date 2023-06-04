<template>
  <div
    class="flex flex-align-center"
    @click="toggleItem"
    :class="{ active: mode, 'task-item': !list, 'item-in-list': list }"
    v-tooltip="toolTipData"
  >
    <!-- <base-icon
      width="20"
      nameIcon="x-window-books"
      pathIcon="icons-book"
      height="10"
    ></base-icon> -->
    <span class="title">{{ title }} </span>
    <!-- <base-icon
      @click.stop="closeWin"
      width="20"
      nameIcon="x-window-books"
      pathIcon="icons-book"
      height="10"
    ></base-icon> -->
    <div
      class="remove icon-otzar icon-circle  icon-remove"
      @click.stop="closeWin"
    >
      F
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "id", "mode", "close", "cb", "tabId", "list"],
  computed: {
    toolTipData() {
      let placement = "right";
      if (this.list) return false; //placement = "top"; //return false;
      return {
        content: this.title,
        placement: placement,
      };
    },
  },
  methods: {
    toggleItem(id) {
      this.$store.dispatch("taskbar/toggleItemMode", this.id);
    },
    closeWin() {
      this.$store.dispatch("taskbar/removeItem", this.id);
      this.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.task-item {
  cursor: pointer;
  padding: 0 5px 0 0px;
  border-radius: 11px;
  background-color: #fff;
  border: 1px solid #b6b6b6;
  color: #626262;
  color: #fff;
  max-width: 100px;
  white-space: nowrap;
  // overflow: hidden;
  margin-left: 3px;
  width: 100px;
  animation: flick 1.1s;
  animation-iteration-count: 3;
  background-color: var(--custom-color1);
  font-weight: normal;
  &:hover {
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.24);
    border: 1px solid #b6b5b5;
    background-color: var(--custom-color2);
  }
  &.active {
    color: #fff;
    box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.24);
    border: 1px solid #b6b5b5;
    background-color: var(--custom-color2);
    &:hover {
      background-color: var(--custom-color1);
    }
    // box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.24);
  }
  .title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: calc(100% - 10px);
    font-weight: normal;
  }
}
.remove {
  font-size: 8px;
  height: 15px;
  width: 10px;
  color: rgba(255, 255, 255, 0.552);
  line-height: 18px;
  text-align: center;
  margin: 0px 0px 0 4px;
}
.item-in-list {
  border: 0;
  white-space: nowrap;
  max-width: 100%;
  color: #000;
  height: 28px;
  line-height: 28px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  cursor: pointer !important;
  padding-right: 5px;
  padding-left: 5px;
  justify-content: space-between;
  &:hover {
    background-color: #ececec;
    .remove.icon-otzar {
      opacity: 1;
    }
  }
  .remove.icon-otzar {
    color: black;
    opacity: 0;
  }
}
</style>
