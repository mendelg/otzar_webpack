<template>
  <div class="outer-msg-box" :class="{ show: show }" v-zindex.fixed v-body>
    <div class="msg-box" ref="msgbox">
      <titleAndXHeader @click="close">{{ msg.title }}</titleAndXHeader>

      <!-- <baseIcon class="close-popup" nameIcon="x-popup" @click="toggleVisible" /> -->

      <div class="content rtl flex-column">
        <div class="align-center-div1">{{ msg.content }}</div>
        <div>
          <input
            ref="input"
            v-if="msg.input"
            class="align-center-div1"
            v-model="msgInput"
            @keypress.enter="
              clickBtn(msg.input ? { btn: msg.btns[0], msgInput } : msg.btns[0])
            "
          />
          <!--   <baseInput
            style="width:200px"
            @input="msgInput = $event.target.value"
            :text="msgInput"
            @keyup.enter="
              clickBtn(msg.input ? { btn: msg.btns[0], msgInput } : msg.btns[0])
            "
            v-focus
          /> -->
        </div>
      </div>
      <div class="footer">
        <div class="btns margin-auto flex">
          <baseButton
            class="mrg-l-3  "
            v-for="(btn, index) in msg.btns"
            :key="index"
            @click="clickBtn(msg.input ? { btn, msgInput } : btn)"
            >{{ btn }}</baseButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return { msgInput: "" };
  },
  computed: mapState("msgBox", ["show", "msg"]),
  methods: {
    close() {
      if (this.msg.center) {
        this.$refs.msgbox.style.display = "none";
      }
      this.$removeMsg();
    },
    clickBtn(str) {
      if (this.msg.center) {
        this.$refs.msgbox.style.display = "none";
      }
      this.$clickMsg(str);
    },
  },
  updated() {
    if (this.show && this.msg.center) {
      this.$refs.msgbox.style.display = "block";
      this.$refs.msgbox.style.position = "fixed";
      let screenH = document.body.clientHeight;
      let elemH = this.$refs.msgbox.clientHeight;
      this.$refs.msgbox.style.top = screenH / 2 - elemH / 2 + "px";
    }
  },
  mounted() {
    if (this.$refs.input) this.$refs.input.focus();
  },
};
</script>

<style lang="scss" scoped>
$bg-color1: #fff;
.container-popup {
  position: absolute;
  // height: 150px;
  width: 400px;
  top: 0;
  left: 20%;
  background-color: rgba(0, 0, 0, 0.4);
  // background-color: white;
  // border: black solid 2px;
  z-index: 7 !important;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.16);
}
.outer-msg-box {
  height: 0;
  width: 100vw;
  position: fixed;
  overflow: hidden;
  z-index: 9999999999;
  top: 0;
  /* opacity: 0.6; */
  background-color: #d3d2d28c;
  background-color: #0000004a;
  transition: 0.4s;
  transition: opacity 0.15s linear;
  &.show {
    height: 100vh;
    .msg-box {
      transform: translate(-50%, 0);
    }
  }
}

.msg-box {
  width: 440px;
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99;

  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.16);
  position: absolute;
  background-color: $bg-color1;
  transition: -webkit-transform 0.3s ease-out;
  transition: transform 0.3s ease-out;
  transition: transform 0.3s ease-out, -webkit-transform 0.3s ease-out;
  -webkit-transform: translate(-50%, -25%);
  transform: translate(-50%, -25%);

  .content {
    height: 59px;
    margin: auto;
    text-align: center;
    position: relative;
  }
  .footer {
    background-color: #f4f4f4;
    height: 41px;
  }
}
.close-popup-outer .icon-del {
  // top: 10px;
  // left: 0;
  font-size: 8px;
  z-index: 999;
}
</style>
