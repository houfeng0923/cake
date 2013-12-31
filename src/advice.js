


/**
 * 为组件提供aop支持
 * advice.withAdvice.call(obj) or  advice.mixin(obj)
 */
define(['./utils'], function(utils) {

  "use strict";
  
  var advice = {

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
      }
    },
    /*
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
            return base.apply(this,args)
          },this))
        }else{
          return base.apply(this, args);
        }
      }
    },

    after: function(base, after) {
      var afterFn = (typeof after == 'function') ? after : after.obj[after.fnName];
      return function composedAfter() {
        var res = (base.unbound || base).apply(this, arguments);
        afterFn.apply(this, arguments);
        return res;
      }
    },

    // a mixin that allows other mixins to augment existing functions by adding additional
    // code before, after or around.
    withAdvice: function() {

      utils.each(['before', 'after', 'around'], function(m) {
        //if obj exists advice function ,ignore.
        if(typeof this[m] == 'function') return;

        this[m] = function(method, fn) {
          if (typeof this[method] == 'function') {
            return this[method] = advice[m](this[method], fn)
          } else {
            return this[method] = fn
          }
        };
      }, this)
    },

    mixin:function(context) {
      this.withAdvice.call(context);
    }
  };

  return advice


})