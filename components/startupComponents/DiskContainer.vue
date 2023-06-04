var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{staticClass:"lstdisk"},[_c('div',{staticStyle:{"display":"flex"}},_vm._l((_vm.disks),function(disk){return _c('disk',{key:disk.id,attrs:{"selected":_vm.selected == disk,"disk":disk},on:{"click":function($event){return _vm.setSelected(disk)}}})}),1),_c('button',{directives:[{name:"show",rawName:"v-show",value:(_vm.showSelect),expression:"showSelect"}],staticClass:"button",on:{"click":_vm.startSelectedDisk}},[_vm._v("\n    "+_vm._s(_vm.$t("general.confirm"))+"\n  ")])])
}
var staticRenderFns = []

export { render, staticRenderFns }