export let mobile = false;
if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    )
) {
    mobile = true;
}

let plug = {};
window._mobile = false; //mobile;
plug.install = function(Vue) {
    Vue._mobile = false; //mobile;

    Vue.prototype.$_mobile = mobile;
};

export default plug;