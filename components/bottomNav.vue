<template>
  <CurvedBottomNavigation
    foreground-color="var(--custom-color1)"
    badge-color="#FBC02D"
    background-color="var(--border-color6"
    icon-color="black"
    :replaceRoute="true"
    :options="options"
    v-model="selected"
    @update="clicked"
  >
    <template #icon="{ props }">
      <Icons :icon="props.icon" height="18px" width="18px" fill="black" />
    </template>
    <template #title="{ props }">
      <b
        ><i>{{ props.title }}</i></b
      >
    </template>
    <template #child-icon="{ props }">
      <Icons :icon="props.icon" height="18px" width="18px" fill="black" />
    </template>
  </CurvedBottomNavigation>
</template>

<script>
import Icons from "@/components/Icons/Icons.vue";
import { CurvedBottomNavigation } from "bottom-navigation-vue";
export default {
  props: ["mode", "loggedin"],
  data: () => ({
    selected: 2,
  }),
  computed: {
    options() {
      let arr = [];
      /*  arr.push({
        id: 4,
        icon: "grid",
        title: "מפרשי האוצר",
      });
      //  if (this.mode == 4)
      arr.push({
        id: 5,
        icon: "section",
        title: "רשימת מפרשים",
      }); */
      arr.push({
        id: 1,
        icon: "open-book",
        title: "ספר",
        /*  path: { path: "/", query: { mode: "book" } }, */
      });
      arr.push({
        id: 2,
        icon: "rows",
        title: "רשימה",
        /*   path: { path: "/", query: { mode: "list" } }, */
      });

      if (this.loggedin)
        arr.push({
          id: 3,
          icon: "signin",
          title: this.loggedin,
          childs: [
            { icon: "logout", id: 301 },
            { icon: "information", id: 302 },
          ],
        });
      else
        arr.push({
          id: 3,
          icon: "signin",
          title: "התחבר",
          /*   path: { path: "/", query: { mode: "login" } }, */
        });

      return arr;
    },
  },
  components: { CurvedBottomNavigation, Icons },
  watch: {
    mode: function(val) {
      this.selected = val;
    },
  },
  methods: {
    clicked(a) {
      this.$emit("navigate", a);
    },
  },
  mounted() {
    this.$nextTick(() => {
      const elemHeight = this.$el.offsetHeight;

      document.getElementsByClassName(
        "full-mobile"
      )[0].style.height = `calc(100vh - ${elemHeight}px)`;
    });
  },
};
</script>
