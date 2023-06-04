var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',_vm._l((_vm.vols),function(v,index){return _c('div',{key:index},[_c('item-book',{attrs:{"book":v,"type":"book","active":_vm.activeBook,"checked":_vm.getBooksChecked[v.id],"volumesCount":_vm.book.volumes_length},on:{"set-volumes":_vm.setVols}})],1)}),0)
}
var staticRenderFns = []

export { render, staticRenderFns }