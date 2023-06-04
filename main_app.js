require("../global");
const CacheCanvases = new Map();
globalThis.CacheCanvases = CacheCanvases;
//boot init
require("./boot/init");
require("./utils/winSizes");
import Vue from "vue";
import App from "./App.vue";
import router from "./routes/router";
import store from "./store/store";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";
import notificationmanager from "@/plugins/nofiticationManager";
import mobile from "@/plugins/mobile";
import msgBoxManager from "@/plugins/msgBoxManager";
import promptManager from "@/plugins/promptManager";
import OtzarVer from "@/plugins/otzarVersion";
import userSettings from "@/plugins/user_settings";
import otzarBook from "@/plugins/otzarBook";
import appMode from "@/plugins/appMode";
import userType from "@/plugins/userType";
import VueWaypoint from "vue-waypoint";
import VueVirtualScroller from "vue-virtual-scroller";
import vClickOutside from "v-click-outside";
import VDragged from "v-dragged";
import VZindex from "./directives/zindex";
import Vbody from "./directives/vbody";
import Vversions from "./directives/vversions";
import Vdev from "./directives/vdev";
import vmobile from "./directives/vmobile";
import Vdisable from "./directives/vdisable";
import Vusertype from "./directives/vusertype";
import {
    setHeader
} from "./services/_axios";
import Vmodal from "./directives/vmodal";
import vkeyboard from "./directives/vkeyboard";
import Vcdrag from "./directives/vdrag";
import VConnection from "./directives/connection";
import socketListeners from "./services/socketListeners";
import VueSocketIOExt from "vue-socket.io-extended";
import VueSocketIOExtWrapper from "./plugins/socket.io-extended_wrapper";
import io from "socket.io-client";
import directives from "@/directives/directives.js";
import VueDraggableResizable from "vue-draggable-resizable";
import devtk from "./utils/devToken";
import VueDragscroll from "vue-dragscroll";
import kos from "@/plugins/kos";
// import CKEditor from "@ckeditor/ckeditor5-vue";
// import VueHtml2Canvas from "vue-html2canvas";
//localizaton
globalThis.__IO = io;
import {
    i18n
} from "@/localization/local";
// Importing the global css file
import "@/assets/css/global.css";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import VueSplit from "vue-split-panel";
import init from "@/config/init.js";

// import VTooltip from "v-tooltip";
// import FloatingVue from "floating-vue";
// import "floating-vue/dist/style.css";

import VTooltip_fake from "./directives/vtooltip_fake.js";
import "vue-draggable-resizable/dist/VueDraggableResizable.css";
import vkiosk from "./directives/vkiosk";
import vIpUser from "./directives/vIPUser";

//init middleware
require("@/middleware/init");
require("@/assets/css/mainStyle.scss");
require("@/assets/css/responsive.scss");
require("@/assets/css/ListBookStyle.scss");
require("@/assets/css/pageBookStyle.scss");
require("@/assets/css/menuStyle.scss");
require("@/assets/css/lang.scss");

Vue.config.productionTip = false;

const requireComponent = require.context(
    // The relative path of the components folder
    "./components/BaseComponents",
    // Whether or not to look in subfolders
    true,
    // The regular expression used to match base component filenames
    /[A-Z]\w+\.(vue|js)$/
);

requireComponent.keys().forEach((fileName) => {
    // Get component config
    const componentConfig = requireComponent(fileName);

    // Get PascalCase name of component
    const componentName = upperFirst(
        camelCase(
            // Gets the file name regardless of folder depth
            fileName
            .split("/")
            .pop()
            .replace(/\.\w+$/, "")
        )
    );

    // Register component globally
    Vue.component(
        componentName,
        // Look for the component options on `.default`, which will
        // exist if the component was exported with `export default`,
        // otherwise fall back to module's root.
        componentConfig.default || componentConfig
    );
});

Vue.component("vue-draggable-resizable", VueDraggableResizable);

import VueObserveVisibility from "vue-observe-visibility";
Vue.use(VueObserveVisibility);

Vue.use(vClickOutside);
Vue.use(notificationmanager);
Vue.use(mobile);
Vue.use(msgBoxManager);
Vue.use(promptManager);
Vue.use(OtzarVer);
Vue.use(VueWaypoint);
Vue.use(VueVirtualScroller);
Vue.use(VDragged);
Vue.use(VueSplit);
Vue.directive("keyboard", vkeyboard);
// Vue.use(FloatingVue, { placement: "top" });
// Vue.use(VTooltip, { defaultPlacement: "top" });
Vue.use(VTooltip_fake);
VZindex(Vue);
VConnection.hide(Vue);
VConnection.remove(Vue);
Vue.use(userSettings);

Vue.use(otzarBook);
Vue.use(userType);
Vue.use(appMode);
Vue.use(kos);
Vue.use(VueDragscroll);
// Vue.use(CKEditor);
Vcdrag(Vue);
Vbody(Vue);
Vversions(Vue);
Vdev(Vue);
Vdisable(Vue);
vkiosk(Vue);
vIpUser(Vue);
Vmodal(Vue);
vmobile(Vue);
Vusertype(Vue);
var allowedOrigins = [init.getServer()];

directives.forEach((d) => {
    Vue.directive(d.name, d.actions);
});

const options = {
    origins: allowedOrigins
};

globalThis.reduceCanvasMemory = function reduceCanvasMemory(cnv) {
    if (!cnv) {
        return;
    }
    cnv.width = cnv.height = 0;
    const ctx = cnv.getContext("2d");
    ctx.clearRect(0, 0, 0, 0);
};
let socket;
if (globalThis.ELECTRON_ENV) {
    if (globalThis.RELOAD_APP) {
        // window.location.reload=globalThis.RELOAD_APP
        //   const beforeUnloadListener = (event) => {
        //     event.preventDefault();
        //     globalThis.RELOAD_APP();
        //   };
        //   addEventListener("beforeunload", beforeUnloadListener, { capture: true });
    }

    socket = { ...globalThis.SOCKETS_OFFLINE
    };
    globalThis.SOCKETS_OFFLINE_READY = socket;
    socket.emit("connection");
} else {
    console.log("val is " + init.getServer(true));
    socket = io
        .connect(init.getServer(true), {
            transports: ["websocket", "polling"]
        })
        .on("reconnect", () => {
            //dont reconnect if in disconnected mode
            if (router.currentRoute.name == "disconnected") return;
            const token = store.getters["user/getUserToken"];
            console.log("socket reconnected");
            setHeader("socket_id", socket.id);
            document.cookie = "socket_id=" + socket.id;
            //socket.emit("setUserSocket", { token });
            if (store.getters["user/hasOtzarConnection"])
                socket.emit("setUserSocket", {
                    connectionType: "otzar",
                    token
                });
            if (store.getters["user/hasMefConnection"])
                socket.emit("setUserSocket", {
                    connectionType: "mef",
                    token
                });

            if (store.state.printing.bookId) {
                store.state.printing.socket = socket;
            }
        });
    socket.on("connect", () => {
        if (!socketConnected) {
            //dont reconnect if in disconnected mode
            if (router.currentRoute.name == "disconnected") return;
            const token = store.getters["user/getUserToken"];
            console.log("socket reconnected");
            setHeader("socket_id", socket.id);
            document.cookie = "socket_id=" + socket.id;
            //socket.emit("setUserSocket", { token });
            if (store.getters["user/hasOtzarConnection"])
                socket.emit("setUserSocket", {
                    connectionType: "otzar",
                    token
                });
            if (store.getters["user/hasMefConnection"])
                socket.emit("setUserSocket", {
                    connectionType: "mef",
                    token
                });

            if (store.state.printing.bookId) {
                store.state.printing.socket = socket;
            }
        } else {
            console.log("connect socket");
            setHeader("socket_id", socket.id);
            document.cookie = "socket_id=" + socket.id;
        }
        socketConnected = false;
    });
    let socketConnected = true;
    socket.on("disconnect", () => {
        socketConnected = false;
        console.log("socket disconnected");
    });
}

// socket.emit("tk", { data: devtk() });
//reg all listerners
socketListeners.forEach((item) => {
    socket.on(item.on, item.fn);
});
Vue.use(VueSocketIOExt, socket);
Vue.use(VueSocketIOExtWrapper, socket);

// Vue.use(VueHtml2Canvas);
// if (globalThis.TEST_O) globalThis.TEST_O();
let vue = new Vue({
    i18n,
    store,
    router,
    render: (h) => h(App),
}).$mount("#app");

export default vue;
export function getSocket() {
    return socket;
}