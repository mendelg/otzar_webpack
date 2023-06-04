<template>
  <div id="app1">
    <div class="container">
      <!-- <div>{{ percent }}%</div>
      <div>{{percentage}}</div>-->
      <div :class="[loadingClass, defaultLoadingClass]">
        <div
          v-show="show"
          ref="scroller"
          class="percentage"
          :class="{ animation: !ani }"
          :style="{ width: percent + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    time: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    loadingClass: {
      type: String,
      default: "loading-bar",
    },
    defaultLoadingClass: {
      type: String,
      default: "loading-bar",
    },
    stopAnimation: {
      type: Boolean,
      default: false,
    },
    auto: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      percentage1: this.percentage,
      animation: "animation",
      temp: 0,
    };
  },
  computed: {
    percent() {
      return this.auto ? this.percentage1 : this.percentage;
    },
    ani() {
      if (this.auto) return false;
      // return this.animation;
      if (this.percentage < this.temp) return true;
      return false;
    },
    chang() {},
  },
  watch: {
    percentage: function() {
      if (this.percentage != this.percentage1) {
        this.temp = this.percentage;
      }
    },

    stopAnimation: {
      immediate: true,
      handler(val, oldVal) {
        val ? (this.animation = "") : (this.animation = "animation");
        //this.$refs.scroller.style.webkitAnimationPlayState = "paused";

        //this.$refs.scroller.style.webkitAnimationPlayState = "running";
      },
    },
  },

  created() {
    if (this.auto == true && this.time > 0) {
      var intval = setInterval(() => {
        if (this.percentage1 < 100) this.percentage1 += 1.1;
        //else clearInterval(intval);
      }, this.time / 100);
    }
  },
};
</script>

<style lang="scss" scoped>
$bg-color5: #f4f4f4;
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.container {
  text-align: right;
  font-size: 8rem;
  color: #555;
}

.loading-bar {
  position: relative;
  width: 355px;
  height: 7px;
  border-radius: 4px;
  overflow: hidden;
  background-color: $bg-color5;
  /* border-bottom: 1px solid #ddd; */
  /* -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.4), 0 -1px 1px #fff, 0 1px 0 #fff; */
  // box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.4), 0 -1px 1px #fff, 0 1px 0 #fff;
  .percentage {
    position: absolute;
    /* top: 1px; */
    /* left: 1px; */
    right: 1px;
    display: block;
    height: 100%;
    border-radius: 4px;
    background-color: var(--custom-color1);
  }
  .animation {
    animation: animate-stripes 3s linear infinite;
    transition: 0.3s;
  }
}

.fsloadingbar {
  width: 100% !important;
  padding-right: 6px;
  padding-left: 6px;
}

@keyframes animate-stripes {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 60px 0;
  }
}

/* Youtube Link */
#yt_link {
  position: absolute;
  right: 0;
  left: 0;
  bottom: -200px;
  display: block;
  width: 160px;
  text-align: center;
  color: #fff;
  font-size: 15px;
  text-decoration: none;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  padding: 10px;
  margin: 0 auto;
  background-color: red;
  border-radius: 2px;
  animation: showYtLink 1.5s ease 3s forwards;
}

@keyframes showYtLink {
  0% {
    bottom: -200px;
  }
  100% {
    bottom: 20px;
  }
}
</style>
