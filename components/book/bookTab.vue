<template>
  <div>
    <template v-if="!inlist">
      <BaseResizablePatched
        ref="resizableComponent"
        :active="handlers"
        :width="width"
        :min-width="70"
        :disableAttributes="dhandlers"
        @resize:end="handleResizeEnd"
        dragSelector=".tab-title"
      >
        <div
          v-tooltip="toolTipContent"
          class="item-tab-con"
          :class="{
            active: active,
            dragging: inDragMode,
          }"
        >
          <div
            v-if="!editMode"
            class="item-tab"
            :index="id"
            @click="parentClick"
            @contextmenu="openContexMenu"
            :class="{ dragging: inDragMode }"
            :id="'tab' + id"
          >
            <BaseContextMenu>
              <div v-if="!emptyTab" @click="doEdit" class="menu-item">
                {{ $t("general.rename") }}
              </div>
              <div v-if="!emptyTab" @click="$emit('dup')" class="menu-item">
                {{ $t("tabs.duplicate") }}
              </div>
              <div
                @click="$emit('move', { move: 1, index: id })"
                class="menu-item"
              >
                {{ $t("tabs.moveLeft") }}
              </div>
              <div
                @click="$emit('move', { move: -1, index: id })"
                class="menu-item"
              >
                {{ $t("tabs.moveRight") }}
              </div>
              <div @click="removeTab" class="menu-item">
                {{ $t("tabs.closeTabe") }}
              </div>
              <div @click="$emit('closeall')" class="menu-item">
                {{ $t("tabs.closeAll") }}
              </div>
              <div @click="$emit('closenotpinned')" class="menu-item">
                {{ $t("tabs.closeNotPinned") }}
              </div>
              <div @click="$emit('closeothers')" class="menu-item">
                {{ $t("tabs.closeOthers") }}
              </div>
              <div v-if="!emptyTab" @click="$emit('unpin')" class="menu-item">
                {{ $t("tabs.openNewWindow") }}
              </div>
              <div @click="$emit('create_qk_btn', 'tabs')" class="menu-item">
                צור כפתור מהיר מטאבים פתוחים
              </div>
              <div @click="$emit('create_qk_btn', 'wins')" class="menu-item">
                צור כפתור מהיר מחלונות פתוחים
              </div>
            </BaseContextMenu>
            <bookTabTitle
              :tabId="getTabId"
              :origTitle="getTabData.title || $t('tabs.chooseBook')"
              :title="title"
              :inList="inlist"
            />
            <div></div>
            <span
              v-if="pinned && !inlist"
              @click="unPinTheTab"
              class="icon-unpin text-xxl mef-icon pin"
              v-tooltip="{
                content: $t('tooltip.unpin'),
                placement: 'top',
              }"
            >
              <BaseIcon
                class="icon x-close"
                width="13"
                height="15"
                nameIcon="pinter-active"
                pathIcon="icons"
              />
            </span>
            <span
              v-if="!pinned && getTabData.book > 0 && !inlist"
              @click="pinTheTab"
              class="icon-pin-tab mef-icon text-xxl"
              v-tooltip="{ content: $t('tabs.pin'), placement: 'top' }"
            >
              <BaseIcon
                class="icon"
                width="13"
                height="15"
                nameIcon="pinter-gray"
                pathIcon="icons"
              />
            </span>
            <!-- <span
              v-if="!pinned && getTabData.book > 0 && !inlist"
              @click="dockTheTab"
              class="icon-pin-tab mef-icon text-xxl"
              v-tooltip="{ content: $t('tabs.pin'), placement: 'top' }"
            >
              <BaseIcon
                class="icon"
                width="13"
                height="15"
                nameIcon="pinter-gray"
                pathIcon="icons"
              />
            </span> -->
            <div class="icon icon-close">
              <BaseIconX :nameIcon="nameIconRemove" @click="removeTab()" />
            </div>
          </div>
          <div v-if="editMode">
            <input
              @keydown.enter="save"
              ref="editBox"
              type="text"
              :value="getTabData.customTitle || getTabData.title"
              class="input-change"
            />
            <div class="icons-change">
              <span @click.stop="editMode = false" class="otz-icon icon-x"
                >F</span
              >
              <span @click.stop="save" class="otz-icon icon-v">A</span>
            </div>
          </div>
        </div>
      </BaseResizablePatched>
    </template>
    <template v-else>
      <div
        v-tooltip="toolTipContent"
        class="item-tab-con"
        :class="{
          active: active,
          dragging: inDragMode,
        }"
      >
        <div
          v-if="!editMode"
          class="item-tab"
          :index="id"
          @click="parentClick"
          @contextmenu="openContexMenu"
          :class="{ dragging: inDragMode }"
          :id="'tab' + id"
        >
          <BaseContextMenu>
            <div v-if="!emptyTab" @click="doEdit" class="menu-item">
              {{ $t("general.rename") }}
            </div>
            <div v-if="!emptyTab" @click="$emit('dup')" class="menu-item">
              {{ $t("tabs.duplicate") }}
            </div>
            <div
              @click="$emit('move', { move: 1, index: id })"
              class="menu-item"
            >
              {{ $t("tabs.moveLeft") }}
            </div>
            <div
              @click="$emit('move', { move: -1, index: id })"
              class="menu-item"
            >
              {{ $t("tabs.moveRight") }}
            </div>
            <div @click="removeTab" class="menu-item">
              {{ $t("tabs.closeTabe") }}
            </div>
            <div @click="$emit('closeall')" class="menu-item">
              {{ $t("tabs.closeAll") }}
            </div>
            <div @click="$emit('closeothers')" class="menu-item">
              {{ $t("tabs.closeOthers") }}
            </div>
            <div v-if="!emptyTab" @click="$emit('unpin')" class="menu-item">
              {{ $t("tabs.openNewWindow") }}
            </div>
          </BaseContextMenu>
          <bookTabTitle
            :tabId="getTabId"
            :origTitle="getTabData.title || $t('tabs.chooseBook')"
            :title="title"
            :inList="inlist"
          />
          <div></div>
          <span
            v-if="pinned && !inlist"
            @click="unPinTheTab"
            class="icon-unpin text-xxl mef-icon pin"
            v-tooltip="{
              content: $t('tooltip.unpin'),
              placement: 'top',
            }"
          >
            <BaseIcon
              class="icon x-close"
              width="13"
              height="15"
              nameIcon="pinter-active"
              pathIcon="icons"
            />
          </span>
          <span
            v-if="!pinned && getTabData.book > 0 && !inlist"
            @click="pinTheTab"
            class="icon-pin-tab mef-icon text-xxl"
            v-tooltip="{ content: $t('tabs.pin'), placement: 'top' }"
          >
            <BaseIcon
              class="icon"
              width="13"
              height="15"
              nameIcon="pinter-gray"
              pathIcon="icons"
            />
          </span>
          <div class="icon icon-close">
            <BaseIconX :nameIcon="nameIconRemove" @click="removeTab()" />
          </div>
        </div>
        <div v-if="editMode">
          <input
            @keydown.enter="save"
            ref="editBox"
            type="text"
            :value="getTabData.customTitle || getTabData.title"
            class="input-change"
          />
          <div class="icons-change">
            <span @click.stop="editMode = false" class="otz-icon icon-x"
              >F</span
            >
            <span @click.stop="save" class="otz-icon icon-v">A</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
// import VueResizable from "vue-resizable";
import { mapActions, mapState } from "vuex";
import bookTabTitle from "@/components/book/bookTabTitle.vue";
export default {
  components: {
    bookTabTitle,
    // VueResizable,
  },
  props: ["id", "width", "index", "inlist"],
  data() {
    return {
      nameIconRemove: "icon-remove",
      nameIconPin: "icon-pin",
      nameIconUnpin: "icon-unpin",
      editMode: false,
      dhandlers: ["l", "h", "t"],
    };
  },
  watch: {
    currentTabId: function(val) {
      if (val != this.id) this.editMode = false;
    },
  },
  computed: {
    ...mapState("tabsManager", ["currentTabId", "pinnedTabs"]),
    handlers() {
      return this.inlist ? [] : ["l"];
    },
    toolTipContent() {
      return {
        content: this.inlist || this.emptyTab ? "" : this.title,
        placement: "bottom",
      };
    },
    title() {
      return (
        this.getTabData.customTitle ||
        this.getTabData.title ||
        this.$t("tabs.chooseBook")
      );
    },
    inDragMode() {
      return this.$store.state.tabsManager.draggingTab;
    },
    emptyTab() {
      return this.getTabData.book == -1;
    },
    pinned() {
      return this.pinnedTabs[this.id] != undefined;
    },
    active() {
      return this.currentTabId == this.getTabId;
    },
    getTabId() {
      return this.id;
    },
    getOverride() {
      return this.getTabData.override;
    },
    doTabData() {
      return this.getTabData;
      // return { title: "theTab", book: this.getTabId };
    },
    firstTab() {
      return this.$store.getters["tabs/" + this.getTabId + "/isfirstTab"];
    },
    getTabData() {
      let tabdata = this.$store.getters[
        "tabs/" + this.getTabId + "/getTabData"
      ];
      return tabdata;
    },
  },
  methods: {
    ...mapActions("tabsManager", ["delTab", "pinTab"]),
    handleResizeEnd(data) {
      this.$store.state.tabs[this.id].tabWidth = data.width;
      this.$emit("setMaxTabs");
    },
    save() {
      if (this.$refs.editBox.value.trim() == "") return;
      this.$store.dispatch(
        `tabs/${this.getTabId}/setCustomTitle`,
        this.$refs.editBox.value
      );
      this.editMode = false;
    },
    doEdit() {
      this.editMode = true;

      this.$nextTick(() => {
        this.$refs.editBox.select();
      });
    },
    pinTheTab() {
      this.pinTab({ tabId: this.id, pin: true });
    },
    unPinTheTab() {
      this.pinTab({ tabId: this.id, pin: false });
    },
    openContexMenu() {
      if (!this.inlist) this.contextSelected = this.id;
    },
    removeTab() {
      this.delTab(this.getTabId);
    },

    clickOnList() {
      this.$emit("click");
    },
    parentClick() {
      this.$store.state.homePage = false;
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
/* body {
  direction: rtl;
  text-align: right;
} */
.icon-close {
  padding-left: 20px;
}
.resizable {
  resize: horizontal;
  overflow: hidden;
}
.item-tab-con {
  // background-color: aquamarine;
  height: 100%;
  width: 100%;
  border-left: 1px solid #e5e5e5;
  border-top: 1px solid #e5e5e5;
  position: relative;
  .input-change {
    padding-left: 40px;
  }
  .icons-change {
    left: 12px;
    .icon-v {
      margin: 0;
    }
  }
  &:hover {
    .icon-pin-tab {
      opacity: 1;
    }
  }
  &:not(.active):hover {
    background-color: #ececec;
  }

  &.active {
    border-bottom: 0;
    color: #000;
    position: relative;
    height: calc(100% + 1px);
    background-color: #fff;
    border-color: #b2b2b2;
    border-right: 0.2px solid #b2b2b2;
  }
}
.icon-pin-tab {
  align-items: center;
  display: flex;
  opacity: 0;
}

.icon-unpin {
  transform: translateX(5px);
  display: flex;
  align-items: center;
}
</style>
