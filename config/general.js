export default {
    OCRMaximum: 200,
    serverConnection: "online",
    // serverConnection: "offline",
    licensePackages: {
        ALL: 0b1000000000000000000000000000000,
        CHABAD: 0b100,
        KOOK: 0b1000,
        MACHON: 0b10000,
        SHLOMO: 0b100000,
        SHALOM: 0b1000000,
        OFEK: 0b10000000,
        OZ: 0b100000000,
        ENC: 0b1000000000,
        FREE: 0b10000000000,
        MEF_OTZAR: 0b100000000000,
        AHARON: 0b1000000000000,
        NEW_AHARON: 0b10000000000000,
        OTZAR_MEFHARSHI_HATLMOD: 0b100000000000000,
        FULL: 0b1,
        SCHOOL: 0b10,
        FREE: 0b10000000000,
        OVADIA: 0b1000000000000000000,
        NO_BT: 0b1000000000000000000000000000000,
    },
    isCustomBook(book) {
        return book >= 5000000 && book < 6000000;
    },
    isPDFCustomBook(book) {
        return book >= 6000000;
    },
    gzirHeight: {
        low: 100,
        medium: 150,
        high: 200
    },
};