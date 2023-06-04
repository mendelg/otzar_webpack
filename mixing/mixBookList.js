import itemBook from "@/components/listBookArea/listContentContainer/itemBook.vue";
import listStatus from "@/components/listBookArea/listContentContainer/listStatus.vue";
import freeSearchListStatusBar from "@/components/listBookArea/freeSearchBarContainer/freeSearchListStatusBar.vue";

export const bookList = {
    data() {
        return {
            activeColor: "red",
            maxAddToList: 50,
            maxViewList: 100,
            endList: 100,
            startList: 0,
            heightItem: 37,
            toAddHistory: true,
        };
    },
    components: {
        itemBook,
        listStatus,
        freeSearchListStatusBar,
    },
    computed: {
        endListComputed() {
            if (this.lenghList == this.maxViewList) return this.maxViewList;
            else return this.endList;
        },

        lenghList() {
            return this.list.length;
        },
        heightAllList() {
            if (this.$store.state.bookList.currentListLength == 0) return "0";
            return this.$store.state.bookList.currentListLength * this.heightItem;
        },
        calcHeightRectTop() {
            // if (this.$store.state.bookList.currentListLength == 0) return "0";
            if (this.startList > 0) return this.startList * this.heightItem + "px";
            return "0";
        },
        calcHeightRectBottom() {
            if (this.$store.state.bookList.currentListLength == 0) return "0";
            let x = this.endList * this.heightItem;
            let heightRec = this.heightAllList - x;
            return heightRec + "px";
            return "100px";
        },
    },
};