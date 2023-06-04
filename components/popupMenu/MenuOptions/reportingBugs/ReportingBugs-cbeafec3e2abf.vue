<template>
  <div class="bugs-main">
    <HeaderMenu :title="title" :routeBackName="routeBackName" />
    <div class="repo-container">
      <div class="text-area-container b-border">
        <label>{{ $t("userContactDetails.bugDetailsPlaceholder") }}</label>
        <textarea
          class="inputs-data-bloke font"
          @input="setCommentsTextArea"
        ></textarea>
      </div>
      <div class="b-border colum-contact-container">
        <div class="row">
          <label>{{ $t("userContactDetails.nameAndLastname") }}</label>
          <input
            class="input-b-border input-data filled"
            type="text"
            v-bind:value="nameAndLastName"
            @input="setNameAndLastNameDetail($event.target.value)"
          />
        </div>
        <div class="row">
          <label>{{ $t("userContactDetails.phone") }}</label>
          <input
            class="input-b-border input-data filled"
            type="text"
            v-bind:value="phoneNumber"
            @input="setPhoneNumberDetail($event.target.value)"
          />
        </div>
        <div class="row">
          <label>{{ $t("userContactDetails.email") }}</label>
          <input
            autocomplete="email"
            class="input-b-border input-data filled"
            type="text"
            v-bind:value="emailAddress"
            @input="setEmailAddressDetail($event.target.value)"
          />
        </div>
      </div>
      <div v-if="fieldError" class="email-error">
        {{ $t("userContactDetails.fieldError") }}
      </div>
      <p class="required-fields">
        {{ $t("userContactDetails.requiredFields") }}
      </p>
      <div class="flex-r">
        <div v-for="error in errors" :key="error" class="email-error">
          {{ error }}
        </div>
      </div>
    </div>
    <div class="send-email-block">
      <button class="btn send-email-btn font" @click="sendEmail">
        {{ $t("userContactDetails.send") }}
      </button>
    </div>
  </div>
</template>

<script>
import * as userSendEmail from "@/services/userSendEmail.js";
import menuService from "@/services/menu";
export default {
  data() {
    return {
      title: this.$t("mainMenu.repoBugsName"),
      routeBackName: "menu-options",
      phoneNumber: "",
      nameAndLastName: "",
      emailAddress: "",
      userCommentsDetails: "",
      fieldError: false,
      errors: [],
    };
  },
  methods: {
    setCommentsTextArea(e) {
      this.userCommentsDetails = e.currentTarget.value;
    },
    setPhoneNumberDetail(e) {
      this.phoneNumber = e;
    },
    setNameAndLastNameDetail(e) {
      this.nameAndLastName = e;
    },
    setEmailAddressDetail(e) {
      this.emailAddress = e;
    },
    async sendEmail() {
      //validation
      this.errors = [];
      var val = this.phoneNumber;

      var regExp = /[a-zA-Zא-ת]/g;

      if (val.match(regExp))
        this.errors.push(this.$t("userContactDetails.phoneError"));

      if (
        this.nameAndLastName == "" ||
        this.userCommentsDetails == "" ||
        val == "" ||
        (globalThis.SERVER_MODE == "online" && this.emailAddress == "")
      )
        this.errors.push(this.$t("userContactDetails.requiredError"));

      if (this.errors.length > 0) return;

      let content =
        this.$t("reportingBugs.nameclient") +
        ": " +
        this.nameAndLastName +
        "\n" +
        this.$t("reportingBugs.phone") +
        ": " +
        this.phoneNumber;
      if (this.emailAddress != "") {
        content =
          content +
          "\n" +
          this.$t("reportingBugs.email") +
          ": " +
          this.emailAddress;
      }

      content = content + "\n\n" + this.userCommentsDetails;
      let type = "SUPPORT";
      let contactDetails = {
        content,
        type,
      };
      let message = "",
        messtype = "success";
      if (await userSendEmail.postUserSendSystemEmail(contactDetails)) {
        message = "נשלח בהצלחה";
        messtype = "success";
      } else {
        message = "תקלה בשליחת המייל";
        messtype = "error";
      }

      const notification = {
        type: messtype,
        message,
        timeout: 2000,
      };
      this.$notify(notification);
      menuService.closeMenu();
    },
  },
};
</script>

<style lang="scss" scoped>
$bg-color2: #f7f7f7;
$bg-color5: #f4f4f4;
.bugs-main {
  width: 100%;
}
.repo-container {
  margin-top: 20px;
}
.required-fields {
  color: var(--custom-color1);
  margin: 0 20px;
  font-weight: bold;
}
.text-area-container {
  padding: 0 20px;
  .inputs-data-bloke {
    resize: none;
    width: 100%;
    height: 200px;
    // margin: 6px;
    line-height: 20px;
    background-color: $bg-color2;
    // margin-top: 3px;
    border: 1px solid #afafaf;
    margin-bottom: 0;
  }
}
.colum-contact-container {
  display: flex;
  flex-direction: column;
  padding: 0px 10px 0px 10px;
  overflow: auto;
  box-sizing: border-box;
  width: 100%;
  padding: 20px 20px 20px;
  input.input-border.filled + label {
    margin-bottom: 20px !important;
  }
  input.input-border.filled + label span {
    height: 14px;
    line-height: 14px;
    font-size: 10px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.3);
  }
  .input-border.filled:focus + label span {
    color: var(--custom-color1);
  }
  label {
    // color: #c6c6c6;
  }
}
.input-data {
  width: 100%;
  display: flex;
  border: none;
  //margin: 0px 4px 0px 0px;
  border-bottom: 1px solid #dedede;
  background: none;
  margin-bottom: 14px;
  //width: -webkit-fill-available;
}
.send-email-block {
  display: flex;
  justify-content: center;
  height: 60px;
  margin-top: auto;
  background-color: $bg-color5;
  height: 60px;
  border: 1px solid #dedede;
  padding: 0 10px;
  position: absolute;
  width: 100%;
  bottom: 0;
}
.send-email-btn {
  width: auto;
  padding: 0 10px;
  margin: 14px 0;
}
.email-error {
  color: red;
  margin: 0 20px;
}
</style>
