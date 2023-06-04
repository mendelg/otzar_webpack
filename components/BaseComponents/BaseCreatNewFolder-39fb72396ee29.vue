<template>
  <div>
    <baseIcon nameIcon="create-folder" @click="creatFolder" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      // nameIcon:
    };
  },
  methods: {
    creatFolder() {
      this.$emit("click");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>