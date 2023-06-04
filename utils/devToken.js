module.exports = () => {
    const dt = new Date();
    const key = "0Ppch3plVw92ch3v3mdscMC3Fto0vggrmaK";
    /**@type {Buffer} */
    const bf = Buffer.alloc(12);
    bf.writeInt16LE(dt.getMonth());
    bf.writeInt32LE(dt.getFullYear(), 2);
    bf.writeInt16LE(dt.getHours(), 6);
    bf.writeInt16LE(dt.getDate(), 8);
    bf.writeInt16LE(dt.getMinutes(), 10);
    for (let o = 0; o < bf.byteLength; o++) bf[o] = bf[o] ^ key.charCodeAt(o);
    return bf;
};