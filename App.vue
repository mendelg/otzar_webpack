<template>
  <div
    @contextmenu="disableContextMenu"
    id="app"
    style="direction: rtl"
    v-keyboard="[{ keys: ['F2'], cbs: [toogleFindMmWin] }]"
    @click="userClicked"
  >
    <NetError v-if="netErrorOccured" />
    <messagesContainer />

    <mefoPrinter v-if="$store.getters['mefoPrinter/showMefoPrinter']" />
    <CenterPopupContainer />
    <!-- <freesearchTest /> -->
    <router-view> </router-view>
    <NotificationContainer />
    <WinBooks />
    <CommonWins />

    <MyPdfs v-if="$store.state.myPdfWin" />
    <WaitTask v-if="$store.state.WaitTasks.show" />
    <softwareNotUsed v-if="showSoftNotUsed" @close="showSoftNotUsed = false" />
    <vkeyboard
      v-if="showVKeyboard"
      @close="setKeyBoardDisplay(false)"
      @onChange="onChange"
      :input="vKeyBoardInput"
      :inputName="vKeyBoardInputName"
    />

    <!-- <WaitTask v-if="$store.state.WaitTasks.show" /> -->
  </div>
</template>

<script>
import NotificationContainer from "@/components/NotificationContainer.vue";
import WinBooks from "@/components/openBooks/openBooksContainer.vue";
// import * as desktopManager from "@/services/desktops.js";
import deskMix from "@/mixing/mixDesktop.js";
import loginMix from "@/mixing/login.js";

import deskLoaderMix from "@/mixing/mixDesktopLoader.js";
import CommonWins from "./components/CommonWins/CommonWinContainer";
import NetError from "./components/NetworkError.vue";
import MyPdfs from "./components/popupMenu/MenuOptions/extensions/MyPdfs.vue";
import WaitTask from "./components/importantActions/importantActions.vue";
import NotifyUserWaitTask from "./components/importantActions/notifyUser.vue";
import NotifyUserBooksRrefresh from "./components/importantActions/notifyUserBooksRrefresh";
import messagesContainer from "./components/importantActions/messagesContainer";
// import freesearchTest from "./components/listBookArea/freeSearchBarContainer/freesearchTest.vue";
import mefoPrinter from "@/components/mefo/mefoPrinter.vue";
import vkeyboard from "@/components/vkeyboard.vue";
import errorsMgr from "@/helper/errorCodes";
import softwareNotUsed from "./components/softwareNotUsed.vue";
import { loadLanguageAsync } from "@/localization/local";
import { mapActions, mapGetters, mapState } from "vuex";
import { Axios } from "@/services/_axios";
import onlineHelper from "@/services/onlineStations";
import mixNetTimer from "@/mixing/mixNetTimer";

export default {
  data() {
    return {
      showSoftNotUsed: false,
    };
  },
  computed: {
    ...mapState("userSetting", [
      "backgroundColor",
      "subColor",
      "textSize",
      "bookItemSize",
      "language",
    ]),
    ...mapState("vKeyBoard", [
      "showVKeyboard",
      "vKeyBoardInputName",
      "vKeyBoardInput",
    ]),
    ...mapGetters("findMm", ["showFindMmWin"]),
    netErrorOccured() {
      return this.$store.state.networkModule.error;
    },
  },
  finishedPrintBook: async function(data) {
    let res = await printBook(data);
    this.loading = false;
    this.$emit("loading", false);
    if (res == "popupsNotAllowed") {
      this.warnPopupsNotAllowed = true;
    } else {
      this.closeWindow();
    }
  },
  sockets: {
    ping: async function() {
      this.$socket.client.emit("recievedPing");
    },
  },
  components: {
    messagesContainer,
    WaitTask,
    NotifyUserWaitTask,
    NotificationContainer,
    WinBooks,
    CommonWins,
    MyPdfs,
    NetError,
    NotifyUserBooksRrefresh,
    // freesearchTest,
    mefoPrinter,
    softwareNotUsed,
    vkeyboard,
  },
  mixins: [deskMix, deskLoaderMix, mixNetTimer, loginMix],
  created() {
    this.setOnlineUnloadEvent();
    window.addEventListener("storage", this.message_receive);
    window.onresize = this.reportWindowSize;
    Axios.get("/api/general/ready");
    this.$store.state.hasInternet = window.navigator.onLine;
    window.addEventListener("online", () => {
      this.$store.state.hasInternet = true;
    });
    window.addEventListener("offline", () => {
      this.$store.state.hasInternet = false;
    });
    //language change

    this.userSettings.addListner("language", () => {
      let val = this.userSettings.settings.language;
      if (val != undefined) {
        //set lang

        document.documentElement.setAttribute("language", val);
        loadLanguageAsync(val).then(() => {
          let contextMenuLabels = [
            {
              label: this.$t("rightMenu.copy"),
              role: "copy",
            },
            { label: this.$t("rightMenu.cut"), role: "cut" },
            { label: this.$t("rightMenu.paste"), role: "paste" },
            { label: this.$t("general.selectAll"), role: "selectall" },
          ];
          if (globalThis.SEND_MENU_DATA)
            globalThis.SEND_MENU_DATA(contextMenuLabels);
        });
      }
    });
    this.userSettings.addListner("subColor", () => {
      let val = this.userSettings.settings.subColor;
      //if we in electron then change titlebar

      if (val != undefined) {
        //set lang
        document.documentElement.setAttribute("color", val);
      }
    });

    this.userSettings.addListner("textSize", () => {
      let val = this.userSettings.settings.textSize;
      if (val != undefined) {
        document.documentElement.setAttribute("text-size", val);
      }
    });

    this.userSettings.addListner("bookItemSize", () => {
      let val = this.userSettings.settings.bookItemSize;
      if (val != undefined) {
        document.documentElement.setAttribute("book-item-size", val);
        this.$store.state.booksChanged++;
      }
    });

    this.userSettings.addListner("theme", () => {
      let val = this.userSettings.settings.theme;
      if (val != undefined) {
        document.documentElement.setAttribute("theme", val);
      } else {
        this.userSettings.setSettings("theme", "bright");
      }
      if (val == "archaic") {
        // this.subColor = "#7a755e";
        if (window.OtzarTitleSetColor) {
          window.OtzarTitleSetColor("#f9eec0");
        }
      } else if (val == "dark") {
        if (window.OtzarTitleSetColor) {
          window.OtzarTitleSetColor("#1e1a17");
        }
      } else {
        if (window.OtzarTitleSetColor) {
          window.OtzarTitleSetColor("#dbdbdb");
        }
      }
    });
    this.userSettings.addListner("subColor", () => {
      let val = this.userSettings.settings.subColor;
      if (val != undefined) {
        //set lang
        document.documentElement.setAttribute("color", val);
      }
    });
    this.userSettings.addListner("book_selection_default", () => {
      let val = this.userSettings.settings.book_selection_default;
      if (val == 1) this.$store.dispatch("bookPopups/setOCREnable", true);
      else this.$store.dispatch("bookPopups/setOCREnable", false);
    });
  },
  mounted() {
    errorsMgr.setErrorCodes(this);
    document.body.addEventListener("keydown", (event) => {
      if (event.ctrlKey && "pPפ".indexOf(event.key) !== -1) {
        event.preventDefault();
      }
      if (event.shiftKey && event.key == "Tab") {
        event.preventDefault();
        this.$store.dispatch("tabsManager/goToNextTab");
      }
      if (event.ctrlKey && "bBנ".indexOf(event.key) !== -1) {
        if (this.$store.state.tabsManager.currentTabId)
          this.$store.dispatch(`tabsManager/togglePinTab`, {
            tabId: this.$store.state.tabsManager.currentTabId,
          });

        event.preventDefault();
      }
    });

    //start net timer in case we need
    this.triggerNetwork();
    //inform server that web is ready

    // set page title
    // document.title = "Multiple Themes in Vue.js";
    // set 'app-background' class to body tag
    let bodyElement = document.body;
    bodyElement.classList.add("app-background");
    // check for active theme
    let htmlElement = document.documentElement;

    let contextMenuLabels = {
      copy: this.$t("rightMenu.copy"),
      cut: this.$t("rightMenu.cut"),
      paste: this.$t("rightMenu.paste"),
    };

    /* if (globalThis.CreateContextMenu)
      globalThis.CreateContextMenu(contextMenuLabels); */
    // let theme = localStorage.getItem("theme");
    // htmlElement.setAttribute(
    //   "color",
    //   this.userSettings.settings.subColor
    //     ? this.userSettings.settings.subColor
    //     : "#b577730"
    // );
    // htmlElement.setAttribute("theme", theme);
    // htmlElement.setAttribute("text-size", this.textSize);
    // let lang;
    // if (!localStorage.getItem("language")) {
    //   lang = "he";
    // } else
    // lang = localStorage.getItem("language");
    // htmlElement.setAttribute("language", lang);
  },
  watch: {
    backgroundColor: function() {
      // add/remove class to/from html tag
      let htmlElement = document.documentElement;
      htmlElement.setAttribute("theme", this.backgroundColor);
      if (this.backgroundColor == "archaic") {
        // this.subColor = "#7a755e";
        if (window.OtzarTitleSetColor) {
          window.OtzarTitleSetColor("#f9eec0");
        }
      } else if (this.backgroundColor == "dark") {
        if (window.OtzarTitleSetColor) {
          window.OtzarTitleSetColor("#1e1a17");
        }
      } else {
        if (window.OtzarTitleSetColor) {
          window.OtzarTitleSetColor("#dbdbdb");
        }
      }
    },
    subColor: function() {
      let htmlElement = document.documentElement;
      htmlElement.setAttribute("color", this.subColor);
    },
    textSize: function() {
      let htmlElement = document.documentElement;
      htmlElement.setAttribute("text-size", this.textSize);
    },
    bookItemSize: function() {
      let htmlElement = document.documentElement;
      htmlElement.setAttribute("book-item-size", this.bookItemSize);
    },
    language() {
      let htmlElement = document.documentElement;
      htmlElement.setAttribute("language", this.language);
    },
  },
  methods: {
    ...mapActions("findMm", ["setFindMmWin"]),
    ...mapActions("vKeyBoard", ["setKeyBoardDisplay", "setKeyBoardInput"]),

    userClicked(e) {
      onlineHelper.startOnlineTimer();
    },
    onChange(input) {
      this.setKeyBoardInput(input);
    },
    disableContextMenu(e) {
      try {
        let a = e.target.className.includes("selectable-text");
        let b = e.target instanceof HTMLInputElement;

        if (!a && !b) {
          e.preventDefault();
          return false;
        }
      } catch {
        e.preventDefault();
        return false;
      }
    },
    devmode() {
      alert(8);
    },
    toogleFindMmWin() {
      this.setFindMmWin(!this.showFindMmWin);
    },
    message_receive(ev) {
      if (ev.key == "message") {
        var message = JSON.parse(ev.newValue);
        this.userSettings.setSettings("windowSize", ev.newValue);
      }
    },
    reportWindowSize() {
      if (this.$store.state.bookOnlyMode) {
        this.userSettings.setSettings(
          "windowSize",
          JSON.stringify({
            width: window.innerWidth,
            height: window.innerHeight,
          })
        );

        localStorage.setItem(
          "message",
          JSON.stringify({
            width: window.innerWidth,
            height: window.innerHeight,
          })
        );
      }
    },
  },
};
</script>

<style lang="scss">
body {
  margin: 0;
  height: 100%;
}
* {
  box-sizing: border-box;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #000;
  // color: #636363;
  height: 100%;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
