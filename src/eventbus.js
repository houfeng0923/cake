
/**
 * 事件总线
 * todo: 考虑如何满足 registry及 debugger
 */
define(['jquery'], function($) {

  "use strict";

  var eventbus = {},
      o = $({}); //暂时先不考虑传入注册源的方式 : new Eventbus(obj)

  eventbus.subscribe = function(event,callback ) { 
    return o.on.apply(o,arguments)
  }

  eventbus.unsubscribe = function(event /*,callback*/) {
    o.off.apply(o,arguments)
  }

  eventbus.publish = function(event,params) {
    o.trigger.apply(o,arguments)
  }


  eventbus.sub = eventbus.subscribe
  eventbus.unsub = eventbus.unsubscribe
  eventbus.pub = eventbus.publish



  // eventbus.on = eventbus.listen = function() {
  //   o.on.apply(o, arguments);
  // };

  // eventbus.off = eventbus.stopListening = function() {
  //   o.off.apply(o, arguments);
  // };

  // // eventbus.one = eventbus.listenOnce = function() {
  // //   o.one.apply(o,arguments);
  // // }

  // eventbus.broadcast = function() {
  //   o.trigger.apply(o, arguments);
  // };

  return eventbus

});