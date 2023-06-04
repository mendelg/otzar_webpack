import winManager from "@/services/book_win";
import {
    goToPage
} from "@/services/bookData.js";

import {
    mapActions
} from "vuex";

export default {
    methods: {
        ...mapActions("userPersonalExtensions", [
            "deleteUserComment",
            "deleteUserKey",
            "deleteUserMarker",
            "deleteUserLink",
        ]),
        openInNewWin(
            bookId,
            position,
            width = null,
            height = null,
            tabId = null,
            volumes = false
        ) {
            winManager.createWinBook(bookId, position, width, height, tabId, volumes);
        },
        go(position, tabId) {
            goToPage(position, tabId);
        },
        async deleteExtensItem(item, type) {
            let msg;
            if (type == "comment") {
                let payload = {
                    title: this.$t("general.remove2"),
                    content: this.$t("personalExtensions.okRemoveComment"),
                    btns: [this.$t("general.yes"), this.$t("general.no")],
                };
                let act = await this.$msg(payload);
                if (act == this.$t("general.yes")) {
                    // this.deleteUserComment(item.id);
                    this.$store.dispatch(
                        `personalAdditionsTabs/delComment`, {
                            bookId: item.bookId,
                            keyId: item.id
                        }, {
                            root: true,
                        }
                    );

                    msg = this.$t("personalExtensions.succeedRemoveComment");
                } else return;
            }
            if (type == "key") {
                let payload = {
                    title: this.$t("general.remove2"),
                    content: this.$t("personalExtensions.okRemoveKey"),
                    btns: [this.$t("general.yes"), this.$t("general.no")],
                };
                let act = await this.$msg(payload);
                if (act == this.$t("general.yes")) {
                    // this.deleteUserKey(item.id);
                    this.$store.dispatch(
                        `personalAdditionsTabs/delKey`, {
                            bookId: item.bookId,
                            keyId: item.id
                        }, {
                            root: true,
                        }
                    );
                    msg = this.$t("personalExtensions.succeedRemoveKey");
                } else return;
            }
            if (type == "marker") {
                let payload = {
                    title: this.$t("general.remove2"),
                    content: this.$t("personalExtensions.okRemoveMarker"),
                    btns: [this.$t("general.yes"), this.$t("general.no")],
                };
                let act = await this.$msg(payload);
                if (act == this.$t("general.yes")) {
                    //this.deleteUserMarker(item.id);
                    this.$store.dispatch(
                        `personalAdditionsTabs/delMarker`, {
                            bookId: item.bookId,
                            userMarkerId: item.id
                        }, {
                            root: true,
                        }
                    );
                    msg = this.$t("personalExtensions.succeedRemoveMarker");
                } else return;
            }

            if (type == "link") {
                let payload = {
                    title: this.$t("general.remove2"),
                    content: this.$t("links1.deleteLinkQck"),
                    btns: [this.$t("general.yes"), this.$t("general.no")],
                };
                let act = await this.$msg(payload);
                if (act == this.$t("general.yes")) {
                    //  this.deleteUserLink(item.id);
                    const payload = {
                        userLinkId: item.id,
                        bookId: item.bookId,
                        userLinkId2: item.linkedTo.id,
                        bookId2: item.linkedTo.bookId,
                    };
                    this.$store.dispatch(`personalAdditionsTabs/delLink`, payload, {
                        root: true,
                    });
                    msg = this.$t("links1.successDeleteLink");
                    return true;
                } else return false;
            }

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
        },
    },
};