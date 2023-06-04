<template>
  <div
    class="list-folder flex-g-1"
    style="overflow: auto; height: calc(100% - 44px);"
  >
    <item-explore
      v-for="(folder, index) in list"
      :key="index"
      :item="folder"
      :active="active"
      @open="$emit('open', folder)"
      @select="$emit('select', folder)"
    />
    <div v-if="showfiles">
      <item-explore
        :file="true"
        v-for="(folder, index) in files"
        :key="index"
        :item="folder"
        :active="active"
        @open="$emit('open', folder)"
        @select="$emit('select', folder)"
      />
    </div>
  </div>
</template>

<script>
import itemExplore from "@/components/BaseComponents/explorer/itemExplore.vue";
export default {
  props: ["list", "active", "showfiles", "files"],
  components: {
    itemExplore,
  },
};
</script>

<style lang="scss" scoped></style>
