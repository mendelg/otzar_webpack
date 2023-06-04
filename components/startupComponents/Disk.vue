var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{staticClass:"card",class:{ selected: _vm.selected },on:{"click":_vm.setMe}},[_c('img',{staticStyle:{"width":"100%"},attrs:{"src":require("@/assets/img/load-img.png"),"alt":"disk image"}}),_c('div',{staticClass:"container"},[_vm._m(0),_c('p',[_vm._v(_vm._s(_vm.disk.mountPoint))]),_c('p',[_vm._v("דיסק חיצוני")])])])
}
var staticRenderFns = [function (){var _vm=this,_c=_vm._self._c;return _c('h4',[_c('b',[_vm._v("דיסק אוצר החכמה")])])
}]

export { render, staticRenderFns }