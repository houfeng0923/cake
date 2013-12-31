//mixin 功能 依赖于 aop ，如果暂时不考虑mixin，aop是否可选？
//lifecycle render (增加dom支持)

define(['./utils', './base'], function(utils, Base) {

  "use strict";

  var componentInstId = 1;

  function ComponentBase() {
    ComponentBase.superclass.constructor.apply(this, arguments);
    // Base.apply(this, arguments)
  }

  // utils.mixin(ComponentBase.prototype, Base.prototype, {
  utils.extend(ComponentBase, Base, {

    initializer: function(cfg) {
      var args = arguments,
        componentName = cfg.name,
        instanceId = componentInstId++;
      //todo 避免被覆盖，该如何处理呢
      this.name = componentName
      this.id = instanceId
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
        this.initialize = function() {}
      } 
      if (typeof this.initialize == 'function') {
        dfd = this.initialize.apply(this, args)
      }
      if (!dfd){
        dfd = utils.Deferred().resolveWith(this)
      }
      return dfd.pipe(function() {
      //init event delegate  已经使用扩展实现  
      // init event delegate  moved
      // this._parseEvents(cfg.events || {})
        return {
          id: instanceId,
          componentName: componentName
        }
      })
      // else {
      //   throw new Error('the method:initialize not found')
      // }
    },

    // toString: function() {
    //   return this.name
    // },

    _parseEvents: function(events) { 

      if (typeof events == 'function') {
        events = events.call(this);
      }
      // this.events = events;  
      utils.map(events, function(callbackName, rule) {
        var callback,
          // eventRule = rule.replace(/\s+/g, ' ').split(' '),
          // eventName = eventRule[0],
          // eventSelector = eventRule.slice(1).join(' ');
          eventRule = rule.split('@'),
          eventName = eventRule[0],
          eventSelector = eventRule.slice(1).join('@');

        //attr 
        while (/({{(.*?)}})/.test(eventSelector)) {
          eventSelector = eventSelector.replace(RegExp.$1, this.attrs[RegExp.$2])
        }

        if (typeof this[callbackName] !== 'function') {
          throw new Error("the given callback is not a function . callback:" + callbackName);
        }
        callback = this[callbackName] // utils.bind(this[callbackName], this)
        //dom  delegate  event  
        if (eventSelector) {
          this.on(eventName, eventSelector, callback)
          // this.$element.on(eventName, eventSelector, callback)
        } else {
          this.on(eventName, callback)
          // this.$element.on(eventName,callback)
        }
        // this[callbackName].guid = callback.guid
      }, this)
    },

    // _bindAll: function() {
    //   var proto = this.constructor.prototype ,
    //       fn , key;
    //   for (key in proto) { 
    //     proto.hasOwnProperty(key) && 
    //     utils.isFunction(fn = proto[key]) &&
    //       (this[key] = utils.bind(fn, this))
    //   }
    // },

    destructor: function() {  
      if (typeof this.teardown == 'function') {
        this.teardown.call(this);
      }
    }
  })


  return ComponentBase;

})