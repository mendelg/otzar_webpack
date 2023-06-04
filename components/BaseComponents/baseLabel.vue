<template>
  <div class="label">
    <span class="text">{{ text }}</span>
    <!-- <div class="div-icon">
      <BaseIcon class="x-close" nameIcon="x-list" width="5.5" height="5.5" @click="remove" />
    </div>-->
    <div
      class="remove icon-otzar icon-circle icon-bg icon-remove"
      @click="remove"
    >
      F
    </div>
  </div>
</template>

<script>
export default {
  props: ["text"],
  methods: {
    remove() {
      this.$emit("remove", this.word);
    },
  },
};
</script>

<style lang="scss" scoped>
$bg-hover2: #00000020;

$border: #d4d4d4;

$border2: #b2b2b2;

.label {
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  min-width: 90px;
  height: 25px;
  background-color: white;
  border-radius: 17px;
  padding: 0 10px 0 3px;
  font-size: 13px;
  border: 1px solid $border;
  line-height: 23px;
  margin-left: 8px;
  // margin-top: 18px;
  color: #000;
  position: relative;
  cursor: pointer;
  transition: 0.3s;
  .text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 80%;
  }
  &:hover {
    border: 1px solid $border2;
  }
  .remove {
    background-color: $bg-hover2;
    font-size: 8px;
    height: 18px;
    width: 18px;
    line-height: 18px;
    text-align: center;
    margin: 2.5px 4px 0 0;
  }
}
</style>
