<template>
  <div class="card fade-in-2">
    <div class="flex h-100">
      <div class="mrg-l-12">
        <div class="title-gray mrg-b-12">{{ $t("welcome.howStart") }}</div>
        <baseButton class="mrg-b-12" @click="openDesktopWin">{{
          $t("welcome.openNewDesktop")
        }}</baseButton>
        <baseButton v-if="hasLastDesk" @click="openLastDesk">{{
          $t("welcome.openLastDesktop")
        }}</baseButton>
      </div>
      <div class="mrg-r-12 flex-column h-100 flex-g-1">
        <div class="title-gray">
          {{ $t("welcome.openFromSavedDesktop") }}
        </div>
        <div class="flex-column h-100 space-b">
          <!-- ...mapState("desktop", { state: (state) => state }) -->
          <div class="no-saved-desc flex-column desk-line-container list-desk">
            <template v-if="getLastDesks.length < 1">
              <p class="desk-line">{{ $t("welcome.noSavedDesktop") }}</p>
            </template>
            <template v-else>
              <p
                v-for="desk in getLastDesks"
                :key="desk.id"
                class="desk-line"
                @dblclick="openDesktop(desk)"
              >
                {{ desk.title }}
              </p>
            </template>
          </div>

          <div v-if="getLastDesks.length < 1">
            <div class="bold">{{ $t("welcome.howSavedDesktop") }}</div>
            <div class="list">
              <ol>
                <!-- לא רלוונטי לתרגום כרגע..... -->
                <li>נמצאים במצב אותו רוצים לשמור</li>
                <li>'בתפריט - נכנסים ל'כלים - שולחן עבודה</li>
                <li>'בוחרים באפשרות 'שמור שולחן עבודה</li>
                <li>בוחרים שם ושומרים את שולחן העבודה</li>
                <li>
                  בפעם הבאה, יופיע שולחן העבודה ברשימת
                  <br />.שולחנות העבודה השמורים
                </li>
              </ol>
            </div>
          </div>
        </div>
        <div class="list list-saved-desc"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import deskMix from "@/mixing/mixDesktop.js";
export default {
  mixins: [deskMix],
  computed: {
    ...mapState("desktop", ["desktops"]),
    getLastDesks() {
      return this.desktops
        .filter((a) => a.title != "RECENT")
        .slice()
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);
    },
    hasLastDesk() {
      return this.desktops.find((a) => a.title == "RECENT") ? true : false;
    },
  },
  methods: {
    openDesktopWin() {
      this.$store.dispatch("desktop/setVisible", true);
    },
    openLastDesk() {
      let desk = this.desktops.find((a) => a.title == "RECENT");
      if (desk) {
        this.openDesktop(desk);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.desk-line {
  // line-height: 20px;
  margin: 0px 3px;
}
.desk-line-container {
  margin-bottom: 5px;
}
.no-saved-desc {
  // margin: 22px 0 36px 0;
}
.list-desk {
  .desk-line {
    display: flex;
    justify-content: space-between;
    position: relative;
    line-height: 36px;
    height: 36px;
    border-bottom: 1px solid #0000001a;
    font-weight: 300;
    transition: 0.3s;
    cursor: pointer;
    .date {
      color: #00000050;
    }
    &::after {
      content: "";
      -webkit-transform: scaleX(0);
      transform: scaleX(0);
      width: 100%;
      height: 1px;
      border-bottom: 1px solid var(--custom-color1);
      position: absolute;
      right: 0;
      bottom: 0;
      transition: 0.3s;
    }
    &:hover {
      color: var(--custom-color1);
      transition: 0.3s;
      &::after {
        transform: scaleX(1);
        transition: 0.3s;
      }
    }
  }
}
.space-b {
  justify-content: space-between;
}
</style>
