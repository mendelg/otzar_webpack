export default {
    base64ToArrayBuffer,
    saveByteArray
};

function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);

    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }
    return bytes;
}

var saveByteArray = (function() {
    var a = document.createElement("a");

    document.body.appendChild(a);

    a.style = "display: none";

    return function(data, name) {
        var blob = new Blob(data, {
                type: "text/plain"
            }),
            url = window.URL.createObjectURL(blob);

        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
    };
})();