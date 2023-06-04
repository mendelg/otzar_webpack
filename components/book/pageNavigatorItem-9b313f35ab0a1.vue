var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{staticClass:"item page-nav-item",class:{ 'empty-page': _vm.position == 0 },attrs:{"active":_vm.active,"position":_vm.position},on:{"mouseleave":_vm.hideHeader,"mouseenter":_vm.showHeader,"click":function($event){return _vm.goToPage()}}},[_c('span',{staticClass:"text"},[_vm._v(_vm._s(_vm.letter))])])
}
var staticRenderFns = []

export { render, staticRenderFns }