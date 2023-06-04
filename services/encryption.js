export default function encrpyt(_enc, _key, len = 150) {
    let enc = Buffer.from(_enc);
    let key = Array.from(_key);
    enc.forEach((byte, index) => {
        if (index > len) return;
        enc[index] = byte ^ (key[2] >> 8);
        let bt = byte + key[2];
        bt = bt & 0xff;
        key[2] = bt * key[0] + key[1];
    });
    for (let i = 0; i < len; i++) {
        _enc[i] = enc[i];
    }
    return enc;
}