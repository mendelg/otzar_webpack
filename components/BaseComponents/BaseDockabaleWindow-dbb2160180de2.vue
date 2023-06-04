var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{staticClass:"container"},[(_vm.title)?_c('div',{staticClass:"header-dockabale dir-rtl drag"},[_c('span',{staticClass:"main-header title padd-l-3 drag-area w-100"}),_c('div',{staticClass:"icon-pin otz-icon no-bg no-bg",on:{"click":_vm.togglePin}},[_vm._v("\n      p\n    ")]),_c('span',{staticClass:"icon-del icon-close otz-icon no-bg no-bg",on:{"click":_vm.closeList}},[_vm._v("F")]),(_vm.canClose == true)?_c('span',{staticClass:"icon-general icons",on:{"click":_vm.closeFunc}},[_vm._v("t")]):_vm._e()]):_vm._e(),_c('div',{staticClass:"content h-100"},[_vm._t("content")],2)])
}
var staticRenderFns = []

export { render, staticRenderFns }