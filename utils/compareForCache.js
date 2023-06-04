export default function compareForCache(newObj, oldObj, cache) {
    let useCache = true;
    if (!cache) return false;
    const keys = Object.keys(newObj);
    for (let i = 0; i < keys.length; i++) {
        if (newObj[keys[i]] != oldObj[keys[i]]) {
            useCache = false;
            break;
        }
    }
    return useCache;
}