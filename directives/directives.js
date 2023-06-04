function focusHandler(e) {
    e.target.select();
}

let directives = [{
        name: "focus",
        actions: {
            inserted: function(el, binds) {
                if (binds.value ? .nofocus != true) el.focus();
            },
        },
    },
    {
        name: "select",
        actions: {
            inserted: function(el, binds) {
                if (binds.value ? .nofocus != true) el.select();

                if (binds.modifiers.focus) {
                    el.addEventListener("focus", focusHandler);
                }
            },

            unbind: function(el, binds) {
                if (binds.modifiers.focus)
                    el.removeEventListener("focus", focusHandler);
            },
        },
    },
];

export default directives;