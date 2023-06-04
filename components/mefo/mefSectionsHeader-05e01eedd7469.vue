<template>
  <div>
    <div class="flex header">
      <div style="width:100%">
        <div class="flex combo-options">
          <div class="flex">
            <span class="lbl-order-by">{{ $t("mefo.sortBy") }}</span>
            <ComboboxInput
              class="cmb"
              :items="[
                { label: this.$t('mefo.defSort'), key: 0, name: 'default' },
                { label: this.$t('mefo.alphaSort'), key: 1, name: 'alefbet' },
              ]"
              @input="$emit('sortBy', $event.name)"
              :labelStart="0"
              :labal="'aaa'"
              :labelKey="1"
            />
          </div>
          <div class="flex">
            <BaseOverCircle>
              <span
                class="btn-header"
                style="stroke:var(--text-color2)"
                @click="$emit('toggleGridMode')"
                v-tooltip="
                  gridMode
                    ? this.$t('mefo.goToRowView')
                    : this.$t('mefo.goToGridView')
                "
              >
                <Icons
                  class="btn-header"
                  :icon="!gridMode ? 'grid' : 'rows'"
                  height="18px"
                  width="18px"
                /> </span
            ></BaseOverCircle>
            <BaseOverCircle>
              <span
                v-tooltip="
                  bookview ? $t('mefo.goToPartView') : $t('mefo.goToPageView')
                "
                class="btn-header "
                style="height:18px;width:18px;stroke:var(--text-color2);fill:var(--text-color2);stroke-width: 2px;"
                @click="$emit('toggleBookView')"
              >
                <Icons
                  :icon="bookview ? 'section' : 'book'"
                  height="18px"
                  width="18px"
                />
              </span>
            </BaseOverCircle>

            <BaseOverCircle v-if="!gridMode">
              <span
                v-tooltip="
                  minimizeAll
                    ? this.$t('mefo.openAll')
                    : this.$t('mefo.minimAll')
                "
                style="fill:var(--text-color2)"
                class="btn-header"
                @click="$emit('toggleMini')"
              >
                <Icons
                  :icon="minimizeAll ? 'plus' : 'minimize'"
                  height="16px"
                  width="16px"
              /></span>
            </BaseOverCircle>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icons from "@/components/Icons/Icons.vue";
export default {
  data() {
    return {
      color: "#626262",
    };
  },
  components: { Icons },
  props: ["minimizeAll", "gridMode", "bookview"],
};
</script>

<style lang="scss" scoped>
.header {
  min-height: 39px;
  color: rgb(152, 119, 79);

  align-items: center;
  //font-family: Heebo-Bold;
  padding: 0px 11px;
  justify-content: space-between;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #dedede;
}
.cmb {
  width: 107px;
  border-color: var(--custom-color1);
}
.combo-options {
  align-items: center;
  justify-content: space-between;
}
.close-btn {
  width: 18px;
  height: 18px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lbl-order-by {
  padding: 0px 5px;
  display: inline-block;
  font-size: 12px;
  color: var(--text-color1);
  font-weight: 400;
  font-family: "Heebo";
}
.btn-header.btn-header-close {
  display: flex;
  margin: 0px 0px;
  border-radius: 50%;
  padding: 2px;
  background-color: #00000014;
}
.lbl-header {
  color: var(--text-color1);
}
</style>
