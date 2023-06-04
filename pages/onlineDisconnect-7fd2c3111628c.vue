var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{staticClass:"license-error-container font"},[_c('div',{staticClass:"license-error-inner"},[_c('br'),_c('h2',[_vm._v(_vm._s(_vm.$t("softwareNotUsed.title")))]),_c('h3',[_vm._v("\n      "+_vm._s(_vm.$route.params.mode == 2
          ? _vm.$t("softwareNotUsed.disconnectMsgSingleUser")
          : _vm.$t("softwareNotUsed.disconnectMsg"))+"\n    ")]),_c('div',{staticClass:"btn",staticStyle:{"margin":"auto"},on:{"click":_vm.connectAgain}},[_vm._v("\n      "+_vm._s(_vm.$t("softwareNotUsed.connectAgain"))+"\n    ")])])])
}
var staticRenderFns = []

export { render, staticRenderFns }