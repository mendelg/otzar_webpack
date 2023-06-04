<template>
  <div class="container-mef h-100 flex-column">
    <div
      class="header flex flex-bet dir-rtl"
      style="align-items: flex-start;"
      :class="{ mobile: $_mobile }"
    >
      <div class="img">
        <img class="h-100 flex" :src="pathImg" height="100%" alt />
      </div>

      <div class="text-header">
        <div class="title-color">
          {{ $t("wellcome1.mefDesc") }}
        </div>
        <div class="desc">
          {{ $t("wellcome1.mefDesc1") }}

          {{ $t("wellcome1.mefDesc2") }}
        </div>
      </div>
    </div>
    <div class="content content-mef flex-g-2 flex-column">
      <div class="books-list-img flex flex-g-1">
        <div
          class="arrow-scroll arrow-right"
          @click="scrollBtns(1)"
          v-if="!$_mobile"
        >
          <div class="icon">
            M
          </div>
        </div>
        <div
          ref="listBookMef"
          class="inner-list-img flex flex-g-1 overflow-auto"
        >
          <bookImg
            v-for="mas in shas"
            :key="mas.o"
            @click="openMefIn(mas.bookid, mas.firstPage)"
            >{{ mas.bookName }}</bookImg
          >
        </div>
        <div
          class="arrow-scroll arrow-left"
          @click="scrollBtns(-1)"
          v-if="!$_mobile"
        >
          <div class="icon">
            M
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mef from "@/services/mefotzar";
import bookImg from "./bookImg.vue";
import { openBook } from "@/services/bookData.js";

export default {
  components: {
    bookImg,
  },
  data() {
    return {
      disableArrowLeft: true,
      disableArrowRight: true,
    };
  },
  computed: {
    pathImg() {
      if (this.userSettings.settings.language == "en")
        return "./books/meforsh-eng.png";
      else return "./books/meforsh.png";
    },
    shas() {
      let data = Object.values(mef);
      data = data.filter((a) => a.done);
      data.sort((a, b) => a.o - b.o);
      return data;
    },
  },
  methods: {
    openMefIn(mas, daf) {
      //when we integrate mef in otzar we should do this
      // if (parseInt(this.otzarVersion) >= 20)
      this.$emit("click");

      return openBook(mas, daf + 1, null, null, true);

      if (globalThis.SERVER_MODE == "offline") {
        const params = [
          "height=" + screen.height,
          "width=" + screen.width,
        ].join(",");
        const popup = window.open(
          `http://localhost:3010/#/t/142131/b/${mas}/p/${daf}`,
          "_blank",
          params
        );
        popup.moveTo(0, 0);
      } else {
        window.open(
          `https://mefo.otzar.org/#/t/142131/b/${mas}/p/${daf}`,
          "_blank"
        );
      }
    },
    // scrollRight() {

    //   let scrollW = this.$refs.listBookMef.scrollWidth;
    //   let scrollLeft = this.$refs.listBookMef.scrollLeft;
    //   let widthDiv = this.$refs.listBookMef.clientWidth;
    // },
    // scrollLeft() {

    // },
    // calcContainerWidth() {
    //   //show/hide navigating buttons according to number of buttons
    //   let containerWidth = this.$refs.container.clientWidth;
    //   let containerScrollWidth = this.$refs.container.scrollWidth;
    //   this.showNavigateBtns = containerScrollWidth > containerWidth;
    // },
    showDisableArrow() {
      let width = this.$refs.listBookMef.clientWidth;
      let scrollWidth = this.$refs.listBookMef.scrollWidth;
      let scrollLeft = Math.abs(this.$refs.listBookMef.scrollLeft);

      if (scrollLeft > 0) this.disableArrowRight = true;
      else {
        this.disableArrowRight = false;
      }
      if (scrollWidth > width && scrollWidth - width > Math.round(scrollLeft)) {
        this.disableArrowLeft = true;
      } else this.disableArrowLeft = false;
    },
    scrollBtns(dir) {
      if (
        this.$refs.listBookMef.scrollLeft < this.$refs.listBookMef.scrollWidth
      )
        this.$refs.listBookMef.scrollLeft +=
          dir * this.$refs.listBookMef.clientWidth;
      this.showDisableArrow();
    },
  },
  mounted() {
    let width = this.$refs.listBookMef.clientWidth;
    let scrollWidth = this.$refs.listBookMef.scrollWidth;
    setTimeout(() => {
      if (scrollWidth == width) {
        this.disableArrowLeft = false;
        this.disableArrowRight = false;
      }
    }, 300);
  },
};
</script>

<style lang="scss" scoped>
.container-mef {
}
.header {
  align-items: flex-start;
  // height: 35px;
  flex-grow: 0;
  margin-bottom: 10px;
  .img img {
    height: 35px;
    width: auto;
    min-height: 50%;
    margin-top: auto;
    display: block;
  }
  .text-header {
    font-weight: 200;
    font-weight: 300;
    line-height: 14px;
    text-align: left;
    padding-right: 6px;
    // display: none;
    .title-color {
      font-size: 16px;
      font-weight: 700;
      line-height: 20px;
    }
    .desc {
      line-height: 16px;
      max-width: 310px;
    }

    .books-list-img {
      display: flex;
      .arrow-scroll {
        width: 14px;
        height: 100%;
      }
    }
  }
}
.inner-list-img {
  width: calc(100% - 28px);
  overflow: auto;
  padding: 5px 0;
  overflow-y: hidden;
  height: 100%;
  &::-webkit-scrollbar-track {
    width: 0;
    height: 0;
  }

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
.arrow-scroll {
  position: relative;
  // width: 12px;
  font-family: otzar-new;
  font-size: 30px;
  color: #000000;
  top: 50%;
  margin-top: 7px;
  position: absolute;
  left: -25px;
  transform: translateY(50%);
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
  .icon {
    font-family: otzar-new;
    font-size: 30px;
    color: #000000;
    transform: rotate(-90deg);
  }
  &.arrow-right {
    // transform: translateY(-50%);
    left: auto;
    right: -25px;
    // transform-origin: right;
  }
  &.arrow-left {
    // transform: translateY(-50%);
    // transform-origin: left;
    .icon {
      transform: rotate(90deg);
    }
  }
}
.mobile {
  flex-direction: column;
  .img {
    padding: 5px;
  }
  .text-header {
    padding-top: 10px;
  }
}
</style>
