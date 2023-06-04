const plugin = {};
plugin.install = function(Vue, socket) {
    const enable = globalThis.ELECTRON_ENV && globalThis.SOCKETS_OFFLINE;
    if (enable) {
        // inject some component options
        Vue.mixin({
            created: function() {
                const events = Object.keys(this.$options.sockets);
                events.forEach((keyname) => {
                    const newFn = this.$options.sockets[keyname].bind(this);
                    if (!this.$options.sockets_new_fns)
                        this.$options.sockets_new_fns = {};

                    //we need to add the key id of this fn as preload use diff context
                    let fn = socket.on(keyname, newFn);
                    this.$options.sockets_new_fns[keyname] = fn;
                });
            },
            beforeDestroy: function() {
                let events = Object.keys(this.$options.sockets);
                events.forEach((keyname) => {
                    const fn = this.$options.sockets_new_fns[keyname];
                    socket.removeListener(keyname, fn);
                    delete this.$options.sockets_new_fns[keyname];
                    if (!Object.keys(this.$options.sockets_new_fns).length)
                        delete this.$options.sockets_new_fns;
                });
            },
        });
    }
};

export default plugin;