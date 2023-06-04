import interact from "interactjs";
import store from './store'

/**
 * 创建一个新的元素
 * @param cls　元素class
 * @param width 宽度
 * @param height　高度
 * @returns {HTMLDivElement}
 */
function newElement(cls, width, height) {
    let element = document.createElement('div')
    if (cls) {
        cls.split(' ').forEach(c => {
            if (c.trim()) {
                element.classList.add(c.trim())
            }
        })
    }
    if (width) {
        element.style.width = width + 'px'
    }
    if (height) {
        element.style.height = height + 'px'
    }
    return element
}

function parseTranslate(transform) {
    if (transform) {
        transform = transform.replace('translate(', '').replace(')', '')
        let szArr = transform.split(',')
        return {
            x: parseInt(szArr[0].replace('px', '')),
            y: parseInt(szArr[1].replace('px', ''))
        }
    }
}

class Mask {
    constructor() {
        this.targetElement = document.fullscreenElement || document.body
        this.mask = newElement('video-mask')
        this.box = newElement('box')
        this.lastBoxPosition = {
            x: 0,
            y: 0
        }
        this.lastMaskPosition = {
            x: 0,
            y: 0
        }
        let _this = this
        interact(this.box)
            .draggable({
                onstart(e) {
                    let transform = e.target.style.transform
                    if (transform) {
                        _this.lastBoxPosition = parseTranslate(transform)
                    } else {
                        _this.lastBoxPosition = {
                            x: 0,
                            y: 0
                        }
                    }
                },
                onmove(event) {
                    const position = _this.lastBoxPosition
                    position.x += event.dx
                    position.y += event.dy
                    event.target.style.transform = `translate(${position.x}px, ${position.y}px)`
                }
            })
            .resizable({
                edges: {
                    top: true,
                    left: true,
                    bottom: true,
                    right: true
                }
            })
            .on('resizemove', event => {
                let {
                    x,
                    y
                } = event.target.dataset
                x = parseFloat(x) || 0
                y = parseFloat(y) || 0
                Object.assign(event.target.style, {
                    width: `${event.rect.width}px`,
                    height: `${event.rect.height}px`,
                    transform: `translate(${event.rect.left}px, ${event.rect.top}px)`
                })
                Object.assign(event.target.dataset, {
                    x,
                    y
                })
            })
            .on('doubletap', e => {
                _this.mask.style.visibility = 'gone'
            })
        interact(this.mask)
            .draggable({
                listeners: {
                    start(e) {
                        _this.lastMaskPosition = {
                            x: 0,
                            y: 0
                        }
                        let style = _this.box.style
                        style.width = '0px'
                        style.height = '0px'
                        style.transform = `translate(${e.clientX0}px, ${e.clientY0}px)`
                    },
                    move(event) {
                        const position = _this.lastMaskPosition
                        position.x += event.dx
                        position.y += event.dy
                        let style = _this.box.style
                        style.width = `${Math.abs(position.x)}px`
                        style.height = `${Math.abs(position.y)}px`
                    }
                }
            })
    }

    show() {
        store.getData().then(d => {
            if (!d || !d.width) {
                this.targetElement.appendChild(this.mask)
                this.mask.style.visibility = 'visible'
            }
            this.targetElement.appendChild(this.box)
            let style = this.box.style
            style.visibility = 'visible'
            if (d) {
                style.width = d.width
                style.height = d.height
                if (d.x) {
                    style.transform = `translate(${d.x}px, ${d.y}px)`
                }
            }
        })
    }

    hide() {
        let style = this.box.style
        let data = {
            width: style.width,
            height: style.height
        }
        data = Object.assign(data, parseTranslate(style.transform))
        store.saveData(data).then(() => {
            this.mask.style.visibility = 'hidden'
            this.box.style.visibility = 'hidden'
        })
    }

    fullscreen() {
        this.targetElement = document.fullscreenElement || document.body
        if (this.mask.parentNode && this.mask.parentElement !== this.targetElement) {
            this.targetElement.appendChild(this.mask)
        }
        if (this.box.parentNode && this.box.parentElement !== this.targetElement) {
            this.targetElement.appendChild(this.box)
        }
    }
}

export default Mask