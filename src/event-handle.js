/*
  事件类包装对象。
  事件分为 'dom' 和 'custom'　两类。
  对cake监听的消息进行包装。通过manager进行管理，后期直接通过包装对象来注销对应的事件。
 */
define(['./utils','./eventbus'], function(utils,eventbus) {

  "use strict";
  
  function EventHandle(instance, category, eventInfo) {
    //same instance
    //eventInfo:[type,[selector],callback]
    //1:dom       [type,selector,fn(guid)]  this.$element 
    //2:custom:   [type,fn(guid)]  eventbus
    var eLen;
    this.instance = instance;
    this.category = category;
    this.eventInfo = eventInfo;

    eLen = eventInfo.length;
    this.type = eventInfo[0];

    if (typeof eventInfo[eLen - 1] != 'function') {
      throw new Error('the last item in array:eventInfo is not a function');
    }
    if (eLen == 2) {
      this.callback = eventInfo[1];
    }
    if (eLen == 3) {
      this.selector = eventInfo[1];
      this.callback = eventInfo[2];
    }
  }

  utils.mixin(EventHandle.prototype, {
    /**
     * 判断事件是否匹配
     */
    equals: function(matchEvent) {
      if (this.instance != matchEvent.instance) return false;

      if (matchEvent.category == 'dom') {
        return (this.type == matchEvent.type) &&
          (this.selector == matchEvent.selector) &&
          (this.callback == matchEvent.callback ||
          this.callback.guid == matchEvent.callback.guid
        );

      } else if (matchEvent.category == 'custom') {
        return (this.type == matchEvent.type) &&
          (this.callback == matchEvent.callback ||
          this.callback.guid == matchEvent.callback.guid
        );
      }
    },
    /**
     * 取消消息的订阅（及dom事件的监听）
     */
    detach: function() {
      var args = this.eventInfo;
      if (this.category == 'dom') {
        this.instance.$element.off.apply(this.instance.$element,args);
      }else if(this.category == 'custom'){
        eventbus.unsubscribe.apply(null,args);
      }
    }
  });

  return EventHandle;

});