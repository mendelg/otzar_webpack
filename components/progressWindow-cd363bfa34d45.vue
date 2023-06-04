var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{staticClass:"outer-results-print"},[_c('div',{staticClass:"inner-results-print"},[_c('div',{staticClass:"font-13 bold text-color mrg-t-6 mrg-b-12"},[_vm._v("\n      "+_vm._s(_vm.$store.state.progressWindow.bottomMessage)+"\n    ")]),_c('span',{staticClass:"text-title"},[_vm._v(_vm._s(_vm.$store.state.progressWindow.topMessage))]),_c('freeSearchProgress',{attrs:{"show":!_vm.$store.state.progressWindow.hideProg,"percent":_vm.$store.state.progressWindow.percent,"search":_vm.progressTxt,"seconds":false,"message":""},on:{"stop":function($event){return _vm.stop()}}})],1)])
}
var staticRenderFns = []

export { render, staticRenderFns }