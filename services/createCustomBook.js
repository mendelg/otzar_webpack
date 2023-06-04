import store from "@/store/store.js";
import CusBookService from "@/services/customBook.js";
import ImageProccessor from "./ImageProccessor.js";
import * as userBooksData from "@/services/userBooksData.js";
import VueInst from "@/main_app.js";

export const startBook = async (name) => {
    let data = await CusBookService.addAuthor({
        name: "תוצאות חיפוש חופשי"
    });

    store.dispatch("createBook/setCurBookAsChanged", false);
    store.dispatch("createBook/customBook/emptyNewImages");
    store.dispatch("createBook/customBook/setBookPages", []);

    store.dispatch("createBook/customBook/setBookName", name);
    store.dispatch("createBook/customBook/setAuthor", data);
};

export const addPage = (pageData) => {
    store.dispatch("createBook/customBook/addPage", pageData);
};

export const parseBook = async (data) => {
    let book = JSON.parse(data.book);

    let thumbnail = data.thumbnail;
    let pages = [];

    for (let i = 0; i < book.pages.length; i++) {
        let tmb = await extractThunbImg(data.thumbnail, book.pages[i].id);
        pages.push({
            ...book.pages[i],
            bookId: book.id,
            thumbImg: tmb,
        });
    }
    book.pages = pages;
    return book;
};

export const saveBook = () => {
    return new Promise(async (resolve, reject) => {
        CusBookService.saveNew(getBookAsJSON()).then(async (res) => {
            if (res.status === 200) {
                let {
                    book: resbook,
                    dbdata: resdbdata
                } = res.data;
                resbook = await parseBook(resbook);
                store.dispatch("createBook/customBook/setId", resbook.id);

                saveNewImages()
                    .then(() => {
                        VueInst.$notify({
                            type: "success",
                            message: VueInst.$t("createBook1.saveSuccessed"),
                            timeout: 4000,
                        });

                        //create user links to result books
                        try {
                            for (var p = 0; p < resbook.pages.length; p++) {
                                let page = resbook.pages[p];

                                addBookLink(
                                    resbook.id,
                                    resbook.name,
                                    page.sys_id,
                                    page.order,
                                    page.linkBook,
                                    page.linkBookName,
                                    page.linkPage,
                                    1
                                );
                            }
                        } catch (ex) {
                            console.log(ex);
                        }

                        // update sys and main bookslist after save
                        userBooksData.addUserBookToSystem(resdbdata);
                        store.dispatch("createBook/setCurBookAsChanged", false);
                        store.dispatch("createBook/customBook/emptyNewImages");
                        store.dispatch("createBook/customBook/setBookPages", []);
                        resolve();
                    })
                    .catch((err) => {
                        console.error("err :>> ", err);
                        VueInst.$notify({
                            type: "error",
                            message: VueInst.$t("createBook1.failSavedImg"),
                            timeout: 4000,
                        });
                        reject();
                    });
            } else {
                VueInst.$notify({
                    type: "error",
                    message: VueInst.$t("createBook1.faileSaveBook"),
                    timeout: 4000,
                });
            }
        });

        /*  saveNewImages().then(() => {
  store.dispatch("createBook/customBook/setBookPages", []);
      store.dispatch("createBook/customBook/emptyNewImages"); 
    });
  }); */
    });
};

export const saveNewImages = async () => {
    let curOpenBook = store.state.createBook.customBook;
    let newImages = Object.values(curOpenBook.newImages).map((p) => {
        return {
            pageid: p.id,
            image: p.image
        };
    });
    for (let i = 0; i < newImages.length; i++) {
        //this.setSaveImgsProgress({ max: newImages.length, val: i });
        // let img = ImageProccessor.compressImage(newImages[i].image);
        let img = newImages[i].image;
        let bookId = curOpenBook.id;
        await CusBookService.saveImage(bookId, newImages[i].pageid, img);
    }
};

export const getBookAsJSON = () => {
    let curOpenBook = store.state.createBook.customBook;
    let thumbImgs = [];
    curOpenBook.pages.forEach((p) =>
        thumbImgs.push({
            pageId: p.id,
            thumbImg: p.thumbImg
        })
    );
    let book = {
        id: curOpenBook.id,
        name: curOpenBook.name,
        author: curOpenBook.author,
        comment: [],
        tsiyunim: curOpenBook.tsiyunim.map((t) => JSON.parse(JSON.stringify(t))),
        customTsiyunim: curOpenBook.customTsiyunim.map((t) =>
            JSON.parse(JSON.stringify(t))
        ),
        pages: curOpenBook.pages.map((p) => PageToJSON(p)),
    };

    return {
        book,
        thumbImgs
    };
};
export const PageToJSON = (pageToExport) => {
    let page = {
        id: pageToExport.id,
        order: pageToExport.order,
        type: pageToExport.type,
        linkBook: pageToExport.linkBook,
        linkPage: pageToExport.linkPage,
        linkBookName: pageToExport.linkBookName,
    };
    if (pageToExport.type === "page")
        page = {
            ...page,
            book: pageToExport.book,
            page: pageToExport.page,
            searchResult: pageToExport.searchResult,
        };
    if (pageToExport.type === "text")
        page = { ...page,
            text: pageToExport.text,
            html: pageToExport.html
        };
    return page;
};

export const createNewPage = async (pageData) => {
    try {
        let img = await ImageProccessor.base64ToImage(pageData.image);
        pageData.thumbImg = ImageProccessor.resizeImage(img, {
            h: 250,
            w: 200,
        });

        pageData.id = await store.dispatch("createBook/customBook/createNewPageid");

        if (pageData.tsiyunim) addTsiyunimFromPage(pageData.tsiyunim, pageData.id);

        let page = await store.dispatch(
            "createBook/customBook/addNewPage",
            pageData
        );

        if (pageData.type !== "page")
            await store.dispatch("createBook/customBook/addImagesAsNews", pageData);

        store.dispatch("createBook/customBook/setCurPage", page);
    } catch (error) {
        console.log(error);
    }
};

const addTsiyunimFromPage = (tsiyunim, pageId) => {
    tsiyunim.forEach((t) => {
        store.dispatch("createBook/customBook/addTsiyun", {
            id: t.id,
            title: t.title,
            internalPageId: pageId,
        });
    });
};

const extractThunbImg = async (imgsBuffer, pageId) => {
    if (!imgsBuffer) return "";
    let pagesBuffer;
    try {
        pagesBuffer = new Buffer.from(imgsBuffer.data.slice(0, 60000));
    } catch {
        //in electron env
        pagesBuffer = new Buffer.from(imgsBuffer.slice(0, 60000));
    }

    let pos = pagesBuffer.indexOf(pageId.toString());
    let imgPos = pagesBuffer.readInt32LE(pos + 20);
    let endImgPos = pagesBuffer.readInt32LE(pos + 24);
    let img;
    try {
        img = new Buffer.from(imgsBuffer.data.slice(imgPos, endImgPos));
    } catch {
        //in electron env
        img = new Buffer.from(imgsBuffer.slice(imgPos, endImgPos));
    }

    img = img.toString();
    return img;
};

const addBookLink = (
    newBook,
    newBookName,
    newPage,
    newPagePos,
    resultBook,
    resultBookName,
    resultPage,
    resultPagePos
) => {
    // TODO add here values of pages name, position and letter
    let userLink = {
        firstLink: {
            bookId: newBook,
            bookName: newBookName,
            note: resultBookName,
            pageId: newPage,
            position: newPagePos,
            x: 10,
            y: 10,
        },
        secondLink: {
            bookId: resultBook,
            bookName: resultBookName,
            note: "X",
            pageId: resultPage,
            position: resultPagePos,
            x: 10,
            y: 10,
        },
    };

    store.dispatch(`personalAdditionsTabs/addLink`, userLink);
};