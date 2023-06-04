<template>
  <div>
    <canvas ref="canvas" style="width: 100%; min-width: 20vw;"></canvas>
  </div>
</template>

<script>
export default {
  props: ["rects", "img", "id"],
  data() {
    return { canvas: null };
  },
  async created() {
    await this.loadCanvas();
    this.drawCanvas();
    this.$emit("canvasCreated", { cnv: this.$refs.canvas, id: this.id });
  },
  methods: {
    loadCanvas() {
      this.$nextTick(() => {
        const canvas = this.$refs.canvas;
        if (!canvas) return;
        // this.canvas = canvas;
      });
      // return new Promise((res, rej) => {
      //   let t = setInterval(() => {
      //     const canvas = this.$refs.canvas;
      //     if (!canvas) return;
      //     this.canvas = canvas;
      //     res(clearInterval(t));
      //   }, 1);
      // });
    },
    drawCanvas() {
      const { width, height, x, y, w, h, distX, distY } = this.rects.finalSizes;

      // this.canvas.width = width;
      // this.canvas.height = height;

      //draw
      this.$refs.canvas.width = width;
      this.$refs.canvas.height = height;

      const ctx = this.$refs.canvas.getContext("2d");
      ctx.drawImage(this.img.picture, x, y, w, h, distX, distY, w, h);
    },
  },
  beforeDestroy() {
    globalThis.reduceCanvasMemory(this.$refs.canvas);
  },
};
</script>

<style lang="scss" scoped></style>
