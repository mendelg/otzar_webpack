export default function(Vue) {
    Vue.directive("cdrag", {
        inserted: function(el, binds, vnode) {
            if (binds.value ? .disable) return;
            /** @type {HTMLElement} */
            let elem = el;
            if (binds.modifiers.parent) {
                elem.cdrag_parent = 1;
                elem.style.position = "absolute";
                return;
            } else if (binds.modifiers.self) {
                elem.cdrag_parent = 1;
                elem.style.position = "absolute";
                dragElement(elem, elem);
            } else {
                setTimeout(() => {
                    let current = elem.parentElement;
                    let parent = null;
                    while (current) {
                        if (current.cdrag_parent) {
                            parent = current;
                            break;
                        }
                        current = current.parentNode;
                    }
                    if (!parent) console.warn("no cdrag parent found");
                    else {
                        dragElement(parent, elem);
                    }
                }, 0);
            }

            function dragElement(elmnt, mover) {
                var pos1 = 0,
                    pos2 = 0,
                    pos3 = 0,
                    pos4 = 0;
                mover.onmousedown = dragMouseDown;
                mover.addEventListener("touchstart", dragMouseDown, false);

                function dragMouseDown(e) {
                    e = e || window.event;
                    e.preventDefault();
                    // get the mouse cursor position at startup:
                    pos3 = e.touches ? e.touches[0].clientX : e.clientX;
                    pos4 = e.touches ? e.touches[0].clientY : e.clientY;
                    document.onmouseup = closeDragElement;
                    document.addEventListener("touchend", closeDragElement, false);
                    document.addEventListener("touchcancel", closeDragElement, false);
                    // call a function whenever the cursor moves:
                    document.onmousemove = elementDrag;
                    document.addEventListener("touchmove", elementDrag, false);
                    vnode.context.$emit("dragStart", e);
                }

                function elementDrag(e) {
                    elmnt.style.pointerEvents = "none";
                    e = e || window.event;
                    e.preventDefault();
                    // calculate the new cursor position:
                    const x = e.touches ? e.touches[0].clientX : e.clientX;
                    const y = e.touches ? e.touches[0].clientY : e.clientY;
                    pos1 = pos3 - x;
                    pos2 = pos4 - y;
                    pos3 = x;
                    pos4 = y;
                    // set the element's new position:
                    // check if it out of viewport
                    let viewWidth = 0,
                        viewHeight = 0;
                    if (binds.value ? .parent === true) {
                        viewWidth = elem.parentElement.clientWidth;
                        viewHeight = elem.parentElement.clientHeight;
                    } else {
                        viewWidth =
                            window.winSizes.innerWidth ||
                            document.documentElement.clientWidth ||
                            document.body.clientWidth;
                        viewHeight =
                            window.winSizes.innerHeight ||
                            document.documentElement.clientHeight ||
                            document.body.clientHeight;
                    }
                    let rightMargin = binds.value ? .rm || elem.clientWidth;
                    let bottomMargin = binds.value ? .bm || elem.clientHeight;
                    elmnt.offsetTop - pos2 < 0 ?
                        (elmnt.style.top = "0px") :
                        elmnt.offsetTop - pos2 > viewHeight - bottomMargin ?
                        (elmnt.style.top = viewHeight - bottomMargin + "px") :
                        (elmnt.style.top = elmnt.offsetTop - pos2 + "px");
                    elmnt.offsetLeft - pos1 < 0 ?
                        (elmnt.style.left = "0px") :
                        elmnt.offsetLeft - pos1 > viewWidth - rightMargin ?
                        (elmnt.style.left = viewWidth - rightMargin + "px") :
                        (elmnt.style.left = elmnt.offsetLeft - pos1 + "px");
                    vnode.context.$emit("dragging", elmnt.offsetLeft, elmnt.offsetTop, e);
                }

                function closeDragElement(e) {
                    elmnt.style.pointerEvents = "auto";
                    vnode.context.$emit(
                        "dragEnd",
                        elmnt.offsetLeft,
                        elmnt.offsetTop,
                        e,
                        binds.value ? .id
                    );
                    // stop moving when mouse button is released:
                    document.onmouseup = null;
                    document.onmousemove = null;
                    document.removeEventListener("touchend", closeDragElement);
                    document.removeEventListener("touchcancel", closeDragElement);
                    document.removeEventListener("touchmove", elementDrag);
                }
            }
        },
    });
}