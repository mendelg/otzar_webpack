export default function(Vue) {
    Vue.mixin({
        computed: {
            appMode() {
                return {
                    online() {
                        return globalThis.SERVER_MODE === "online";
                    },
                    offline() {
                        return globalThis.SERVER_MODE === "offline";
                    },
                };
            },
        },
    });
}