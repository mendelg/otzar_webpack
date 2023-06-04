<template>
  <div id="login" class="inputs-border">
    <h1>{{ $t("login.createdUser") }}</h1>
    <div>
      <input
        class="input-border"
        :class="{ filled: !emptyFirstname }"
        type="text"
        name="firstname"
        v-model="input.firstname"
        @keydown.enter="createUser"
      />
      <label for="firstname">
        <span>{{ $t("login.name") }}</span>
      </label>
      <input
        class="input-border"
        :class="{ filled: !emptyLastname }"
        type="text"
        name="lastname"
        v-model="input.lastname"
        @keydown.enter="createUser"
      />
      <label for="lastname">
        <span>{{ $t("login.lastName") }}</span>
      </label>
      <input
        class="input-border"
        :class="{ filled: !emptyUser }"
        type="text"
        name="username"
        v-model="input.username"
        @keydown.enter="createUser"
      />
      <label for="username">
        <span>{{ $t("login.user") }}</span>
      </label>
      <input
        class="input-border"
        type="password"
        name="password"
        v-model="input.password"
        :class="{ filled: !emptyPass }"
        @keydown.enter="createUser"
      />
      <label for="password">
        <span>{{ $t("login.password") }}</span>
      </label>
    </div>

    <button
      class="btn-border"
      type="button"
      v-on:click="createUser()"
      style="width: 200px; margin-bottom: 0px; margin-top: 40px"
    >
      {{ $t("login.creatNeweUser") }}
    </button>
    <div>{{ errorMsg }}</div>
  </div>
</template>

<script>
import { Axios } from "@/services/_axios";
import init from "@/config/init.js";
export default {
  props: {
    to: {
      default: "/",
    },
  },
  data() {
    return {
      input: {
        username: "",
        password: "",
        firstname: "",
        lastname: "",
      },
      errorMsg: "",
      show: false,
    };
  },
  computed: {
    emptyUser() {
      if (this.input.username != "") return false;
      return true;
    },
    emptyFirstname() {
      if (this.input.firstname != "") return false;
      return true;
    },
    emptyLastname() {
      if (this.input.lastname != "") return false;
      return true;
    },
    emptyPass() {
      if (this.input.password != "") return false;
      return true;
    },
  },
  methods: {
    createUser() {
      let username = this.input.username;
      let firstName = this.input.firstname;
      let lastName = this.input.lastname;
      let password = this.input.password;
      if (
        this.emptyUser ||
        this.emptyPass ||
        this.emptyLastname ||
        this.emptyFirstname
      ) {
        alert(this.$t("createBook1.noDetailes"));
        return;
      }
      let url = init.getServer() + "api/user";
      Axios.post(url, { username, password, firstName, lastName })
        .then((e) => {
          alert(this.$t("login1.createUserSuccess"));
          this.$router.push({ name: "login" });
        })
        .catch((err) => {
          console.dir(err.response.status);
          if (err.response.status == 409) {
            alert(this.$t("login1.tryOtherName"));
          } else {
            console.error(err);
            alert(this.$t("login.errorCreateUser"));
          }
        });
      // this.login({
      //   username: this.input.username,
      //   password: this.input.password
      // })
      //   .then(() => {
      //     // console.dir(this);
      //     this.$router.push(this.to);
      //   })
      //   .catch((error) => {
      //     this.errorMsg = error.response.statusText;
      //     console.error(error);
      //   });
    },
  },
};
</script>

<style scoped lang="scss">
$bg-color1: #fff;
#login {
  width: 500px;
  border: 1px solid #cccccc;
  background-color: $bg-color1;
  margin: auto;
  margin-top: 200px;
  padding: 20px;
  direction: rtl;
  position: relative;
  padding: 35px;
  border-radius: 11px;
  border-style: dotted;
}
</style>
