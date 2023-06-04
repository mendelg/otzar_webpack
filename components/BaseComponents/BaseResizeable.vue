<template>
  <div class="resizable">
    <div class="resizers" ref="rescontainer" :class="{ active: active }">
      <slot></slot>
      <div v-show="active" class="resizer top-left"></div>
      <div v-show="active" class="resizer top-all"></div>
      <div v-show="active" class="resizer bottom-all"></div>
      <div v-show="active" class="resizer right-all"></div>
      <div v-show="active" class="resizer left-all"></div>
      <div v-show="active" class="resizer top-right"></div>
      <div v-show="active" class="resizer bottom-left"></div>
      <div v-show="active" class="resizer bottom-right"></div>
    </div>
  </div>
</template>

<script>
function makeResizableDiv(div, vueInstance, parentControl = false) {
  /**@type {HTMLElement} */
  const element = div;

  const resizers = element.querySelectorAll(".resizer");
  const minimum_size = 20;
  let original_width = 0;
  let original_height = 0;
  let original_x = 0;
  let original_y = 0;
  let original_mouse_x = 0;
  let original_mouse_y = 0;

  for (let i = 0; i < resizers.length; i++) {
    const currentResizer = resizers[i];
    function mouseDownHandler(e) {
      e.preventDefault();
      original_width = parseFloat(
        getComputedStyle(element, null)
          .getPropertyValue("width")
          .replace("px", "")
      );
      original_height = parseFloat(
        getComputedStyle(element, null)
          .getPropertyValue("height")
          .replace("px", "")
      );
      original_x = element.getBoundingClientRect().left;
      original_y = element.getBoundingClientRect().top;
      original_mouse_x = e.pageX;
      original_mouse_y = e.pageY;
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResize);
    }
    currentResizer.resizeHandler = resize;
    currentResizer.stopResizeHandler = stopResize;
    currentResizer.mouseDownHandler = mouseDownHandler;
    currentResizer.addEventListener("mousedown", mouseDownHandler);
    function resize(e) {
      if (currentResizer.classList.contains("bottom-right")) {
        const width = original_width + (e.pageX - original_mouse_x);
        const height = original_height + (e.pageY - original_mouse_y);
        if (width > minimum_size) {
          element.style.width = width + "px";
        }
        if (height > minimum_size) {
          element.style.height = height + "px";
        }
      } else if (currentResizer.classList.contains("top-all")) {
        const height = original_height - (e.pageY - original_mouse_y);
        if (height > minimum_size) {
          element.style.height = height + "px";
          element.style.top = original_y + (e.pageY - original_mouse_y) + "px";
        }
      } else if (currentResizer.classList.contains("bottom-all")) {
        const height = original_height + (e.pageY - original_mouse_y);

        if (height > minimum_size) {
          element.style.height = height + "px";
        }
      } else if (currentResizer.classList.contains("right-all")) {
        const width = original_width + (e.pageX - original_mouse_x);
        if (width > minimum_size) {
          element.style.width = width + "px";
        }
      } else if (currentResizer.classList.contains("left-all")) {
        const width = original_width - (e.pageX - original_mouse_x);

        if (width > minimum_size) {
          element.style.width = width + "px";
          element.style.left = original_x + (e.pageX - original_mouse_x) + "px";
        }
      } else if (currentResizer.classList.contains("bottom-left")) {
        const height = original_height + (e.pageY - original_mouse_y);
        const width = original_width - (e.pageX - original_mouse_x);
        if (height > minimum_size) {
          element.style.height = height + "px";
        }
        if (width > minimum_size) {
          element.style.width = width + "px";
          element.style.left = original_x + (e.pageX - original_mouse_x) + "px";
        }
      } else if (currentResizer.classList.contains("top-right")) {
        const width = original_width + (e.pageX - original_mouse_x);
        const height = original_height - (e.pageY - original_mouse_y);
        if (width > minimum_size) {
          element.style.width = width + "px";
        }
        if (height > minimum_size) {
          element.style.height = height + "px";
          element.style.top = original_y + (e.pageY - original_mouse_y) + "px";
        }
      } else {
        const width = original_width - (e.pageX - original_mouse_x);
        const height = original_height - (e.pageY - original_mouse_y);
        if (width > minimum_size) {
          element.style.width = width + "px";
          element.style.left = original_x + (e.pageX - original_mouse_x) + "px";
        }
        if (height > minimum_size) {
          element.style.height = height + "px";
          element.style.top = original_y + (e.pageY - original_mouse_y) + "px";
        }
      }

      if (parentControl === true) {
        vueInstance.$parent.$refs.popup.style.height = element.style.height;
        vueInstance.$parent.$refs.popup.style.width = element.style.width;
        if (element.style.top != "")
          vueInstance.$parent.$refs.popup.style.top = element.style.top;
        if (element.style.left != "")
          vueInstance.$parent.$refs.popup.style.left = element.style.left;
      }
    }

    function stopResize() {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResize);
      vueInstance.$emit("resize");
    }
  }
  return resizers;
}

export default {
  props: ["w", "h", "active", "parentcontrol"],
  data() {
    return {
      elemWithHandlers: [],
    };
  },
  beforeDestroy() {
    this.elemWithHandlers.forEach((e) => {
      e.removeEventListener("mousedown", e.mouseDownHandler);
      window.removeEventListener("mousemove", e.resizeHandler);
      window.removeEventListener("mouseup", e.stopResizeHandler);
      delete e.resizeHandler;
      delete e.stopResizeHandler;
      delete e.mouseDownHandler;
    });
    this.elemWithHandlers = [];
  },
  mounted() {
    let handlers = makeResizableDiv(
      this.$refs.rescontainer,
      this,
      this.parentcontrol
    );
    this.elemWithHandlers = [...handlers];
    if (this.parentcontrol) {
      this.$refs.rescontainer.style.top = this.$parent.$refs.popup.top;
      this.$refs.rescontainer.style.left = this.$parent.$refs.popup.left;

      // this.$refs.rescontainer.style.height = this.h + "px";
    }
    this.$refs.rescontainer.style.width = this.w + "px";
    // if (this.$_mobile) this.$refs.rescontainer.style.maxHeight = this.h + "px";
    //else
    this.$refs.rescontainer.style.height = this.h + "px";
    if (this.$_mobile) this.$refs.rescontainer.style.maxHeight = this.h + "px";
  },
  watch: {
    w(val) {
      this.$refs.rescontainer.style.width = val + "px";
      // this.$el.style.width = val + "px";
    },
    h(val) {
      this.$refs.rescontainer.style.height = val + "px";
      if (this.$_mobile) this.$refs.rescontainer.style.maxHeight = val + "px";
      // this.$el.style.height = val + "px";
    },
  },
};
</script>

<style lang="scss" scoped>
.resizable {
  // background: white;
  // width: 100%;
  // height: 100%;
  // // width: 0px;
  // position: absolute;
  //   top: 100px;
  //   left: 100px;
}

.resizable .resizers {
  width: 100%;
  height: 100%;
  // transition: 0.3s;
  box-sizing: border-box;
}
.active {
  // border: 0.4px solid var(--custom-color1);
  // outline: 1px solid #b6b6b6;
}

.resizable .resizers .resizer {
  width: 12px;
  height: 12px;
  // border-radius: 50%;
  // background: var(--custom-color1);
  // border: 3px solid var(--custom-color1);

  position: absolute;
  // &:hover::before {
  //   transform: scale(3);
  //   opacity: 0;
  // }
  // &::before {
  //   content: "";
  //   width: 12px;
  //   height: 12px;
  //   // border-radius: 50%;
  //   // background: var(--custom-color1);
  //   opacity: 0.5;
  //   // border: 3px solid var(--custom-color1);
  //   position: absolute;
  //   z-index: 1;
  //   transition: 1s;
  //   top: 0;
  //   /* left: 0; */
  //   right: -3px;
  //   top: -3px;
  // }
}

.resizable .resizers .resizer.top-left {
  left: -5px;
  top: -5px;
  cursor: nwse-resize; /*resizer cursor*/
}
.resizable .resizers .resizer.top-right {
  right: -5px;
  top: -5px;
  cursor: nesw-resize;
}
.resizable .resizers .resizer.bottom-left {
  left: -5px;
  bottom: -5px;
  cursor: nesw-resize;
}
.resizable .resizers .resizer.bottom-right {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}
.resizers {
  // position: relative;
}
.top-all {
  width: calc(100% - 4px) !important;
  top: -2px !important;
  border-radius: 0px !important;
  height: 4px !important;
  padding: 0px !important;
  margin: 0px !important;
  cursor: ns-resize;

  background-color: transparent !important;
}
.bottom-all {
  width: calc(100% - 4px) !important;
  bottom: -2px !important;
  border-radius: 0px !important;
  height: 4px !important;
  padding: 0px !important;
  margin: 0px !important;
  cursor: ns-resize;
  z-index: 22222;
  background-color: transparent !important;
}
.right-all {
  height: calc(100% - 4px) !important;
  right: 0px !important;
  border-radius: 0px !important;
  width: 4px !important;
  top: -2px;
  padding: 0px !important;
  margin: 0px !important;
  cursor: e-resize;
  z-index: 22223;
  background-color: transparent !important;
}
.left-all {
  top: 0px;
  height: calc(100% - 4px) !important;
  left: -2px !important;
  border-radius: 0px !important;
  width: 4px !important;
  padding: 0px !important;
  margin: 0px !important;
  cursor: e-resize;
  z-index: 22223;
  background-color: transparent !important;
}
</style>
