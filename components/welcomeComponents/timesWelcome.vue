<template>
  <div class="flex-column">
    <div class="flex times flex-g-1">
      <div class="time-day  fade-in-2">
        <div class="title-color mrg-b-12">
          {{ $t("welcome.timeDay") }}
        </div>
        <ComboboxInput
          class="fit-height"
          :labal="label"
          :labelKey="label"
          :items="place"
          @input="selectPlace($event)"
          :labelStart="labelStart"
        />
      </div>
      <!-- <div class="flex flex-bet"> -->

      <div
        class="time-icon flex  fade-in-2 flex-right flex-g-1"
        style="max-width: fit-content;}"
      >
        <div class="item-time">
          <BaseIcon
            width="27.714"
            height="29.909"
            nameIcon="icon-wel-1"
            pathIcon="icons-welcom"
            class="mrg-b-6 pop"
          />
          <div class="time">
            <div class="mrg-b-6">
              {{ $t("wellcome1.Dawn") }}
            </div>
            <span class="space"> &nbsp;</span>
            <div class="hour">{{ alot_hashachar }}</div>
          </div>
        </div>
        <div class="item-time">
          <BaseIcon
            width="27.714"
            height="29.909"
            nameIcon="icon-wel-2"
            pathIcon="icons-welcom"
            class="mrg-b-6 pop"
          />
          <div class="time">
            <div class="mrg-b-6">{{ $t("wellcome1.sunrise") }}</div>
            <span class="space"> &nbsp;</span>
            <div class="hour">{{ neitz_hachama }}</div>
          </div>
        </div>
        <div class="item-time">
          <BaseIcon
            width="27.714"
            height="29.909"
            nameIcon="icon-wel-3"
            pathIcon="icons-welcom"
            class="mrg-b-6 pop"
          />
          <div class="time">
            <div class="mrg-b-6">{{ $t("wellcome1.midnight") }}</div>
            <span class="space"> &nbsp;</span>
            <div class="hour">{{ chatzot }}</div>
          </div>
        </div>
        <div class="item-time">
          <BaseIcon
            width="27.714"
            height="29.909"
            nameIcon="icon-wel-4"
            pathIcon="icons-welcom"
            class="mrg-b-6 pop"
          />
          <div class="time">
            <div class="mrg-b-6">{{ $t("wellcome1.sunset") }}</div>
            <span class="space"> &nbsp;</span>
            <div class="hour">{{ shkiah }}</div>
          </div>
        </div>
        <div class="item-time">
          <BaseIcon
            width="27.714"
            height="29.909"
            nameIcon="icon-wel-5"
            pathIcon="icons-welcom"
            class="mrg-b-6 pop"
          />
          <div class="time">
            <div class="mrg-b-6">{{ $t("wellcome1.risingStar") }}</div>
            <div class="hour">{{ tzeit }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="time-status border-t-light fade-in-2">
      <div class=" status" style="line-height: 18px;">
        <div class="item-stat">
          {{ $t("wellcome1.day") }} {{ yom }}<span class="space">&nbsp;</span
          >{{ hebDate }}
        </div>
        <div class="item-stat h-s">
          {{ $t("wellcome1.dafYumi") }} {{ dafYomi }}
        </div>
        <div class="item-stat h-s">
          {{ $t("wellcome1.parashat") }}{{ parasa }}
          <template v-if="specialShabat"
            >-
            {{ $t("welcome.hag") }}
          </template>
        </div>
        <div class="item-stat">
          {{ $t("wellcome1.candleLight") }} {{ nerot }}
        </div>
        <div class="item-stat">
          {{ $t("wellcome1.sabbatEnd") }} {{ havdala }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const Hebcal = require("hebcal");
const moment = require("moment");

//var  this.cheb = new Hebcal.HDate();

// window.hb =  this.cheb;
export default {
  data() {
    return {
      label: "ירושלים",
      labelKey: 0,
      labelStart: 0,
      reload: false,
      city: "Jerusalem",
      place: [
        { label: "ירושלים", hname: "Jerusalem", key: 0 },
        { label: "בני ברק", hname: "Tel Aviv", key: 1 },
        { label: "חיפה", hname: "Haifa", key: 2 },
        { label: "אשדוד", hname: "Ashdod", key: 3 },
      ],
      chebInterval: null,
      cheb: new Hebcal.HDate(),
    };
  },
  methods: {
    selectPlace(event) {
      this.$emit("city", { name: event.hname, label: event.label });
      this.city = event.hname;
      this.cheb.setCity(event.hname);
      this.reload = !this.reload;
    },
  },
  computed: {
    hcal() {
      let x = this.reload;
      return this.cheb;
    },
    zemanim() {
      let times = this.hcal.getZemanim();
      Object.keys(times).forEach((key) => {
        times[key] = convertTZ(times[key], "Asia/Jerusalem");
      });
      return times;
      return this.hcal.getZemanim();
    },
    alot_hashachar() {
      return moment(this.zemanim.alot_hashachar).format("HH:mm");
    },
    chatzot() {
      return moment(this.zemanim.chatzot).format("HH:mm");
    },
    shkiah() {
      return moment(this.zemanim.shkiah).format("HH:mm");
    },
    tzeit() {
      return moment(this.zemanim.tzeit).format("HH:mm");
    },
    neitz_hachama() {
      return moment(this.zemanim.neitz_hachama).format("HH:mm");
    },
    parasa() {
      return this.hcal.getParsha("h")[0]; // h for hebrew
    },
    dafYomi() {
      return this.hcal.dafyomi("h");
    },
    hebDate() {
      return this.hcal.toString("h");
    },
    nerot() {
      let shihi = this.hcal.nearest(5);
      let mins = 0;
      switch (this.city) {
        case "Jerusalem":
          mins = 10;
          break;
        case "Tel Aviv":
          // mins = 20;
          break;
      }
      return moment(convertTZ(shihi.candleLighting(), "Asia/Jerusalem"))
        .subtract(mins, "minutes")
        .format("HH:mm");
    },
    specialShabat() {
      return !this.hcal.isSedra();
    },
    havdala() {
      let shabat = this.hcal.nearest(6);
      return (
        moment(convertTZ(shabat.havdalah(), "Asia/Jerusalem"))
          // .add(22, "minutes")
          .format("HH:mm")
      );
    },
    yom() {
      let alefChar = "א".charCodeAt(0);
      let dayNum = this.hcal.getDay();
      return String.fromCharCode(alefChar + dayNum);
    },
  },
  created() {
    moment.parseZone();

    //moment.tz.setDefault("Asia/Jerusalem");
    let luach_city = this.userSettings.settings.luach_city || "";
    if (luach_city === "") {
      this.cheb.setCity("Jerusalem");
      this.city = "Jerusalem";
    } else {
      let find = this.place.filter((p) => p.label === luach_city);
      if (find.length > 0) {
        this.label = find[0].label;
        this.labelStart = find[0].key;
        this.cheb.setCity(find[0].hname);
        this.city = find[0].hname;
      }
    }
  },
  mounted() {
    //this.cheb = new Hebcal.HDate();
    // this.dafYomi =  this.cheb.dafyomi("h");

    this.chebInterval = setInterval(() => {
      this.cheb = new Hebcal.HDate();
      this.cheb.setCity(this.city || "Jerusalem");
      this.$emit("hebCal", this.cheb);
    }, 1000 * 60);
  },
  destroyed() {
    clearInterval(this.chebInterval);
  },
};

function convertTZ(date, tzString) {
  return new Date(
    (typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: tzString,
    })
  );
}
</script>

<style lang="scss" scoped>
.grid {
  display: grid;
}
.times {
  padding: 1rem;
  padding-bottom: 1rem;
}
.time-day {
  // grid-column-start: 1;
  // grid-column-end: 1;
  // display: flex;
  // justify-content: center;
  // grid-column-start: 1;
  // grid-column-end: 1;
  // margin-top: 0;

  .title-color {
    margin-bottom: 6px !important;
    line-height: 10px;
    margin-top: 5px;
  }
}
.time-status {
  // grid-row-start: 2;
  // grid-row-end: 3;
  box-shadow: 5px 3px 6px rgb(0 0 0 / 16%);
  background-color: #fff;
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row: 2;

  color: var(--custom-color1);
  // margin-right: -24px;
  // margin-left: -24px;
  padding: 0 24px;

  display: flex;
  align-items: center;
  min-height: 30px;
  .status {
    margin: 0 auto;
    display: flex;
  }
}
.time-icon {
  // grid-column-start: 2;
  // grid-column-end: 4;
  // grid-row-start: 1;
  margin-right: auto;
  // grid-row-end: 3;
  align-items: center;
  .space {
    display: none;
  }
}
</style>
