var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{staticClass:"title"},[(!_vm.allBooks)?_c('span',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({
      content: _vm.getNameListBook,
      placement: 'top',
    }),expression:"{\n      content: getNameListBook,\n      placement: 'top',\n    }"}]},[_vm._v(_vm._s(_vm.getNameListBook))]):_vm._e(),(_vm.allBooks)?_c('span',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({
      content: _vm.$t('freeSearchInput.searchIn.allBooks'),
      placement: 'top',
    }),expression:"{\n      content: $t('freeSearchInput.searchIn.allBooks'),\n      placement: 'top',\n    }"}]},[_vm._v(_vm._s(_vm.$t("freeSearchInput.searchIn.allBooks")))]):_vm._e(),_vm._t("default")],2)
}
var staticRenderFns = []

export { render, staticRenderFns }