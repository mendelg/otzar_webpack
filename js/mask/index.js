import './mask.css'
import mask from './mask'

let msk
chrome.runtime.onMessage.addListener((request, sender, response) => {
    if (request && request.cmd) {
        if (request.cmd === 'show') {
            if (!msk) msk = new mask()
            msk.show()
        } else if (request.cmd === 'hide') {
            if (msk) {
                msk.hide()
            }
        }
    }
})
document.onfullscreenchange = (e) => {
    if (msk) {
        msk.fullscreen(e)
    }
}