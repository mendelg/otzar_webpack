<template>
  <div class="flex-column h-100">
    <div class="content flex-g-1 flex-column flex">
      <div class="title padd-b-12 padd-r-12 rtl">
        {{ $t("advancSearchBook.text1") }}
      </div>
      <div class=" flex-column flex-center input-rtl">
        <div class="mrg-b-12 ">
          <input
            id="bookname"
            v-focus
            v-model="name"
            class="input-border"
            type="text"
            :placeholder="$t('advancSearchBook.nameBook')"
            @keydown.enter="search"
          />
        </div>
        <div class="mrg-b-12">
          <input
            v-model="author"
            class="input-border"
            type="text"
            :placeholder="$t('advancSearchBook.author')"
            @keydown.enter="search"
          />
        </div>
        <div class="mrg-b-12">
          <input
            v-model="year"
            class="input-border"
            type="text"
            :placeholder="
              $t('advancSearchBook.yearPrint') +
                $t('advancSearchBook.yearPrint2')
            "
            @keydown.enter="search"
          />
        </div>
        <div class="mrg-b-12">
          <input
            v-model="place"
            class="input-border"
            type="text"
            :placeholder="$t('advancSearchBook.placePrint')"
            @keydown.enter="search"
          />
        </div>
      </div>
    </div>
    <footer class="footer flex-center w-100">
      <BaseButton class="" @click="clear">
        {{ $t("freeSearchInput.clear") }}
      </BaseButton>
      <BaseButton class="w-fit-content" @click="search">
        {{ $t("freeSearchInput.search") }}
      </BaseButton>
    </footer>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      name: "",
      author: "",
      place: "",
      year: "",
    };
  },
  methods: {
    ...mapActions("bookList", ["setSearchTo"]),
    search() {
      let searchTxt = "";
      this.name.trim() != "" ? (searchTxt += "ספר:" + this.name + "&") : "";
      this.author.trim() != ""
        ? (searchTxt += "מחבר:" + this.author + "&")
        : "";
      this.year.trim() != "" ? (searchTxt += "שנה:" + this.year + "&") : "";
      this.place.trim() != "" ? (searchTxt += "מקום:" + this.place + "&") : "";

      if (searchTxt != "") {
        //set search in booklist search text
        this.setSearchTo("|" + searchTxt.slice(0, -1) + "|");
        this.clear();
        this.$emit("close");
      }
    },
    clear() {
      this.name = this.author = this.place = this.year = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  padding: 12px;
  padding-top: 20px;
}
.footer {
  display: flex;
  align-items: center;
  padding: 0 !important;
  margin: auto;
  height: 41px;
  background-color: #f7f7f7;
}
.input-border {
  width: 273px;
  margin: 0 auto;
  display: block;
}
</style>
