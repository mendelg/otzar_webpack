var render = function render(){var _vm=this,_c=_vm._self._c;return _c('div',{staticClass:"tools-container"},[(!_vm.txtBook)?_c('div',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({
      content: this.$t('toolbox.fitHeight'),
      placement: 'right',
      classes: 'machon-tooltip',
    }),expression:"{\n      content: this.$t('toolbox.fitHeight'),\n      placement: 'right',\n      classes: 'machon-tooltip',\n    }"}],staticClass:"item item-fit-w"},[_c('div',{class:['font-icon-bar font-icon', { active: _vm.fit == 'height' }],on:{"click":_vm.fitToHeight}},[_vm._v("\n      d\n    ")])]):_vm._e(),(!_vm.txtBook)?_c('div',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({
      content: this.$t('toolbox.fitWidth'),
      placement: 'right',
      classes: 'machon-tooltip',
    }),expression:"{\n      content: this.$t('toolbox.fitWidth'),\n      placement: 'right',\n      classes: 'machon-tooltip',\n    }"}],staticClass:"item"},[_c('div',{class:['font-icon-bar font-icon width', { active: _vm.fit == 'width' }],on:{"click":_vm.fitToWidth}},[_vm._v("\n      d\n    ")])]):_vm._e(),(!_vm.isWindow(_vm.tabId) && !this.$store.state.bookOnlyMode)?_c('div',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({
      content: this.$t('toolbox.fullScreen'),
      placement: 'right',
      classes: 'machon-tooltip',
    }),expression:"{\n      content: this.$t('toolbox.fullScreen'),\n      placement: 'right',\n      classes: 'machon-tooltip',\n    }"}],staticClass:"item"},[_c('div',{class:['font-icon-bar font-icon', { active: _vm.fullScreen }],on:{"click":_vm.setFullScreen}},[_vm._v("\n      "+_vm._s(_vm.getFullScreenIcon)+"\n    ")])]):_vm._e(),(!_vm.txtBook)?_c('div',{staticClass:"item",attrs:{"tabindex":"0"},on:{"keyup":_vm.doZoom}},[_c('baseDropDown',{class:['left zoom', { active: _vm.zoomValue != 100 }],attrs:{"selfClose":false},scopedSlots:_vm._u([{key:"button",fn:function(){return [_c('div',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({
            content: _vm.$t('toolbox.zoom'),
            placement: 'right',
            classes: 'machon-tooltip',
          }),expression:"{\n            content: $t('toolbox.zoom'),\n            placement: 'right',\n            classes: 'machon-tooltip',\n          }"}],staticClass:"font-icon-bar font-icon"},[_vm._v("\n          f\n        ")])]},proxy:true},{key:"list",fn:function(){return [_c('div',{staticClass:"flex flex-align-center flex-bet"},[_c('div',{staticClass:"present mrg-l-12 flex flex-align-center",staticStyle:{"line-height":"33px"}},[_vm._v("\n            "+_vm._s(_vm.zoomValue)+"%\n          ")]),_c('div',{staticClass:"flex"},[_c('div',{staticClass:"zoom-act zoom-in icon-circle mrg-l-6",class:{ disable: _vm.zoomValue >= _vm.maxZoom },on:{"click":function($event){return _vm.zoomInOut(1)},"dblclick":function($event){$event.stopPropagation();}}},[_vm._v("\n              +\n            ")]),_c('div',{staticClass:"zoom-act zoom-out icon-circle mrg-l-6",class:{ disable: _vm.zoomValue <= _vm.minZoom },on:{"click":function($event){return _vm.zoomInOut(-1)},"dblclick":function($event){$event.stopPropagation();}}},[_vm._v("\n              -\n            ")]),_c('baseButton',{on:{"dblclick":function($event){$event.stopPropagation();},"click":_vm.initZoom}},[_vm._v(_vm._s(_vm.$t("toolbox.reset")))])],1)])]},proxy:true}],null,false,2384989043)})],1):_vm._e(),_c('div',{staticClass:"seperator"}),(!_vm.txtBook && !_vm.customBook)?_c('div',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({
      content: this.$t('toolbox.ocr'),
      placement: 'right',
      classes: 'machon-tooltip',
    }),expression:"{\n      content: this.$t('toolbox.ocr'),\n      placement: 'right',\n      classes: 'machon-tooltip',\n    }"}],staticClass:"item"},[_c('div',{directives:[{name:"kiosk",rawName:"v-kiosk"}],class:['font-icon-bar font-icon', { active: _vm.OCREnabled }],on:{"click":_vm.toggleOcr}},[_vm._v("\n      b\n    ")])]):_vm._e(),_c('div',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({
      content: _vm.printToolTip,
      placement: 'right',
      classes: 'machon-tooltip',
    }),expression:"{\n      content: printToolTip,\n      placement: 'right',\n      classes: 'machon-tooltip',\n    }"}],staticClass:"item"},[_c('div',{directives:[{name:"disable",rawName:"v-disable"}],class:[
        'font-icon-bar font-icon',
        { active: _vm.printBookVisibility },
        { disable: !_vm.bookAllowed },
      ],on:{"click":_vm.print}},[_vm._v("\n      h\n    ")])]),_c('div',{staticClass:"seperator"}),(!_vm.txtBook)?_c('div',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({
      content: this.$t('toolbox.userExtens'),
      placement: 'right',
      classes: 'machon-tooltip',
    }),expression:"{\n      content: this.$t('toolbox.userExtens'),\n      placement: 'right',\n      classes: 'machon-tooltip',\n    }"}],staticClass:"item"},[_c('div',{directives:[{name:"kiosk",rawName:"v-kiosk"}],class:['font-icon-bar font-icon', { active: _vm.showAdds }],on:{"click":_vm.showUserAdditions}},[_vm._v("\n      c\n    ")])]):_vm._e(),_c('div',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({
      content: this.$t('toolbox.link'),
      placement: 'right',
      classes: 'machon-tooltip',
    }),expression:"{\n      content: this.$t('toolbox.link'),\n      placement: 'right',\n      classes: 'machon-tooltip',\n    }"}],staticClass:"item"},[_c('div',{staticClass:"font-icon-bar font-icon",on:{"click":_vm.link}},[_vm._v("i")])]),_c('div',{staticClass:"seperator"}),(!_vm.$store.state.bookOnlyMode)?_c('div',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({
      content: this.getFavoritesTooltip,
      placement: 'right',
      classes: 'machon-tooltip',
    }),expression:"{\n      content: this.getFavoritesTooltip,\n      placement: 'right',\n      classes: 'machon-tooltip',\n    }"}],staticClass:"item fav",class:{ active: _vm.getFavActive }},[_c('div',{directives:[{name:"kiosk",rawName:"v-kiosk"}],staticClass:"font-icon-bar font-icon",on:{"click":_vm.addToFavorites}},[_vm._v("\n      "+_vm._s(_vm.getFavoritesIcon)+"\n    ")])]):_vm._e(),(!_vm.txtBook && !_vm.customPDFBook && !_vm.customBook)?_c('div',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({
      content: _vm.mmToolTip,
      placement: 'right',
      classes: 'machon-tooltip',
    }),expression:"{\n      content: mmToolTip,\n      placement: 'right',\n      classes: 'machon-tooltip',\n    }"}],staticClass:"item mm-icon",on:{"click":_vm.toggleMM}},[_c('div',{directives:[{name:"kiosk",rawName:"v-kiosk"}],staticClass:"font-icon-bar font-icon",class:{ active: _vm.showMm }},[_vm._v("\n      "+_vm._s(_vm.getIconMM)+"\n    ")])]):_vm._e(),(_vm.hasFsResults)?_c('div',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({
      content: _vm.showHideFs,
      placement: 'right',
      classes: 'machon-tooltip',
    }),expression:"{\n      content: showHideFs,\n      placement: 'right',\n      classes: 'machon-tooltip',\n    }"}],staticClass:"item",on:{"click":function($event){return _vm.removeFsMarks()}}},[_c('div',{class:['font-icon-bar font-icon hide-results', { active: !_vm.drawFs }]},[(!_vm.drawFs)?_c('div',[_c('div',{staticClass:"mef-icon"},[_vm._v("l")])]):_vm._e(),(_vm.drawFs)?_c('div',[_c('div',{staticClass:"mef-icon"},[_vm._v("l")])]):_vm._e()])]):_vm._e(),(!_vm.$store.state.bookOnlyMode)?_c('div',{staticClass:"seperator"}):_vm._e(),(!_vm.$store.state.bookOnlyMode)?_c('div',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({
      content: this.$t('toolbox.openBook'),
      placement: 'right',
      classes: 'machon-tooltip',
    }),expression:"{\n      content: this.$t('toolbox.openBook'),\n      placement: 'right',\n      classes: 'machon-tooltip',\n    }"}],staticClass:"item",on:{"click":function($event){return _vm.addBook()}}},[_c('div',{staticClass:"font-icon-bar font-icon"},[_vm._v("j")])]):_vm._e(),_c('div',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({
      content: this.$t('toolbox.detailesBook'),
      placement: 'right',
      classes: 'machon-tooltip',
    }),expression:"{\n      content: this.$t('toolbox.detailesBook'),\n      placement: 'right',\n      classes: 'machon-tooltip',\n    }"}],staticClass:"item"},[_c('div',{class:['font-icon-bar font-icon', { active: _vm.bookDetailsVisibility }],on:{"click":function($event){$event.stopPropagation();return _vm.bookDetails.apply(null, arguments)}}},[_vm._v("\n      a\n    ")])]),(!_vm.$store.state.bookOnlyMode)?_c('div',{staticClass:"seperator"}):_vm._e(),(!_vm.$store.state.bookOnlyMode && _vm.isMefoMask)?_c('div',{staticClass:"item"},[_c('div',{staticClass:"hide-results",class:[
        'font-icon-bar font-icon center-it',
        { active: _vm.$store.state.tabs[this.tabId].showMask },
      ],on:{"click":function($event){$event.stopPropagation();return _vm.toggleMask.apply(null, arguments)}}},[(_vm.$store.state.tabs[this.tabId].showMask)?_c('div',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({
          content: this.$t('toolbox.maskOff'),
          placement: 'right',
          classes: 'machon-tooltip',
        }),expression:"{\n          content: this.$t('toolbox.maskOff'),\n          placement: 'right',\n          classes: 'machon-tooltip',\n        }"}]},[_c('div',{staticClass:"mef-icon"},[_vm._v("l")])]):_vm._e(),(!_vm.$store.state.tabs[this.tabId].showMask)?_c('div',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({
          content: this.$t('toolbox.maskOn'),
          placement: 'right',
          classes: 'machon-tooltip',
        }),expression:"{\n          content: this.$t('toolbox.maskOn'),\n          placement: 'right',\n          classes: 'machon-tooltip',\n        }"}],class:[
          'font-icon-bar font-icon center-it',
          { active: _vm.$store.state.tabs[this.tabId].showMask },
        ],on:{"click":function($event){$event.stopPropagation();return _vm.toggleMask.apply(null, arguments)}}},[_c('div',{staticClass:"mef-icon"},[_vm._v("x")])]):_vm._e()])]):_vm._e(),(!_vm.$store.state.bookOnlyMode && !_vm.tabId.startsWith('win') && _vm.isMefo)?_c('div',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({
      content: _vm.$store.state.mefo.enable
        ? this.$t('toolbox.mefOff')
        : this.$t('toolbox.mefOn'),
      placement: 'right',
      classes: 'machon-tooltip',
    }),expression:"{\n      content: $store.state.mefo.enable\n        ? this.$t('toolbox.mefOff')\n        : this.$t('toolbox.mefOn'),\n      placement: 'right',\n      classes: 'machon-tooltip',\n    }"}],staticClass:"item"},[_c('div',{class:[
        'font-icon-bar font-icon center-it',
        { active: _vm.$store.state.mefo.enable },
      ],on:{"click":function($event){$event.stopPropagation();return _vm.toggleMefo.apply(null, arguments)}}},[_c('Icons',{attrs:{"icon":"power","height":"18px","width":"18px","fill":"#626262"}})],1)]):_vm._e(),(!_vm.$store.state.bookOnlyMode && !_vm.tabId.startsWith('win') && _vm.isMefo)?_c('div',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({
      content: _vm.$store.state.mefo.showMefoArea
        ? this.$t('toolbox.mefAreaOff')
        : this.$t('toolbox.mefAreaOn'),
      placement: 'right',
      classes: 'machon-tooltip',
    }),expression:"{\n      content: $store.state.mefo.showMefoArea\n        ? this.$t('toolbox.mefAreaOff')\n        : this.$t('toolbox.mefAreaOn'),\n      placement: 'right',\n      classes: 'machon-tooltip',\n    }"}],staticClass:"item"},[_c('div',{class:[
        'font-icon-bar font-icon center-it',
        { active: _vm.$store.state.mefo.showMefoArea },
      ],on:{"click":function($event){$event.stopPropagation();return _vm.toggleMefoArea.apply(null, arguments)}}},[_c('Icons',{attrs:{"icon":"open-section","height":"18px","width":"18px","stroke":"#626262"}})],1)]):_vm._e(),(false && !_vm.txtBook)?_c('div',{staticClass:"h-100 flex align-item-center",on:{"click":function($event){$event.stopPropagation();return _vm.rotatePage.apply(null, arguments)}}},[_c('iconCircle',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({
        content: this.$t('toolbox.rotateImage'),
        placement: 'right',
        classes: 'machon-tooltip',
      }),expression:"{\n        content: this.$t('toolbox.rotateImage'),\n        placement: 'right',\n        classes: 'machon-tooltip',\n      }"}],staticClass:"h-100 flex align-item-center icon-refresh",attrs:{"nameIcon":"icon-refresh"}})],1):_vm._e(),(_vm.isShasYesod && !_vm.tabId.startsWith('win'))?_c('div',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({
      content: this.$t('toolbox.startMefo'),
      placement: 'right',
      classes: 'machon-tooltip',
    }),expression:"{\n      content: this.$t('toolbox.startMefo'),\n      placement: 'right',\n      classes: 'machon-tooltip',\n    }"}],staticClass:"item"},[_c('div',{class:['font-icon-bar font-icon center-it'],on:{"click":_vm.goToMefo}},[_c('Icons',{attrs:{"icon":"section","height":"18px","width":"18px","stroke":"#626262"}})],1)]):_vm._e(),(!_vm.$_mobile)?_c('div',{directives:[{name:"tooltip",rawName:"v-tooltip",value:({ content: this.$t('book.showBookHeaders') }),expression:"{ content: this.$t('book.showBookHeaders') }"}],staticClass:"item h-100 flex align-item-center",on:{"click":function($event){$event.stopPropagation();return _vm.showHeaders.apply(null, arguments)}}},[_c('div',{class:['font-icon-bar font-icon center-it']},[_c('Icons',{attrs:{"icon":"rows","height":"18px","width":"18px","fill":"#626262"}})],1)]):_vm._e()])
}
var staticRenderFns = []

export { render, staticRenderFns }