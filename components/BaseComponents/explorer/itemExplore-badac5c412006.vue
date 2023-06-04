var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{staticClass:"item",class:{ active: _vm.active.name == _vm.item.name },on:{"dblclick":_vm.openFolder,"click":_vm.selectFolder}},[(!_vm.file)?_c('BaseIcon',{staticClass:"folder mrg-l-9",attrs:{"width":"17","height":"15","nameIcon":"icon-folder-normal-list","pathIcon":"icons-folder"}}):_c('BaseIcon',{staticClass:"folder mrg-l-9",attrs:{"width":"16.095","height":"17.245","nameIcon":"icon-folder-list-list","pathIcon":"icons-folder"}}),_c('span',[_vm._v(_vm._s(_vm.item.name || _vm.item.dir))])],1)
}
var staticRenderFns = []

export { render, staticRenderFns }