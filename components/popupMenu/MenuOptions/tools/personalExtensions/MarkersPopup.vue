var render = function render(){var _vm=this,_c=_vm._self._c;return _c('popupUserExtensions',{attrs:{"title":_vm.$t('userDefaultFolders.markers'),"name":"marker","list":_vm.geMarkers,"status":_vm.status,"listCheckedIds":_vm.listCheckedIds,"icon":"5","total":_vm.totalRows,"limit":_vm.limit,"offset":_vm.offset},on:{"close":function($event){return _vm.$emit('close')},"inc":_vm.getRows,"search":_vm.doSearch}})
}
var staticRenderFns = []

export { render, staticRenderFns }