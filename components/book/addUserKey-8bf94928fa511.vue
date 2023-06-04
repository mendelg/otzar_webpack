<template>
  <div class="container-user-key">
    <div class="flex-column">
      <div>
        <input
          v-model="vkey"
          type="text"
          v-focus
          :placeholder="$t('general.value')"
        />
      </div>
      <div>
        <textarea
          name=""
          v-model="content"
          id=""
          cols="30"
          rows="10"
          :placeholder="$t('general.content')"
        ></textarea>
      </div>
      <div class="flex flex-center">
        <div class="btn-container flex">
          <BaseButton @click="save">{{ $t("general.save") }}</BaseButton>
          <BaseButton v-if="edit" @click="deleteK">{{
            $t("general.delete")
          }}</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["book", "page", "x", "y", "item", "edit", "tabId"],
  data() {
    return {
      vkey: "",
      content: "",
    };
  },
  computed: {
    pageData() {
      try {
        return this.$store.state.tabs[this.tabId].pages.filter(
          (p) => p.id == this.page
        )[0];
      } catch (ex) {
        console.log("Error getting page data >> " + ex.message);
        return {};
      }
    },
  },
  created() {
    if (this.item) {
      this.vkey = this.item.key;
      this.content = this.item.value;
    }
  },
  methods: {
    save() {
      let msg = "";
      if (this.item) {
        //save
        this.$store.dispatch(`personalAdditionsTabs/updKey`, {
          bookId: this.book,
          editKey: {
            id: this.item.id,
            key: this.vkey,
            value: this.content,
          },
        });
        /*  this.$store.dispatch("userPersonalExtensions/updateUserKey", {
          id: this.item.id,
          key: this.vkey,
          value: this.content,
        }); */
        msg = this.$t("keys.success_save");
      } else {
        //add
        let payload = {
          bookId: this.book,
          pageId: this.page,
          x: this.x,
          y: this.y,
          key: this.vkey,
          value: this.content,
          name: this.pageData.name,
          position: this.pageData.position,
          letter: this.pageData.pagedata[0]?.letter || "",
        };
        this.$store.dispatch(`personalAdditionsTabs/addKey`, {
          bookId: this.book,
          newKey: payload,
        });
        // this.$store.dispatch("userPersonalExtensions/addUserKey", payload);
        msg = this.$t("keys.success_add");
      }

      const notification = {
        type: "success",
        message: msg,
        timeout: 2000,
      };
      this.$notify(notification);
      this.$emit("close");
    },
    async deleteK() {
      let msg;
      let payload = {
        title: this.$t("general.remove2"),
        content: this.$t("personalExtensions.okRemoveKey"),
        btns: [this.$t("general.yes"), this.$t("general.no")],
      };
      let act = await this.$msg(payload);
      if (act == this.$t("general.yes")) {
        this.$emit("delete");
        msg = this.$t("personalExtensions.succeedRemoveKey");
      } else return;
      const notification = {
        type: "success",
        message: msg,
        timeout: 2000,
        setting: {
          grid: "icon",
          nameIcon: "icon-garbage-color",
          position: "center",
        },
      };
      this.$notify(notification);
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
.container-user-key {
  background-color: #fff;
  padding: 10px;

  margin: 0 0 auto 0;
  height: 200px;
}
textarea {
  height: 100px;
  font-family: "Heebo", sans-serif;
}
input:focus {
  outline: var(--custom-color1) auto 1px;
}
textarea,
input {
  width: 100%;
  // height: 136px;
  background-color: #f7f7f7;
  border: 1px solid #dedede;
  padding: 4px 8px;
  margin-bottom: 10px;
}
.btn-container {
  width: fit-content;
}
</style>
