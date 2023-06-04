<template>
  <BaseCleanPopup
    @close="closePopup()"
    :winh="593"
    :winw="1000"
    v-body
    class="larg-win"
  >
    <!-- <div class="outer-window-user-extens" v-cdrag.parent> -->
    <!-- <vue-draggable-resizable
      :x="x"
      :y="y"
      :parent="true"
      :resizable="false"
      :w="1000"
      :h="593"
      drag-handle=".drag"
    >-->
    <template v-slot:header>
      <div class="flex-row flex-align-center h-100">
        <div class="icon-item">{{ icon }}</div>
        <div class="flex-g-1">{{ title }}</div>
      </div>
    </template>
    <div class="window-user-extens">
      <div class="container container-user-extens">
        <div class="content">
          <div class="header flex">
            <div class="combobox">
              <ComboboxInput
                class="fit-height comb"
                :items="filterlist"
                @input="filterView($event)"
                :labelStart="labelStart"
                :labelKey="labelKey"
                :labal="$t('personalExtensions.createDate')"
              />
            </div>
            <div class="search" v-if="name !== 'marker'">
              <!-- search action -->
              <baseInputIconSearch
                :placeholder="placeholder"
                @input="setTextSearch"
                :value="searchValue"
                @search="doSearch"
                @clear="clearSearch"
              />
            </div>

            <div
              v-if="searchList.length > 0"
              class="results-search-container flex"
            >
              <input type="text" :value="currentSearchIndex + 1" />
              <span class="text"
                >{{ $t("general.ofResults") }} {{ searchList.length }}&nbsp;{{
                  $t("general.results")
                }}</span
              >
              <div class="icons-arrow flex">
                <baseIcon
                  class="icon-arrow-results icon-prev"
                  :class="{ disable: currentSearchIndex == 0 }"
                  nameIcon="arrow-top-circle"
                  pathIcon="icons-ganeral"
                  width="21"
                  height="21"
                  @click="showPrevResults"
                />
                <baseIcon
                  class="icon-arrow-results icon-next"
                  :class="{
                    disable: searchList.length == currentSearchIndex + 1,
                  }"
                  nameIcon="arrow-bottom-circle"
                  pathIcon="icons-ganeral"
                  width="21"
                  height="21"
                  @click="showNextResults"
                />
              </div>
            </div>
            <div v-if="total > 0" class="flex nev-pages">
              <div class="mrg-l-12">
                <span class="mrg-l-3">
                  <span>{{ offset + 1 }}</span>
                  <span>-</span>
                  <span>{{ toRow }}</span>
                </span>
                <span class="mrg-l-3">{{ $t("general.ofResults") }}</span>
                <span>{{ total }}</span>
              </div>
              <div class="flex flex-align-center">
                <div
                  @click="prevPage"
                  class="otz-icon icon-arrow-np icon-prev mrg-l-12"
                  :class="{ disable: firstPage }"
                >
                  o
                </div>
                <div
                  @click="nextPage"
                  class="otz-icon icon-arrow-np icon-next"
                  :class="{ disable: lastPage }"
                >
                  o
                </div>
              </div>
            </div>
            <baseIcon
              v-disable
              class="export-to-excel"
              nameIcon="export-to-excel"
              pathIcon="icons-ganeral"
              width="24"
              height="23"
              v-if="name !== 'marker'"
              @click="showDataInExcel"
            />
          </div>
          <div class="list-extens">
            <div class="dir-rtl header-list-extens flex flex-align-center">
              <!-- <baseCheckBox :size="larg" /> -->
              <baseCheckBox
                class="check-item check-larg"
                :class="{ 'check-minus': checkMinus }"
                @change="checkAll"
                :checked="hasCheckedTop"
                size="larg"
                :minus="checkMinus"
              />
              <div
                class="num remove-select"
                v-tooltip="this.$t('general.delete')"
              >
                <baseIcon
                  nameIcon="icon-garbage-stroke"
                  width="15"
                  height="17"
                  class="icon-extens icon-garbage-extens"
                  :class="{ active: hasCheckedTop }"
                  pathIcon="icons-ganeral"
                  @click="remove"
                />
              </div>
              <div class="date">{{ $t("general.date") }}</div>
              <template v-if="name === 'link'">
                <div class="link-book">{{ $t("general.fromBook") }}</div>
                <div class="link-book flex-g-1">{{ $t("general.toBook") }}</div>
              </template>
              <template v-else>
                <div v-if="name == 'key'" class="value">
                  {{ $t("general.value") }}
                </div>

                <div v-if="name == 'key'" class="content">
                  {{ $t("general.content") }}
                </div>
                <div v-if="name == 'comment'" class="comment">
                  {{ $t("comments.comment") }}
                </div>
                <div class="image" v-if="name == 'marker'">
                  {{ $t("general.img") }}
                </div>
                <div class="name-book">{{ $t("changeBookInfo.bookName") }}</div>
                <div class="page-number">{{ $t("general.page") }}</div>
              </template>
              <div class="icons"></div>
            </div>
            <div class="dir-rtl inner-list-extens">
              <itemUserExtensions
                :id="item.id"
                :item="item"
                :listCheckedIds="listCheckedIds"
                :name="name"
                v-for="(item, index) in itemlist"
                :key="item.id"
                :index="index + offset"
                :currentSearchId="currentSearchId"
                :inSearch="inSearch"
                searchValue=""
                @close="closePopup()"
              />
            </div>
          </div>

          <div class="line-status">{{ status }}</div>
        </div>
      </div>
    </div>
    <!-- </vue-draggable-resizable> -->
    <!-- </div> -->
  </BaseCleanPopup>
</template>

<script>
import itemUserExtensions from "./itemUserExtensions.vue";
import { mapActions } from "vuex";
import fs from "@/services/fileSaver.js";
export default {
  props: [
    "title",
    "name",
    "status",
    "list",
    "icon",
    "listCheckedIds",
    "offset",
    "limit",
    "total",
  ],
  components: {
    itemUserExtensions,
  },
  data() {
    return {
      labelStart: 0,
      labelKey: 0,
      searchList: [],
      currentSearchIndex: 0,
      currSearchId: 0,
      searchValue: "",
      sTitle: {
        a: "",
        b: "",
        c: "",
      },
    };
  },
  computed: {
    toRow() {
      return this.offset + this.limit <= this.total
        ? this.offset + this.limit
        : this.total;
    },
    firstPage() {
      return this.offset == 0;
    },
    lastPage() {
      return this.offset + this.limit >= this.total;
    },
    x() {
      let wWindow = window.winSizes.innerWidth;
      let left = wWindow / 2 - 500;
      return left;
    },
    y() {
      let hWindow = window.winSizes.innerHeight;
      let top = hWindow / 2 - 296;
      return top;
    },
    hasCheckedTop() {
      if (this.listCheckedIds.length > 0) {
        return true;
      }
      return false;
    },
    itemlist() {
      if (this.inSearch) return this.searchList;
      return this.list;
    },
    checkMinus() {
      if (
        this.listCheckedIds.length > 0 &&
        this.listCheckedIds.length !== this.list.length
      )
        return true;
      return false;
    },
    placeholder() {
      return this.$t("general.searchIn") + ` ${this.title}...`;
    },
    filterlist() {
      if (this.name == "comment")
        return [
          {
            label: this.$t("personalExtensions.createDate"),
            name: "date",
            key: 0,
          },
          { label: this.$t("general.nameBook"), name: "bookName", key: 1 },
        ];
      if (this.name == "key")
        return [
          {
            label: this.$t("personalExtensions.createDate"),
            name: "date",
            key: 0,
          },
          { label: this.$t("general.value"), name: "key", key: 1 },
          { label: this.$t("general.nameBook"), name: "bookName", key: 2 },
        ];
      if (this.name == "marker")
        return [
          {
            label: this.$t("personalExtensions.createDate"),
            name: "date",
            key: 0,
          },
          { label: this.$t("general.nameBook"), name: "bookName", key: 1 },
        ];
      if (this.name == "link")
        return [
          {
            label: this.$t("personalExtensions.createDate"),
            name: "date",
            key: 0,
          },
          { label: this.$t("general.nameBook"), name: "bookName", key: 1 },
        ];

      return [
        {
          label: this.$t("personalExtensions.createDate"),
          name: "date",
          key: 0,
        },
        { label: this.$t("general.nameBook"), name: "bookName", key: 1 },
      ];
    },
    currentSearchId() {
      if (this.searchList.length > 0) {
        return this.searchList[this.currentSearchIndex];
      } else return 0;
    },
    inSearch() {
      return false;
      if (this.searchValue != "") return true;
      return false;
    },
  },
  methods: {
    ...mapActions("menuPersonalExtentions", [
      "setSortType",
      "checkAllItemsInList",
      "deleteCheckedItemsList",
    ]),
    ...mapActions("userPersonalExtensions", [
      "getAllComments",
      "getAllKeys",
      "getAllLinks",
    ]),

    nextPage() {
      if (!this.lastPage) this.$emit("inc", 1);
    },
    prevPage() {
      if (!this.firstPage) this.$emit("inc", -1);
    },
    async remove() {
      let payload = {
        title: this.$t("general.remove2"),
        content:
          this.name == "comment"
            ? this.$t("personalExtensions.okRemoveComments")
            : this.name == "key"
            ? this.$t("personalExtensions.okRemoveKeys")
            : this.name == "marker"
            ? this.$t("personalExtensions.okRemoveMarkers")
            : this.$t("links1.deleteLinkQcks"),
        btns: [this.$t("general.yes"), this.$t("general.no")],
      };
      let act = await this.$msg(payload);
      if (act == this.$t("general.yes")) this.deleteCheckedItemsList(this.name);
    },
    async showDataInExcel() {
      let fileName = "";
      let listArrays = [];
      if (this.name == "comment") {
        fileName = this.$t("exportResults.commentsList");
        let list = await this.getAllComments();

        let titles = [
          this.$t("general.date"),
          this.$t("comments.comment"),
          this.$t("general.nameBook"),
          this.$t("general.page"),
        ];
        listArrays.push(titles);
        list.forEach((l) => {
          let mydate = new Date(l.created);
          let d = mydate.toLocaleDateString();
          let data = [d, getText(l.data), l.bookName, l.letter];
          listArrays.push(data);
        });
      }
      if (this.name == "key") {
        fileName = this.$t("exportResults.keysList");
        let list = await this.getAllKeys();
        let titles = [
          this.$t("general.date"),
          this.$t("general.value"),
          this.$t("general.content"),
          this.$t("general.nameBook"),
          this.$t("general.page"),
        ];

        listArrays.push(titles);
        list.forEach((l) => {
          let mydate = new Date(l.created);
          let d = mydate.toLocaleDateString();
          let data = [d, l.key, l.value, l.bookName, l.letter];
          listArrays.push(data);
        });
      }

      if (this.name == "link") {
        fileName = this.$t("exportResults.linksList");
        let list = await this.getAllLinks();
        let titles = [
          this.$t("general.date"),
          this.$t("general.fromBook"),
          this.$t("general.toBook"),
          this.$t("general.nameBook"),
          this.$t("general.page"),
          this.$t("comments.comment"),
        ];
        listArrays.push(titles);
        list.forEach((l) => {
          let mydate = new Date(l.created);
          let d = mydate.toLocaleDateString();
          let data = [
            d,
            l.bookName,
            l.letter,
            l.note,
            l.linkedTo.bookName,
            l.linkedTo.letter,
            l.linkedTo.note,
          ];
          listArrays.push(data);
        });
      }

      let csvContent = listArrays.map((e) => e.join(",")).join("\r\n");
      var link = window.document.createElement("a");
      link.setAttribute(
        "href",
        "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csvContent)
      );

      link.setAttribute(
        "download",
        `${this.$t("general.title")}_${fileName}.csv`
      );
      link.click();
    },
    doSearch() {
      let searchValue = this.searchValue;
      if (searchValue == "") return;
      this.$emit("search", searchValue);
      this.$emit("inc");
    },
    clearSearch() {
      this.searchValue = "";
      this.$emit("search", "");
      this.$emit("inc");
    },
    setTextSearch(e) {
      this.searchList = [];
      this.searchValue = e.target?.value || e;
      return;
      if (e.target.value == "") return;
      //indexOf

      if (this.name == "comment") {
        this.list.forEach((item) => {
          if (item.data.includes(e.target.value)) this.searchList.push(item);
        });
      }
      if (this.name == "key") {
        this.list.forEach((item) => {
          if (
            item.key.includes(e.target.value) ||
            item.value.includes(e.target.value)
          )
            this.searchList.push(item);
        });
      }
      if (this.name == "link") {
        let regx = new RegExp(e.target.value);
        this.list.forEach((item) => {
          if (
            regx.test(item.note) ||
            regx.test(item.linkedTo.note) ||
            regx.test(item.bookName) ||
            regx.test(item.linkedTo.bookName)
          )
            this.searchList.push(item);
        });
      }
      if (this.searchList.length > 0) {
        this.currentSearchIndex = 0;
        this.currSearchId = this.searchList[0];
        var elmnt = document.getElementById(this.currSearchId);
        elmnt.scrollIntoView();
      }
    },
    closePopup() {
      // this.$router.push({ name: "home" });
      this.$emit("close");
    },
    changeItem(str, item) {},
    // action sort
    async filterView(e) {
      //setSortType

      await this.setSortType(e.name);
      this.$emit("inc");
    },
    showPrevResults() {
      if (this.currentSearchIndex > 0)
        this.currentSearchIndex = this.currentSearchIndex - 1;
      this.currSearchId = this.searchList[this.currentSearchIndex];
      var elmnt = document.getElementById(this.currSearchId);
      elmnt.scrollIntoView();
    },
    showNextResults() {
      if (this.searchList.length > this.currentSearchIndex + 1)
        this.currentSearchIndex = this.currentSearchIndex + 1;
      this.currSearchId = this.searchList[this.currentSearchIndex];
      var elmnt = document.getElementById(this.currSearchId);
      elmnt.scrollIntoView();
    },
    checkAll($event) {
      if ($event.target.checked) {
        let payload = {
          hasCheckAll: true,
          listType: this.name,
        };
        this.checkAllItemsInList(payload);
      } else {
        let payload = {
          hasCheckAll: false,
          listType: this.name,
        };
        this.checkAllItemsInList(payload);
      }
    },
  },
};

function getText(txt) {
  return txt.replace(/<(?:.|\n)*?>/gm, "").replace("&nbsp", "");
}
</script>

<style lang="scss">
$bg-color5: #f4f4f4;
$bg-color1: #fff;
.window-user-extens {
  box-shadow: 6px 6px 6px rgba(0, 0, 0, 0.16);
  box-shadow: 3px 3px 11px rgba(0, 0, 0, 0.46);
  width: 100%;
  height: 100%;
  background-color: $bg-color1;
  // z-index: 9999999 !important;
  // position: absolute;
  // top: 50%;
  // left: 50%;
  // transform: translateX(-50%) translateY(-50%);
  // max-width: 100vw;
  // max-height: 100vh;
  ul {
    margin: inherit;
    margin-bottom: 13px;
    margin-top: 0;
  }
  .container-user-extens {
    height: 100%;
  }
  .title {
    height: 56px;
    width: 100%;
    background-color: #e9e9e9;
    padding: 0 12px 0 0;
    line-height: 56px;
    color: #000;
    font-size: 14px;
    font-weight: 600;
    position: relative;
    .icon-item {
      height: 100%;
      line-height: 56px;
      font-size: 50px;
      font-weight: 100;
    }
    .close {
      position: relative;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      cursor: pointer;
      margin-top: 16px;
      &:hover {
        background-color: #00000014;
      }
      svg {
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        position: absolute;
      }
    }
  }
  .content {
    height: 100%;
    .header {
      height: 42.5px;
      padding: 0 10px 0 15px;
      line-height: 42px;
      background-color: $bg-color5;
      border-top: 1px solid #dedede;
      border-bottom: 1px solid #dedede;
      position: relative;
      align-items: center;
      .results-search-container {
        padding: 10px 0;
        input {
          text-align: center;
          width: 32px;
          height: 16px;
          border-radius: 16px;
          border: 1px solid #e5e5e5;
          background-color: transparent;
          padding: 0 6px;
          margin-top: 1px !important;
          margin-left: 7px;
        }
        .text {
          line-height: 23px;
          margin-left: 8px;
          font-size: 12px;
        }
        .icons-arrow {
          width: 47px;
          justify-content: space-between;
          svg {
            transition: 0.3s;
            border-radius: 50%;
            cursor: pointer;
            &:hover {
              background-color: bisque;
              border: 1px solid #00000014;
            }
          }
        }
      }
      .export-to-excel {
        position: absolute;
        left: 10px;
        height: 28px;
        width: 28px;
        top: 8px;
        border-radius: 3px;
        padding-top: 2px;
        cursor: pointer;
        &:hover {
          background-color: #00000014;
        }
      }
      .search {
        width: 394px;
      }
      .combobox,
      .search {
        padding: 9.25px 0;
      }
    }
  }
  .header-list-extens {
    height: 31px;
    line-height: 30px;
    color: #b2b2b2;
    font-size: 12px;
    font-weight: bold;
    border-bottom: 1px solid #e5e5e5;
  }
  .header-list-extens,
  .item {
    div {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      line-height: 44px;
      // padding-right: 7px;
    }
    .check-item {
      width: 26px;
      padding: 15px 10px 0 0px;
      align-items: flex-start;
      label {
        top: 0;
        transform: translateY(0);
      }
    }
    .num {
      width: 30px;
      text-align: center;
      font-weight: bold;
      color: var(--custom-color1);
    }
    .value {
      width: 138px;
    }
    .content {
      width: 266px;
      flex-grow: 1;
    }
    .date {
      width: 108px;
      padding-right: 6px;
    }
    .image {
      width: 406px;
      max-height: 80px;
      overflow: auto;
      padding: 5px;
    }
    .comment {
      width: 406px;
      flex-grow: 1;
      line-height: normal;
      padding-top: 6px;
    }
    .comment-s {
      white-space: normal;
      padding-left: 10px;
    }
    .name-book {
      width: 210px;
    }
    .page-number {
      width: 110px;
    }
    .link-book {
      width: 270px;
    }
    .icons {
      width: 104px;
      justify-content: left;
      align-items: flex-start;
      padding-top: 10px;
      margin-left: 10px;
    }
  }
  .list-extens {
    height: calc(100% - 70px);
    overflow: auto;
    .inner-list-extens {
      height: calc(100% - 32px);
      overflow: auto;
    }
  }

  .line-status {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 26px;
    line-height: 26px;
    /* font: Bold 12px Heebo; */
    letter-spacing: 0;
    color: var(--custom-color1);
    font-size: 12px;
    font-weight: bold;
    padding: 0 20px;
    border-top: 1px solid #dedede;
  }
}
.window-user-extens .header-list-extens .comment {
  line-height: 44px !important;
  padding-top: 0 !important;
}
.remove-select .icon-extens {
  // margin-top: 3px;
}
.icon-arrow-results.disable {
  opacity: 0.5;
}
.icon-garbage-extens {
  cursor: default !important;
  svg {
    stroke: #b2b2b2;
  }
}
.icon-garbage-extens.active {
  cursor: pointer !important;
  svg {
    stroke: var(--custom-color2);
  }
}
.icon-arrow-np {
  transform: rotate(90deg);
  height: 24px;
  width: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  &.icon-prev {
    transform: rotate(-90deg);
  }
}
.nev-pages {
  margin-right: auto;
  margin-left: 40px;
}
.comb {
  width: 100px !important;
}
</style>
