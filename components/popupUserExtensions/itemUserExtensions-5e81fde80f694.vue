<template>
  <div
    class="item item-extens flex-bet flex"
    :class="{ edit: modeEdit, active: active }"
  >
    <baseCheckBox
      class="check-item check-larg"
      @change="check"
      :checked="hasChecked"
      size="larg"
    />

    <div class="num">{{ index + 1 }}</div>
    <div class="date">{{ crearedDate }}</div>
    <div v-if="name == 'key'" class="value">
      <span v-if="!modeEdit">
        <span v-if="!inSearch" class>{{ item.key }}</span>
        <span v-if="inSearch">
          <span>{{ sTitle.a }}</span>
          <!-- DISABLE FOR NOW MAYBE IN FUTURE -->
          <!-- <span class="mark-search-extention">{{ sTitle.b }}</span> -->
          <span>{{ sTitle.b }}</span>
          <!-- <span>{{ sTitle.b }}</span> -->
          <span>{{ sTitle.c }}</span>
        </span>
      </span>

      <div v-if="modeEdit" class="input input-rect">
        <input
          type="text"
          :value="keyInput"
          @input="setKeyKey($event.target.value)"
          v-select
        />
      </div>
    </div>

    <div v-if="name == 'key'" class="content content-s">
      <span v-if="!modeEdit">{{ item.value }}</span>
      <div class="input input-rect" v-if="modeEdit">
        <input
          type="text"
          :value="valueInput"
          @input="setKeyValue($event.target.value)"
        />
      </div>
    </div>
    <div v-else-if="name == 'comment'" class="comment comment-s">
      <span v-if="!modeEdit">
        <span v-if="!inSearch" v-html="item.data"></span>
        <span v-else>
          <span v-html="sTtitle.a"></span>
          <span class="mark-search-extention">{{ sTitle.b }}</span>
          <span>{{ sTtitle.c }}</span>
        </span>
      </span>
      <div class="input input-rect" v-if="modeEdit">
        <input
          type="text"
          :value="dataInput"
          @input="setCommentData($event.target.value)"
          v-select
        />
      </div>
    </div>
    <div v-else-if="name == 'marker'" class="image">
      <canvas ref="canvas" />
    </div>
    <template v-if="name === 'link'">
      <div class="link-book">
        {{ item.bookName }}, {{ $t("general.page") }} {{ item.letter }}
        <div
          class="note-link"
          style="font-size: 10px; line-height: 14px; opacity: 0.7"
        >
          {{ item.note }}
        </div>
      </div>
      <div class="link-book flex-g-1">
        {{ item.linkedTo.bookName }}, {{ $t("general.page") }}
        {{ item.linkedTo.letter }}
        <div style="font-size: 10px; line-height: 14px; opacity: 0.7">
          {{ item.linkedTo.note }}
        </div>
      </div>
    </template>
    <template v-else>
      <!-- getbook -->
      <div class="name-book name-book-s">{{ item.bookName }}</div>
      <!-- get page -->
      <div class="page-number">{{ item.letter }}</div>
    </template>
    <div class="icons flex-bet">
      <div
        style="line-height: 21px"
        v-if="modeEdit"
        class="btn-circle otz-icon icon-circle font-11"
        @click="cancelEdit"
        v-tooltip="this.$t('general.cancel')"
      >
        F
      </div>
      <div
        style="line-height: 21px"
        v-if="modeEdit"
        class="btn-circle otz-icon icon-circle font-14"
        @click="saveEdit"
        v-tooltip="this.$t('general.save')"
      >
        A
      </div>

      <div class="flex-bet flex-align-center" v-if="!modeEdit">
        <!-- <baseIcon
          nameIcon="arrow-user-extens"
          width="12"
          height="16"
          class="icon-extens icon-arrow-user-extens"
          pathIcon="icons-ganeral"
          @click="openInBook"
          v-tooltip="this.$t('general.open')"
        /> -->
        <div class="btn btn-open mrg-l-6" @click="openInBook">
          {{ $t("general.open") }}
        </div>
        <baseIcon
          v-if="name != 'marker' && name != 'link'"
          nameIcon="edit-extens"
          width="15"
          height="15"
          class="icon-extens icon-edit-extens"
          pathIcon="icons-ganeral"
          @click="edit"
          v-tooltip="this.$t('general.edit')"
        />
        <baseIcon
          nameIcon="icon-garbage-stroke"
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
import { mapState, mapActions, mapGetters } from "vuex";
import { getImageObject } from "@/services/bookData.js";
import bookwin from "@/services/book_win.js";
export default {
  props: [
    "item",
    "name",
    "index",
    "listCheckedIds",
    "currentSearchId",
    "inSearch",
    "searchValue",
  ],
  data() {
    return {
      modeEdit: false,
      dataInput: this.item.data,
      keyInput: this.item.key,
      valueInput: this.item.value,
      hasChanges: false,
    };
  },
  async mounted() {
    if (this.name != "marker") return;
    let maxWidth = 380;
    let c = this.$refs.canvas;
    let ctx = c.getContext("2d");
    let img;

    try {
      img = await getImageObject(
        this.item.bookId,
        this.item.name,
        "image",
        false,
        {},
        null,
        this.item.position
      );
    } catch (ex) {
      //  alert(ex);
    }
    let originWidth = img.imageMetaData.width || img.width;
    let originHeight = img.imageMetaData.height || img.height;
    let rat = img.width / originWidth;

    img = img.picture;
    let sx = this.item.x * rat;
    let sy = this.item.y * rat;
    let dWidth = this.item.width * rat;
    let dHeight = this.item.height * rat;
    let iw = this.item.width * rat;
    let ih = this.item.height * rat;
    c.height = this.item.height * rat;
    c.width = this.item.width * rat;
    if (dWidth > maxWidth) {
      iw = maxWidth;
      ih = ih * (maxWidth / dWidth);
      c.height = ih;
      c.width = maxWidth;
    }
    ctx.drawImage(img, sx, sy, dWidth, dHeight, 0, 0, iw, ih);
  },
  created() {},
  computed: {
    ...mapGetters("books", ["getBookbyId"]),
    bookName() {
      let book = this.getBookbyId(this.item.bookId);
      if (!book) return "";
      return book.name;
    },
    crearedDate() {
      let mydate = new Date(this.item.created);
      mydate =
        mydate.getDate() +
        "." +
        (mydate.getMonth() + 1) +
        "." +
        mydate.getFullYear();
      return mydate;
    },
    active() {
      if (this.currentSearchId == this.item.id) {
        // this.item.scrollIntoView();
        return true;
      }
      //let rect = item.getBoundingClientRect();
      return false;
    },
    hasChecked() {
      let hasChecked = false;
      this.listCheckedIds.forEach((id) => {
        if (id == this.item.id) hasChecked = true;
      });
      return hasChecked;
    },
    sTitle() {
      if (this.searchValue.length > 0) {
        let str = this.searchValue;
        let fullString = "";
        if (this.name == "comment") fullString = this.item.data;
        if (this.name == "key") fullString = this.item.key;
        let a, b, c;
        let i = fullString.indexOf(str);
        if (i != -1) {
          a = fullString.slice(0, i);
          b = str;
          c = fullString.slice(i + str.length, fullString.length);
        } else {
          a = fullString;
          b = "";
          c = "";
        }
        return {
          a,
          b,
          c,
        };
      }
    },
  },
  methods: {
    ...mapActions("tabsManager", ["setBook"]),
    ...mapActions("menuPersonalExtentions", ["checkedItem"]),
    //menuPersonalExtentions
    ...mapActions("userPersonalExtensions", [
      "updateUserComment",
      "updateUserKey",
      "updateUserMarker",
      "deleteUserComment",
      "deleteUserKey",
      "deleteUserMarker",
      "deleteUserLink",
    ]),
    async openInBook() {
      let bookId = this.item.bookId;
      let page = "P" + this.item.pageId;
      //await openBook(bookId, page);
      bookwin.createWinBook(bookId, page);
      // this.$emit("close");
    },
    check() {
      this.checkedItem(this.item.id);
      return;
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
      let payload = {
        title: this.$t("general.remove2"),
        content:
          this.name == "comment"
            ? this.$t("personalExtensions.okRemoveComment")
            : this.name == "key"
            ? this.$t("personalExtensions.okRemoveKey")
            : this.name == "marker"
            ? this.$t("personalExtensions.okRemoveMarker")
            : this.$t("links1.deleteLinkQck"),
        btns: [this.$t("general.yes"), this.$t("general.no")],
      };
      let act = await this.$msg(payload);
      if (act == this.$t("general.yes")) {
        if (this.name == "comment") this.deleteUserComment(this.item.id);
        if (this.name == "key") this.deleteUserKey(this.item.id);
        if (this.name == "marker") this.deleteUserMarker(this.item.id);
        if (this.name == "link") this.deleteUserLink(this.item.id);
      }
    },
    setCommentData(e) {
      this.dataInput = e;
      if (e !== this.item.data && e !== "") this.hasChanges = true;
      else this.hasChanges = false;
    },
    setKeyKey(e) {
      this.keyInput = e;
      if (e !== this.item.key && e !== "") this.hasChanges = true;
      else this.hasChanges = false;
    },
    setKeyValue(e) {
      this.valueInput = e;
      if (e !== this.item.value && e !== "") this.hasChanges = true;
      else this.hasChanges = false;
    },
    saveEdit() {
      this.modeEdit = false;
      if (this.name == "comment") {
        let payload = {
          id: this.item.id,
          x: this.item.x,
          y: this.item.y,
          data: this.dataInput,
        };
        this.updateUserComment(payload);
      } else if (this.name == "key") {
        let payload = {
          id: this.item.id,
          x: this.item.x,
          y: this.item.y,
          key: this.keyInput,
          value: this.valueInput,
        };
        this.updateUserKey(payload);
      }
    },
    cancelEdit() {
      this.modeEdit = false;
    },
  },
};
</script>

<style lang="scss">
.content-s {
  padding-left: 10px;
}
.comment-s {
  padding-left: 10px;
}
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
    svg {
      stroke: var(--custom-color1);
    }
  }
  svg {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translateX(-50%) translateY(-50%);
    stroke: #b2b2b2;
    &:hover {
      stroke: var(--custom-color1);
    }
  }
}
.btn.btn-open {
  line-height: 20px !important;
  margin: 0 !important;
  margin-left: 4px !important;
  min-width: fit-content !important;
  width: fit-content !important;
}
.name-book-s {
  padding-left: 10px;
}
</style>
