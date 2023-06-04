var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.showProgress),expression:"showProgress"}],staticClass:"container flex"},[_c('div',[_c('div',{staticClass:"content"},[_c('div',[_c('div',{staticClass:"text"},[_vm._v("\n          "+_vm._s(_vm.processMessage)+"\n        ")]),_c('progressBar',{attrs:{"percentage":_vm.getPercentage,"show":_vm.show,"loadingClass":"fsloadingbar","stopAnimation":_vm.stopAnimation}})],1)])])])
}
var staticRenderFns = []

export { render, staticRenderFns }