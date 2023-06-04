var render = function render(){var _vm=this,_c=_vm._self._c;return (
    !_vm.userSettings.settings.showPagePreview ||
      _vm.userSettings.settings.showPagePreview == 'on'
  )?_c('div',{directives:[{name:"zindex",rawName:"v-zindex"},{name:"body",rawName:"v-body"}],ref:"container",staticClass:"header-container",style:({ width: _vm.previewPageSize })},[_c('headerItem',{attrs:{"currentHeaderData":_vm.currentHeaderData,"book":_vm.book,"full":!_vm.userSettings.settings.pagePreviewType ||
        _vm.userSettings.settings.pagePreviewType == 'full'},on:{"setHeight":_vm.setHeight,"setLocation":_vm.setHeaderLocation}})],1):_vm._e()
}
var staticRenderFns = []

export { render, staticRenderFns }