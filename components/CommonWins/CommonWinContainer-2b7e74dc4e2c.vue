var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',[(_vm.winShows.commentsShow)?_c('UserComments',{on:{"close":function($event){return _vm.setShow('commentsShow', false)}}}):_vm._e(),(_vm.winShows.keysShow)?_c('KeysPopup',{on:{"close":function($event){return _vm.setShow('keysShow', false)}}}):_vm._e(),(_vm.winShows.marksShow)?_c('MarkersPopup',{on:{"close":function($event){return _vm.setShow('marksShow', false)}}}):_vm._e(),(_vm.winShows.linksShow)?_c('LinksPopup',{on:{"close":function($event){return _vm.setShow('linksShow', false)}}}):_vm._e()],1)
}
var staticRenderFns = []

export { render, staticRenderFns }