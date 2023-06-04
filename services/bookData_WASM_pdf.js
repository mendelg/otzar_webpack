const stdio = require("@/utils/wasm_pdf/stdio");
const {
    createMuPdf
} = require("@/utils/wasm_pdf/index.js");
// let mupdf;
// async function init() {
//   mupdf = await createMuPdf();
// }
// init();
async function getPdfPage(
    bookId,
    page,
    dpi,
    pdfMode,
    PDFType = "21",
    imageBuffer = null
) {
    //console.log("get WASM page", bookId, page, dpi, PDFType);
    let doc = null;
    let mupdf = await createMuPdf();

    if (PDFType == "19") page = 1;
    let bookData = PDFType == "19" ? new Uint8Array(imageBuffer) : String(bookId);
    doc = await mupdf.load(bookData, PDFType);

    let png = null;

    switch (pdfMode) {
        case 1:
            png = await mupdf.getPxs(doc, page, dpi);
            break;
        case 2:
            png = await mupdf.getPngRaw(doc, page, dpi);
            break;
        case 3:
            png = await mupdf.drawPageAsPNG(doc, page, dpi);
            break;
        default:
            png = await mupdf.getPxs(doc, page, dpi);
    }
    return png;
}

export default {
    getPdfPage
};