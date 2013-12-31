//lifecycle init destroy 
define(['./utils', './event-target', './advice'], function(utils, EventTarget, advice) {

  "use strict";

  function Base() {
    /*避免被实例同名方法覆盖*/
    // Base.prototype.init.apply(this,arguments) 
    this._getProtoFunction('init').apply(this,arguments)
  }

  advice.mixin(Base.prototype);

  utils.mixin(Base.prototype, EventTarget, {

    init: function(cfg) {
      var dfd,args = arguments,
        /*避免被实例同名方法覆盖*/
        initializerFun = this._getProtoFunction('initializer');

      if (typeof initializerFun == 'function') {
        dfd = initializerFun.apply(this, args)
        
      }
      //event initialized 
      dfd && dfd.then(function(compInfo) { 
        var eventName = ['initialized','.',compInfo.componentName].join('');
        this.publish(eventName, {
          cfg: cfg,
          instId:compInfo.id,
          name: compInfo.componentName
        }) //todo this.name
      })
    },

    destroy: function() {
      var
        /*避免被实例同名方法覆盖*/
        destructorFun =  this._getProtoFunction('destructor');

      if (typeof destructorFun == 'function' ) {
        destructorFun.call(this)
      }
    },

    _getClasses:function() {
      if(!this._classes){
        var c = this.constructor,
            classes = [];
        while(c){
          classes.push(c.prototype)
          c = c.superclass ? c.superclass.constructor : null
        }
        this._classes = classes
      }
      return this._classes
    },

    _getProtoFunction:function(fnName) {
      var classes = this._getClasses(),fn;
      for(var i=classes.length-1; i>=0;i--){
        fn = classes[i][fnName];
        if(typeof fn == 'function'){
          return fn
        }
      }
    }

    ,_getExtensions:function() {
      var proto = this.constructor.prototype
      return proto._extensions;
    }

  })
  
  return Base

})