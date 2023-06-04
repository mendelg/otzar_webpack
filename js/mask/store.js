const STORE_KEY = "video_mask_key"

const getData = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(STORE_KEY, result => {
            resolve(result[STORE_KEY])
        })
    })
}
const saveData = (v) => {
    return new Promise((resolve, reject) => {
        let data = {}
        data[STORE_KEY] = v
        chrome.storage.sync.set(data, () => {
            resolve()
        })
    })
}
export default {
    getData,
    saveData
}