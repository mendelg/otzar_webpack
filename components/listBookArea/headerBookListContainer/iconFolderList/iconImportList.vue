var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({ content: _vm.tooltip, placement: 'right' }),expression:"{ content: tooltip, placement: 'right' }"}],staticClass:"icon",class:{ 'no-radius': _vm.listType == 'free' }},[_c('BaseIconOpenFolder',{attrs:{"listType":_vm.listType,"nameIcon":_vm.nameIcon},on:{"click":_vm.importList}})],1)
}
var staticRenderFns = []

export { render, staticRenderFns }