<template>
  <div>
    <div
      v-body
      v-zindex
      class="popup-printer"
      :style="{ visibility: 'initial' }"
    >
      <div class="close-btn">
        <span
          v-if="!printMode"
          class="font-icon-bar font-icon"
          @click="printMe"
        >
          h
        </span>
        <span v-else class="font-icon-bar font-icon" @click="closePrint">
          j
        </span>
        <span @click="closeMe"> x </span>
      </div>
      <div class="paper-container" ref="paperPontainer">
        <!-- <div> -->
        <div :style="{ width: paperW + 'px', position: 'relative' }">
          <!-- <div style="position: absolute;"> -->

          <template v-for="(page, i) in numPages">
            <div
              class="fake-paper"
              :style="{
                width: paperW + 'px',
                height: paperH + 'px',
                top: i * paperH + 'px',
                //'margin-top': 10 + 'px',
                //'margin-bottom': paperMarginY + 'px',
              }"
              :key="i"
            ></div>
          </template>

          <template v-for="section in sectionsOrdered">
            <template v-for="(part, i) in section.parts">
              <secPrintCard
                :key="section.id + 'p' + i"
                :partNum="i"
                :sumParts="section.parts.length"
                :paperW="paperW"
                :canvases="part.canvases"
                :partHeight="part.partHeight"
                :spaceBottom="spaceBottom"
                :section="section"
                :screenRatio="screenRatio"
                :basicCanvasWidth="basicCanvasWidth"
                :headerHCalc="headerHCalc"
                draggable="true"
                @dragstart="(e) => dragstart(e, section.id)"
                @drop="(e, direction) => drop(e, section, direction)"
                @dragover="dropEle = section.id"
                @dragend="dropEle = null"
                :dropEle="dropEle"
                @removeSec="removeSec"
                @pushNext="pushNext"
                @pushBack="pushBack"
                @mouseenter="secHovered = section.id"
                @mouseleave="secHovered = null"
                @setSecWidth="setSecWidth"
                :style="{
                  //position: 'absolute',
                  width: section.width + 'px',
                  top: (part.pageNum - 1) * paperH + part.partTop + 'px',
                  right: part.partRight + 'px',
                  backgroundColor:
                    secHovered == section.id
                      ? 'rgba(128, 128, 128, 0.108)'
                      : '',
                }"
              ></secPrintCard>
            </template>
          </template>
          <!-- </div> -->
        </div>
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import secPrintCard from "@/components/mefo/secPrintCard.vue";
import ImageProccessor from "@/services/ImageProccessor.js";
export default {
  components: { secPrintCard },
  data() {
    return {
      dropEle: null,
      paper: null,
      secHovered: null,
      basePaperW: 700,
      basePaperH: 1000,
      spaceBottom: 5, //TODO temp need vuex
      sections: [],
      sectionsLocations: {},
      numPapers: 1,
      //   paperMarginY: 5,
      screenRatio: 1,
      printMode: false,
      numPages: 0,
    };
  },
  created() {
    this.sections = this.sectionsToPrint;
  },
  computed: {
    sectionsToPrint() {
      return this.$store.state.mefoPrinter.sectionsToPrint;
    },
    paperW() {
      return winSizes.innerWidth * 0.7 * this.screenRatio;
    },
    paperH() {
      const ratio = this.paperW / this.basePaperW;
      return this.basePaperH * ratio;
    },
    basicCanvasWidth() {
      return (this.paperW / 4) * 0.95;
    },
    maxSecHeight() {
      return this.paperH - this.headerHCalc;
    },
    headerHCalc() {
      //   return this.headerH * this.screenRatio;
      return 20 * this.screenRatio;
    },
    sumBrutoSecSpaceY() {
      const header = this.headerHCalc;
      const margin = 0;
      const padding = 5 * 2;
      const border = 1 * 2;
      return header + margin + padding + border;
    },
    sectionsOrdered() {
      const sections = this.sections;
      let nextTop = 0;
      let nextRight = 0;
      let nextPageNum = 1;
      for (const section of sections) {
        section.width =
          section.width || this.basicCanvasWidth * this.screenRatio;
        if (nextTop > 0) nextTop += this.sumBrutoSecSpaceY;
        const parts = this.calcParts(section, nextTop);
        const lastPart = parts[parts.length - 1];

        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          part.pageNum = nextPageNum;
          this.numPages = nextPageNum;
          part.partRight = nextRight;
          const isEndColumn = parts[i + 1] && parts[i + 1].partTop == 0;
          if (isEndColumn) nextRight += section.width;
          const isEndPage = nextRight >= this.paperW - section.width;
          if (isEndPage) {
            nextRight = 0;
            nextPageNum++;
          }
        }

        nextTop = lastPart.partTop + lastPart.partHeight; //+ this.sumBrutoSecSpaceY;
        section.parts = parts;
      }
      return sections;
    },
  },
  methods: {
    printMe() {
      document.body.style.visibility = "hidden";
      //   document.body.style.overflow = "visible";
      // this.$refs.paperContainer.style.overflow = "calc(100% - 50px)";
      // this.$refs.paperContainer.style.overflow = "visible";
      //   this.basePaperW = winSizes.innerWidth - 100;
      //   this.paperW = winSizes.innerWidth - 100;

      this.printMode = true;
      this.screenRatio = (winSizes.innerWidth - 60) / this.paperW;
      //   window.print();

      //   let sections = this.sections;
      //   this.sections = [];
      //   this.sections = sections;
    },
    closePrint() {
      document.body.style.visibility = "unset";
      //   document.body.style.overflow = "hidden";
      //   this.$refs.paperContainer.style.overflow = "auto";

      this.printMode = false;
      this.screenRatio = 1;
    },
    closeMe() {
      this.$store.dispatch("mefoPrinter/emptySections"); //TODO temp
      this.$store.dispatch("mefoPrinter/setShowMefoPrinter", false);
    },
    removeSec(section) {
      this.$store.dispatch("mefoPrinter/removeSecFromPrinter", section);
    },
    pushNext(section) {
      this.$store.dispatch("mefoPrinter/pushNext", section);
    },
    pushBack(section) {
      this.$store.dispatch("mefoPrinter/pushBack", section);
    },
    dragstart(e, secId) {
      e.dataTransfer.setData("text", secId);
    },
    drop(e, secDist, direction) {
      e.preventDefault();
      let secSrcId = e.dataTransfer.getData("text");
      let sec = this.sections.filter((s) => s.id == secSrcId)[0];
      let func = direction == "up" ? "moveBefore" : "moveAfter";
      this.$store.dispatch("mefoPrinter/" + func, { sec, secDist });

      //  ev.target.appendChild(document.getElementById(data));
    },
    setSecWidth(id, width) {
      let i = 0;
      for (const sec of this.sections) {
        if (sec.id == id) {
          sec.width = width;
          this.$set(this.sections, i, sec); //for refresh
          break;
        }
      }
    },
    calcParts(section, startFromY) {
      const canvases = section.canvases;
      const parts = [{ canvases: [] }];
      let part = 0;
      let partHeight = 0;
      const canvasWidth = section.width;
      const maxSecHeight = this.maxSecHeight;
      let maxtPartHeight = maxSecHeight - startFromY;
      for (const cvs of canvases) {
        const ratio = canvasWidth / cvs.width;
        let curCanvas = cvs;
        let curCvsHeightCalc = (cvs.height + this.spaceBottom) * ratio;

        if (partHeight + curCvsHeightCalc <= maxtPartHeight) {
          partHeight += curCvsHeightCalc;
          parts[part].canvases.push(cvs);
        } else {
          const catCanvas = (srcCanvas) => {
            // find white row
            const tmpCvs1H =
              (maxtPartHeight - partHeight - this.spaceBottom) / ratio;
            const cvs1H = ImageProccessor.getLastWhiteRowInRange(
              srcCanvas,
              tmpCvs1H
            );

            //crt new cvs1
            const cvs1 = new OffscreenCanvas(srcCanvas.width, cvs1H);
            const ctx1 = cvs1.getContext("2d");
            ctx1.drawImage(srcCanvas, 0, 0);

            //crt new cvs2
            const cvs2H = srcCanvas.height - cvs1H;
            const cvs2W = srcCanvas.width;

            const cvs2 = new OffscreenCanvas(cvs2W, cvs2H);
            const ctx2 = cvs2.getContext("2d");

            const args = [0, cvs1H, cvs2W, cvs2H, 0, 0, cvs2W, cvs2H];
            ctx2.drawImage(srcCanvas, ...args);

            return { cvs1, cvs2 };
          };

          while (partHeight + curCvsHeightCalc > maxtPartHeight) {
            const { cvs1, cvs2 } = catCanvas(curCanvas);
            curCanvas = cvs2;
            parts[part].canvases.push(cvs1);
            const ratio1 = canvasWidth / cvs1.width;
            curCvsHeightCalc = (cvs1.height + this.spaceBottom) * ratio1;
            partHeight += curCvsHeightCalc;
            parts[part].partHeight = partHeight;
            parts[part].partTop = startFromY;

            // partsHeight.push(partHeight);

            //New column
            startFromY = 0;
            maxtPartHeight = maxSecHeight - startFromY;
            const ratio2 = canvasWidth / cvs2.width;
            curCvsHeightCalc = (cvs2.height + this.spaceBottom) * ratio2;
            partHeight = curCvsHeightCalc;
            part++;
            parts[part] = { canvases: [] };
            parts[part].canvases.push(cvs2);
          }
        }
      }
      parts[part].partHeight = partHeight;
      parts[part].partTop = startFromY;
      return parts;
    },
  },
  watch: {
    sectionsToPrint: function(val, oldV) {
      this.sections = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-printer {
  position: fixed;
  top: 30px;
  left: 30px;
  height: calc(100% - 100px);
  background-color: #f5eded;
  padding: 5px;
}
.paper-container {
  //   height: 80vh;
  height: 100%;
  overflow: auto;
  background-color: aliceblue;
  padding: 5px;
}
.close-btn {
  //   position: absolute;
  top: 5px;
  left: 5px;
  //   position: sticky;
  cursor: pointer;
  z-index: 2;
  background-color: rgba(182, 67, 21, 0.473);
  width: fit-content;
  padding: 2px;
}
.fake-paper {
  border: gray 1px solid;
  background-color: white;
  //   display: flex;
  //   flex-wrap: wrap;
  position: absolute;
}
</style>
