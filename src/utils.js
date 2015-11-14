/*
  工具类。提供一些常用的工具方法。
  职责：对jquery一些工具方法的包装、补充。
  原始目标是隔离cake对jquery的依赖，目前看来意义不是很大（大量jquery $ 的运用）
  
 */
define(['jquery'], function($) {

  "use strict";

  var nativeForEach = Array.prototype.forEach,
    nativeFilter = Array.prototype.filter,
    nativeMap = Array.prototype.map,
    hasOwnProperty = Object.prototype.hasOwnProperty;

  var utils = {

    guid: function() {
      return $.guid++;
    },

    // ---------- oop -----------------
    mixin: $.extend,

    extend: function(subCls, superCls, proto) {
      for (var p in superCls)
        if (superCls.hasOwnProperty(p)) subCls[p] = superCls[p];

      function F() {
        this.delegateclass = subCls.prototype;
      }

      F.prototype = superCls.prototype;
      subCls.prototype = new F();
      subCls.prototype.constructor = subCls;

      // debugger
      subCls.prototype.superclass = subCls.superclass = superCls.prototype.delegateclass || superCls.prototype;

      if (superCls.prototype.constructor == Object.prototype.constructor) {
        superCls.prototype.constructor = superCls;
      }

      utils.mixin(subCls.prototype, proto);
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

    // ----------array --------------
    inArray:$.inArray,


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

    filter : function(obj, iterator, context) {
      var results = [];
      if (obj == null) return results;
      if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
      this.each(obj, function(value, index, list) {
        if (iterator.call(context, value, index, list)) results.push(value);
      });
      return results;
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

    getRootDomain: function(domains) {
      if (typeof domains != 'string')
        throw new Error('wrong domain input!!');

      var domain_name = ['com','net','org','gov','edu'],
        rd = [],// root domain array
        da = domains.split('.'),// domain array
        l = da.length;

      if (da.length<2)
        throw new Error('wrong domain format!');

      rd.unshift(da.pop());
      if (rd[0] == 'cn') {
        rd.unshift(da.pop());
        for (var i=0;i<l;i++) {
          if (rd[1]==domain_name[i])
            return rd.unshift(da.pop()).join('.');
        }
        return rd.join('.');
      } else {
        for (i=0;i<l;i++) {
          if (rd[0]==domain_name[i])//验证域名合法性
            return rd.unshift(da.pop()).join('.');
        }
        // 如果输入域名末位不是['com','net','org','gov','edu']
        // 也不是'cn'
        // 所以，不是合法域名
        throw new Error('wrong domain format!');
      }
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
  };



  /**
   * isArray,isFunction,isString,isNumber,isDate,isRegExp
   */
  utils.each(['Array', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    utils['is' + name] = function(obj) {
      return Object.prototype.toString.call(obj) == '[object ' + name + ']';
    };
  });




  return utils;
});