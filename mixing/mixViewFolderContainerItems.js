import modeViewFolder from "@/components/popupFolders/contentFolder/modeViewFolders/modeViewFolder.vue";
import createFolderView from "@/components/popupFolders/contentFolder/modeViewFolders/createFolderModeView.vue";
import {
    mapGetters,
    mapState
} from "vuex";
export default {
    components: {
        modeViewFolder,
        createFolderView,
    },
    data() {
        return {
            m: 0,
            tempSelect: [],
            endSearch: 80,
            addLoad: 40,
        };
    },
    computed: {
        ...mapGetters("systemFolders", ["getSystemFoldersContentByParentId"]),
        ...mapGetters("userFolders", ["getTextSearchInput"]),
        ...mapGetters("folders", [
            "getCreateFolder",
            "getIdSelectFolder",
            "getNameSelectFolder",
            "getModeEdit",
            "getTypePopup",
            "getSelectFolder",
            "getOrderBy",
            "getCurrentListFolder",
            "getCurrentListFolderSystem",
            "hasViewSystemFolder",
            "hasViewMineFolder",
            "getAllListCurrent",
            "getListType",
            "hasSelectSystemFolder",
        ]),

        viewSystemFolder() {
            if (this.getTextSearchInput && this.getTextSearchInput.length > 0)
                return false;
            if (
                this.hasViewSystemFolder &&
                this.getTypePopup != "export" &&
                this.getListType != "free"
            )
                return true;
            return false;
        },
        viewMineFolder() {
            if (this.getTextSearchInput && this.getTextSearchInput.length > 0)
                return false;
            if (this.hasViewMineFolder && this.getTextSearchInput == "") return true;
            // return false;
        },
        viewresultsSearchFolder() {
            if (
                this.getTextSearchInput ||
                this.getTextSearchInput.length > 0 ||
                this.getTextSearchInput != ""
            )
                return true;
            return false;
        },
        creatNewFolder() {
            return this.getCreateFolder;
        },
        listSearch() {
            if (this.getTextSearchInput || this.getTextSearchInput != "") {
                this.folders.forEach((element) => (element.systemFile = "false"));
                this.foldersSystem.forEach((element) => (element.systemFile = "true"));
                let findArray = [...this.foldersSystem, ...this.folders];
                return findArray;
            }
            return [];
        },
        foldersSystem() {
            if (this.getCurrentListFolderSystem().length == 0) return [];
            return this.getCurrentListFolderSystem();
        },
        folders() {
            if (this.getCurrentListFolder == 0) return [];
            return this.getCurrentListFolder;
        },
        firstView() {
            if (this.hasViewSystemFolder && this.hasViewMineFolder) return true;
            else return false;
        },
        emptyFolder() {
            if (this.getCreateFolder) return false;
            if (!this.folders) return false;
            if (this.folders.length == 0) {
                return true;
            }
            return false;
        },
        emptyFolderSystem() {
            if (this.hasViewSystemFolder)
                if (this.getCurrentListFolderSystem().length > 0) return false;
            return true;
        },
        emptyFolderSearch() {
            if (this.getTextSearchInput && this.getTextSearchInput.length > 0)
                return true;
            return false;
        },
        messagesEmptySearch() {
            if (this.getTextSearchInput && this.getTextSearchInput.length > 0)
                if (this.foldersSystem.length == 0 && this.folders.length == 0)
                    return this.$t("files1.noResults");
        },
        messagesEmpty() {
            if (this.getTextSearchInput && this.getTextSearchInput.length > 0)
                return this.$t("files1.noResults");
            return this.$t("files1.emptyFolder");
        },
        messagesEmptySystem() {
            if (this.foldersSystem.length == 0) this.$t("files1.noFindSystemFolder");
        },
    },
    methods: {
        loadMoreResults() {
            if (this.listSearch.length > this.endSearch + this.addLoad)
                this.endSearch += 80;
            else this.endSearch = this.listSearch.length;
        },
        createFolder(value) {
            let title = value;
            this.$store.dispatch("userFolders/createUserFolder", title);
            this.$store.dispatch("folders/toggleCreateFolder");
        },
        editFolder() {
            if (this.getModeEdit.type == "rename")
                this.$store.dispatch("folders/renameFolder");
            else if (this.getModeEdit.type == "create") {
                this.$store.dispatch("folders/createFolder", false);
                this.$store.dispatch("folders/toggleCreateFolder", false);
            }
        },
        selectFolder(item, foldersSystem, position) {
            // this.selectedItem = item;

            this.$store.dispatch("folders/setSelectFolder", {
                folder: item,
                foldersSystem: foldersSystem,
                positionElem: position,
            });
        },
        openFolder() {
            if (this.getTypePopup == "activeStore") {
                if (
                    this.hasSelectSystemFolder &&
                    this.getSelectFolder[0].next.length == 0
                )
                    return;
                else if (!this.hasSelectSystemFolder &&
                    this.getSelectFolder[0].folderTypeId == 2
                )
                    return;
            }
            this.$store.dispatch("folders/openFolder");
        },
    },
    watch: {
        getTextSearchInput: function(val, oldVal) {
            if (this.getTextSearchInput.length > 0) {
                this.$store.dispatch("folders/setModeView", "details");
            } else {
                this.$store.dispatch("folders/setModeView", "symbole");
            }
        },
    },
};