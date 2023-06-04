<template>
  <div class="flex custom-text">
    <div class="font-size">
      <div class="bigger"></div>
      <div class="smaller"></div>
    </div>
    <div class="mrg-l-3 flex-center dir-r">
      <span class="mrg-l-3 label-combo">{{ $t("itemBook1.selectFont") }}</span>
      <ComboboxInput
        class="combo-fontf"
        :items="listFonts"
        @input="chooseFonts($event)"
        :labelStart="labelFont"
        :labal="labelFont"
        :labelKey="1"
      />
    </div>
    <div class="mrg-l-6 flex-center dir-r border-l-light">
      <div class="flex-g-1 mrg-l-3 label-combo">
        {{ $t("itemBook1.selectSizeText") }}
      </div>
      <ComboboxInput
        class="combo-size"
        :items="listSize"
        @input="chooseSizeFonts($event)"
        :labelStart="labelFontSize"
        :labal="labelFontSize"
        :labelKey="3"
      />
    </div>
  </div>
</template>
<script>
import { systemFonts } from "@/services/general.js";
import generalConfig from "@/config/general.js";
export default {
  data() {
    return {
      listFonts: [],
      listSize: [
        { label: "1", key: 0, name: "1" },
        { label: "2", key: 0, name: "2" },
        { label: "3", key: 0, name: "3" },
        { label: "4", key: 0, name: "4" },
        { label: "5", key: 0, name: "5" },
        { label: "6", key: 0, name: "6" },
        { label: "7", key: 0, name: "7" },
      ],
    };
  },
  computed: {
    isOnline() {
      return generalConfig.serverConnection == "online";
    },
    labelFont() {
      let a = this.userSettings.settings.fontFamilyTxtBook;
      if (a) return this.listFonts.findIndex((font) => font.label == a);
      return 0; // this.listFonts[0];
    },
    labelFontSize() {
      let a = this.userSettings.settings.fontSizeTxtBook;
      if (a) return a - 1;
      return 3;
    },
    // async listFonts() {
    //   let fonts = await systemFonts().data;
    //   fonts.forEach((font, i) => {
    //     let a = font;
    //     if (a && a.length > 0) {
    //       a = a.split("\\");
    //       a = a[a.length - 1].split(".");
    //       let b = {};
    //       b.label = a[0];
    //       b.name = a[0];
    //       b.key = 0;
    //       fonts[i] = b;
    //     }
    //   });

    //   return fonts;
    // },
  },
  methods: {
    chooseFonts(e) {
      this.$emit("font-family", e.label);
    },
    chooseSizeFonts(e) {
      this.$emit("font-size", e.label);
    },
  },
  async mounted() {
    let fonts,
      fonts1 = [];

    if (this.isOnline) {
      fonts1 = [
        { label: "arial", name: "arial", key: 0 },
        { label: "david", name: "david", key: 0 },
        { label: "frankfuel", name: "frankfuel", key: 0 },
      ];
    } else {
      fonts1 = await systemFonts().data;

      fonts1.forEach((font, i) => {
        let a = font;
        if (a && a.length > 0) {
          a = a.split("\\");
          a = a[a.length - 1].split(".");
          let b = {};
          b.label = a[0];
          b.name = a[0];
          b.key = 0;
          fonts1[i] = b;
        }
      });
    }
    const hebFonts = [
      "aharoni",
      "arial",
      "david",
      "frankfuel",
      "gisha",
      "ariabd",
      "guttman yad",
      "guttman haim",
    ];
    this.listFonts = fonts1.filter((f) =>
      hebFonts.includes(f.name.toLowerCase())
    );
  },
};
</script>
<style lang="scss" scoped>
.custom-text {
  height: 25px;
  //   width: 300px;
}
.label-combo {
  white-space: nowrap;
}
</style>
