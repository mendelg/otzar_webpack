<template>
  <div class="container-user-link">
    <div class="flex-column h-100">
      <div class="flex-g-1">
        <div class="link1 mrg-b-12">
          <div class="text flex flex-bet mrg-b-3">
            <div class="text-title">
              <span class="bold">{{ first.bookName }}</span>
              <!-- <span class=""> / {{ first.authorName }}</span> -->
              <!-- <span>{{ first.bookName }}</span> -->
            </div>
            <div style="min-width: 48px;text-align: left;direction: ltr;">
              <span> | </span>
              <span
                >{{ $t("general.page") }}
                {{ first.letter || first.position }}</span
              >
            </div>
          </div>
          <div class="relative">
            <input
              type="text"
              v-model="first.note"
              v-focus
              class="rtl"
              :placeholder="$t('links1.enterDesc')"
            />
            <BaseButton
              class="btn-small absolute t-4 l-0"
              v-if="!firstonly"
              @click="goToPage(first)"
              >{{ $t("links1.goPage") }}</BaseButton
            >
          </div>
        </div>
        <div class="text-gray" v-if="firstonly">
          {{ $t("links1.desc1") }}
        </div>
        <div class="link1" v-else>
          <div class="text flex flex-bet  mrg-b-3">
            <div>
              <span class="bold">{{ second.bookName }}</span>
              <!-- <span class=""> / {{ second.authorName }}</span> -->
              <!-- <span>{{ second.bookName }}</span> -->
            </div>
            <div style="min-width: 48px;text-align: left;direction: ltr;">
              <span> | </span>
              <span
                >{{ $t("general.page") }}
                {{ second.letter || second.position }}</span
              >
            </div>
          </div>
          <div class="relative">
            <input
              class="rtl"
              type="text"
              v-model="second.note"
              v-focus
              :placeholder="$t('links1.enterDesc')"
            />
            <BaseButton
              class="btn-small absolute t-4 l-0"
              @click="goToPage(second)"
            >
              {{ $t("links1.goPage") }}
            </BaseButton>
          </div>
        </div>
      </div>
      <div class="flex flex-center">
        <div class="btn-container flex" v-if="!firstonly">
          <BaseButton @click="save">{{ $t("general.save") }}</BaseButton>
        </div>
        <div class="btn-container flex" v-if="edit">
          <BaseButton @click="deleteLink">{{
            $t("general.delete")
          }}</BaseButton>
        </div>
        <div class="btn-container flex" v-if="firstonly">
          <BaseButton @click="$emit('close')">{{
            $t("general.cancel")
          }}</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

import mixBook from "@/mixing/mixBook.js";

export default {
  mixins: [mixBook],
  props: ["firstonly", "edit", "item", "tabId"],
  data() {
    return {
      //   link1: null,
      //   link2: null,
      first: {},
      second: {},
    };
  },
  created() {
    if (!this.edit) {
      this.first = { ...this.firstLink };
      if (!this.firstonly) this.second = this.secondLink;
    } else {
      this.first = { ...this.item };
      this.second = { ...this.item.linkedTo };
    }
  },
  methods: {
    ...mapActions("personalAdditionsTabs", ["addLink", "updLink"]),
    async save() {
      let userLink = { firstLink: this.first, secondLink: this.second };
      if (!this.edit) {
        this.addLink(userLink);
      } else {
        this.updLink(userLink);
      }

      const notification = {
        type: "success",
        message: this.$t(
          this.edit ? "links.success_save" : "links.success_add"
        ),
        timeout: 2000,
      };
      this.$notify(notification);

      this.$emit("close");
    },
    async deleteLink() {
      //mixing
      if (await this.deleteExtensItem(this.item, "link")) this.$emit("close");
    },
    goToPage(item) {
      this.$emit("gotoitempage", item);
    },
  },
  computed: {
    ...mapState("personalAdditionsTabs", ["firstLink", "secondLink"]),
  },
  watch: {
    firstLink: function() {
      this.first = { ...this.firstLink };
    },
    secondLink: function() {
      this.second = { ...this.secondLink };
    },
  },
};
</script>

<style lang="scss" scoped>
.container-user-link {
  background-color: #fff;
  padding: 10px;
  margin: 0 0 auto 0;
  height: 220px;
  height: 100%;
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
.btn-small {
  position: absolute;
  top: 3px;
  left: 3px;
}
.text-title {
  max-width: calc(100% - 60px);
  overflow: hidden;
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
