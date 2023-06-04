let sizes = {};

if (
    navigator.platform != "iPad" &&
    navigator.platform != "iPhone" &&
    navigator.platform != "iPod"
) {
    sizes.innerWidth = window.innerWidth;
    sizes.innerHeight = window.innerHeight;
    //I'll use window.winSizes.innerWidth in production
} else {
    sizes.innerWidth = screen.width;
    sizes.innerHeight = screen.height;
}

window.winSizes = sizes;