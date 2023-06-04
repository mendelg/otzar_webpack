import stamps from "./stamps";
export default class ImageProccessor {
    /**
     * @returns {HTMLCanvasElement} canvas object
     */
    static catImage(img, {
        x,
        y,
        w,
        h
    }) {
        const canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = w;
        canvas.height = h;

        ctx.drawImage(img, x, y, w, h, 0, 0, canvas.width, canvas.height);
        return canvas;
    }

    static createBmpFromPixels(width, height, pixelsBuffer) {
        let header = new Uint8Array(122);
        header[0] = 0x42;
        header[1] = 0x4d;
        header[10] = 0x7a;
        header[0xe] = 0x6c;
        header[0x16] = 0x1;
        header[0x1a] = 0x1;
        header[0x1c] = 0x20;
        header[0x1e] = 0x3;
        header[0x38] = 0xff;
        header[0x3b] = 0xff;
        header[0x3e] = 0xff;
        header[0x45] = 0xff;

        let head = Buffer.from(header);
        //set dims
        head.writeInt32LE(width, 0x12);
        head.writeInt32LE(height, 0x16);

        //set pixels size
        const pixSize = pixelsBuffer.length;
        const fileSize = pixSize + 122;
        //write pixels bytes count
        head.writeInt32LE(pixSize, 0x22);
        //write file size
        head.writeInt32LE(fileSize, 0x2);
        let px = Buffer.from(pixelsBuffer.buffer);
        let data = Buffer.concat([head, px]);
        return data;
    }
    /**
     * @param {Image|Canvas} img
     * (canvas can draw from: CSSImageValue|HTMLImageElement|SVGImageElement|HTMLVideoElement|HTMLCanvasElement|ImageBitmap|OffscreenCanvas)
     * @returns {HTMLCanvasElement} canvas object
     */
    static resizeImage(img, dist = {
        h: 250,
        w: 200
    }) {
        const canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.height = dist.h;
        canvas.width = dist.w;

        // get the scale
        let scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        // get the top left position of the image
        let x = canvas.width / 2 - (img.width / 2) * scale;
        let y = canvas.height / 2 - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        return canvas;
    }

    // static canvasToImgDOMObject(canvas) {
    //   return new Promise((resolve, reject) => {
    //     let img = new Image();
    //     img.onload = () => resolve(img);
    //     img.onerror = reject;
    //     img.src = canvas.toDataURL();
    //   });
    // }

    /** @returns {HTMLCanvasElement} */
    static imgToCanvas(img) {
        const canvas =
            typeof OffscreenCanvas !== "undefined" ?
            new OffscreenCanvas(0, 0) :
            document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        return canvas;
        var dataURL = canvas.toDataURL("image/png");
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }

    static cloneCanvas(cnv) {
        const canvas =
            typeof OffscreenCanvas !== "undefined" ?
            new OffscreenCanvas(0, 0) :
            document.createElement("canvas");
        canvas.width = cnv.width;
        canvas.height = cnv.height;
        var ctx = canvas.getContext("2d");
        // ctx.drawImage(cnv, 0, 0);
        return canvas;
    }

    /** @returns {dataURL} dataUrl */
    static bufferToDataUrl(buffer) {
        let b64 = buffer.toString("base64");
        return `data:image/png;base64,${b64}`;
    }

    static async base64ToImage(b64) {
        let tmpImg = new Image();
        let prms = new Promise((resolve, reject) => {
            tmpImg.onload = () => resolve(tmpImg);
        });
        tmpImg.src = b64;
        let img = await prms;
        return img;
    }

    /** @param {Image} image */
    static compressImage(image) {
        let base64 = /^data:image/.test(image.src) ?
            image.src :
            this.imgToCanvas(image).toDataURL();
        // let binData = atob(base64);
        // return binData;
        return base64;
    }

    static blobToDataUrl(blob) {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.addEventListener("loadend", () => {
                let contents = reader.result;
                resolve(contents);
            });
        });
    }

    static blobToObjectURL(blob) {
        return URL.createObjectURL(blob);
    }

    /**  @param {HTMLCanvasElement} canvas */
    static canvasToBlob(canvas, type = "image/png") {
        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            });
        });
    }

    /**  @param {HTMLCanvasElement|OffscreenCanvas} canvas */
    static async canvasToDataUrl(canvas) {
        const isOffScreen =
            typeof OffscreenCanvas !== "undefined" &&
            canvas instanceof OffscreenCanvas;

        let imgBlob, dataUrl;
        if (isOffScreen) {
            imgBlob = await canvas.convertToBlob();
            dataUrl = await this.blobToDataUrl(imgBlob);
        } else {
            dataUrl = canvas.toDataURL();
        }
        return dataUrl;
    }

    static bufferToBlob(buffer) {
        return new Blob(Buffer.from(buffer, "binary"));
    }

    /**  @param {HTMLCanvasElement|OffscreenCanvas} canvas */
    /**  @param {String} stampTxt */
    static addStamps(canvas, stampTxt = "") {
        return new Promise((res, rej) => {
            try {
                let context = canvas.getContext("2d");
                let width = canvas.width;
                let height = canvas.height;
                const image = context.getImageData(0, 0, width, height);
                const {
                    data
                } = image;
                //create 2d array of pixels
                let pixelsArr = new Array(height)
                    .fill(0)
                    .map(() => new Array(width).fill(0));

                let colorIndices;
                for (let i = 0; i < width; i++)
                    for (let j = 0; j < height; j++) {
                        colorIndices = getColorIndicesForCoord(i, j, width);
                        let [redIndex, greenIndex, blueIndex, alphaIndex] = colorIndices;
                        let Y =
                            0.2126 * data[redIndex] +
                            0.7152 * data[greenIndex] +
                            0.0722 * data[blueIndex];

                        let c = Y < 128 ? 0 : 1;
                        pixelsArr[i][j] = c;
                    }

                let stampW = 53,
                    stampH = 25;

                let generalFound = [];

                //get random number in range of canvas to start searching for white area
                let startPixelX = Math.floor(Math.random() * (width - 100)) + 50;
                let startPixelY = Math.floor(Math.random() * (height - 100)) + 50;

                let indexX = startPixelX;
                let indexY = startPixelY;
                let loops = 0;
                const maxLoops = 100;
                const maxStamps = 2;

                while (generalFound.length < maxStamps && loops < maxLoops) {
                    let lineData = pixelsArr[indexX];
                    let pure = true;

                    //if the randomed pixel is not white
                    if (lineData[indexY] === 0) {
                        let a = indexY;
                        while (lineData[a] === 0 && a < lineData.length) {
                            a++;
                        }
                        if (lineData.length === a) {
                            indexX = Math.floor(Math.random() * (width - 100)) + 50;

                            loops++;
                            continue;
                        } else indexY = a;
                    }
                    loops++;
                    //if it is white
                    for (
                        let x = indexX; x < pixelsArr.length && x < indexX + stampW && pure; x++
                    )
                        for (
                            let y = indexY; y < pixelsArr[x].length && y < indexY + stampH && pure; y++
                        )
                            try {
                                if (pixelsArr[x][y] !== 1) {
                                    pure = false;
                                    break;
                                }
                            } catch (ex) {}

                    if (pure) {
                        generalFound.push([indexX, indexY]);
                        if (generalFound.length === maxStamps) break;

                        //random a new point
                        indexX = Math.floor(Math.random() * (width - 100)) + 50;
                        indexY = Math.floor(Math.random() * (height - 100)) + 50;
                    } else {
                        indexY++;
                    }
                }

                if (generalFound.length == 0) res();

                context.font = "8px Arial";

                var img = new Image();
                img.onload = function() {
                    for (let i = 0; i < generalFound.length; i++) {
                        context.drawImage(
                            img,
                            generalFound[i][0],
                            generalFound[i][1],
                            stampW,
                            17
                        );
                        context.fillStyle = "#000000";
                        context.fillText(
                            stampTxt,
                            generalFound[i][0] + 25,
                            generalFound[i][1] + 25
                        );
                    }
                    res();
                };
                img.src = stamps[0];
            } catch (ex) {
                res();
            }
        });
    }

    static rotateCanvas(
        cnv,
        angle,
        cnvWidth = cnv.width,
        cnvHeight = cnv.height
    ) {
        if (angle > 180) angle = angle - 360;

        function diffAngleSize(angle, width, height) {
            angle = Math.abs(angle);
            if (angle === 180) return {
                w: width,
                h: height
            };
            angle = (angle * Math.PI) / 180;
            let leftAngle = (90 * Math.PI) / 180 - angle;
            let long = Math.max(width, height),
                short = Math.min(width, height);
            let rightW = Math.cos(angle) * short,
                leftW = Math.cos(leftAngle) * long;
            let rightH = Math.sin(angle) * short,
                leftH = Math.sin(leftAngle) * long;
            return {
                w: rightW + leftW,
                h: rightH + leftH
            };
        }
        let width = diffAngleSize(angle, cnvWidth, cnvHeight).w;
        let height = diffAngleSize(angle, cnvWidth, cnvHeight).h;

        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext("2d");

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.drawImage(cnv, -cnvWidth / 2, -cnvHeight / 2);
        ctx.restore();
        return canvas;
    }

    static getLastWhiteRowInRange(cvs, heightToCkeck) {
        /** @type HTMLCanvasElement */
        const canvas = cvs;

        const pixels = canvas
            .getContext("2d")
            .getImageData(0, 0, canvas.width, heightToCkeck);
        // const BLACK = 15;
        // const WHITE = 238;
        const COLOR = 100;
        const pixel = 4;
        const rowLen = canvas.width * pixel;
        const rowsCnt = pixels.data.length / rowLen; //==heightToCkeck
        let notEmptyRow = true;
        let rowNum = rowsCnt;
        //iterator rows from bottom to top
        while (notEmptyRow && rowNum > 0) {
            const start = (rowNum - 1) * rowLen;
            const end = start + rowLen;
            const row = pixels.data.slice(start, end);
            let isColorRow = false;
            //iterator pixels in row
            for (let i = 0; i < row.length; i = i + pixel) {
                const [r, g, b, a] = row.slice(i, i + pixel);
                let isColorPixel = (r < COLOR || g < COLOR || b < COLOR) && a !== 0;
                isColorRow = isColorRow || isColorPixel;
            }
            notEmptyRow = isColorRow;
            if (notEmptyRow) rowNum--;
        }
        //TODO if all rows are coloring
        let newHeight = rowNum - 1;
        return newHeight > 0 ? newHeight : rowsCnt;
    }
}

const getColorIndicesForCoord = (x, y, width) => {
    const red = y * (width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
};