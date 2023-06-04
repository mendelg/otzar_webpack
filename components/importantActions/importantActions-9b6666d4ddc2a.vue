var render = function render(){var _vm=this,_c=_vm._self._c;return _c('BaseCleanPopup',{directives:[{name:"body",rawName:"v-body"},{name:"zindex",rawName:"v-zindex"}],ref:"popup",attrs:{"mask":true,"h":40,"w":300,"winh":446,"winw":317},on:{"close":_vm.closeWin},scopedSlots:_vm._u([{key:"header",fn:function(){return [_c('div',[_vm._v(_vm._s(_vm.$t("general.ImportantMsg")))])]},proxy:true}])},[_c('div',{staticClass:"content"},[_c('div',{staticClass:"msgs"},_vm._l((_vm.msgs),function(msg){return _c('p',{key:msg.id},[_vm._v("* "+_vm._s(msg.msg))])}),0),_c('div',{staticClass:"bottom"},[_c('base-button',{on:{"click":_vm.start}},[_vm._v(_vm._s(_vm.$t("general.play")))])],1)])])
}
var staticRenderFns = []

export { render, staticRenderFns }