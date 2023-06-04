<template>
  <div class="outer-login font">
    <img v-if="!freeuser" alt />
    <LoginForm v-show="!freeuser" :to="$route.params.refer" />
  </div>
</template>

<script>
import LoginForm from "@/components/Login.vue";
import config from "@/config/general";

export default {
  computed: {
    freeuser() {
      return false;
      return (
        globalThis.DEV_CONNECT_USER_TO_FREE_AUTO &&
        config.serverConnection === "online"
      );
    },
  },
  name: "Login",
  components: { LoginForm },
};
</script>
