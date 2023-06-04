<template>
  <div class="welcom-page-container flex-column no-select relative">
    <div
      v-if="hasClose"
      class="close-home-page otz-icon"
      @click="
        $store.dispatch('welcome/closewindow');
        $store.state.homePage = false;
      "
    >
      F
    </div>
    <!-- <div class="header header-welcome">
      <div class="t1 title-color fade-in">{{ $t("welcome.welcomeOtzar") }}</div>
      <div class="t3 fade-in-2">{{ $t("welcome.descTitle") }}</div>
    </div> -->
    <div class="welcom-page-inner flex flex-center flex-g-1 h-100">
      <!-- <headerWelcome />
      <div class="flex flex-around flex-wrap">
        <div class="flex-g-1" style="max-width: 50%;">
          <desktopWelcome />
        </div>
        <div class="w-left" style="min-width: 440px">
          <suggestedListBook />
        </div>
      </div>
      <div class="flex flex-around flex-g-1">
        <timesWelcome class="mrg-b-12 flex-shrink-0" />
        <fromForumWelcome class="flex-shrink-0" v-if="isOnline" />
      </div> -->
      <div class="fade-in-2 libary-container" style="">
        <div class="title-color mrg-b-3 ">
          {{ $t("welcome.suggestedListBook") }}
        </div>
        <libaryWelcome />
      </div>
      <div class="flex-g-1 flex-column flex-bet outer-card" style="">
        <baseCard>
          <div
            class="flex-g-1 border-b-light padd-v-24 padd-h-24 inner-card flex-column"
            style="padding-bottom: 0;"
          >
            <headerWelcome />
            <suggestedListBook
              :hebCal="hebCal"
              :city="city"
              class="outer-list-action flex-column flex-g-1 flex-align-center- flex-center w-100 "
            />
          </div>

          <timesWelcome
            class=" flex-shrink-0  grid-times "
            @city="setCity"
            @dafYomi="setDafYomi"
            @hebCal="setHebCal"
          />
        </baseCard>
        <div class="mef-otz-container fade-in-2 flex-g-1" style="">
          <meforshWelcome />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import headerWelcome from "./welcomeComponents/headerWelcome.vue";
import desktopWelcome from "./welcomeComponents/desktopWelcome.vue";
import timesWelcome from "./welcomeComponents/timesWelcome.vue";
import suggestedListBook from "./welcomeComponents/suggestedListBookWelcome.vue";
import libaryWelcome from "./welcomeComponents/libaryWelcome.vue";
import meforshWelcome from "./welcomeComponents/meforshWelcome.vue";
import generalConfig from "@/config/general.js";

export default {
  data() {
    return {
      city: "Jerusalem",
      dafYomi: "",
      hebCal: "",
    };
  },
  components: {
    headerWelcome,
    desktopWelcome,
    timesWelcome,
    suggestedListBook,
    libaryWelcome,
    meforshWelcome,
  },
  methods: {
    setCity(e) {
      this.city = e.name;
      this.userSettings.setSettings("luach_city", e.label);
    },
    setDafYomi(daf) {
      this.dafYomi = daf;
    },
    setHebCal(h) {
      this.hebCal = h;
    },
  },
  computed: {
    isOnline() {
      return generalConfig.serverConnection == "online";
    },
    hasClose() {
      return this.$store.getters["tabsManager/getTabs"].length > 0;
    },
  },
  mounted() {},
};
</script>

<style lang="scss">
.msg-wel {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #fff;
  top: 0;
  right: 0;
  text-align: center;
  padding: 50px;
  font-size: 30px;
  color: var(--custom-color1);
}
.grid-times {
  // padding: 1.5rem;
  padding-top: 0;
  padding-bottom: 0;
  margin-bottom: 0 !important;
  display: flex;
  // grid-template-columns: 80px calc(100% - 80px);
  // grid-template-rows: 1fr 30px;
}
.welcom-page-container {
  padding: 27px 40px 40px 40px;
  padding: 1.4rem 2.5rem 2.5rem 2.5rem;
  top: 0;
  background-color: #f7f7f7;
  z-index: 2;
  width: 100%;
  height: calc(100%);
  overflow: hidden;
  .btn {
    margin: 0;
  }
  .title-gray {
    padding: 0;
  }
  .card {
    // height: 328px;
    margin-bottom: 32px;
    // height: calc(100% - 273px);
    // overflow: hidden;
    // margin-right: 12px;
    // flex-grow: 1;
    max-height: 450px;
  }

  .FilterCombo {
    width: 80px;
  }
  .list-forum {
    .item {
      display: flex;
      justify-content: space-between;
      position: relative;
      line-height: 36px;
      height: 36px;
      border-bottom: 1px solid #0000001a;
      font-weight: 300;
      transition: 0.3s;
      cursor: pointer;
      .date {
        color: #00000050;
      }
      &::after {
        content: "";
        -webkit-transform: scaleX(0);
        transform: scaleX(0);
        width: 100%;
        height: 1px;
        border-bottom: 1px solid var(--custom-color1);
        position: absolute;
        right: 0;
        bottom: 0;
        transition: 0.3s;
      }
      &:hover {
        color: var(--custom-color1);
        transition: 0.3s;
        &::after {
          transform: scaleX(1);
          transition: 0.3s;
        }
      }
    }
  }
  .w-left {
    max-width: 480px;

    width: 480px;
  }
  .item-time {
    &:last-child {
      .time {
        // padding-left: 0;
      }
    }
    height: fit-content;
    font-size: 15px;
    font-weight: 300;
    flex-grow: 1;
    cursor: default;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &:hover {
      transition: 0.9;
      .pop {
        -webkit-animation-name: hvr-bob-float, hvr-bob;
        animation-name: hvr-bob-float, hvr-bob;
        -webkit-animation-duration: 0.3s, 1.5s;
        animation-duration: 0.3s, 1.5s;
        -webkit-animation-delay: 0s, 0.3s;
        animation-delay: 0s, 0.3s;
        -webkit-animation-timing-function: linear;
        animation-timing-function: linear;
        -webkit-animation-iteration-count: 1, infinite;
        animation-iteration-count: 1, infinite;
        -webkit-animation-fill-mode: forwards;
        animation-fill-mode: forwards;
        -webkit-animation-direction: normal, alternate;
        animation-direction: normal, alternate;
      }
      .hour {
        // color: var(--custom-color1);
        // transition: 0.9;
      }
    }
    &:first-child {
      .time {
        // padding-right: 0;
        // border: 0;
      }
    }
    &:last-child {
      .time {
        border: 0;
      }
    }
    .icon {
      margin: 0 auto;
    }
    .time {
      border-left: 1px solid #dedede;
      padding: 0 15px;
      white-space: nowrap;
      .hour {
        font-size: 1.6rem;
      }
    }
  }
  .item-stat {
    padding: 0 15px;
    cursor: default;
    font-weight: 400;
    position: relative;
    transition: 0.9s;
    white-space: nowrap;
    &:hover {
      color: var(--custom-color1);
      &::after {
        color: #000;
      }
    }
    &:first-child {
      padding-right: 0;
    }
    &:last-child {
      padding-left: 0;
      &::after {
        content: "";
      }
    }
    &::after {
      content: ".";
      position: absolute;
      top: 0px;
      font-weight: 900;
      font-size: 24px;
      left: -2px;
      margin-top: -5px;
      color: #ccc;
      &:hover {
        color: #ccc;
      }
    }
  }
}
.libary-container {
  margin-left: 28px;
  width: 25%;
  min-width: fit-content;
}
.close-home-page {
  position: absolute;
  left: 10px;
  font-size: 12px;
  &:hover {
    background-color: transparent !important;
    color: var(--custom-color2);
  }
}
.mef-otz-container {
  max-height: 300px;
  margin-bottom: -5px;
}
.outer-card {
  max-width: 760px;
  margin-top: 24.5px;
  width: calc(75% - 30px);
  height: calc(100% - 34px);
}
</style>
