/**
 * 声明式事件注册 
 */
define(['../utils'], function(utils) {

  "use strict";
  
  function EventExtension() {
    this.before('initialize', function(cfg) { 
      parseEvents.call(this,cfg.events||{})
    })

  }

  var parseEvents = function(events) {

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
  }

  return EventExtension;

})