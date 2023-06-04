var render = function render(){var _vm=this,_c=_vm._self._c;return (_vm.appMode.offline() || _vm.sifApp)?_c('div',{directives:[{name:"cdrag",rawName:"v-cdrag"}],staticClass:"down-left"},[(_vm.$store.getters['bookListRefresh/getStatus'] != 'done')?_c('NotifyUserBooksRrefresh'):_vm._e(),(_vm.showNotifier)?_c('NotifyUserUpdatesProcess'):_vm._e(),(_vm.$store.state.print.show && _vm.appMode.offline())?_c('NotifyUserPrintProcess'):_vm._e()],1):_vm._e()
}
var staticRenderFns = []

export { render, staticRenderFns }