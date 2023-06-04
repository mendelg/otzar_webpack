var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',[_c('div',{staticClass:"flex header"},[_c('div',{staticClass:"lbl-header"},[_vm._v("\n      מפרשי הדף\n    ")]),_c('div',[_c('div',{staticClass:"flex combo-options"},[_c('div',{staticClass:"flex"},[_c('BaseOverCircle',[_c('span',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({
                content: !_vm.showFilters
                  ? _vm.$t('mefo.showFilterOptions')
                  : _vm.$t('mefo.hideFilterOptions'),
                placement: 'right',
              }),expression:"{\n                content: !showFilters\n                  ? $t('mefo.showFilterOptions')\n                  : $t('mefo.hideFilterOptions'),\n                placement: 'right',\n              }"}],staticClass:"btn-header",staticStyle:{"width":"19px","height":"19px","display":"flex","justify-content":"center"},on:{"click":function($event){return _vm.$emit('toggleFilters')}}},[_c('div',{staticStyle:{"width":"18px","height":"18px","display":"flex","align-items":"center"}},[_c('div',{staticStyle:{"width":"16px","height":"16px","fill":"#fff","display":"flex","align-items":"center","justify-content":"center"}},[_c('Icons',{attrs:{"icon":!_vm.showFilters ? 'plus' : 'minimize',"height":"12px","width":"12px"}})],1)])])]),_c('BaseOverCircle',[_c('span',{staticClass:"btn-header btn-header-white btn-header-close",staticStyle:{"fill":"#fff","stroke":"none"},on:{"click":function($event){return _vm.$emit('closeMef')}}},[_c('div',{staticClass:"close-btn"},[_c('Icons',{attrs:{"icon":"exit","height":"10px","width":"10px"}})],1)])])],1)])])])])
}
var staticRenderFns = []

export { render, staticRenderFns }