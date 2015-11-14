


/**
 * 为组件提供aop支持
 * advice.withAdvice.call(obj) or  advice.mixin(obj)
 */
define(['./utils'], function(utils) {

  "use strict";
  
  var advice = {
    /*
      环绕增强
     */
    around: function(base, wrapped) {
      return function composedAround() {
        // unpacking arguments by hand benchmarked faster
        var i = 0,
          l = arguments.length,
          args = new Array(l + 1);
        // args[0] = base.bind(this);
        args[0] = utils.bind(base, this);
        for (; i < l; i++) args[i + 1] = arguments[i];
        
        return wrapped.apply(this, args);
      };
    },

    /*
      前置增强
      示例：
      this.before('afterWork',function() {'checkin'});
      this.before('afterWork',{obj:somebody,fnName:'checkin'})
   */
    before: function(base, before) {
      var beforeFn = (typeof before == 'function') ? before : before.obj[before.fnName];
      return function composedBefore() {
        var args = arguments,
            promise = beforeFn.apply(this, arguments);
        //增加promise支持
        if(promise && typeof promise.then === 'function'){
          return promise.pipe(utils.bind(function() {
            return base.apply(this,args);
          },this));
        }
        return base.apply(this, args);
      };
    },
    /**
      后置增强
      示例：
      this.after('afterWork',function() {'checkin'});
      this.after('afterWork',{obj:somebody,fnName:'checkin'})
     */
    after: function(base, after) {
      var afterFn = (typeof after == 'function') ? after : after.obj[after.fnName];
      return function composedAfter() {
        var args = arguments,
            res = (base.unbound || base).apply(this, args); 
        if(res && typeof res.then === 'function'){
          return res.pipe(utils.bind(function() {
            afterFn.apply(this, args);
          },this));
        }
        afterFn.apply(this,args);
        return res;
      };
    },

    /*
      工厂包装方法
     */
    withAdvice: function() {

      utils.each(['before', 'after', 'around'], function(m) {
        //if obj exists advice function ,ignore.
        if(typeof this[m] == 'function') return;

        this[m] = function(method, fn) {
          if (typeof this[method] == 'function') {
            return this[method] = advice[m](this[method], fn);
          } else {
            return this[method] = fn;
          }
        };
      }, this);
    },

    /*
      对外接口
     */
    mixin:function(context) {
      this.withAdvice.call(context);
    }
  };

  return advice;


});