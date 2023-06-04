var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{staticClass:"flex-g-1 outer-book-area",class:{ 'full-vh': _vm.$store.state.bookOnlyMode }},[(_vm.showBook)?_c('booksContainer',{staticClass:"book",on:{"login":function($event){return _vm.$emit('login')}}}):_vm._e(),(!_vm.showBook && !_vm.$store.state.bookOnlyMode)?_c('welcomePage',{staticClass:"font"}):_vm._e()],1)
}
var staticRenderFns = []

export { render, staticRenderFns }