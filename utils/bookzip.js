/*
structure of data
first 4 bytes is a flag info which tell which props we had (limit to 32 props per object root)
***FLAG BIT IS BY THE INX IN FLAGINFORMATION - MUST BE SORTED LIKE THE ORGINAL OBJ***

countBytes = how many next bytes this prop gonna take
useCountAsVal = the value itself reside in the countBytes
onEmpty = what to put when the flag or the data (in child array case) is empty
child = how the child should looks and build (if its type of object or
    just simple array of flat data is decide by the type of the root arr)

some rules
in child array we always put the data even when no data is actually there
and in those case we just put 0 in countBytes. in other words
in array child we dont have a flag

*/

const bookFlagOrder = [
    "mainVolume",
    "position",
    "id",
    "name",
    "volume",
    "authors",
    "permissions",
    "addnames",
    "places",
    "toyear",
    "fromyear",
    "mainvol",
    "volumes",
    "moredata",
    "changed",
    "nameSort",
    "authorSort",
    "subbooks",
    "pubYearValue",
];

const BookFlagInformation = [{
        name: "mainVolume",
        countBytes: 4,
        useCountAsVal: true,
        type: "Number",
        bit: 0,
        onEmpty: null,
    },
    {
        name: "position",
        countBytes: 2,
        bit: 1,
        useCountAsVal: true,
        type: "Number",
        onEmpty: null,
    },
    {
        name: "id",
        bit: 2,
        countBytes: 4,
        useCountAsVal: true,
        type: "Number",
        onEmpty: null,
    },
    {
        name: "name",
        bit: 3,
        countBytes: 2,
        useCountAsVal: false,
        type: "String",
        writeToSecFile: true,
        onEmpty: "",
    },
    {
        bit: 4,
        name: "volume",
        countBytes: 2,
        useCountAsVal: false,
        type: "String",
        writeToSecFile: true,
        onEmpty: "",
    },
    {
        name: "authors",
        countBytes: 2,
        bit: 5,
        ArrayCountBytes: 2,
        useCountAsVal: false,
        skip: false,
        spreadTo: [{
                name: "id"
            },
            {
                name: "name"
            },
            {
                name: "authorTypeId"
            },
            {
                name: "period"
            },
        ],
        type: "ArrayOfObject",
        onEmpty: [],
        bookFlagOrder: ["id", "authorTypeId", "name", "period"],
        child: [{
                name: "id",
                countBytes: 4,
                useCountAsVal: true,
                type: "Number",
                onEmpty: null,
            },
            {
                name: "authorTypeId",
                countBytes: 1,
                useCountAsVal: true,
                type: "Number",
                onEmpty: null,
            },
            {
                name: "name",
                countBytes: 2,
                useCountAsVal: false,
                dontRead: true,
                type: "String",
                skip: false,

                onEmpty: "",
            },
            {
                name: "period",
                countBytes: 1,
                useCountAsVal: true,
                type: "Number",
                onEmpty: null,
            },
        ],
    },
    {
        name: "permissions",
        bit: 6,
        countBytes: 4,
        ArrayCountBytes: 1,
        useCountAsVal: false,
        type: "Number",
        onEmpty: [],
        skip: false,
        lazy: false,
        bookFlagOrder: ["id", "title"],
        child: [{
                name: "id",
                countBytes: 1,
                useCountAsVal: true,
                type: "Number",
                onEmpty: null,
            },
            {
                name: "title",
                skip: true,
                countBytes: 2,
                useCountAsVal: false,
                type: "String",
                onEmpty: "",
            },
        ],
    },
    {
        name: "addnames",
        bit: 7,
        countBytes: 2,
        ArrayCountBytes: 2,
        lazy: false,
        useCountAsVal: false,
        type: "ArrayOfObject",
        spreadTo: [{
            name: "name"
        }],
        onEmpty: [],
        bookFlagOrder: ["id", "name"],
        child: [{
                name: "id",
                countBytes: 4,
                skip: true,
                useCountAsVal: true,
                type: "Number",
                onEmpty: null,
            },
            {
                name: "name",
                countBytes: 2,
                useCountAsVal: false,
                type: "String",
                onEmpty: "",
            },
            {
                name: "bookId",
                countBytes: 4,
                skip: true,
                useCountAsVal: true,
                type: "Number",
                onEmpty: null,
            },
        ],
    },
    {
        name: "places",
        countBytes: 2,
        bit: 8,
        ArrayCountBytes: 2,
        useCountAsVal: false,
        lazy: false,
        type: "ArrayOfObject",
        makeItStringFrom: "name",
        justOne: true,
        justOneFrom: "name",
        justOneType: "String",
        hasMoreThanOne: true,
        onEmpty: [],
        bookFlagOrder: ["id", "name"],
        child: [{
                name: "id",
                skip: true,
                countBytes: 4,
                useCountAsVal: true,
                type: "Number",
                onEmpty: null,
            },
            {
                name: "name",
                countBytes: 2,
                useCountAsVal: false,
                dontRead: true,
                type: "String",

                onEmpty: "",
            },
        ],
    },

    {
        name: "toyear",
        bit: 9,
        countBytes: 2,
        lazy: false,
        ArrayCountBytes: 2,
        makeItStringFrom: "name",
        justOne: true,
        justOneFrom: "name",
        justOneType: "String",
        hasMoreThanOne: false,
        useCountAsVal: false,
        type: "ArrayOfObject",
        bookFlagOrder: ["id", "name", "value"],
        onEmpty: [],
        child: [{
                name: "id",

                countBytes: 4,
                useCountAsVal: true,
                type: "Number",

                onEmpty: null,
            },
            {
                name: "name",
                countBytes: 2,
                useCountAsVal: false,
                skip: true,
                type: "String",
                dontRead: true,
                onEmpty: "",
            },
            {
                name: "value",
                countBytes: 2,
                skip: true,
                useCountAsVal: true,
                type: "Number",
                onEmpty: null,
            },
        ],
    },
    {
        name: "fromyear",
        countBytes: 2,
        bit: 10,
        lazy: false,
        ArrayCountBytes: 2,
        useCountAsVal: false,
        type: "ArrayOfObject",
        makeItStringFrom: "name",
        justOne: true,
        justOneFrom: "name",
        justOneType: "String",
        hasMoreThanOne: false,
        onEmpty: [],
        bookFlagOrder: ["id", "name", "value"],
        child: [{
                name: "id",
                countBytes: 4,
                useCountAsVal: true,

                type: "Number",
                onEmpty: null,
            },
            {
                name: "name",
                countBytes: 2,
                useCountAsVal: false,
                dontRead: true,
                skip: true,
                type: "String",
                onEmpty: "",
            },
            {
                name: "value",
                countBytes: 2,
                useCountAsVal: true,
                type: "Number",
                skip: true,
                onEmpty: null,
            },
        ],
    },
    {
        name: "mainvol",
        countBytes: 1,
        bit: 11,
        ArrayCountBytes: 2,
        useCountAsVal: false,
        skip: true,
        type: "ArrayOfObject",
        onEmpty: [],
        bookFlagOrder: ["id"],
        child: [{
            name: "id",
            countBytes: 4,
            useCountAsVal: true,
            type: "Number",
            onEmpty: null,
        }, ],
    },

    {
        name: "volumes",
        countBytes: 4,
        bit: 12,
        lazy: false,
        ArrayCountBytes: 2,
        useCountAsVal: false,
        spreadTo: [{
            name: "id"
        }, {
            name: "name"
        }, {
            name: "volume"
        }],
        type: "ArrayOfObject",
        bookFlagOrder: ["id", "name", "volume"],
        onEmpty: [],
        child: [{
                name: "id",
                countBytes: 4,
                useCountAsVal: true,
                type: "Number",

                onEmpty: null,
            },
            {
                name: "name",
                countBytes: 2,
                useCountAsVal: false,
                type: "String",
                skip: true,
                onEmpty: "",
            },
            {
                name: "volume",
                countBytes: 2,
                skip: true,
                useCountAsVal: false,
                type: "String",
                onEmpty: "",
            },
        ],
    },
    {
        name: "moredata",
        countBytes: 1,
        bit: 13,
        ArrayCountBytes: 2,
        useCountAsVal: false,
        type: "Object",
        onEmpty: null,
        skip: false,
        moreDataField: true,
        bookFlagOrder: ["isText", "isSidra", "dor", "removed"],
        child: [{
                name: "isText",
                countBytes: 1,
                useCountAsVal: true,
                type: "Number",
                onEmpty: null,
            },
            {
                name: "isSidra",
                countBytes: 1,
                useCountAsVal: true,
                type: "Number",
                onEmpty: null,
            },
            {
                name: "dor",
                countBytes: 1,
                useCountAsVal: true,
                type: "Number",
                onEmpty: null,
            },
            {
                name: "removed",
                countBytes: 1,
                useCountAsVal: true,
                type: "Number",
                onEmpty: null,
            },
        ],
    },
    {
        name: "changed",
        countBytes: 1,
        useCountAsVal: true,
        type: "Number",
        bit: 14,
        onEmpty: 0,
    },
    {
        name: "nameSort",
        bit: 15,
        countBytes: 4,
        useCountAsVal: true,
        type: "Number",
        onEmpty: 0,
    },
    {
        name: "authorSort",
        bit: 16,
        countBytes: 4,
        useCountAsVal: true,
        type: "Number",
        onEmpty: 0,
    },
    {
        name: "subbooks",
        countBytes: 4,
        bit: 17,
        lazy: false,
        ArrayCountBytes: 2,
        useCountAsVal: false,
        spreadTo: [{
                name: "id"
            },
            {
                name: "name"
            },
            {
                name: "author"
            },
            {
                name: "dor"
            },
        ],
        type: "ArrayOfObject",
        bookFlagOrder: ["id", "name", "author", "dor"],
        onEmpty: [],
        child: [{
                name: "id",
                countBytes: 4,
                useCountAsVal: true,
                type: "Number",
                onEmpty: null,
            },
            {
                name: "name",
                countBytes: 2,
                useCountAsVal: false,
                type: "String",
                onEmpty: "",
            },
            {
                name: "author",
                countBytes: 2,
                useCountAsVal: false,
                type: "String",
                onEmpty: "",
            },
            {
                name: "dor",
                countBytes: 4,
                useCountAsVal: true,
                type: "Number",
                onEmpty: null,
            },
        ],
    },
    {
        name: "pubYearValue",
        bit: 17,
        countBytes: 4,
        useCountAsVal: true,
        type: "Number",
        onEmpty: 0,
    },
];

function getNumber(dview, size, address) {
    let addr = Number(address);
    let num;
    /**@type {DataView} */
    let dv = dview;
    if (size == 1) num = dv.getInt8(addr);
    else if (size == 2) num = dv.getInt16(addr, true);
    else num = dv.getInt32(addr, true);
    return num;
}

function getString(vbuff, location) {
    let stringStartAt = getNumber(vbuff, 4, location);
    return stringStartAt;
}

function decompressItem(
    buff,
    addr = 0,
    flags = BookFlagInformation,
    order = bookFlagOrder
) {
    let vbuff = new DataView(buff);
    let location = addr;
    let obj = {
        _bookinfo: 1
    };
    //first let gets the flag
    let bookFlag = vbuff.getInt32(location, true);
    location += 4;
    obj._flag = bookFlag;
    order.forEach((keyName) => {
        let keyInfo = flags.find((k) => k.name == keyName);
        if (keyInfo.skip) return;
        let isSet = getBit(bookFlag, keyInfo.bit);
        //hmmm
        if (!isSet) {
            return;
        }
        if (keyInfo.type == "Number") {
            let num = getNumber(vbuff, keyInfo.countBytes, location);
            location += keyInfo.countBytes;
            obj[keyName] = num;
        } else if (
            keyInfo.type == "String" ||
            (keyInfo.type == "ArrayOfObject" && keyInfo.justOne)
        ) {
            let val = getString(vbuff, location);
            location += 4;
            obj[keyName] = val;
        } else if (keyInfo.type == "Object") {
            //this is more data
            const moreData = getNumber(vbuff, 2, location);
            location += 2;

            obj["moredata"] = moreData;
        } else if (keyInfo.type == "ArrayOfObject") {
            //get count
            let count = getNumber(vbuff, 2, location);
            obj[keyName + "_length"] = count;
            location += 2;
            if (count == 0) {
                obj[keyName + "_length"] = 0;
                return;
            }
            if (keyInfo.justOne) {
                let val = getString(vbuff, location);
                location += 4;
                obj[keyName] = val;
            } else {
                //we must have spread
                //let arr = [];
                let childs = keyInfo.child;

                for (let i = 0; i < count; i++) {
                    childs.forEach((child) => {
                        if (child.skip) return;
                        if (child.type == "Number") {
                            let num = getNumber(vbuff, child.countBytes, location);
                            obj[keyName + "_" + i + "_" + child.name] = num;
                            location += child.countBytes;
                        } else {
                            //must be string
                            let str = getString(vbuff, location);
                            location += 4;
                            obj[keyName + "_" + i + "_" + child.name] = str;
                        }
                    });
                }
            }
        }
    });
    return obj;
}

function getBit(number, bitPosition) {
    return (number & (1 << bitPosition)) === 0 ? 0 : 1;
}

export default {
    decompressItem,
    getBit
};