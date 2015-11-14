
/**
 * 事件总线　
 */
define(['jquery'], function($) {

  "use strict";

  var eventbus = {},
      o = $({}); //暂时先不考虑传入注册源的方式 : new Eventbus(obj)

  eventbus.subscribe = function(/*event,callback*/ ) { 
    return o.on.apply(o,arguments);
  };

  eventbus.unsubscribe = function(/*event ,callback*/) {
    o.off.apply(o,arguments);
  };

  eventbus.publish = function(/*event,params*/) {
    o.trigger.apply(o,arguments);
  };


  eventbus.sub = eventbus.subscribe;
  eventbus.unsub = eventbus.unsubscribe;
  eventbus.pub = eventbus.publish;
　
  return eventbus;

});