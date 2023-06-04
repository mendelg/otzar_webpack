import {
    Axios
} from "@/services/_axios";
import init from "@/config/init.js";
import store from "@/store/store";

/* export const permissionsEnum = {
  KOOK: 0b1000,
  MACHON: 0b10000,
  SHLOMO: 0b100000,
  SHALOM: 0b1000000,
  OFEK: 0b10000000,
  OZ: 0b100000000,
  ENC: 0b1000000000,
  MEF_OTZAR: 0b100000000000,
  AHARON: 0b1000000000000,
  NEW_AHARON: 0b10000000000000,
  OTZAR_MEFHARSHI_HATLMOD: 0b100000000000000,
  NO_BT: 0b1000000000000000000000000000000,
  CHABAD: 0b100,
  SCHOOL: 0b10,
}; */

export const permissionsEnum = {
    GENERAL: {
        value: 0b1,
        description: "אוצר החכמה הבסיסי"
    },
    BT: {
        value: 64,
        description: "אוצר החכמה בני תורה"
    },
    CHABAD: {
        value: 0b100,
        description: 'מהדורת חב"ד',
        description2: 'ספריית חב"ד',
    },
    SCHOOL: {
        value: 0b10,
        description: 'מהדורת בי"ס'
    },
    OZ: {
        value: 0b100000000,
        description: "מכון עוז והדר"
    },
    KOOK: {
        value: 0b1000,
        description: "מוסד הרב קוק"
    },
    SHALOM: {
        value: 0b1000000,
        description: "מכון אהבת שלום"
    },
    MACHON: {
        value: 0b10000,
        description: "מכון ירושלים"
    },
    SHLOMO: {
        value: 0b100000,
        description: "מכון חכמת שלמה"
    },
    OFEK: {
        value: 0b10000000,
        description: "מכון אופק"
    },
    AHARON: {
        value: 0b1000000000000,
        description: "מכון זכרון אהרון"
    },
    FREE: {
        value: 0b10000000000,
        description: "ספרים חינמיים"
    },
    MEF_OTZAR: {
        value: 0b100000000000,
        description: "מפרשי האוצר"
    },
    OVADIA: {
        value: 0b1000000000000000000,
        description: "מאור ישראל"
    },
};

export function getBookPermission(bookId, NABooks = false) {
    const bookOnly = store.state.bookOnlyMode;
    let bk;
    if (!bookOnly) {
        bk = store.getters["books/getBookbyId"](bookId, NABooks);
        if (bk) {
            let bookPermissions = bk.permissions;
            if (!bookPermissions) bookPermissions = 2;
            bookPermissions = bookPermissions >> 1;
            //get permission descriptions

            let bookPermissionsData = [];
            Object.keys(permissionsEnum).forEach((p) => {
                let currPer = permissionsEnum[p] ? .value;
                if (currPer & bookPermissions)
                    bookPermissionsData.push(permissionsEnum[p]);
            });

            return {
                bookPermissions,
                bookPermissionsData
            };
        }
    }
    return {
        bookPermissions: 0,
        bookPermissionsData: []
    };
}

export function getBookLicenseData(license) {
    let bookPermissions = 0;
    let bookPermissionsData = [];
    license.forEach((l) => {
        let lic = l.title;
        if (lic == "NO_BT") return;
        if (globalThis.SERVER_MODE == "online" && lic == "ENC") return;

        if (lic == "NEW_AHARON") lic = "AHARON";
        if (lic == "OTZAR_MEFHARSHI_HATLMOD") lic = "MACHON";

        let code = permissionsEnum[lic] ? .value;

        if (code) {
            bookPermissions = bookPermissions | code;

            if (lic != "MEF_OTZAR") bookPermissionsData.push(permissionsEnum[lic]);
        }
    });
    if (bookPermissions == 0) {
        bookPermissions = 2 >> 1;
        bookPermissionsData.push(permissionsEnum.GENERAL);
    }
    //remove MEF lic if doesnt have basic license
    if (
        (bookPermissions & permissionsEnum["MEF_OTZAR"].value) > 0 &&
        bookPermissions != permissionsEnum["MEF_OTZAR"].value
    ) {
        bookPermissions = bookPermissions ^ permissionsEnum["MEF_OTZAR"].value;
    }

    if (bookPermissions == permissionsEnum["MEF_OTZAR"].value) {
        bookPermissions = bookPermissions | (2 >> 1);
        bookPermissionsData.push(permissionsEnum.GENERAL);
    } else {
        if (
            (bookPermissions & permissionsEnum["MEF_OTZAR"].value) > 0 &&
            isPackageBook(bookPermissions)
        ) {
            bookPermissions = bookPermissions ^ permissionsEnum["MEF_OTZAR"].value;
        }
    }

    /*   const bookOnly = store.state.bookOnlyMode;
    let bk;

    if (!bookOnly) {
      bk = store.getters["books/getBookbyId"](bookId, NABooks);
      if (bk) {
        let bookPermissions = bk.permissions;
        if (!bookPermissions) bookPermissions = 2;
        bookPermissions = bookPermissions >> 1;
        //get permission descriptions

        let bookPermissionsData = [];
        Object.keys(permissionsEnum).forEach((p) => {
          let currPer = permissionsEnum[p].value;
          if (currPer & bookPermissions)
            bookPermissionsData.push(permissionsEnum[p]);
        });
        return { bookPermissions, bookPermissionsData };
      }
    } */
    return {
        bookPermissions,
        bookPermissionsData
    };
}

export function isPackageBook(lic) {
    return (
        (lic & permissionsEnum.AHARON.value) > 0 ||
        (lic & permissionsEnum.CHABAD.value) > 0 ||
        (lic & permissionsEnum.KOOK.value) > 0 ||
        (lic & permissionsEnum.MACHON.value) > 0 ||
        (lic & permissionsEnum.SHALOM.value) > 0 ||
        (lic & permissionsEnum.SHLOMO.value) > 0 ||
        (lic & permissionsEnum.OFEK.value) > 0 ||
        (lic & permissionsEnum.OZ.value) > 0
    );
}