<template>
  <div
    tabindex="0"
    ref="container"
    class="img-container"
    @touchstart="sendStartTouchUp"
    @touchmove="sendEndTouchUp"
  >
    <canvas
      ref="canvas"
      class="img-canvas"
      :height="imgHeight"
      :width="imgWidth"
      style="track-action: pinch-zoom"
    />
    <selectArea
      @addexten="$emit('addexten')"
      :height="imgHeight"
      :width="imgWidth + (landscape ? 0 : 24)"
      :imgRatio="imgRatio"
      top="0"
      :left="paddingLeft"
      :img="cropImg"
      :pageData="pageData"
      @toggleocr="toggleOCR"
      :tabId="tabId"
      :paddingTop="paddingTop"
      :webP="webP"
      :imageSize="originImgSize"
      :actualImgSize="actualImgSize"
      :fixedSize="{ width: origWidth, height: origHeight }"
      :errorPage="errorPage"
      :pagepos="pagepos"
    />
  </div>
</template>
<script>
import * as bookData from "@/services/bookData.js";
import { mapActions, mapGetters, mapState } from "vuex";
import selectArea from "@/components/book/selectArea.vue";

import mixNetTimer from "@/mixing/mixNetTimer";
import mixMefo from "@/mixing/mixIsMefo";
function reduceCanvasMemory(cnv) {
  if (!cnv) {
    return;
  }
  cnv.width = cnv.height = 0;
  const ctx = cnv.getContext("2d");
  ctx.clearRect(0, 0, 0, 0);
}
// const CacheCanvases = new Map();
export default {
  mixins: [mixNetTimer, mixMefo],
  props: [
    "pageData",
    "tabId",
    "scrolling",
    "drawFs",
    "raw",
    "currPage",
    "offset",
    "rotateImage",
    "pagepos",
  ],
  components: { selectArea },

  data() {
    return {
      _timer: null,
      finger_dist: 0,
      idImageRequest: Math.random(1 % 10000000).toString(),
      lastTime: 0,
      canvas: null,
      canvasCtx: null,
      imgHeight: 0,
      imgWidth: 0,
      imgLeft: 0,
      cropImg: "",
      data: null,
      imgRatio: 0,
      paddingLeft: 0,
      paddingTop: 0,
      actualW: 0,
      actualH: 0,
      webP: false,
      showSpinner: false,
      originImgSize: {},
      actualImgSize: {},
      // cachedImg: null,
      origWidth: 0,
      origHeight: 0,
      errorPage: false,
      imageMetaData: {},
      fsCoords: [],
      rat: 1.5,
      wasm: false,
      /*       scale: 1,
      cameraOffset: {},
      cameraZoom: 1,
      isDragging: false,
      dragStart: { x: 0, y: 0 },
      initialPinchDistance: null,
      lastZoom: 1, */
    };
  },
  watch: {
    imageEditChanged: function() {
      this.drawImage();
    },
    showMasks: function() {
      this.drawImage();
    },
    rotateImage: function() {
      /*  if (this.currPage == this.pageData.position - 1) {
        this.drawImage(false, true);
      } */
    },
    fsChange: function(val, oldVal) {
      this.drawImage();
    },
    pageHeight: function(val, oldVal) {
      this.doImageChange(true);
    },
    pageData: function(val, oldVal) {
      this.$nextTick(() => {
        // this.doImageChange(true);
        this.doImageChange(true);
        this.initCropper();
        this.fsCoords = [];
      });
    },

    showMm: function() {
      this.drawImage();
    },
    toggleMefEnable: function() {
      this.drawImage(true);
    },
    MMhideMode: function() {
      this.drawImage();
    },
    MMshowYesodOnly: function() {
      this.drawImage();
    },
    raw: function() {
      this.drawImage();
    },
    drawFs: function() {
      this.drawImage(true);
    },
    subColor: function() {
      this.drawImage();
    },
    reloadAgainNoCache: function() {
      this.drawImage(true);
    },
  },
  computed: {
    ...mapGetters("tabsManager", ["getWordsCoords", "getCurrentScrollTo"]),
    ...mapState("userSetting", ["subColor", "secondSubColor"]),
    ...mapGetters("userSetting", ["showMm", "MMshowYesodOnly", "MMhideMode"]),
    toggleMefEnable() {
      return this.$store.state.mefo.enable;
    },
    rotate() {
      return this.pageData?.rotate || 0;
    },
    imageEditChanged() {
      return this.$store.state.tabs[this.tabId].imageEdit?.changed;
    },
    landscape() {
      return this.rotate == 90 || this.rotate == 270;
    },
    pageHeight() {
      return this.$store.state.tabs[this.tabId].pageHeight;
    },
    reloadAgainNoCache() {
      return this.$store.state.reloadAllPages;
    },
    showMasks() {
      return this.$store.state.tabs[this.tabId].showMask;
    },
    fsChange() {
      return this.$store.state.tabs[this.tabId].fsChange;
    },
    getBookFit() {
      return this.$store.getters[`tabs/${this.tabId}/getBookFit`];
    },
    MM() {
      let pageMm = [];
      try {
        pageMm =
          this.$store.state.tabs[this.tabId].MM[
            (this.pageData.originPosition || this.pageData.position) - 1
          ] || [];
        if (this.MMshowYesodOnly)
          pageMm = pageMm.filter((m) => m.type == "yesod");
      } catch (ex) {}

      // return pageMm.map((m) => m.words);
      return pageMm;
    },
  },

  methods: {
    ...mapActions("tabsManager", ["initCropper"]),
    /*  handlePinch(e) {
      e.preventDefault();

      let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };

      // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
      let currentDistance =
        (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2;

      if (this.initialPinchDistance == null) {
        this.initialPinchDistance = currentDistance;
      } else {
        this.adjustZoom(null, currentDistance / this.initialPinchDistance);
      }
    },

    adjustZoom(zoomAmount, zoomFactor) {

      if (!this.isDragging) {
        if (zoomAmount) {
          this.cameraZoom += this.zoomAmount;
        } else if (zoomFactor) {
          console.log(zoomFactor);
          this.cameraZoom = zoomFactor * this.lastZoom;
        }

        this.cameraZoom = Math.min(this.cameraZoom, MAX_ZOOM);
        this.cameraZoom = Math.max(this.cameraZoom, MIN_ZOOM);

        console.log(this.zoomAmount);
      }
    },
    // Gets the relevant location from a mouse or single touch event
    getEventLocation(e) {
      if (e.touches && e.touches.length == 1) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.clientX && e.clientY) {
        return { x: e.clientX, y: e.clientY };
      }
    },
    handleTouch(e, singleTouchHandler) {
      if (e.touches.length == 1) {
        singleTouchHandler(e);
      } else if (e.type == "touchmove" && e.touches.length == 2) {
        this.isDragging = false;
        this.handlePinch(e);
      }
    },
    onPointerDown(e) {
      this.isDragging = true;
      this.dragStart.x =
        this.getEventLocation(e).x / this.cameraZoom - this.cameraOffset.x;
      this.dragStart.y =
        this.getEventLocation(e).y / this.cameraZoom - this.cameraOffset.y;
    },

    onPointerUp(e) {
      this.isDragging = false;
      this.initialPinchDistance = null;
      this.lastZoom = this.cameraZoom;
    }, */
    get_distance(e) {
      var diffX = e.touches[0].clientX - e.touches[1].clientX;
      var diffY = e.touches[0].clientY - e.touches[1].clientY;
      return Math.sqrt(diffX * diffX + diffY * diffY); // Pythagorean theorem
    },
    addRotationClass(dom_canvas) {
      const selectArea_element = this.$el.children[1];
      removeClassByPrefix(dom_canvas, "rotate-");
      removeClassByPrefix(selectArea_element, "rotate-");
      if (this.rotate > 0) {
        selectArea_element.classList.add(`rotate-${this.pageData.rotate}`);
        dom_canvas.classList.add(`rotate-${this.pageData.rotate}`);
      }
    },
    setScrolling(value) {
      this.$emit("setscrolling", value);
    },
    toggleOCR(show) {
      this.$emit("toggleocr", show);
    },
    setCurrentScrollTo(data) {
      this.$store.dispatch(this.tabId + "/setScrollTo", data, {
        root: true,
      });
    },
    async getImage() {
      let imageData;

      let bookId = this.pageData?.bookId;
      let pageId = this.pageData?.name;

      if (!bookId) return false;
      //ספרי אביעזרי
      if (
        [26296, 26299, 26297, 26298, 26362].includes(bookId) &&
        !this.pageData?.words &&
        this.pageData?.position > 40
      ) {
        imageData = await bookData.getBlockedImg(30);
        imageData.imageMetaData = { error: true };
        return imageData;
      }

      if (this.raw) {
        //we deal with pdf
        const img = await bookData.getPdfPageAsImage(
          this.raw.pdf,
          Number(pageId)
        );
        this.webP = false;
        return img;
      }
      try {
        try {
          imageData = await bookData.getImageObject(
            bookId,
            pageId,
            "url",
            false,
            {
              resize: this.imgWidth * window.devicePixelRatio,
              zoom:
                this.$store.state.tabs[this.tabId].zoom *
                window.devicePixelRatio,
            },
            this.idImageRequest,
            this.pageData?.originPosition || this.pageData?.position
          );
        } catch (ex) {
          console.error(ex);
          return;
          // }
        }

        this.webP = imageData.imageMetaData?.PDF || imageData.webP;
        this.wasm = imageData.imageMetaData?.wasm || false;
        return imageData;
      } catch (ex) {
        console.error(ex);
        return false;
      }
    },
    getCanvasCoords(imgWidth, imgHeight, coords, img) {
      try {
        let ratio = 1;
        let rat2 = img.width / imgWidth;
        if (this.webP) {
          ratio = imgWidth / 3000;
          //  imH = (imgHeight * 3000) / imgWidth;
          //imW = 3000;
        }
        let _this = this;
        return coords.map((coord) => ({
          x: parseInt(coord.left * ratio * rat2), // * (_this.actualW / imW)) + _this.paddingLeft,
          y: parseInt(coord.top * ratio) * rat2, // * (_this.actualH / imH)),
          w: parseInt(coord.width * ratio * rat2), // * (_this.actualW / imW)),
          h: parseInt(coord.height * ratio * rat2), //* (_this.actualH / imH)),
        }));
      } catch (ex) {
        return [];
      }
    },

    async drawImage(getImageFromServer = false) {
      this.triggerNetwork();

      if (!this.$refs.canvas) return;

      try {
        if (globalThis.OTZAR_BASIC_INFO.networkMode == "server") {
          const notification = {
            type: "success",
            message: this.$t("network.autoCloseOnAdminDisconnect"),
            timeout: 2000,
          };
          this.$notify(notification);
          return;
        }
        //draw only if current
        // if (this.currPage !== this.pageData.position - 1) return;

        let img;
        let limited;
        //if getting new image, clear page first, to avoid seeing picture change
        if (getImageFromServer)
          this.$refs.canvas
            .getContext("2d")
            .clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
        const cache = globalThis.CacheCanvases.get(this.idImageRequest);
        if (!getImageFromServer && cache) {
          img = cache; //cloneCanvas(this.cachedImg);
        } else {
          img = await this.getImage();

          if (!img) return;

          limited = img.limited;
          //we can skip this img
          if (typeof img == "string" && img == "skip") return;
          this.imageMetaData = img.imageMetaData;
        }

        let originWidth =
          this.imageMetaData.width && this.imageMetaData.width != 0
            ? this.imageMetaData.width
            : img.width;
        let originHeight =
          this.imageMetaData.height && this.imageMetaData.height != 0
            ? this.imageMetaData.height
            : img.height;
        this.errorPage = this.imageMetaData.error || false;
        this.origWidth = originWidth;
        this.origHeight = originHeight;

        let isCnv =
          img instanceof HTMLCanvasElement ||
          (typeof OffscreenCanvas !== "undefined" &&
            img instanceof OffscreenCanvas);

        if (!isCnv) {
          //TODO draw image on canvas for online
          img = img.picture;
        }

        //cache image
        if (getImageFromServer) {
          reduceCanvasMemory(globalThis.CacheCanvases.get(this.idImageRequest));
          globalThis.CacheCanvases.set(this.idImageRequest, cloneCanvas(img));
          // this.cachedImg = cloneCanvas(img); // img = downscaleImg(img, 0.9);
        }
        this.cropImg = img;
        let canvasRatio = this.imgWidth / this.imgHeight;
        //  let canvasRatio = this.$refs.canvas.width / this.$refs.canvas.height;
        let originImgRatio = originWidth / originHeight;

        let w;
        let h;
        if (parseFloat(originImgRatio) < parseFloat(canvasRatio)) {
          h = this.imgHeight;
          w = Math.round(this.imgHeight * originImgRatio);
        } else {
          w = this.imgWidth;
          h = Math.round(this.imgWidth / originImgRatio);
        }
        let hefreshW = this.imgWidth - w;

        let hefreshH = this.imgHeight - h;

        let l = hefreshW / 2;
        let t = hefreshH / 2;

        this.paddingLeft = l;
        this.paddingTop = t;
        this.actualW = w;
        this.actualH = h;
        //draw fs marks and MM marks
        //   if error image - dont draw these
        // await this.contrastImage(img, 90);
        if (this.$store.state.tabs[this.tabId]?.imageEdit?.enable) {
          const ctx = img.getContext("2d");

          ctx.filter =
            "brightness(" +
            this.$store.state.tabs[this.tabId].imageEdit.brightness +
            "%) ";
          ctx.filter +=
            "contrast(" +
            this.$store.state.tabs[this.tabId].imageEdit.contrast +
            "%) ";
          ctx.filter +=
            "invert(" +
            this.$store.state.tabs[this.tabId].imageEdit.invert +
            "%) ";
          ctx.filter +=
            "saturate(" +
            this.$store.state.tabs[this.tabId].imageEdit.saturate +
            "%) ";
          ctx.filter +=
            "sepia(" +
            this.$store.state.tabs[this.tabId].imageEdit.sepia +
            "%) ";
          ctx.filter +=
            "grayscale(" +
            this.$store.state.tabs[this.tabId].imageEdit.grayscale +
            "%) ";

          ctx.drawImage(img, 0, 0, img.width, img.height);
        }
        // await this.darkMode(img);

        if (!this.imageMetaData.error && !limited) {
          await this.drawFsMarks(img);
          await this.draWMMarks(img);

          // await this.darkMode(img);
        }

        // if (!this.$refs.canvas) ;
        /** @type {HTMLCanvasElement} */
        const dom_canvas = this.$el.getElementsByTagName("canvas")[0];
        dom_canvas.width = w;
        dom_canvas.height = h;

        let destW = this.actualW;

        const pxr = window.devicePixelRatio;

        let destH = this.actualH;
        dom_canvas.style.width = destW + "px";
        dom_canvas.style.height = destH + "px";

        destW *= pxr;
        destH *= pxr;

        dom_canvas.width = destW;
        dom_canvas.height = destH;

        let quality = "high";
        // quality = this.userSettings.settings.imgQuality || "high";

        dom_canvas.getContext("2d").imageSmoothingQuality = quality;

        //this.addRotationClass(dom_canvas);

        /*   if (this.landscape) {
          let rat = destW / destH;
          destH = destW;
          destW = destH * rat;
        } */

        dom_canvas.getContext("2d").drawImage(img, 0, 0, destW, destH);
        this.addMefMasks(img);
        // reduceCanvasMemory(img);
        //if we need to mask

        this.imgRatio = img.width / w;

        this.originImgSize = { width: originWidth, height: originHeight };
        this.actualImgSize = { width: this.actualW, height: this.actualH };

        this.setScrolling(false);
        if (this._isDestroyed) {
          reduceCanvasMemory(globalThis.CacheCanvases.get(this.idImageRequest));
          globalThis.CacheCanvases.delete(this.idImageRequest);
          reduceCanvasMemory(this.$el.getElementsByTagName("canvas")[0]);
        }
        // }
      } catch (ex) {
        console.error(ex);
      }
      // } catch (ex) {
      //   this.showSpinner = false;
      // }
    },
    addMefMasks(img) {
      const show = this.showMasks;
      let masks = this.$store.state.tabs[this.tabId].masks;
      if (!show || !Object.keys(masks).length) return;
      const dom_canvas = this.$el.getElementsByTagName("canvas")[0];

      let originWidth = img.width; //this.origWidth; //img.width;
      let originHeight = img.height; //this.origHeight; // img.height;
      if (Object.keys(masks).length) {
        let cols = masks;
        /** @type HTMLCanvasElement */
        const canvasMask = new OffscreenCanvas(100, 100);
        const ctxMask = canvasMask.getContext("2d");
        canvasMask.width = dom_canvas.width;
        canvasMask.height = dom_canvas.height;
        ctxMask.fillStyle = "rgba(255,255,255,0.7)";
        ctxMask.fillRect(0, 0, canvasMask.width, canvasMask.height);

        // const yMinus = this.clearStart
        //   ? Object.values(page.columns)[0].marks[0].y * orgImgSize.h
        //   : 0;
        let topMask = dom_canvas.height;
        let rightTop = dom_canvas.height;
        let minRightMask = dom_canvas.width + 1000;
        let maxRightMask = 0;
        for (const col in cols) {
          const data = cols[col];
          if (data.page != this.pageData.name) continue;

          for (const item in data.columns) {
            const column = data.columns[item];
            for (const rects of column.marks) {
              //convert to px
              const x = rects.x * dom_canvas.width;
              const y = rects.y * dom_canvas.height;
              const h = rects.h * dom_canvas.height;
              const w = rects.w * dom_canvas.width;
              ctxMask.clearRect(x, y, w, h);

              if (y < topMask) topMask = y;
              if (x + w > maxRightMask) {
                maxRightMask = x + w;
                if (y < rightTop) rightTop = y;
              } else {
                if (Math.abs(x + w - maxRightMask) < 100)
                  if (y < rightTop) rightTop = y;
              }
              if (x + w < minRightMask) minRightMask = x + w;
            }
          }
        }
        dom_canvas.getContext("2d").drawImage(canvasMask, 0, 0);

        if (
          this.currPage == this.pageData.position - 1 &&
          this.$store.state.tabsManager.scrollToMefMask === true
        ) {
          let topToscroll =
            maxRightMask - minRightMask > 200 ? rightTop : topMask;

          this.$emit(
            "scrollToResult",
            (topToscroll + 20) / window.devicePixelRatio
          );
          this.$store.state.tabsManager.scrollToMefMask = false;
        }
      }
    },
    async draWMMarks(img) {
      if (this.MMhideMode.color) return;

      if (
        !String(this.tabId).startsWith("win_") &&
        this.isMefo &&
        this.$store.state.mefo.enable
      )
        return;
      //draw marei mekomot

      let originWidth = this.origWidth;
      let originHeight = this.origHeight;
      const willReadFrequently = this.wasm ? true : false;
      let ctx = img.getContext("2d", { willReadFrequently });

      if (!willReadFrequently) ctx.globalCompositeOperation = "lighter";

      this.MM.forEach((m) => {
        let mm = m.words;
        mm = mm.map((m1) => m1.pos);
        mm = this.getCanvasCoords(originWidth, originHeight, mm, img);
        let subColor = this.userSettings.settings.subColor
          ? this.userSettings.settings.subColor
          : "#c67f05";
        let secondSubColor = this.userSettings.settings.secondSubColor
          ? this.userSettings.settings.secondSubColor
          : "#7d5104";
        let color =
          m.type == "yesod"
            ? "rgb(22, 3, 133)"
            : // secondSubColor
            m.type == "list"
            ? "rgb(84, 22, 0)"
            : // subColor
              "rgb(6, 99, 25)";
        let colorPX =
          m.type == "yesod"
            ? [22, 3, 133]
            : // secondSubColor
            m.type == "list"
            ? [84, 22, 0]
            : // subColor
              [6, 99, 25];

        /*   let color =
          m.type == "yesod" ? "blue" : m.type == "list" ? "brown" : "green"; */
        let _vm = this;
        mm.forEach((m, i) => {
          let exists = false;
          if (_vm.fsCoords.length > 0) {
            _vm.fsCoords.forEach((f) => {
              if (
                f.x <= m.x &&
                f.y <= m.y &&
                f.w + f.x <= m.w + m.x &&
                f.y + f.h <= m.y + m.h
              ) {
                exists = true;
                return;
              }
            });
          }
          if (!exists) {
            if (willReadFrequently) {
              const imageData = ctx.getImageData(m.x, m.y, m.w, m.h);
              const data = imageData.data;

              // Loop through each pixel and check if it is black and has full alpha
              for (let i = 0; i < data.length; i += 4) {
                const red = data[i];
                const green = data[i + 1];
                const blue = data[i + 2];
                const alpha = data[i + 3];
                let white = data[i] == 255 && data[i + 1] == 255 && data[i + 2];

                if (alpha > 0 && !white) {
                  data[i] = colorPX[0];
                  data[i + 1] = colorPX[1];
                  data[i + 2] = colorPX[2];
                }
              }

              // Put the modified pixel data back on the canvas
              ctx.putImageData(imageData, m.x, m.y);
            } else {
              ctx.fillStyle = color;
              ctx.fillRect(m.x, m.y, m.w, m.h);
            }
          }
        });
      });
      if (!willReadFrequently) ctx.globalCompositeOperation = "source-over";
    },
    async contrastImage(img, contrast) {
      // contrast as an integer percent
      const cnv = img;
      const ctx = cnv.getContext("2d");
      const w = cnv.width;
      const h = cnv.height;
      const ImgData = ctx.getImageData(0, 0, w, h);
      let data = ImgData; // original array modified, but canvas not updated
      contrast *= 2.55; // or *= 255 / 100; scale integer percent to full range
      let factor = (255 + contrast) / (255.01 - contrast); //add .1 to avoid /0 error

      for (
        let i = 0;
        i < data.length;
        i += 4 //pixel values in 4-byte blocks (r,g,b,a)
      ) {
        data[i] = factor * (data[i] - 128) + 128; //r value
        data[i + 1] = factor * (data[i + 1] - 128) + 128; //g value
        data[i + 2] = factor * (data[i + 2] - 128) + 128; //b value
      }
      const imgBitmap = await createImageBitmap(data);

      ctx.drawImage(imgBitmap, 0, 0, w, h);
      // return imageData; //optional (e.g. for filter function chaining)
    },
    async darkMode(img) {
      // let val = this.userSettings.settings.theme;
      // if (val != "dark") return;
      /**@type {HTMLCanvasElement} */
      const cnv = img;
      const ctx = cnv.getContext("2d");
      const w = cnv.width;
      const h = cnv.height;
      const ImgData = ctx.getImageData(0, 0, w, h);
      const data = ImgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3];
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (r > 200 && g > 200 && b > 200) {
          //0 is black
          data[i] = 52;
          data[i + 1] = 46;
          data[i + 2] = 41;
          data[i + 3] = 255;
        } else if (r < 30 && g < 30 && b < 30) {
          data[i] = data[i + 1] = data[i + 2] = data[i + 3] = 255;
        }
      }
      const imgBitmap = await createImageBitmap(ImgData);
      ctx.drawImage(imgBitmap, 0, 0, w, h);
    },
    async drawFsMarks(img) {
      if (
        (this.pageData?.words != undefined && this.drawFs !== false) ||
        this.imageMetaData?.searchResult
      ) {
        let originWidth = this.origWidth;
        let originHeight = this.origHeight;
        let ratio = this.imgWidth / img.width;
        //draw freesearch marks
        let ctx = img.getContext("2d");
        let fsHeight = (document.body.clientHeight - 100) / 2;
        ctx.globalCompositeOperation = "multiply";
        try {
          let coords = "";
          if (this.imageMetaData?.searchResult) {
            coords = this.imageMetaData.searchResult;
          } else coords = await this.getWordsCoords(this.pageData, this.webP);

          if (coords == "") return;

          let fsDraw = this.getCanvasCoords(
            originWidth,
            originHeight,
            coords[0],
            img
          );
          let page = this.pageData.position;
          let minTop = 10000;
          this.fsCoords = fsDraw;
          const yellowCodes = [
            "255,255,102",
            "255,255,51",
            "255,255,0",
            "204,204,0",
            "153,153,0",
          ];
          let yellowCode = this.userSettings.settings.fsresult_color || 2;
          fsDraw.forEach((fs, i) => {
            if (fs.y < minTop) minTop = fs.y;
            ctx.fillStyle = `rgba(${yellowCodes[yellowCode]})`;
            ctx.fillRect(fs.x, fs.y, fs.w, fs.h);
          });

          if (minTop != 10000) {
            minTop *= ratio;
            if (minTop > fsHeight) {
              minTop = minTop - fsHeight;
              this.$emit("topFs", minTop);

              if (
                this.currPage == this.pageData.position - 1 &&
                this.$store.state.tabsManager.scrollToFsResult === true
              ) {
                this.$emit("scrollToResult", minTop);
                this.$store.state.tabsManager.scrollToFsResult = false;
              }
            }
          }
        } catch (ex) {
          console.error(ex);
          return "";
        }
      }
    },
    sendStartTouchUp(e) {
      if (this.$_mobile) return;
      if (e.touches.length > 1) {
        e.preventDefault();
        // if multiple touches (pinch zooming)
        this.finger_dist = this.get_distance(e); // Save current finger distance
      }
      // this.$emit("touchstart", e);
    },

    sendEndTouchUp(e) {
      if (this.$_mobile) return;
      if (e.touches.length > 1) {
        // If pinch-zooming
        clearTimeout(this._timer);
        let new_finger_dist = get_distance(e); // Get current distance between fingers
        const zoomOut = new_finger_dist - this.finger_dist;

        this._timer = setTimeout(() => {
          let zoomTo =
            this.$store.state.tabs[_this.tabId].zoom + (zoomOut > 0 ? 10 : -10); // zoomOut;
          if (zoomTo < 100) zoomTo = 100;
          if (zoomTo > 250) zoomTo = 250;
          this.$store.state.tabs[_this.tabId].zoom = zoomTo;
          this.finger_dist = new_finger_dist;
        }, 100);
      }
    },

    imgError(error) {
      console.error(error);
    },

    calcImageSize() {
      if (!this.$refs.container) return;
      // this.canvas = this.$refs.canvas;
      //  this.canvasCtx = this.canvas.getContext("2d");

      if (this.getBookFit == "width") {
        this.imgWidth = this.$refs.container.clientWidth - 20;
        this.imgHeight = this.$refs.container.clientHeight; //this.imgWidth * 1.5; // this.$refs.container.clientHeight;
      } else {
        this.imgHeight = this.$refs.container.clientHeight;
        this.imgWidth = this.imgHeight / this.rat;

        if (this.imgWidth > this.$refs.container.clientWidth - 20) {
          this.imgWidth = this.$refs.container.clientWidth - 20;
          this.imgHeight = this.imgWidth * this.rat;
        }
      }

      if (this.landscape) {
        let rat = this.imgWidth / this.imgHeight;
        this.imgHeight = this.imgWidth;
        this.imgWidth = this.imgHeight * rat;
      }

      this.imgLeft = 0; // this.canvas.offsetLeft;
    },
    doImageChange(getImageFromServer = false) {
      this.calcImageSize();

      // this.$nextTick(() => {
      this.drawImage(getImageFromServer);
      // });
    },
  },
  beforeDestroy() {
    clearTimeout(this._timer);
    reduceCanvasMemory(globalThis.CacheCanvases.get(this.idImageRequest));
    reduceCanvasMemory(this.$el.getElementsByTagName("canvas")[0]);
    globalThis.CacheCanvases.delete(this.idImageRequest);
    window.removeEventListener("resize", this.doImageChange);
  },
  mounted() {
    this.doImageChange(true);
    window.addEventListener("resize", this.doImageChange);
  },
};

function removeClassByPrefix(el, prefix) {
  el.className = el.className.replace(/\brotate-.*?\b/g, "");
  return el;
}

function cloneCanvas(oldCanvas) {
  //create a new canvas
  if (oldCanvas.width == 0 || oldCanvas.height == 0) return oldCanvas;
  var newCanvas = document.createElement("canvas");
  var context = newCanvas.getContext("2d");

  //set dimensions
  newCanvas.width = oldCanvas.width;
  newCanvas.height = oldCanvas.height;

  //apply the old canvas to the new one
  context.drawImage(oldCanvas, 0, 0);

  //return the new canvas
  return newCanvas;
}
</script>
<style lang="scss" scoped>
.img-container {
  display: flex;
  overflow: hidden;
  justify-content: center;
  padding-left: 10px;
  padding-right: 10px;
}
.img-canvas {
  /*width: 100%;  */
  pointer-events: none;
}
.rotate-0 {
  transform: rotate(0deg) translateY(-10px);
  left: auto !important;
}
.rotate-90 {
  transform: rotate(90deg) translateY(-10px);
  left: auto !important;
}
.rotate-270 {
  transform: rotate(270deg) translateY(-10px);
  left: auto !important;
}
.rotate-180 {
  transform: rotate(180deg) translateY(-10px);
  left: auto !important;
}
</style>
