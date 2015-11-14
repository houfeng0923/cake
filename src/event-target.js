/**
 * 为组件提供基本的业务事件注册和监听机制　
 */
define(['./utils', './eventbus','./event-handle'], function(utils, eventbus, EventHandle) {

  "use strict";


  var EventTarget = {
    //为组件dom元素增加事件监听
    //this.on('type',[delegateSelector],[data],callback)
    on: function() {
      var args = Array.prototype.slice.call(arguments),
        type, callback, originalCb;
      var lastIndex = args.length - 1;

      type = args[0];
      originalCb = args[lastIndex];

      if (typeof originalCb != 'function') {
        throw new Error('Unable to bind to "' + type + '" because the given callback is not a function ');
      }

      callback = utils.bind(originalCb,this);
      callback.target = originalCb;

      // if the original callback is already branded by jQuery's guid, copy it to the context-bound version
      if (originalCb.guid) {
        callback.guid = originalCb.guid;
      }

      args[lastIndex] = callback;

      this.$element.on.apply(this.$element, args);

      // get jquery's guid from our bound fn, so unbinding will work
      originalCb.guid = callback.guid;

      // return callback;
      var eventInfo = args.length==4? args.slice(2,1):args.slice();
      return new EventHandle(this,'dom',eventInfo);
    },

    //为组件dom元素移除事件监听
    //this.off('type',[selector],callback)
    off: function() {
      return this.$element.off.apply(this.$element, arguments);
    },


    // ---------------- custom event ----------------------- 
    /*
      this.publish('hello',[{thisis:'houfeng'}]) //[]:optional 
     */
    publish: function() {
　
      eventbus.publish.apply(this, arguments);
      return this;
    },
    /*
    this.subscribe('hello',function() {'context:context'},context) 
     */
    subscribe: function() {
      var callback, type = arguments[0],
        originalCb = arguments[1],
        context = arguments[2] || this;

      if (typeof originalCb != 'function') {
        throw new Error("Unable to bind to '" + type + "' because the given callback is not a function ");
      }

      callback = utils.bind(originalCb, context);
      callback.target = originalCb;

      // if the original callback is already branded by jQuery's guid, copy it to the context-bound version
      if (originalCb.guid) {
        callback.guid = originalCb.guid;
      }
      eventbus.sub(type, callback);
      //todo 

      // get jquery's guid from our bound fn, so unbinding will work
      originalCb.guid = callback.guid;

      // return callback;
      return new EventHandle(this,'custom',[type,originalCb]);
    },

    /*
    this.subscribeOnce('hello',function() {'context:context'}) 
    不使用 eventbus one；采用 调用 on和 off来实现，可以间接简化事件注册代码
     */
    subscribeOnce: function() {
      var callback, type = arguments[0],
        originalCb = arguments[1],
        context = arguments[2] || this;


      if (typeof originalCb != 'function') {
        throw new Error("Unable to bind to '" + type + "' because the given callback is not a function ");
      }

      callback = utils.bind(originalCb, context);
      // callback.target = originalCb;

      function OnceCallback(e) {
        this.unsubscribe(e,OnceCallback);
        callback();
      }
      OnceCallback.target = originalCb;

      OnceCallback.guid = originalCb.guid || (originalCb.guid = utils.guid());

      return this.subscribe(type, OnceCallback);
    },

    /*
     * this.unsubscribe('hello',callbackFn)　
     */
    unsubscribe: function() {

      var callback = arguments[1];

      if (typeof callback != 'function') {
        throw new Error("missing arguments(callback) or giving arguments(callback) is not a function");
      }
      eventbus.unsub.apply(this, arguments);

      return this;
    }
  };

  return EventTarget;


});