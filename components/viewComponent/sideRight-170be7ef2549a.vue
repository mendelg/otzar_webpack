var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{staticClass:"sideRight"},[_c('div',{staticClass:"container"},[_c('freeSearchBarContainer'),_c('Split',{staticClass:"flex-column",class:{ 'hide-gutter': !_vm.showList },attrs:{"direction":"vertical","gutterSize":18}},[_c('SplitArea',{directives:[{name:"show",rawName:"v-show",value:(_vm.showList),expression:"showList"}],attrs:{"size":50,"minSize":50}},[_c('FreeSearchList',{staticClass:"free-search-area"})],1),_c('SplitArea',{staticClass:"search-book-list",class:{ 'freelist-hidden': !_vm.showList },attrs:{"size":100}},[_c('listBookArea')],1)],1)],1)])
}
var staticRenderFns = []

export { render, staticRenderFns }