import Vue from "vue";
let data = new Map();
let showen = null;

function removeEvent(event) {
    const el = event.target;
    const id = el.getAttribute("tooltip_id");
    const elemToRemove = document.getElementById("tooltip_" + id);
    if (elemToRemove) elemToRemove.remove();
}

function addEvent(event) {
    /**@type {MouseEvent} */
    const e = event;
    const el = event.target;
    const id = el.getAttribute("tooltip_id");
    const info = data.get(id);
    if (!info.content) return;
    const $tooltip = document.createElement("div");
    const $tooltipDimension = el.getBoundingClientRect();
    $tooltip.setAttribute("id", "tooltip_" + id);

    let classes = "ctk-tooltip tooltip";
    if (info.classes != "") classes += ` ${info.classes}`;
    $tooltip.setAttribute("class", classes);

    $tooltip.innerHTML = info.content;
    // $tooltip.style.left =
    //   $tooltipDimension.left + $tooltipDimension.width / 2 + "px";
    // $tooltip.style.left = e.clientX + $tooltip.clientWidth + "px";
    //check if above or below
    $tooltip.style.display = "block";

    if (e.clientY < document.body.clientHeight / 2) {
        $tooltip.style.top = $tooltipDimension.top + 30 + "px";
    } else {
        $tooltip.style.bottom =
            document.body.clientHeight - $tooltipDimension.top + 5 + "px";
    }
    if (showen) {
        hide(showen);
    }
    $tooltip.style.visibility = "hidden";
    document.body.appendChild($tooltip);

    setTimeout(() => {
        if (e.clientX > document.body.clientWidth / 2)
            $tooltip.style.left = e.clientX - $tooltip.clientWidth / 2 + 10 + "px";
        else $tooltip.style.left = e.clientX + $tooltip.clientWidth / 2 - 10 + "px";

        $tooltip.style.visibility = "visible";
    }, 0);
    showen = $tooltip;
}

function remove(el) {
    el.removeEventListener("mouseenter", addEvent);
    el.removeEventListener("mouseleave", removeEvent);
    const id = el.getAttribute("tooltip_id");
    data.delete(id);
    if (id) {
        const elem = document.getElementById("tooltip_" + id);
        if (elem) elem.remove();
    }
    el.removeAttribute("tooltip_id");
    showen = null;
}

function hide(el) {
    el.style.display = "none";
}
export default function(Vue) {
    Vue.directive("tooltip", {
        bind: function(el, binding) {
            let bind = {
                content: "",
                placement: "top"
            };
            if (binding.value && binding.value.content == undefined) {
                bind.content = binding.value;
                binding.value = bind;
            }
            if (!binding.value
                /* ||
                       !binding.value.content   ||
                       binding.value.content == ""  */
            )
                return;
            const id = Math.random(1 % 10000000).toString();
            data.set(id, binding.value);
            el.setAttribute("tooltip_id", id);
            el.addEventListener("mouseenter", addEvent);
            el.addEventListener("mouseleave", removeEvent);
        },
        update(el, binding) {
            let bind = {
                content: "",
                placement: "top"
            };
            if (binding.value && binding.value.content == undefined) {
                bind.content = binding.value;
                binding.value = bind;
            }
            if (!binding.value
                /* ||
                       !binding.value.content ||
                       binding.value.content == "" */
            )
                return;
            const id = el.getAttribute("tooltip_id");
            if (id) data.set(id, binding.value);
        },
        unbind(el) {
            remove(el);
        },
    });
}