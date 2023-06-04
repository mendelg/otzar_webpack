var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{staticClass:"main-setting-menu"},[_c('HeaderMenu',{attrs:{"title":_vm.$t('extensions.title'),"routeBackName":_vm.routeBackName}}),_c('ul',{staticClass:"list-main-setting list-menu"},[_c('li',{staticClass:"item"},[_c('RowItem',{directives:[{name:"disable",rawName:"v-disable"}],attrs:{"title":_vm.$t('extensions.myPdfs'),"HasIconItem":true,"iconItem":"y","HasIconArrow":false,"HasIconDisplay":false,"HasIconCheckbox":false},on:{"click":function($event){_vm.closeMenu();
          _vm.$store.state.myPdfWin = true;}}})],1),_c('li',{staticClass:"item"},[_c('RowItem',{directives:[{name:"disable",rawName:"v-disable"}],attrs:{"title":_vm.$t('extensions.pdfName'),"HasIconItem":true,"iconItem":"y","HasIconArrow":false,"HasIconDisplay":false,"HasIconCheckbox":false},on:{"click":_vm.openPdfImport}})],1)])],1)
}
var staticRenderFns = []

export { render, staticRenderFns }