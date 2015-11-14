//mixin 功能 依赖于 aop ，如果暂时不考虑mixin，aop是否可选？
//lifecycle render (增加dom支持)
/*
  cake 组件基类。
  职责：非生命周期外的其他逻辑处理。包括组件相关属性的定义、组件实例的initialize方法调用（支持异步）

 */
define(['./utils', './base'], function(utils, Base) {

  "use strict";

  var componentInstId = 1;

  function ComponentBase() {
    ComponentBase.superclass.constructor.apply(this, arguments);
    // Base.apply(this, arguments)
  }

  // utils.mixin(ComponentBase.prototype, Base.prototype, {
  utils.extend(ComponentBase, Base, {
    /**
     * 组件基类初始化方法。
     * 读取配置属性并定义实例字段。执行组件实例initialize方法。
     */
    initializer: function(cfg) {
      var args = arguments,
        componentName = cfg.name,
        instanceId = componentName + (componentInstId++);
      //todo 避免被覆盖，该如何处理呢
     
      this.name = componentName;
      this.id = instanceId;
      //todo this.$element
      this.$element = $(cfg.$element);
      this.element = this.$element[0];

      // this._cfg = cfg;
      //init attrs
      this.attrs = cfg.attrs || {};
      this.model = cfg.model || {};
      //init props 

      // this._bindAll();
 
      //initialize  修改为 可以没有 initialize方法（避免组件不需要初始化还要写一个空方法）
      var dfd ;
      if(typeof this.initialize == 'undefined'){
        this.initialize = function() {};
      } 
      if (typeof this.initialize == 'function') {
        dfd = this.initialize.apply(this, args);
      }
      if (!dfd){
        dfd = utils.Deferred().resolveWith(this);
      }
      return dfd.pipe(function() {       
      // this._parseEvents(cfg.events || {}) // init event delegate  moved 已经使用扩展实现 
        return {
          id: instanceId,
          componentName: componentName
        };
      }); 
    },
 
　
    /**
     * 执行组件实例 teardown 方法。释放资源。
     */
    destructor: function() {  
      if (typeof this.teardown == 'function') {
        this.teardown.call(this);
      }
    }
  });


  return ComponentBase;

});