var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{staticClass:"bookArea"},[_c('bookItem',{attrs:{"tabId":_vm.tabId,"pages":_vm.tabData.pages || [],"drawData":_vm.tabData.drawData,"mm":_vm.mm,"drawFs":_vm.drawFs,"rotateImage":_vm.rotateImage},on:{"addexten":function($event){return _vm.$emit('addexten')},"toggleocr":_vm.toggleOCR,"print":_vm.emitPrint,"login":function($event){return _vm.$emit('login')}}}),(_vm.showMagnify)?_c('magnifyImg',{attrs:{"bookId":_vm.tabData.book,"page":_vm.magnifyPage,"magnifyPosition":_vm.magnifyPosition,"refresh":_vm.refresh,"imageRatio":_vm.imgRatio,"magRatio":1.5,"marginLeft":_vm.marginLeft},on:{"dragging":_vm.doMag}}):_vm._e()],1)
}
var staticRenderFns = []

export { render, staticRenderFns }