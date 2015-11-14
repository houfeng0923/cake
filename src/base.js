/*
  cake组件基类(root)。提供基础的生命周期管理(内置生命周期方法：init  destroy)
 */
define(['./utils', './event-target', './advice'], function(utils, EventTarget, advice) {

  "use strict";

  function Base() {
    /*避免被实例同名方法覆盖*/
    // Base.prototype.init.apply(this,arguments) 
    this._getProtoFunction('init').apply(this,arguments);
  }

  // aop增强
  advice.mixin(Base.prototype);

  utils.mixin(Base.prototype, EventTarget, {
    /**
     * 初始化方法。
     * 调用组件基类(ComponentBase)的initializer方法。
     * 在initialize完成后，广播组件‘初始化完成’消息（initialized.ComponentName）
     */
    init: function(cfg) {
      var dfd,args = arguments,
        /*避免被实例同名方法覆盖*/
        initializerFun = this._getProtoFunction('initializer');

      if (typeof initializerFun == 'function') {
        dfd = initializerFun.apply(this, args);
        
      }
      //event initialized 
      if(dfd){
        dfd.then(function(compInfo) { 
          var eventName = ['initialized','.',compInfo.componentName].join('');
          this.publish(eventName, {
            cfg: cfg,
            instId:compInfo.id,
            name: compInfo.componentName
          }); //todo this.name
        });
      }
    },

    /**
     * 组件析构方法。
     * 调用组件基类(ComponentBase)的destructor方法。
     * 
     */
    destroy: function() {
      var
        /*避免被实例同名方法覆盖*/
        destructorFun =  this._getProtoFunction('destructor');

      if (typeof destructorFun == 'function' ) {
        destructorFun.call(this);
      }
    },

    /**
     * 获取组件继承链
     */
    _getClasses:function() {
      if(!this._classes){
        var c = this.constructor,
            classes = [];
        while(c){
          classes.push(c.prototype);
          c = c.superclass ? c.superclass.constructor : null;
        }
        this._classes = classes;
      }
      return this._classes;
    },

    /**
     * 获取原型方法，而非实例方法
     */
    _getProtoFunction:function(fnName) {
      var classes = this._getClasses(),fn;
      for(var i=classes.length-1; i>=0;i--){
        fn = classes[i][fnName];
        if(typeof fn == 'function'){
          return fn;
        }
      }
    },

    /**
     * 获取组件扩展列表
     */
    _getExtensions:function() {
      var proto = this.constructor.prototype;
      return proto._extensions;
    }

  });
  
  return Base;

});