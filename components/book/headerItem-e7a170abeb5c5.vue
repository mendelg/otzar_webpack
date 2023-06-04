var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{ref:"container",staticStyle:{"height":"100%","width":"100%","background-color":"white"},on:{"click":function($event){return _vm.$emit('click')},"resize":_vm.reDraw}},[(!_vm.full)?_c('canvas',{ref:"image",attrs:{"width":_vm.imgWidth,"height":_vm.imgHeight}}):_c('img',{attrs:{"src":_vm.imgSrc,"width":_vm.imgWidth,"alt":""},on:{"load":function($event){return _vm.$emit('setLocation')}}})])
}
var staticRenderFns = []

export { render, staticRenderFns }