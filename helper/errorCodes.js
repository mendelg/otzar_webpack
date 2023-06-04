import VueInst from "@/main_app.js";

let errorCodes = [];

const getErrorDesc = () => errorCodes;

function setErrorCodes(VueInst) {
    errorCodes = [
        "driverErrors.licenseInvalid", //"LICENCE_NOT_FOUND",
        "driverErrors.licenceExpired", // "LICENCE_EXPIRED",
        "driverErrors.licenseInvalid", // "LICENCE_PATH_TOO_LONG",
        "driverErrors.licenseInvalid", // "LICENCE_PATH_INVALID",
        "driverErrors.licenseInvalid", // "LICENCE_FILE_CORRUPTED",
        "driverErrors.licenseInvalid", // "UNABLE_TO_OPEN_LICENCE_FILE",
        "driverErrors.checkOnKeyOrDisk", // "LICENCE_SERIAL_NUMBER_NOT_FOUND",
        "driverErrors.licenseInvalid", // "LICENCE_LT_FILE_OR_SYS_TIME_TOUCHED",
        "driverErrors.licenseInvalid", //"LICENCE_INVALID_CODE_SN_FAILED",
        "driverErrors.licenseInvalid", // "LICENCE_INVALID_CODE_DAYS",
        "driverErrors.licenseInvalid", // "LICENCE_TOO_MANY_BAD_CODES",
        "driverErrors.licenseInvalid", // "LICENCE_INVALID_CODE_DAYS_LESS_THAN_ZERO",
        "driverErrors.licenseInvalid", // "LICENCE_LT_FILE_CORRUPTED",
        "driverErrors.licenseUpdateError", // "UNABLE_TO_WRITE_TO_LICENCE_FILE",
        "driverErrors.licenseUpdateError", //  "UNABLE_TO_WRITE_TO_LICENCE_LT_FILE",
        "driverErrors.generalError", //  "NO_SERIAL_NUMBERS_ON_THIS_MACHINE",
        "driverErrors.bookError", //  "BOOK_OR_PAGE_IS_INVALID",
        "driverErrors.bookError", //  "BOOK_IS_NOT_A_NUMER",
        "driverErrors.bookError", //  "UNABLE_TO_OPEN_BOOK_FILE",
        "driverErrors.bookError", //  "BOOK_FILE_CORRUPTED",
        "driverErrors.bookError", //  "BOOKID_NOT_MATCH_FILE_BOOKID",
        "driverErrors.noPackage", //  "NOT_IN_LICENCE_PACK",
        "driverErrors.pageError", //  "PAGE_NOT_FOUND",
        "driverErrors.bookError", //  "BOOKID_OR_PAGE_INVALID",
        "driverErrors.bookError", //  "BOOKID_IS_NOT_A_NUMBER",
        "driverErrors.generalError", //  "UNKNOWN",
        "driverErrors.ocrError", //  "OCR_ZERO_LOCATIONS",
        "driverErrors.ocrError", //  "UNABLE_TO_OPEN_OCR_FILE",
        "driverErrors.ocrError", //  "UNABLE_TO_OCR_FILE_CORRUPTED",
        "driverErrors.noPlace", //  "NO_FREE_SPACE_ON_THE_SERVER",
        "driverErrors.noDriver", //  "NO_DRIVER",
    ];
}
const errorPageNP =
    "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";
const errorPageNA =
    "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";
const errorPageNL =
    "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";
const errorLicense =
    "iVBORw0KGgoAAAANSUhEUgAAAPIAAAAuCAIAAACd9tOnAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAy0lEQVR4nO3awQ3CQBAEQc5yCCDyz80fBDEYkkB3Ursqgnm09rXjOI7bxWzbtnrCVOd5rp4w2756APyfrAmSNUGyJkjWBMmaIFkTJGuCZE2QrAmSNUGyJkjWBMmaoP3zfq3eMNvVHjXHGKsnzOZaEyRrgmRNkKwJkjVBsiZI1gTJmiBZEyRrgmRNkKwJkjVBsiZI1gTt98dz9YbZrvZ9fH6/qyfM5loTJGuCZE2QrAmSNUGyJkjWBMmaIFkTJGuCZE2QrAmSNUGyJugHFScPXAXN5ZoAAAAASUVORK5CYII=";
const errorBook =
    "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";

const errorNoViewBook =
    "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";
async function handleImageError(error, notify = false) {
    notify = false; // temp plaster for bug of error 22
    if (notify) {
        const notification = {
            type: "error",
            message: VueInst.$t(errorCodes[error - 1] || "UNKNOWN") +
                " - " +
                VueInst.$t("general.errorNo") +
                ":" +
                error,
            timeout: 3000,
            setting: {
                grid: "icon",
                nameIcon: "icon-print",
                position: "center",
            },
        };
        VueInst.$notify(notification);
    }
    let errorPage = "";

    switch (error) {
        case 22:
            {
                errorPage = _base64ToArrayBuffer(errorPageNP);
                break;
            }
        case 17:
        case 18:
        case 19:
        case 20:
        case 21:
        case 23:
        case 24:
        case 25:
            {
                errorPage = _base64ToArrayBuffer(errorPageNA);
                break;
            }
        case 30:
            {
                errorPage = _base64ToArrayBuffer(errorNoViewBook);
                break;
            }
        case 31:
            {
                errorPage = _base64ToArrayBuffer(errorBook);
                break;
            }
        case 32:
            {
                errorPage = _base64ToArrayBuffer(errorBook);
                break;
            }

        default:
            {
                errorPage = _base64ToArrayBuffer(errorPageNL);
            }
    }
    return errorPage;
}

function DriverException(message) {
    const error = new Error(message);
    return error;
}

function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

let booksFiredErrors = [];

DriverException.prototype = new Error();
export default {
    errorCodes,
    handleImageError,
    DriverException,
    setErrorCodes,
    getErrorDesc,
};

/* #define OTZAR_ERROR_LICENCE_NOT_FOUND 1
#define OTZAR_ERROR_LICENCE_EXPIRED 2
#define OTZAR_ERROR_LICENCE_PATH_TOO_LONG 3
#define OTZAR_ERROR_LICENCE_PATH_INVALID 4
#define OTZAR_ERROR_LICENCE_FILE_CORRUPTED 5
#define OTZAR_ERROR_UNABLE_TO_OPEN_LICENCE_FILE 6
#define OTZAR_ERROR_LICENCE_SERIAL_NUMBER_NOT_FOUND 7
#define OTZAR_ERROR_LICENCE_LT_FILE_OR_SYS_TIME_TOUCHED 8
#define OTZAR_ERROR_LICENCE_INVALID_CODE_SN_FAILED 9
#define OTZAR_ERROR_LICENCE_INVALID_CODE_DAYS 10
#define OTZAR_ERROR_LICENCE_TOO_MANY_BAD_CODES 11
#define OTZAR_ERROR_LICENCE_INVALID_CODE_DAYS_LESS_THAN_ZERO 12
#define OTZAR_ERROR_LICENCE_LT_FILE_CORRUPTED 13
#define OTZAR_ERROR_UNABLE_TO_WRITE_TO_LICENCE_FILE 14
#define OTZAR_ERROR_UNABLE_TO_WRITE_TO_LICENCE_LT_FILE 15
#define OTZAR_ERROR_NO_SERIAL_NUMBERS_ON_THIS_MACHINE 16
#define OTZAR_ERROR_BOOK_OR_PAGE_IS_INVALID 17
#define OTZAR_ERROR_BOOK_IS_NOT_A_NUMER 18
#define OTZAR_ERROR_UNABLE_TO_OPEN_BOOK_FILE 19
#define OTZAR_ERROR_BOOK_FILE_CORRUPTED 20
#define OTZAR_ERROR_BOOKID_NOT_MATCH_FILE_BOOKID 21
#define OTZAR_ERROR_NOT_IN_LICENCE_PACK 22
#define OTZAR_ERROR_PAGE_NOT_FOUND 23
#define OTZAR_ERROR_BOOKID_OR_PAGE_INVALID 24
#define OTZAR_ERROR_BOOKID_IS_NOT_A_NUMBER 25
#define OTZAR_ERROR_UNKNOWN 26
#define OTZAR_ERROR_OCR_ZERO_LOCATIONS 27
#define OTZAR_ERROR_UNABLE_TO_OPEN_OCR_FILE 28
#define OTZAR_ERROR_UNABLE_TO_OCR_FILE_CORRUPTED 29 */

//====================================================
//more errors

//not allowed to view 30 (לדוג' אבי עזרי)
//defect page 31