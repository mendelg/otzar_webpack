<template>
  <div class="book-details-container" @contextmenu="openContexMenu">
    <!-- <div class="header drag">
      <span>{{ $t("bookDetails.header") }}</span>
      <div class="darg-circle"></div>
      <div
        class="close-popup otz-icon"
        @click="closeWindow"
        style="position: absolute; left: 0;"
      >
        F
      </div>
    </div> -->

    <div class="content" :class="{ 'hide-shaar': hideShaar }">
      <!-- <spinnerCircle /> -->
      <div ref="imgContainer" v-if="!hideShaar" class="right">
        <img ref="shaar" @error="hideShaar = true" @load="resizeImage" />
      </div>
      <div class="left">
        <div class="tabs-container" v-version.up="21">
          <div
            class="details-tab"
            :class="{ active: currentTab == 0 }"
            @click="currentTab = 0"
          >
            {{ $t(`wellcome1.otzar`) }}
          </div>
          <div
            v-if="getBibInfo.length"
            class="details-tab"
            :class="{ active: currentTab == 1 }"
            @click="currentTab = 1"
          >
            {{ $t(`bibDetails.title`) }}
          </div>
          <div
            v-if="getLeumiInfo.length"
            class="details-tab"
            :class="{ active: currentTab == 2 }"
            @click="currentTab = 2"
          >
            {{ $t(`leumiDetails.title`) }}
          </div>
        </div>
        <template v-if="currentTab == 0">
          <div class="details-container">
            <div class="details-item">
              <p class="item label">{{ $t("bookDetails.bookName") }}:</p>
              <p class="selectable-text item dscription">{{ bookName }}</p>
            </div>
            <div class="details-item">
              <p class="item label">{{ $t("bookDetails.bookAuthor") }}:</p>
              <p class="selectable-text item dscription">{{ bookAuthor }}</p>
            </div>

            <div v-if="bookPlaces != ''" class="details-item">
              <p class="item label">{{ $t("bookDetails.bookPlace") }}:</p>
              <p class="selectable-text item dscription">{{ bookPlaces }}</p>
            </div>

            <div v-if="bookYears != ''" class="details-item">
              <p class="item label">{{ $t("bookDetails.bookYear") }}:</p>
              <p class="selectable-text item dscription">{{ bookYears }}</p>
            </div>

            <div v-if="subjects != ''" class="details-item">
              <p class="item label">{{ $t("bookDetails.subjects") }}:</p>
              <p class="selectable-text item dscription">{{ subjects }}</p>
            </div>

            <div
              v-show="bookAddNames && bookAddNames.length"
              class="details-item"
            >
              <p class="item label">{{ $t("bookDetails.addNames") }}:</p>
              <p class="selectable-text item dscription">
                {{ bookAddNames.map((n) => `[${n}]`).join(" ") }}
              </p>
            </div>

            <div v-show="bookAddAuthors.length > 0" class="details-item">
              <p class="item label">{{ $t("bookDetails.addAuthors") }}:</p>
              <p class="selectable-text item dscription">
                {{ additionalAuthors }}
              </p>
            </div>

            <div class="details-item">
              <p class="item label">{{ $t("bookDetails.bookId") }}:</p>
              <p class="selectable-text item dscription">
                {{ bookDetails ? bookDetails.id : "" }}
              </p>
            </div>
          </div>
        </template>
        <template v-if="currentTab == 1">
          <div class="details-container">
            <div v-for="item in getBibInfo" :key="item">
              <div class="details-item" v-if="bibliDetails[item]">
                <p class="item label">{{ $t(`bibDetails.${item}`) }}:</p>
                <p class="selectable-text item dscription">
                  {{ bibliDetails[item] }}
                </p>
              </div>
            </div>
          </div>
        </template>
        <template v-if="currentTab == 2">
          <div class="details-container">
            <div v-for="item in getLeumiInfo" :key="item">
              <div class="details-item" v-if="leumiDetails[item]">
                <p class="item label">{{ $t(`leumiDetails.${item}`) }}:</p>
                <p
                  v-if="item == 'catId' && $store.state.hasInternet"
                  class="selectable-text item dscription link"
                >
                  <a @click="openLeumiLink(leumiDetails[item])">
                    {{ leumiDetails[item] }}
                  </a>
                </p>
                <p v-else class="selectable-text item dscription">
                  {{ leumiDetails[item] }}
                </p>
              </div>
            </div>
          </div>
        </template>
        <!--  <template v-version.up="21">
          <p
            class="selectable-text"
            v-if="bibliInfo.length"
            style="cursor:pointer"
            @click="showBibliInfo = !showBibliInfo"
          >
            למידע ביביליוגרפי נוסף לחץ כאן
          </p>
          <div style="width:100%" v-if="showBibliInfo">
            <template v-if="getBibInfo[0]">
              <h3>מפעל הביביליוגרפיה:</h3>
              <p v-for="b in Object.keys(getBibInfo[0])" :key="b">
                {{ b }}:{{ getBibInfo[0][b] }}
              </p>
            </template>
          
            <template v-if="getLeumitInfo[0]">
              <h3>הספריה הלאומית:</h3>
              <p v-for="b in Object.keys(getLeumitInfo[0])" :key="b">
                {{ b }}:{{ getLeumitInfo[0][b] }}
              </p>
            </template>
        
          </div>
        </template> -->
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import init from "@/config/init.js";
import * as bookData from "@/services/bookData.js";
import imgCode from "@/utils/imgUrlEnc";
import { Axios } from "@/services/_axios";
import { fetchBookByID } from "@/services/loadBooksDataFromServer.js";
export default {
  props: ["bookid", "triggerResize"],
  data() {
    return {
      subjects: "",
      book: this.bookid,
      hideShaar: false,
      bookDetails: {},
      bibliDetails: {},
      leumiDetails: {},
      bibliInfo: [],
      showBibliInfo: false,
      currentTab: 0,
    };
  },
  watch: {
    bookid: {
      // immediate: true,
      handler(val, oldVal) {
        this.getImage();
        this.getSubjects();
        this.getBibliInfo();
      },
    },
    triggerResize: {
      handler(val, oldVal) {
        this.resizeImage();
      },
    },
  },
  mounted() {
    this.getImage();
    this.getSubjects();
    this.getBibliInfo();
  },
  computed: {
    ...mapGetters("books", ["getBookbyId"]),

    additionalAuthors() {
      return this.bookAddAuthors
        .map((a) => {
          return `[${a}]`;
        })
        .join(" ");
    },
    getBibInfo() {
      return Object.keys(this.bibliDetails) || [];
    },
    getLeumiInfo() {
      return Object.keys(this.leumiDetails) || [];
    },
    isBookPage() {
      return this.$route.name == "bookOnly";
    },
    bookName() {
      if (!this.bookDetails) return "";
      return bookData.getBookName(
        this.bookDetails?.name,
        this.bookDetails?.volume,
        true
      );
    },

    idd() {
      return this.bookid;
    },
    x() {
      let wWindow = window.winSizes.innerWidth;
      // let left = wWindow / 2 - this.w / 2;
      let left = wWindow / 2 - 210;
      if (left < 0) return 0;
      return left;
    },
    y() {
      let hWindow = window.winSizes.innerHeight;
      // let top = hWindow / 2 - this.h / 2;
      let top = hWindow / 2 - 296;
      if (top < 0) return 0;
      return top;
    },
    bookAuthor() {
      let author = this.bookDetails?.mainAuthorName;

      // author = author.filter((au) => au.authorTypeId == 1);

      return author;
    },

    bookAddNames() {
      if (this.isBookPage) {
        if (!this.bookDetails?.addnames) return [];
        return this.bookDetails?.addnames.map((b) => b.name);
      }
      let len = this.bookDetails.addnames_length;
      let ret = [];
      for (let i = 0; i < len; i++) {
        const name = this.bookDetails[`addnames_${i}_name`];
        ret.push(name);
      }
      // let authors = author.filter((au) => au.authorTypeId == 2);

      return ret;
    },
    bookAddAuthors() {
      if (this.isBookPage) {
        if (!this.bookDetails?.authors) return [];
        return this.bookDetails?.authors
          .filter((b) => b.authorTypeId == 2)
          .map((b) => b.name);
      }
      let authlen = this.bookDetails.authors_length;
      let ret = [];
      for (let i = 0; i < authlen; i++) {
        if (this.bookDetails[`authors_${i}_authorTypeId`] == 1) continue;
        const name = this.bookDetails[`authors_${i}_name`];
        ret.push(name);
      }
      // let authors = author.filter((au) => au.authorTypeId == 2);

      return ret;
    },
    bookPlaces() {
      return this.bookDetails?.places;
    },
    bookYears() {
      let yearFrom = this.bookDetails?.fromyear;
      let yearTo = this.bookDetails?.toyear;
      if (!yearFrom) yearFrom = yearTo;
      if (!yearTo) yearTo = yearFrom;
      return yearFrom == yearTo ? yearTo : yearFrom + " - " + yearTo;
    },

    getShaar() {
      let url =
        init.getServer() +
        init.BooksDB.bookImages +
        init.BooksDB.byPos +
        "/" +
        this.bookid +
        "/0" +
        "?c=" +
        imgCode(this.bookid, 0);
      return url;
    },
  },
  methods: {
    ...mapActions("bookPopups", ["closeBookDetails"]),
    openLeumiLink(id) {
      if (this.$store.state.kiosk) return;
      window.open(this.getLeumiLink(id));
    },
    getLeumiLink(id) {
      return `https://merhav.nli.org.il/primo-explore/search?query=any,contains,${id}&tab=default_tab&search_scope=Local&vid=NLI&lang=iw_IL&offset=0`;
    },
    openContexMenu(e) {
      return true;
    },
    resizeImage() {
      let imgRatio =
        this.$refs.shaar.naturalHeight / this.$refs.shaar.naturalWidth;
      let contHeight = this.$refs.imgContainer.clientHeight;
      let contWidth = this.$refs.imgContainer.clientWidth;
      let contRatio = contHeight / contWidth;

      if (imgRatio < contRatio) {
        this.$refs.shaar.style.width = "100%";
        this.$refs.shaar.style.height = "auto";
      } else {
        this.$refs.shaar.style.height = "100%";
        this.$refs.shaar.style.width = "auto";
      }
    },
    async getImage() {
      let bookId = this.bookid;
      let pageId = 1;

      try {
        if (this.otzarBook.type(bookId) == "system") {
          let pageName = await Axios.get(
            `/api/books/pageName/${bookId}/${pageId}`
          );
          pageId = pageName.data;
        }

        let imageData;
        try {
          imageData = await bookData.getImageObject(
            bookId,
            pageId,
            "image",
            false,
            {
              resize: 200,
            },
            null,
            1
          );
        } catch (ex) {
          console.log(ex);
        }
        // if (this.otzarBook.type(this.bookId) != "system") {
        //   //we deal with pdf
        //   imageData = await bookData.getPdfPageAsImage(imageData.pdf, 1);
        // }

        let isCnv =
          imageData instanceof HTMLCanvasElement ||
          (typeof OffscreenCanvas !== "undefined" &&
            imageData instanceof OffscreenCanvas);
        if (!isCnv) {
          //TODO draw image on canvas for online
          imageData = imageData.picture;
        }

        const picDom = this.$refs.shaar;
        if (
          typeof OffscreenCanvas !== "undefined" &&
          imageData instanceof OffscreenCanvas
        ) {
          const picdata = await imageData.convertToBlob();
          loadBlobToImg(picdata);
        } else {
          imageData.toBlob((picdata) => loadBlobToImg(picdata));
        }

        // picDom.width = w;
        //  picDom.height = h;
        function loadBlobToImg(blob) {
          let reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.addEventListener(
            "loadend",
            () => {
              let contents = reader.result;
              picDom.src = contents;
            },
            { once: true }
          );
        }
      } catch (ex) {
        this.hideShaar = true;
      }
    },
    closeWindow() {
      this.$emit("book-details", false);
      this.closeBookDetails();
    },

    async getSubjects() {
      // let x = this.bookid;
      let subjects = await bookData.getBookSubjects([this.bookid]);
      if (subjects.data.length == 0) return "";

      let allSubjects = subjects.data[0].categories;
      let mainSubjects = allSubjects.filter((cat) => cat.level == 1);
      let subStr = mainSubjects.map((sub) => sub.title);
      subStr = subStr.join(", ");
      this.subjects = subStr;

      //return x;
    },
    async getBibliInfo() {
      try {
        let data = await bookData.getBibliInfoOfBook(this.bookid);
        if (data.length == 0) return;

        this.bibliInfo = data[0];
        this.setBibliDetails(data[0][0][1][0]);
        this.setLeumiDetails(data[0][0][0][0]);
      } catch (ex) {
        //console.log(ex);
      }
    },
    setBibliDetails(details) {
      if (!details) return;

      this.bibliDetails = {
        bibId: details.bibId || null,
        bookName: details["כותר"] || null,
        bookName2: details["כותר אחיד נוסף"] || null,
        preHeader: details["כותר מקדים"] || null,
        bookHeader3: details["כותר נוסף"] || null,
        publisher2: details["מדפיס נוסף"] || null,
        edition: details["מהדורה"] || null,
        addMul: details["מול נוסף"] || null,
        mul: details["מוציא לאור"] || null,
        author: details["מחבר"] || null,
        addAuthor: details["מחבר נוסף"] || null,
        collection: details.אוסף || null,
        addAuthors: details["אישים נוספים"] || null,
        publisher: details["דפוס"] || null,
        prevPub: details["הוצאה קודמת"] || null,
        hebHeaderCon: details["המשך כותר עברי"] || null,
        engHeaderCon: details["המשך כותר לועזי"] || null,
        cerifications: details["הסכמות"] || null,
        comments: details["הערות"] || null,
        place: details["מקום ההוצאה"] || null,
        place1: details["מקום ההוצאה אחיד"] || null,
        addPlace: details["מקום נוסף"] || null,
        trans: details["מתרגם"] || null,
        volumes: details["סדרה"] || null,
        alpi: details["על-פי"] || null,
        year: details["פרט השנה"] || null,
        engYear: details["שנת פרסום אזרחית"] || null,
        hebYear: details["שנת פרסום עברית"] || null,
        lang: details["שפה"] || null,
        taagid: details["תאגיד נוסף"] || null,
        description: details["תאורת"] || null,
      };
    },
    setLeumiDetails(details) {
      if (!details) return;

      this.leumiDetails = {
        author: details.authors ? details.authors.split("~")[0] : null,
        addAuthors: details.authorsEx ? details.authorsEx.split("~")[0] : null,
        bookName: details.bookNames || null,
        bookName2: details.bookNamesEx
          ? details.bookNamesEx.split("~").join(" | ")
          : null,
        catId: details.catId || null,
        hekef: details.pages || null,
        pubPlace: details.placesHeb || null,
        pubYear: details.pubInfo || null,
        subjects: details.subjects
          ? details.subjects
              .split("|")
              .filter((s) => s)
              .join(" | ")
              .replace(/~/g, " ")
          : null,
      };
      console.log(this.leumiDetails);
    },
  },

  async created() {
    if (this.isBookPage) {
      let bk = await fetchBookByID(this.bookid);

      bk.mainAuthorName = bk.authors.find((b) => b.authorTypeId == 1).name;
      bk.fromyear = bk.fromyear.map((y) => y.name).join(",");
      bk.toyear = bk.toyear.map((y) => y.name).join(",");
      bk.places = bk.places.map((y) => y.name).join(",");
      this.bookDetails = bk;
    } else {
      let bk = this.getBookbyId(this.bookid);
      this.bookDetails = bk || {};
    }
  },
};
</script>
<style lang="scss" scoped>
$border: #d4d4d4;
$custom-color: gray;
.tabs-container {
  background-color: #e9e9e9;
  display: flex;
  flex-direction: row;
  height: 30px;
}
.details-container {
  padding: 10px;
}
.details-tab {
  width: auto;
  border-left: 1px solid #d4d4d4;
  border-top: 1px solid #d4d4d4;
  border-bottom: 1px solid #d4d4d4;
  background-color: #f4f4f4;
  text-align: center;
  padding: 5px;
  cursor: pointer;
  &.active {
    background-color: white;
    border-bottom: none;
  }
}
.details-item {
  min-height: 55px;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #d4d4d4;
  height: auto;
  padding-top: 10px;
  padding-bottom: 10px;
}
.item {
  display: flex;
  align-items: center;
  justify-contents: middle;
}
.label {
  color: #b2b2b2;
  min-width: 80px;
  font-size: 12px;
}
.description {
  color: #000000;
  font-size: 13px;
}
.link {
  cursor: pointer;
  text-decoration: underline;
}

.content.hide-shaar {
  padding: 15px 25px;
  // pointer-events: none;
}
.book-details::selection {
  background-color: $custom-color !important;
  color: #000 !important;
}
.book-details-container {
  .right {
    //  pointer-events: none;
    // float: right;
    // width: 250px;
    height: 100%;
    flex-grow: 1;
    width: 40%;
    overflow: hidden;
    border-left: $border 1px solid;
    display: flex;
    padding: 10px;
    img {
      padding: 10px;
      max-height: 100%;
      margin: 0 auto;
      display: block;

      max-width: 100%;
      margin: auto;
      margin-top: 0;
      border: 1px solid #d1d1d1;
    }
  }
  .left {
    // pointer-events: none;
    max-width: 500px;
    width: 60%;

    flex-grow: 1;
    overflow: auto;
    user-select: text;
    cursor: text;
    display: flex;
    flex-direction: column;
  }
  position: relative;
  height: 100%;
  .header {
    // width: 100%;
    // height: 56px;
    // line-height: 56px;
    // padding: 0 20px;
    // background-color: #f1f1f1;
    // color: #000;
    // position: relative;
  }
  .header span {
    // padding-top: 20px;
    // padding-right: 20px;
    font-size: 14px;
    color: #000;
    font-weight: 500;
  }
  .icon-del {
    position: absolute;
    top: 50%;
    left: 20px;
    font-size: 9px;
    line-height: 20px;
    transform: translateY(-50%);
    width: 20.3px;
    height: 20.3px;
  }
  .content {
    // pointer-events: none;
    display: flex;
    height: 100%;
    position: relative;
  }
  h3 {
    margin-bottom: 0;
    font-size: 11px;
    font-weight: bold;
    color: #aaa;
    line-height: 15px;
  }
  p {
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>
