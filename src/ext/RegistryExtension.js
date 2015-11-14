/**
 * 实例注册到manager管理
 * 组件事件注册到manager管理 
 */
define(['../utils', '../manager','../event-handle'], function(utils, manager, EventHandle) {

  "use strict";
  
  function RegistryExtension() { 
    this.before('initialize', function() {  
      manager.addInstance(this);
    });
    this.around('on', registry.on);
    this.after('off', registry.off);
     
    this.around('subscribe',registry.subscribe);
    this.after('unsubscribe',registry.unsubscribe);
 
    this.after('destroy', registry.destroy);
  }

 


  var registry = {
 
    trigger: function() {},

    on: function(componentOn) {
      var instance = manager.findInstanceInfo(this),eventHandle; 
      var l = arguments.length,
        i = 1;
      var otherArgs = new Array(l - 1);
      for (; i < l; i++) otherArgs[i - 1] = arguments[i];

      eventHandle = componentOn.apply(null,otherArgs);

      if(instance){
        instance.addBind(eventHandle);
      }  
    },

    off: function( /*type,[selector], callback*/ ) { 
      var event = new EventHandle(this,'dom',arguments),
        instance = manager.findInstanceInfo(this);

      if (instance) {
        instance.removeBind(event);
      } 
    },

    subscribe:function() {
      registry.on.apply(this,arguments);
    },

    unsubscribe:function(/*type,callback*/) {
      var event = new EventHandle(this,'custom',arguments),
        instance = manager.findInstanceInfo(this);

      if (instance) {
        instance.removeBind(event);
      } 
    },

    destroy: function() {
      //????
      var instanceInfo = manager.findInstanceInfo(this);
      utils.each(instanceInfo.events,function(eventInfo){
        eventInfo.detach();
      }) ;
      manager.removeInstance(this);
    }
  };



  return RegistryExtension;
});