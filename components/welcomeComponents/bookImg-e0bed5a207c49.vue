<template>
  <div class="item relative" @click="$emit('click')">
    <div class="img book-img">
      <img class="" src="@/assets/img/books/mefo-book.png" height="100%" alt />
    </div>
    <div class="text"><slot></slot></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.item {
  position: relative;
  transition: 0.3s;
  // height: 222px;
  height: 100%;
  cursor: pointer;
  .img {
    height: 100%;
    img {
      width: 100%;
      min-width: 32px;
      height: 100%;
    }
  }
  .text {
    position: absolute;
    top: 50%;
    left: 50%;
    color: #ecb364;
    transform: rotate(-90deg) translateX(-50%);
    font-size: 22px;
    font-weight: bold;
    transform-origin: left;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    font-family: "HaYetzira", sans-serif;
    padding-top: 1px;
    margin-top: -10px;
  }
  &:hover {
    transition: 0.3s;
    transform: scale(1.1);
    z-index: 2;
  }
}
</style>
