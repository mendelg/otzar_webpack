const crp = require("crypto-js");

export default function(book, page) {
    let bk = book.toString();
    let pg = page.toString();
    var txt = new TextDecoder("utf-8");
    var arr = new Uint8Array([77, 68, 53]);

    var px = new Uint8Array([
        75,
        98,
        118,
        76,
        118,
        52,
        72,
        63,
        112,
        115,
        42,
        100,
        33,
        80,
        66,
        83,
        118,
        85,
        84,
        113,
        64,
        100,
        80,
        122,
        72,
        43,
        100,
        101,
        51,
        67,
        64,
        55,
        64,
        102,
        83,
        53,
        112,
        87,
        106,
        75,
        56,
        116,
        112,
        86,
        80,
        112,
        94,
        107,
        52,
        72,
        95,
        106,
    ]);
    let fn = txt.decode(arr);
    let sk = txt.decode(px);

    let enc = crp[fn](bk + sk + pg).toString();
    return enc;
}