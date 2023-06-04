<template>
  <div>
    <BaseCleanPopup
      v-body
      @close="$store.state.myPdfWin = false"
      ref="popup"
      :h="56"
      :w="300"
      :winh="593"
      :winw="1000"
      v-zindex
      class="my-pdfs larg-win"
    >
      <template v-slot:header>
        <div>{{ $t("myPdf.myPdfBook") }}</div>
      </template>
      <div class="window-user-extens">
        <div class="container container-user-extens">
          <div class="content">
            <div class="header flex">
              <div class="search">
                <!-- search action -->
                <baseInputIconSearch
                  :placeholder="placeholder"
                  @input="setTextSearch"
                />
              </div>
              <div v-if="false" class="results-search-container flex">
                <input type="text" :value="searchValue" />
                <span class="text"
                  >{{ $t("general.ofResults") }} {{ searchList.length
                  }}{{ $t("general.results") }}</span
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
                      disable: true,
                    }"
                    nameIcon="arrow-bottom-circle"
                    pathIcon="icons-ganeral"
                    width="21"
                    height="21"
                    @click="showNextResults"
                  />
                </div>
              </div>
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

                <div class="item-title w-30">
                  {{ $t("advancSearchBook.book") }}
                </div>
                <div class="item-title w-10">
                  {{ $t("advancSearchBook.author") }}
                </div>
                <div class="item-title w-20">
                  {{ $t("bookDetails.bookYear") }}
                </div>
                <div class="id  flex-g-1">{{ $t("general.id") }}</div>
                <div
                  class="icons-title remove-select"
                  v-tooltip="this.$t('general.delete')"
                >
                  <baseIcon
                    nameIcon="icon-garbage"
                    width="15"
                    height="17"
                    class="icon-extens icon-garbage-extens"
                    pathIcon="icons-ganeral"
                    @click="deleteChecked"
                  />
                </div>
              </div>
              <div class="inner-list-extens">
                <itemMyPdfs
                  @checked="changeCheck"
                  v-for="item of pdfsList()"
                  :bookname="item.name"
                  :id="item.id"
                  @delete="deleteBook"
                  :checked="isChecked(item)"
                  :bookauth="item.mainAuthorName"
                  :printyear="item.fromyear"
                  :item="item"
                  :key="item.id"
                />
                <!-- <div class="item-row flex">
                  <baseCheckBox class="check-item check-larg" size="larg" />
                  <div class="item flex-g-1">משלי יעקב</div>
                  <div class="item flex-g-1">יעקב לוי</div>
                  <div class="item flex-g-1">תשנפ</div>
                  <div class="id">545</div>
                </div> -->
              </div>
            </div>

            <div class="line-status">{{ status }}</div>
          </div>
        </div>
      </div>
    </BaseCleanPopup>
  </div>
</template>

<script>
import itemMyPdfs from "./itemMyPdfs.vue";
import { books } from "@/store/modules/books";
import { Axios } from "@/services/_axios";
import { doHardReload } from "@/services/bookData.js";
export default {
  components: {
    itemMyPdfs,
  },
  data() {
    return {
      labelStart: 0,
      labelKey: 0,
      searchList: [],
      checkList: [],
      currentSearchIndex: 0,
      currSearchId: 0,
      searchValue: "",

      listMyPdfs: [
        {
          name: "ספר 1",
          author: "ראובן",
          printYear: "תשנב",
          id: "95",
        },
        {
          name: "ספר 1",
          author: "ראובן",
          printYear: "תשנב",
          id: "96",
        },
        {
          name: "ספר 1",
          author: "ראובן",
          printYear: "תשנב",
          id: "97",
        },
        {
          name: "ספר 1",
          author: "ראובן",
          printYear: "תשנב",
          id: "98",
        },
      ],
    };
  },
  computed: {
    status() {
      return this.pdfsList().length + " " + this.$t("general.books");
    },
    hasCheckedTop() {},

    checkMinus() {},
    placeholder() {
      return this.$t("myPdf.searchInPdfBook");
    },

    currentSearchId() {
      if (this.searchList.length > 0) {
        return this.searchList[this.currentSearchIndex];
      } else return 0;
    },
    inSearch() {
      if (this.searchValue != "") return true;
      return false;
    },
  },
  methods: {
    pdfsList() {
      const pdfs = books.filter((bk) => bk.id >= 6000000);
      const lst = this.checkList;
      return pdfs;
    },
    isChecked(item) {
      const lst = this.checkList;
      return lst.find((i) => i == item) != undefined;
    },
    changeCheck(data) {
      const mode = data.e.target.checked;
      const item = data.item;
      if (mode) {
        this.checkList.push(item);
      } else this.checkList = this.checkList.filter((a) => a !== item);
    },
    remove() {},

    setTextSearch(e) {
      this.searchList = [];
      this.searchValue = e.target?.value || e;
    },
    async deleteBook(bookid) {
      try {
        await Axios.delete("/api/pdf/delete/" + bookid);
        //TODO - add language
        const msg = this.$t("actionBook.completedDeleteBook");
        const payload = {
          title: this.$t("actionBook.deleteBook"),
          content: msg,
          btns: [this.$t("general.confirm")],
        };
        await this.$msg(payload);
        await doHardReload();
      } catch (ex) {
        //TODO - add language
        console.error(ex);
        const msg = this.$t("actionBook.failDeleteBook");
        const payload = {
          title: this.$t("actionBook.deleteBook"),
          content: msg,
          btns: [this.$t("general.confirm")],
        };
        await this.$msg(payload);
      }
    },
    showPrevResults() {},
    showNextResults() {},
    checkAll($event) {
      const mode = $event.target.checked;
      if (!mode) {
        this.checkList = [];
      } else {
        this.checkList = this.pdfsList();
      }
    },
    async deleteChecked() {
      if (this.checkList.length) {
        try {
          for await (const element of this.checkList) {
            await Axios.delete("/api/pdf/delete/" + element.id);
          }

          //TODO - add language
          const msg = this.$t("actionBook.completedDeleteBook");
          const payload = {
            title: "מחיקת ספר",
            content: msg,
            btns: [this.$t("general.confirm")],
          };
          await this.$msg(payload);
          await doHardReload();
        } catch (ex) {
          //TODO - add language
          console.error(ex);
          const msg = this.$t("actionBook.failDeleteBook");
          const payload = {
            title: this.$t("actionBook.deleteBook"),
            content: msg,
            btns: [this.$t("general.confirm")],
          };
          await this.$msg(payload);
        }
      }
    },
  },
};
</script>

<style lang="scss">
$bg-color5: #f4f4f4;
$bg-color1: #fff;
.window-user-extens {
  .container-user-extens {
    height: 100%;
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
      // justify-content: space-between;
      .results-search-container {
        padding: 10px 0;
        input {
          text-align: center;
          width: 32px;
          height: 20px;
          border-radius: 16px;
          border: 1px solid #dedede;
          background-color: #fff;
          padding: 0 6px;
          margin-top: 4px;
          margin-left: 7px;
          transition: 0.3s;
          &:focus {
            border-color: var(--custom-color1);
          }
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
  .item-row {
    .item {
      padding: 0 10px 0 0;
    }
  }
  .list-extens .header-list-extens .check-item {
    padding: 0px 10px 0 0px;
  }
  .header-list-extens,
  .item {
    div {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      // padding-right: 7px;
    }
    .check-item {
      width: 26px;
      padding: 15px 10px 0 0px;
      label {
        top: 0;
        transform: translateY(0);
      }
    }

    .id {
      width: 40px;
    }
    .item,
    .item-title {
      padding: 0 10px 0 0;
      text-align: right;
    }
    .num {
      width: 30px;
      text-align: center;
      font-weight: bold;
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
      width: 96px;
      justify-content: left;
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
.remove-select .icon-extens {
  // margin-top: 3px;
}
.icons-title {
  width: 84px;
}
.window-user-extens .header-list-extens .icons-title .icon-garbage-extens {
  margin-right: auto;
  margin-left: 12px;
}
</style>
