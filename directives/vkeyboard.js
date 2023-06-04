const calls = new Map();
const innerCalls = new Map();
let keys = [];

function cloneConfig(config) {
    let nconfig = [];
    config.forEach((elem) => {
        let cbs = [...elem.cbs];
        nconfig.push({
            keys: elem["keys"],
            cbs
        });
    });
    return nconfig;
}
export default {
    inserted: function(el, binding) {
        const config = binding.value;
        if (binding.modifiers.self) {
            el.keys_self_config = cloneConfig(config);
            addToInnerList(config, el);
        } else {
            el.keys_config = cloneConfig(config);
            addToList(config);
        }
    },
    componentUpdated: function(el, binding) {
        //check for change
        // const configJson = JSON.stringify(config);

        const config = binding.value;
        const oldConfig = binding.modifiers.self ?
            el.keys_self_config :
            el.keys_config;
        if (config == null || config == "") {
            //revmoe oldest
            if (binding.modifiers.self) removeFromInnerList(oldConfig, el);
            else if (oldConfig) removeFromList(oldConfig);
            return;
        }
        //EQUAL CHECKS
        let equal = true;
        //first json check
        const oldConfigJson = JSON.stringify(oldConfig);
        const configJson = JSON.stringify(config);
        if (oldConfigJson == configJson) {
            //now check real fn refs
            for (const key in config) {
                const fns = config[key].cbs.length;
                for (let i = 0; i < fns; i++) {
                    if (config[key].cbs[i] !== oldConfig[key].cbs[i]) {
                        equal = false;
                        break;
                    }
                }
            }
        } else equal = false;
        //if not equal lets just remove all and insert the new ones
        if (!equal) {
            if (binding.modifiers.self) {
                //revmoe oldest
                if (oldConfig) removeFromInnerList(oldConfig, el);
                //set to new one
                el.keys_config = cloneConfig(config);
                //add cbs
                addToInnerList(config, el);
            } else {
                //revmoe oldest
                if (oldConfig) removeFromList(oldConfig);
                //set to new one
                el.keys_config = cloneConfig(config);
                //add cbs
                addToList(config);
            }
        }
    },
    unbind: function(el) {
        //remove all cbs
        if (el.keys_config) removeFromList(el.keys_config);
        if (el.keys_self_config) removeFromInnerList(el.keys_self_config, el);
    },
};

window.addEventListener("keydown", (event) => {
    keys.push(event.key);
});

window.addEventListener("keyup", (event) => {
    const keysPressed = keys
        .sort()
        .join("-")
        .toLowerCase();

    keys = keys.filter((k) => k != event.key);
    triggerCbs(event, keysPressed);
});

function triggerCbs(event, keysPressed) {
    //get all keys
    let callsToRun = calls;
    let hasCustom = false;

    let elem = event.target;
    let item = innerCalls.get(elem);
    if (item) {
        hasCustom = true;
        callsToRun = item;
    } else if (innerCalls.size) {
        while ((elem = elem.parentNode)) {
            item = innerCalls.get(elem);
            if (item) {
                hasCustom = true;
                callsToRun = item;
                break;
            }
        }
    }

    //find the cbs
    let cbs = callsToRun.get(keysPressed);
    if ((!cbs || cbs.size == 0) && hasCustom) {
        cbs = calls.get(keysPressed);
    }
    //call the cbs if we have
    if (cbs && cbs.size) cbs.forEach((cb) => cb());
    event.preventDefault();
    // if(hasCustom){
    //   event.stopPropagation()
    // }
}

function addToList(config) {
    config.forEach((elem) => {
        const lst_keys = elem.keys
            .sort()
            .join("-")
            .toLowerCase();
        let item = calls.get(lst_keys);
        if (!item) {
            item = new Set();
            calls.set(lst_keys, item);
        }
        elem.cbs.forEach((fn) => item.add(fn));
    });
}

function removeFromList(config) {
    config.forEach((elem) => {
        //get the keys code
        const lst_keys = elem.keys.join("-").toLowerCase();
        //found in the cbs calls
        let item = calls.get(lst_keys);
        //if no shortkey found so just return
        if (!item) return;
        //delete the cbs from keys code
        elem.cbs.forEach((fn) => item.delete(fn));

        if (item.size == 0) {
            //delete the shortkey because no cbs remain
            calls.delete(lst_keys);
        }
    });
}

function addToInnerList(config, el) {
    let findCalls = innerCalls.get(el);
    if (!findCalls) {
        innerCalls.set(el, new Map());
        findCalls = innerCalls.get(el);
    }
    let calls = findCalls;
    config.forEach((elem) => {
        const lst_keys = elem.keys
            .sort()
            .join("-")
            .toLowerCase();
        let item = calls.get(lst_keys);
        if (!item) {
            item = new Set();
            calls.set(lst_keys, item);
        }
        elem.cbs.forEach((fn) => item.add(fn));
    });
}

function removeFromInnerList(config, el) {
    let findCalls = innerCalls.get(el);
    if (!findCalls) {
        innerCalls.set(el, new Map());
        findCalls = innerCalls.get(el);
    }
    let calls = findCalls;
    config.forEach((elem) => {
        const lst_keys = elem.keys
            .sort()
            .join("-")
            .toLowerCase();
        let item = calls.get(lst_keys);
        if (!item) {
            item = new Set();
            calls.set(lst_keys, item);
        }
        elem.cbs.forEach((fn) => item.add(fn));
    });
}

// [{ keys: ["a"], cbs: [myfn], self: false }];