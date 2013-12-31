//
define(['jquery'], function($) {

  "use strict";

  var nativeForEach = Array.prototype.forEach,
    nativeMap = Array.prototype.map,
    hasOwnProperty = Object.prototype.hasOwnProperty;

  var utils = {

    guid: function() {
      return $.guid++
    },

    // ---------- oop -----------------
    mixin: $.extend,

    extend: function(subCls, superCls, proto) {
      for (var p in superCls)
        if (superCls.hasOwnProperty(p)) subCls[p] = superCls[p];

      function F() {
        this.delegateclass = subCls.prototype
      }

      F.prototype = superCls.prototype;
      subCls.prototype = new F();
      subCls.prototype.constructor = subCls;

      // debugger
      subCls.prototype.superclass = subCls.superclass = superCls.prototype.delegateclass || superCls.prototype;

      if (superCls.prototype.constructor == Object.prototype.constructor) {
        superCls.prototype.constructor = superCls;
      }

      utils.mixin(subCls.prototype, proto)
    },


    // ----------promise------------
    when: $.when,

    Deferred: $.Deferred,

    // -------- bind ----------------
    bind: $.proxy,

    bindAll: function(obj) {
      var val;
      for (var key in obj) {
        this.isFunction(val = obj[key]) &&
          (obj[key] = this.bind(val, obj));
      }
    },

    // ---------- collection ------------
    each: function(obj, iterator, context) {
      if (obj == null) return;
      if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
      } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
          if (iterator.call(context, obj[i], i, obj) === false) return;
        }
      } else {
        for (var key in obj) {
          if (hasOwnProperty.call(obj, key)) {
            if (iterator.call(context, obj[key], key, obj) === false) return;
          }
        }
      }
    },

    map: function(obj, iterator, context) {
      var results = [];
      if (obj == null) return results;
      if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
      this.each(obj, function(value, index, list) {
        results[results.length] = iterator.call(context, value, index, list);
      });
      return results;
    },

    keys: Object.keys || function(obj) {
      if (obj !== Object(obj)) throw new TypeError('Invalid object');
      var ret = [];
      for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) {
          ret.push(key);
        }
      }
      return ret;
    }
  }

  /**
   * isArray,isFunction,isString,isNumber,isDate,isRegExp
   */
  utils.each(['Array', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    utils['is' + name] = function(obj) {
      return Object.prototype.toString.call(obj) == '[object ' + name + ']';
    };
  });



  return utils;
})