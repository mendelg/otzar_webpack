<template>
  <div class="header-container" @click="$emit('toggleMinimize')">
    <div
      class="header-buttons"
      :style="{
        opacity: ishover ? 1 : 0,
      }"
    >
      <div v-if="workersMode">
        <a :href="workersLink" target="_blank">{{ $t("mefo.shibutz") }}</a>
      </div>

      <!-- link -->
      <!-- 
          <BaseOverCircle>
            <span
              class="btn-header"
              v-tooltip="'העתק קישור לקטע'"
              @click="$emit('toggleFullPage')"
            >
              <Icons
                class="btn-header"
                icon="link"
                height="16px"
                width="16px"
                :stroke="color"
              /> </span
          ></BaseOverCircle> -->

      <!-- print -->
      <BaseOverCircle v-if="!fullPage">
        <span
          style="stroke-width: 10px;height:100%;"
          class="btn-header"
          v-tooltip="$t('mefo.copyPart')"
          @click.stop="$emit('print')"
        >
          <Icons
            class="btn-header"
            icon="print"
            height="16px"
            width="16px"
          /> </span
      ></BaseOverCircle>
      <!-- <div @click="$emit('print')">h</div> -->

      <!-- show book title -->
      <BaseOverCircle>
        <span
          class="btn-header"
          v-tooltip="$t('mefo.copyShaar')"
          @click.stop="$emit('toggleBookInfo')"
        >
          <Icons
            class="btn-header"
            icon="book-title"
            height="16px"
            width="16px"
          /> </span
      ></BaseOverCircle>

      <!-- switch section show modes -->

      <!-- <div
            @click="$emit('toggleFullPage')"
            v-tooltip="fullPage ? 'עבור לתצוגת קטע' : 'עבור לתצוגת עמוד'"
          >
            {{ fullPage ? "-" : "a" }}
          </div> -->
      <BaseOverCircle v-if="fullPage">
        <span
          class="btn-header"
          v-tooltip="$t('mefo.goToPartView')"
          @click.stop="$emit('toggleFullPage')"
        >
          <Icons
            class="btn-header"
            icon="open-section"
            height="16px"
            width="16px"
          /> </span
      ></BaseOverCircle>

      <BaseOverCircle v-else>
        <span
          class="btn-header"
          v-tooltip="$t('mefo.goToPageView')"
          @click.stop="$emit('toggleFullPage')"
        >
          <Icons
            class="btn-header"
            icon="open-book"
            height="16px"
            width="16px"
          /> </span
      ></BaseOverCircle>

      <!-- favorite section -->
      <!-- DISABLE FOR NOW -->
      <BaseOverCircle v-if="1 == 2">
        <span
          class="btn-header"
          v-tooltip="$t('mefo.setAsFav')"
          @click.stop="$emit('toggleMinimize')"
        >
          <Icons
            class="btn-header"
            icon="favorite-section"
            height="16px"
            width="16px"
          /> </span
      ></BaseOverCircle>

      <!-- minimize section -->

      <BaseOverCircle v-if="!gridMode && minimize">
        <span
          class="btn-header"
          v-tooltip="$t('general.open')"
          @click.stop="$emit('toggleMinimize')"
        >
          <Icons
            class="btn-header"
            icon="plus"
            height="16px"
            width="16px"
          /> </span
      ></BaseOverCircle>

      <BaseOverCircle v-if="!gridMode && !minimize">
        <span
          class="btn-header"
          v-tooltip="$t('mefo.minimize')"
          @click.stop="$emit('toggleMinimize')"
        >
          <Icons
            class="btn-header"
            icon="minimize"
            height="16px"
            width="16px"
          /> </span
      ></BaseOverCircle>
    </div>
    <template>
      <span
        class="flex-width-fit info-container container-text-item"
        @click="$emit('click')"
      >
        <div class="inner-text-item" :class="{ machonim: isMachon }">
          <span class="BookInfo">{{ getBookName }} </span>
          <span class="BookAuth">{{ getBookAuthor }}</span>
        </div>
        <!-- <div class="bookinfo">
          <span class="BookInfo">{{ getBookName }} </span>
          <span class="BookAuth">{{ getBookAuthor }}</span>
        </div> -->
        <div
          class="show-machonim mrg-r-3 flex flex-align-center"
          v-if="isMachon"
        >
          <span class="machon">{{ iconMachon }}</span>
        </div>
      </span>
    </template>
  </div>
</template>

<script>
const machonimLicenses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 14, 15];
import Icons from "@/components/Icons/Icons.vue";
import { getBookName } from "@/services/bookData.js";
export default {
  name: "CardHeader",
  components: { Icons },
  props: [
    "ishover",
    "shasSecSelected",
    "book",
    "firstPageNum",
    "fullPage",
    "minimize",
    "subBook",
    "gridMode",
  ],
  data() {
    return { workersMode: false, color: "#707070" };
  },
  methods: {},
  computed: {
    isMachon() {
      let found = false;
      machonimLicenses.forEach((m) => {
        if ((1 << m) & this.book.permissions) {
          found = true;
          return;
        }
      });
      return found;
    },
    iconMachon() {
      if (!this.isMachon) return;
      const flag = this.book.permissions;
      let icon = "";
      let tooltip = "";
      if (flag & (1 << 10)) {
        tooltip = "אנצקלופדיה תלמודית";
        icon = "את";
      } else if (flag & (1 << 4)) {
        tooltip = "מוסד הרב קוק";
        icon = "רק";
      } else if (flag & (1 << 5) || flag & (1 << 15)) {
        tooltip = "מכון ירושלים";
        icon = "יר";
      } else if (flag & (1 << 6)) {
        tooltip = "חכמת שלמה";
        icon = "חש";
      } else if (flag & (1 << 7)) {
        tooltip = "אהבת שלום";
        icon = "אש";
      } else if (flag & (1 << 8)) {
        tooltip = "מכון אופק";
        icon = "או";
      } else if (flag & (1 << 9)) {
        tooltip = "עוז והדר";
        icon = "עוז";
      } else if (flag & (1 << 13)) {
        tooltip = "זכרון אהרן";
        icon = "זא";
      } else if (flag & (1 << 3)) {
        tooltip = "מכון הרב מצליח";
        icon = "ממ";
      } else if (flag & (1 << 2)) {
        tooltip = "נזר דוד";
        icon = "נד";
      } else if (flag & (1 << 1)) {
        tooltip = "מאבני המקום";
        icon = "מה";
      }
      return tooltip;
    },
    getBookAuthor() {
      try {
        if (this.subBook > 0) {
          return this.book.subBooks[this.subBook].author;
        }

        return this.book.mainAuthorName;
      } catch (error) {
        console.log(error);
        return "לא ידוע"; //TODO
      }
    },
    getBookName() {
      try {
        if (this.subBook > 0) return this.book.subBooks[this.subBook].name;

        return getBookName(this.book.name, this.book.volume, true);
      } catch (error) {
        return "לא ידוע"; //TODO
      }
    },
    workersLink() {
      return ``; //`http://ozrmef.otzar.org/smef/intfc.PHP?מסכת=ברכות&דף=ב א&bookl=${this.shasSecSelected.book}&bLpage=${this.shasSecSelected.page}&bookr=${this.book.id}&bRpage=${this.firstPageNum}`;
    },
  },
};
</script>

<style lang="scss">
.header-container {
  width: 100%;
  position: relative;
  align-items: center;
  display: flex;
}
.info-container {
  min-height: 31px;
  display: flex;
  align-items: center;
}
.container-text-item {
  position: relative;
  overflow: hidden;

  display: flex;
  /* white-space: nowrap; */
  /* text-overflow: ellipsis; */
  max-width: 100%;
  width: calc(100% - 10px);

  font-size: 12px;
  .inner-text-item {
    width: auto;
    max-width: 100%;
    display: flex;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    &.machonim {
      max-width: calc(100% - 80px);
    }
    &.fs {
      max-width: calc(100% - 30px);
    }
  }
}
.btn-header {
  height: 100%;
  align-items: center;
  display: flex;
  margin: 0px 0px;
  fill: var(--text-color2);
  stroke: var(--text-color2);
  &:hover {
    stroke: var(--text-color1) !important;
    fill: var(--text-color1) !important;
  }
}
[text-size="large"] {
  .bookinfo .BookInfo {
    font-size: 15px;
  }
  .bookinfo .BookAuth {
    font-size: 14px;
  }
}
.BookInfo {
  /* margin-right: 10px; */
  margin-left: 4px;
  font-size: 13px;
  font-weight: 700;
  line-height: 14px;
  display: inline-block;
  width: fit-content;
  white-space: nowrap;
  color: var(--text-color1);
}
.bookinfo {
  display: flex;
  flex-grow: 1;
  flex-direction: row;
}
.BookAuth {
  color: var(--text-color2);
  /* opacity: 0.5; */
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  display: inline-block;

  height: 13px;
  text-overflow: ellipsis;
  /* overflow: hidden; */
  white-space: nowrap;
  overflow: hidden;
  /* display: flex; */
  align-items: center;
}
.flex-width-fit {
  flex: 1;
  /* flex-direction: r; */
  overflow: hidden;
  max-width: 100%;
  max-height: 20px;
  white-space: nowrap;
  display: flex;
}
.header-buttons {
  height: 100%;
  z-index: 2;
  display: flex;
  position: absolute;
  left: 0px;
  background-color: var(--main-bg-color);
  stroke: var(--text-color2);
  fill: var(--text-color2);
  -webkit-transition: opacity 0.4s; /* For Safari 3.1 to 6.0 */
  transition: opacity 0.4s;
  svg:hover {
    stroke: var(--text-color1);
    fill: var(--text-color1);
  }
}
.header-buttons div:hover {
  background-color: #00000011;
  cursor: pointer;
}
.machon {
  height: 18px;
  color: var(--custom-color1);
  font-size: 10px;
  font-weight: 600;
  background-color: var(--bg-color10);
  border-radius: 9px;
  padding: 0 5px;
  white-space: nowrap;
  line-height: 18px;
}
</style>
