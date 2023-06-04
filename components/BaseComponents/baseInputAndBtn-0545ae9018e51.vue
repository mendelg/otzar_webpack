var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{staticClass:"input-btn-container flex"},[_c('input',{directives:[{name:"select",rawName:"v-select.focus",modifiers:{"focus":true}}],ref:"input",staticClass:"input-border",attrs:{"type":"text","placeholder":_vm.placeholder},on:{"keyup":function($event){if(!$event.type.indexOf('key')&&_vm._k($event.keyCode,"enter",13,$event.key,"Enter"))return null;return _vm.add.apply(null, arguments)}}}),_c('div',{staticClass:"btn",on:{"click":_vm.add}},[_vm._v(_vm._s(_vm.text))])])
}
var staticRenderFns = []

export { render, staticRenderFns }