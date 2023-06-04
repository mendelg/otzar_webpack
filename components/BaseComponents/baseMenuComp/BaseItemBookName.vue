var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{staticClass:"item-book row-menu",class:{ selected: _vm.book.id == _vm.bookSelectedId },on:{"click":function($event){$event.stopPropagation();return _vm.click.apply(null, arguments)}}},[_c('span',{directives:[{name:"show",rawName:"v-show",value:(_vm.book.id == _vm.bookSelectedId),expression:"book.id == bookSelectedId"}],staticClass:"font-icon check-icon"},[_vm._v("A")]),_c('div',{staticClass:"container-text-item"},[_c('nameBook',{attrs:{"name":_vm.getName}}),_c('nameAuthor',{attrs:{"name":_vm.book.mainAuthorName}})],1),_c('div',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({
      content: this.$t('changeBookInfo.selectBook'),
      placement: 'right',
    }),expression:"{\n      content: this.$t('changeBookInfo.selectBook'),\n      placement: 'right',\n    }"}],staticClass:"next",on:{"click":function($event){return _vm.$emit('change')}}},[_c('baseIcon',{attrs:{"width":"9.451","height":"7.516","pathIcon":"icons","nameIcon":"arrow-advanced-search-black"}})],1)])
}
var staticRenderFns = []

export { render, staticRenderFns }