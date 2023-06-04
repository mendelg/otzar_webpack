<template>
  <div class="icons-folders flex" v-if="!$_mobile">
    <iconImportList :listType="listType" :disable="disable" />
    <!-- <iconExportList :listType="listType" :disable="disable" /> -->
    <!-- <div class="flex" v-if="listType != 'free'">
      <baseCheckBox
        class="check-item"
        @change="toggleShowVols"
        size="larg"
        :checked="$store.state.bookList.showVols"
      />
      פתח סדרות
    </div> -->
    <!-- <baseDropDown class="left" :class="{disable}" :disable="disable">

      <template #button class="list-dropdown">
        <div class="otz-icon otz-icon-arrow otz-icon-square">o</div>
      </template>
      <template #list class="list-dropdown">
        <baseItem>שמור שינויים שבוצעו ברשימה</baseItem>
        <baseItem>שמור רשימת ספרים זו בשם חדש</baseItem>
        <baseItem :class="{disable}">שמור ספרים מסומנים כרשימה</baseItem>
      </template>
    </baseDropDown>-->
  </div>
</template>

<script>
import iconExportList from "@/components/listBookArea/headerBookListContainer/iconFolderList/iconExportList.vue";
import iconImportList from "@/components/listBookArea/headerBookListContainer/iconFolderList/iconImportList.vue";
import { mapGetters } from "vuex";
export default {
  props: {
    listType: {
      type: String,
      default: "book",
    },
    disable: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    iconExportList,
    iconImportList,
  },
  computed: {},
  methods: {
    toggleShowVols() {
      this.userSettings.setSettings(
        "openVolumes",
        !this.$store.state.bookList.openVols
      );
      this.$store.dispatch("bookList/toggleShowVols", { root: true });
    },
  },
};
</script>

<style lang="scss">
// .tooltip {
//   position: relative;
//   display: inline-block;
//   border-bottom: 1px dotted black;
// }

// .tooltip .tooltiptext {
//   visibility: hidden;
//   width: 120px;
//   background-color: black;
//   color: #fff;
//   text-align: center;
//   border-radius: 6px;
//   padding: 5px 0;

//   /* Position the tooltip */
//   position: absolute;
//   z-index: 1;
// }

// .tooltip:hover .tooltiptext {
//   visibility: visible;
// }

.icons-folders {
  // min-width: 43px;
  display: flex;
  position: relative;
  .outer-icon {
    height: 100%;
    width: 100%;
    position: relative;
  }

  .icon {
    width: 24px;
    // height: 24px;
    transition: 0.3s;
    border-radius: 50%;
    position: relative;
    padding: 0;
    .outer-icon {
      border-radius: 50%;
    }
    .outer-icon:not(.disable):hover {
      background-color: #00000014;
    }

    svg {
      cursor: pointer;
      top: 52%;
      left: 52%;
      position: absolute;
      transform: translateX(-50%) translateY(-50%);
    }
  }
  .no-radius .icon {
    border-radius: 0;
    width: 14px;
    // margin-left: 4px;
    transform: scale(0.9);
  }
}

.icons-left .import-list {
  padding-top: 8.75px;
}
</style>
