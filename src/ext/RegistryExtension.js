/**
 * 实例注册到manager管理
 * 组件事件注册到manager管理 
 */
define(['../utils', '../manager','../event-handle'], function(utils, manager, EventHandle) {

  "use strict";
  
  function RegistryExtension() { 
    this.before('initialize', function() {  
      manager.addInstance(this)
    })
    this.around('on', registry.on)
    this.after('off', registry.off)
    
    //debug tools may want to add advice to trigger
    // window.DEBUG && DEBUG.enabled && this.after('trigger', registry.trigger); //and  this.publish
    
    this.around('subscribe',registry.subscribe)
    this.after('unsubscribe',registry.unsubscribe)

    // this.after('teardown', registry.teardown);
    this.after('destroy', registry.destroy);
  }

 


  var registry = {

    // debug tools may want to add advice to trigger
    trigger: function() {},

    on: function(componentOn) {
      var instance = manager.findInstanceInfo(this),eventHandle,
        boundCallback;
      // unpacking arguments by hand benchmarked faster
      var l = arguments.length,
        i = 1;
      var otherArgs = new Array(l - 1);
      for (; i < l; i++) otherArgs[i - 1] = arguments[i];

      eventHandle = componentOn.apply(null,otherArgs);

      if(instance){
        instance.addBind(eventHandle)
      } 
      // if (instance) {
      //   boundCallback = componentOn.apply(null, otherArgs);
      //   if (boundCallback) {
      //     otherArgs[otherArgs.length - 1] = boundCallback;
      //   }
      //   var event = parseEventArgs(this, otherArgs);
      //   instance.addBind(event);
      // }
    },

    off: function( /*type,[selector], callback*/ ) { 
      var event = new EventHandle(this,'dom',arguments),
        instance = manager.findInstanceInfo(this);

      if (instance) {
        instance.removeBind(event);
      }
      // //remove from global event manager
      // for (var i = 0, e; e = manager.events[i]; i++) {
      //   if (e.equals(event)) {
      //     manager.events.splice(i, 1);
      //   }
      // }
    },

    subscribe:function() {
      registry.on.apply(this,arguments)
    },

    unsubscribe:function(/*type,callback*/) {
      var event = new EventHandle(this,'custom',arguments),
        instance = manager.findInstanceInfo(this);

      if (instance) {
        instance.removeBind(event);
      }
      // //remove from global event manager
      // for (var i = 0, e; e = manager.events[i]; i++) {
      //   if (e.equals(event)) {
      //     manager.events.splice(i, 1);
      //   }
      // }
    },

    destroy: function() {
      //????
      var instanceInfo = manager.findInstanceInfo(this);
      utils.each(instanceInfo.events,function(eventInfo){
        eventInfo.detach();
      }) 
      manager.removeInstance(this);
    }
  }



  return RegistryExtension
});