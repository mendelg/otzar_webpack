<template>
  <div
    class="item item-extens dir-rtl flex flex-align-center"
    :class="{ edit: modeEdit, active: active }"
  >
    <baseCheckBox
      class="check-item check-larg"
      :checked="checked"
      @change="check"
      size="larg"
    />

    <div class="item w-30">
      <span v-if="!modeEdit">
        {{ bookname }}
      </span>
      <template v-if="modeEdit" class="input input-rect">
        <input type="text" :value="inputValue.name" v-select />
      </template>
    </div>
    <div class="item w-10">
      <span v-if="!modeEdit">
        {{ bookauth }}
      </span>
      <template v-if="modeEdit" class="input input-rect">
        <input type="text" :value="inputValue.author" v-select />
      </template>
    </div>
    <div class="item w-20">
      <span v-if="!modeEdit">
        {{ printyear }}
      </span>
      <template v-if="modeEdit" class="input input-rect">
        <input type="text" :value="inputValue.printYear" v-select />
      </template>
    </div>
    <div class="id flex-g-1">
      <span v-if="!modeEdit">
        {{ id }}
      </span>
    </div>

    <div class="icons flex-bet" :class="{ edit: modeEdit }">
      <div
        v-if="modeEdit"
        class="btn-circle otz-icon icon-circle font-9"
        @click="cancelEdit"
        v-tooltip="this.$t('general.cancel')"
      >
        F
      </div>
      <div
        v-if="modeEdit"
        class="btn-circle otz-icon icon-circle font-13"
        @click="saveEdit"
        v-tooltip="this.$t('general.save')"
      >
        A
      </div>

      <div class="flex-bet" v-if="!modeEdit">
        <baseIcon
          nameIcon="arrow-user-extens"
          width="12"
          height="16"
          class="icon-extens icon-arrow-user-extens"
          pathIcon="icons-ganeral"
          @click="openInBook"
          v-tooltip="this.$t('general.open')"
        />
        <baseIcon
          nameIcon="edit-extens"
          width="15"
          height="15"
          class="icon-extens icon-edit-extens"
          pathIcon="icons-ganeral"
          @click="edit"
          v-tooltip="this.$t('general.edit')"
        />
        <baseIcon
          nameIcon="icon-garbage"
          width="15"
          height="17"
          class="icon-extens icon-garbage-extens"
          pathIcon="icons-ganeral"
          @click="remove"
          v-tooltip="this.$t('general.delete')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { openBook } from "@/services/bookData.js";
export default {
  props: ["item", "bookname", "bookauth", "printyear", "id", "checked"],
  data() {
    return {
      modeEdit: false,
      objEdit: {
        name: "",
        author: "",
        printYear: "",
        id: "",
      },
      hasChanges: false,
    };
  },

  created() {},
  computed: {
    ...mapGetters("books", ["getBookbyId"]),

    active() {
      if (this.currentSearchId == this.item.id) {
        // this.item.scrollIntoView();
        return true;
      }
      //let rect = item.getBoundingClientRect();
      return false;
    },
    hasChecked() {
      //
    },
    inputValue() {
      return {
        name: this.item.name,
        author: this.item.author,
        printYear: this.item.printYear,
        id: this.item.id,
      };
    },
  },
  methods: {
    async openInBook() {
      let bookId = this.item.id;
      let page = 0;
      this.$store.state.homePage = false;
      await openBook(bookId, page);
    },
    check(e) {
      this.$emit("checked", { e, item: this.item });
    },
    open() {
      this.$emit("click", "open", this.item);
      return;
    },
    edit() {
      this.modeEdit = true;
      return;
    },
    async remove() {
      //TODO add language
      const ask_msg = this.$t("actionBook.deletBookQ");
      let payload = {
        title: this.$t("general.remove2"),
        content: ask_msg,
        btns: [this.$t("general.yes"), this.$t("general.no")],
      };
      let act = await this.$msg(payload);
      if (act != this.$t("general.yes")) {
        return;
      }
      this.$emit("delete", this.id);
    },

    saveEdit() {
      this.modeEdit = false;
    },
    cancelEdit() {
      this.modeEdit = false;
    },
  },
};
</script>

<style lang="scss">
$bg-color5: #f4f4f4;
.btn-circle.btn {
  width: 20px;
  min-width: 20px;
}
.input-rect {
  padding: 0 0 0 34px;
  input {
    border-color: #dedede;
    height: 22px;
    border-radius: 0;
    line-height: 22px;
    padding: 0;
  }
}
.item-extens {
  //height: 36px;
  border-bottom: 1px solid #e5e5e5;
  line-height: 35px;
  &.edit,
  &:hover,
  &.active {
    background-color: $bg-color5;
  }
  .link-book {
    padding: 5px 0;
    line-height: 19px;
  }
  .note-link {
    font-size: 10px;
    line-height: 14px;
    opacity: 0.7;
  }
  .btn {
    height: 20px;
    line-height: 19px;
    width: 63px;
    min-width: 63px;
    font-size: 12px;
    margin: 7.5px 2px 0;
  }
}
.icon-extens {
  height: 24px;
  width: 24px;
  cursor: pointer;
  position: relative;
  border-radius: 50%;
  margin: 0 auto;
  // margin-top: 6px;
  &:hover {
    background-color: #00000014;
  }
  svg {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translateX(-50%) translateY(-50%);
  }
}
.window-user-extens .item .icons.edit {
  align-items: baseline;
  text-align: left;
  display: flex;
  justify-content: flex-end;
  padding-left: 12px;
}
</style>
