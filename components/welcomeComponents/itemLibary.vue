<template>
  <div class="item">
    <div class="title">
      <slot name="title"></slot>
    </div>
    <div class="sub-title"><slot name="sub-title"></slot></div>
    <div class="img" v-if="!empty">
      <img class="image mrg-l-12" :src="pathImg" height="100%" alt />
      <img class="image image2 mrg-l-12" :src="pathImg" height="100%" alt />
    </div>
    <div class="overlay" :class="{ show: empty }">
      <div class="desc"><slot name="desc"></slot></div>
      <div class="btn" v-if="!empty" @click="$emit('click')">
        <slot name="btn"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "desc", "img", "empty"],
  computed: {
    pathImg() {
      if (this.img) {
        return "./books/" + this.img + ".png";
      } else return "./books/1.png";
    },
  },
};
</script>

<style lang="scss" scoped>
.img {
  img {
    width: auto;
    height: 65%;
    min-width: 100%;
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
.title {
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--custom-color1);
  width: 176px;
  height: 29px;
  // height: calc(100% / 5);
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  font-size: 15px;
  font-weight: bold;
  color: #fff;
  z-index: 2;
}
.sub-title {
  margin-top: 23px;
  color: #fff;
  text-align: center;
  position: absolute;
  width: 100%;
  z-index: 4;
  font-weight: normal;
  line-height: 13px;
  padding-top: 5px;
}
.overlay {
  position: absolute;
  width: 100%;
  top: 0;
  padding-top: 20px;
  height: 100%;
  background-color: #00000080;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  display: none;
  transition: 0.3;
  &.show {
    background-color: transparent;
    display: flex;
  }
  .desc {
    text-align: center;
    line-height: 17px;
    margin-bottom: 5px;
    line-height: 13px;
  }
}
.item {
  position: relative;
  //   overflow: hidden;
  &:hover {
    .overlay {
      display: flex;
    }
  }
}
.image2 {
  right: 360px !important;
}
</style>
