/**
 * 声明式事件注册 
 */
define(['../utils'], function(utils) {

  "use strict";
   
  function EventExtension() {
    this.after('initialize', function(cfg) {  
      parseEvents.call(this,cfg.events||{});
    });

  }

  var EventSplitter = /^([\w._-]+)@?(.*)$/;

  var parseEvents = function(events) {

    if (typeof events == 'function') {
      events = events.call(this);
    } 
    utils.map(events, function(callbackName, rule) {
      var callback,
        match = rule.match(EventSplitter),
        eventName = match[1],
        eventSelector = match[2];
 
      //attr 
      while (/({{(.*?)}})/.test(eventSelector)) {
        eventSelector = eventSelector.replace(RegExp.$1, this.attrs[RegExp.$2]);
      }

      if (typeof this[callbackName] !== 'function') {
        throw new Error("the given callback is not a function . callback:" + callbackName);
      }
      callback = this[callbackName];  
      if (eventSelector) {
        this.on(eventName, eventSelector, callback); 
      } else {
        this.on(eventName, callback); 
      } 
    }, this);
  };

  return EventExtension;

});