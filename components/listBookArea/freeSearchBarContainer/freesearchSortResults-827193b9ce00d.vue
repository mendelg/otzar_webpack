var render = function render(){var _vm=this,_c=_vm._self._c;return (_vm.getShowResultsPopup)?_c('div',{directives:[{name:"click-outside",rawName:"v-click-outside",value:(_vm.closeResultsPopup),expression:"closeResultsPopup"}],staticClass:"results-container"},[_c('div',{staticClass:"title"},[_vm._v(_vm._s(_vm.$t("freeSearchResults.title")))]),_vm._l((_vm.list),function(result){return _c('div',{key:result.id,staticClass:"result-item",class:{ active: _vm.isActive(result.id) },on:{"click":function($event){return _vm.filter(result)}}},[_c('span',{staticClass:"item-title"},[_vm._v(_vm._s(result.title))]),_c('span',{staticClass:"item-num"},[_vm._v("("+_vm._s(result.num)+")")])])})],2):_vm._e()
}
var staticRenderFns = []

export { render, staticRenderFns }