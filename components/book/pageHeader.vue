<template>
  <div></div>
</template>
<script>
export default {
  props: ["pageData"],
  computed: {
    getPageLetter() {
      return this.pageData.letter;
    }
  }
};
</script>