import {
    mapGetters,
    mapActions,
    mapState
} from "vuex";
export default {
    props: {
        item: Object,
        systemFile: false,
    },

    data() {
        return {
            ...mapState("folders", ["modeEdit"]),
            listParents: "",
        };
    },
    mounted() {
        if (this.item.parent || this.item.parentId) this.getParent(this.item);
    },
    computed: {
        ...mapState("userFolders", ["enumFoldersType"]),
        ...mapGetters("folders", [
            "getSelectFolder",
            "hasViewMenu",
            "getModeEdit",
            "getIdSelectFolder",
            "isKeyArrow",
            "getCurrentListFolderSystem",
            "getCurrentListFolder",
            "getAllListCurrent",
            "getListType",
            "getTypePopup",
        ]),
        ...mapGetters("userFolders", ["getTextSearchInput"]),
        ...mapGetters("systemFolders", ["getTextSearchInput"]),

        //returns a boolean if we are in search or not
        inSearch() {
            // if the length of getTextSearchInput=0 or getTextSearchInput is false
            //return false
            if (this.getTextSearchInput.length == 0 || !this.getTextSearchInput)
                return false;
            //if not return true
            return true;
        },
        pin() {
            if (this.systemFile == "false" && this.item.pin == 1) return true;
        },
        //returns a boolean
        //if the item is active true, else- false
        active() {
            //if there is no selected folder return false

            if (!this.getSelectFolder || this.getSelectFolder.length == 0)
                return false;
            //get the item in getSelectFolder
            let f = this.getSelectFolder.find(
                (selected) => selected.id == this.item.id
            );
            //if the item was in getSelectFolder
            //return true
            if (f !== undefined) return true;
            // else return false
            return false;
        },
        //returns a boolean
        //if the item is edit true, else- false
        edit() {
            //if : 1 - type of getModeEdit is rename
            //2-  active is true
            //3- hasViewMenu is false- not in menu
            // return true
            if (this.getModeEdit.type == "rename" && this.active && !this.hasViewMenu)
                return true;
            //else return false
            else return false;
        },
        //get title if title includes the text search -
        //
        getTiTleFolderSystem() {
            if (this.item.parentId == 0) {
                switch (this.item.categoryTypeId) {
                    case 1:
                        return this.$t("folders.basicBooks");
                    case 2:
                        return this.$t("folders.meforshim");
                    case 3:
                        return this.$t("folders.subject");
                    case 4:
                        return this.$t("folders.maagarim");
                    case 5:
                        return this.$t("folders.textbooks");
                }
            }
            return this.item.title;
        },
        title() {
            //if there is an item
            if (this.item && this.item.title) {
                let fullString = this.item.title;
                if (this.systemFile) {
                    fullString = this.getTiTleFolderSystem;
                }
                if (this.systemFile == "false")
                    fullString = this.getUseDefaultFoldersTitle;

                //and if getTextSearchInput.length>0
                if (this.getTextSearchInput.length > 0) {
                    //string of search
                    let strSearch = this.getTextSearchInput;
                    //string of item

                    //varibal of parts text item
                    let startWord, resultsWord, endWord;
                    //set index of the title of item in search
                    let i = fullString.indexOf(strSearch);
                    if (i != -1) {
                        startWord = fullString.slice(0, i);
                        resultsWord = strSearch;
                        endWord = fullString.slice(i + strSearch.length, fullString.length);
                    } else {
                        startWord = fullString;
                        resultsWord = "";
                        endWord = "";
                    }
                    return {
                        a: startWord,
                        b: resultsWord,
                        c: endWord,
                    };
                }
                return fullString;
            }
            return "";
        },
        getUseDefaultFoldersTitle() {
            if (this.item.parentId == 0) {
                return this.$t(`userDefaultFolders.root`);
            }
            if (this.item.listable == "book") return this.item.title;
            return this.$t(`userDefaultFolders.${this.item.listable}`);
        },

        type() {
            if (this.systemFile == "true") {
                if (this.item.next.length == 0) {
                    if (this.itemcategoryTypeId == 1 && this.item.level == 2) {
                        return "book";
                    }
                    return "list-system";
                }
                return "system";
            }
            if (this.item.icon && this.item.icon.length > 0) return this.item.icon;
            if (this.item.listable == "userbooks") return "userbooks";
            if (this.item.listable == "favorites") return "star";
            if (this.item.folderTypeId == 1) {
                return "normal";
            } else if (this.item.folderTypeId == 2) return "list";
            else if (this.item.folderTypeId == 3) return "list";
            return "normal";
        },

        active() {
            if (!this.getSelectFolder || this.getSelectFolder.length == 0)
                return false;
            let f = this.getSelectFolder.find(
                (selected) => selected.id == this.item.id
            );
            if (f !== undefined) {
                return true;
            }
            // if (this.getIdSelectFolder == this.item.id) return true;
            return false;
        },
        edit() {
            if (this.getModeEdit.type == "rename" && this.active && !this.hasViewMenu)
                return true;
            else return false;
        },
        allowedListTypes() {
            let folderType = this.item.folderTypeId;
            let listType = this.getListType;
            if (listType == "free")
                return (
                    this.item.listable == "book" && this.item.folderTypeId != 2
                    // folderType != this.enumFoldersType.booklist || folderType == undefined
                );
            else if (listType == "book")
                return (
                    folderType != this.enumFoldersType.freelist || folderType == undefined
                );
            else return true;
        },
        allowedFolderTypes() {
            if (globalThis.SERVER_MODE == "online")
                if (
                    this.item.listable == "pdfbooks" ||
                    this.item.listable == "userbooks"
                )
                    return false;
            let typePopup = this.getTypePopup;
            if (typePopup == "activeStore")
                return (
                    this.item.listable != "desktop" && this.item.listable != "customsort"
                );
            else return true;
        },
        valueInput() {
            return this.getModeEdit.value;
        },
        hasCheckBox() {
            let typePopup = this.getTypePopup;
            if (typePopup == "activeStore") {
                if (this.systemFile == "true") {
                    switch (this.item.categoryTypeId) {
                        case 1:
                            return false;
                            break;
                        case 2:
                            {
                                if (this.item.level == 2) {
                                    if (this.item.next.length == 0) return true;
                                    else if (this.item.next[0].level == 3) return true;
                                } else if (this.item.level == 3) return true;
                                else return false;
                            }
                            break;
                        case 3:
                            {
                                if (this.item.level > 1) return true;
                                else if (this.item.level == 1 && this.item.next[0].level > 1)
                                    return true;
                                else return false;
                                break;
                            }
                        case 4:
                            {
                                if (this.item.level == 2) return true;
                                else return false;
                                break;
                            }
                        case 5:
                            return true;
                    }
                }
            }
            return false;
        },
    },
    //methoeds
    methods: {
        getParent(parent) {
            // if (parent && parent.parent) this.listParents = this.parent2(parent);
            if (parent) this.listParents = this.parent2(parent);
        },
        getUseDefaultFoldersTitleByItem(item) {
            // ;
            // if (item.title == "root") {
            //   alert("roooooot");
            //   ;
            // }
            if (item.parentId == 0) {
                if (item.title == "root") {
                    return this.$t(`userDefaultFolders.root`);
                }
                if (item.systemFile != false) {
                    return this.$t(`userDefaultFolders.rootSystem`);
                }
            }
            if (item.listable == "book" || item.categoryTypeId == 4)
                return item.title;
            if (item.listable == undefined) return item.title;
            return this.$t(`userDefaultFolders.${item.listable}`);
        },
        parent2(p) {
            if (!p.parent) return this.getUseDefaultFoldersTitleByItem(p);
            return (
                this.parent2(p.parent) + " > " + this.getUseDefaultFoldersTitleByItem(p)
            );
        },

        click() {
            return;
        },
        checkFolder() {
            this.hasCheck = !this.hasCheck;
        },
        unSelectFolder(event, el) {
            // return;

            if (this.hasViewMenu) return;
            this.$store.dispatch("folders/unSelectFoldersById", this.item.id);
        },

        selectFolder() {
            this.$store.dispatch("folders/unSelectFolders");
            this.$emit("click", this.item, this.systemFile, this.$refs["item"]);
        },
        openFolder() {
            //
            this.selectFolder();
            this.$emit("dblclick");
        },
        editFolder() {
            if (this.getModeEdit.type == "rename")
                this.$store.dispatch("folders/renameFolder");
            else if (this.getModeEdit.type == "create") {
                this.$store.dispatch("userFolders/createUserFolder");
                this.$store.dispatch("folders/toggleCreateFolder", false);
            }
        },
        createFolder() {
            // modeEdit
            let title = this.getModeEdit.value;
            this.$store.dispatch("userFolders/createUserFolder", title);
            this.$store.dispatch("folders/toggleCreateFolder", false);
        },
        keyupInputFunc(code) {
            if (code == "Escape") this.cancelEdit();
        },
        cancelEdit() {
            if (this.getModeEdit.edit) this.$store.dispatch("folders/cancelEdit");
            else this.$store.dispatch("folders/togglePopupFolder", false);
        },
    },
};