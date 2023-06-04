var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{ref:"bookAreaContainer",staticClass:"bookAreaContainer",class:{ close: !_vm.openDock }},_vm._l((_vm.getTabs),function(tab){return _c('book',{directives:[{name:"show",rawName:"v-show",value:(_vm.currentTabId == tab),expression:"currentTabId == tab"}],key:tab,attrs:{"tabId":tab},on:{"login":function($event){return _vm.$emit('login')}}})}),1)
}
var staticRenderFns = []

export { render, staticRenderFns }