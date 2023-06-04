<template>
    <div>
  <div class="combo-item">פריט אחד</div>
   <baseItemNext class="combo-item">
                    <template #next>
                      <baseItem>פריט נפתח</baseItem>
                    </template>
                    <template #list>
                      <baseItem >
                       פריט 1
                      </baseItem>
                      <baseItem>
                         פריט 2
                      </baseItem>
                    </template>
                  </baseItemNext>
      
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>

</style>