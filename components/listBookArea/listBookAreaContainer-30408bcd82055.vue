var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{staticClass:"listBookAreaContainer",class:[_vm.baseClass, _vm.activeClass],on:{"click":function($event){return _vm.setFreeSearchListActive(false)}}},[_c('bookListHandle',{directives:[{name:"show",rawName:"v-show",value:(!_vm.showList),expression:"!showList"}],staticClass:"top",attrs:{"txt":"v"},on:{"click":_vm.toggleShowFreeSearchList}}),_c('div',[_c('searchBarContainer',{staticClass:"top-search-bar"}),_c('headerBookListContainer',{on:{"checkall":_vm.checkAll}})],1),_c('listBookContainer'),_c('listStatus')],1)
}
var staticRenderFns = []

export { render, staticRenderFns }