var render = function render(){var _vm=this,_c=_vm._self._c;return (!_vm.hide)?_c('div',{ref:"container",staticClass:"gzir flex-column",class:{
    active: _vm.isActive,
  },attrs:{"id":'freebook_' + _vm.bookIndex + '_' + _vm.gzirIndex}},[_c('div',{staticClass:"flex flex-bet"},[_c('span',{directives:[{name:"show",rawName:"v-show",value:(_vm.page > 0),expression:"page > 0"}],staticClass:"text-page"},[_vm._v(_vm._s(_vm.$t("general.page") + " " + _vm.page))])]),_c('div',{staticClass:"relative",class:{ 'full-image': _vm.fullImage }},[_c('spinnerCircle',{directives:[{name:"show",rawName:"v-show",value:(_vm.showSpinner),expression:"showSpinner"}],attrs:{"margin":30}}),_c('canvas',{ref:"image",staticClass:"gzirImg",on:{"click":_vm.openResultInBook}})],1)]):_vm._e()
}
var staticRenderFns = []

export { render, staticRenderFns }