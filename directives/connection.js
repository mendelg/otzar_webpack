import init from "@/config/init.js";

let directives = {
    hide: function(Vue) {
        Vue.directive("hide", {
            // When the bound element is inserted into the DOM...
            inserted: function(el, binds) {
                if (binds.modifiers.online && init.serverConnection == "online")
                    el.style.display = "none";

                if (binds.modifiers.offline && init.serverConnection == "offline")
                    el.style.display = "none";
            },
        });
    },
    remove: function(Vue) {
        Vue.directive("remove", {
            // When the bound element is inserted into the DOM...
            inserted: function(el, binds) {
                if (binds.modifiers.online && init.serverConnection == "online")
                    el.remove();
                if (binds.modifiers.offline && init.serverConnection == "offline")
                    el.remove();
            },
        });
    },
};

export default directives;