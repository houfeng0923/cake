
/**
 * [扩展类] 为组件提供模板解析功能支持
 * 扩展方法：renderTemplate
 * 解析属性：templates
 */
define(['cake/utils','hogan'], function(utils,compiler) {

  "use strict";
  // var TEMPLATE_ENGINE_MODULE_NAME = 'hogan';

  function TemplateExtension() { 
    this.before('initialize', function(cfg) {  
      var dfd = _initTemplates.call(this,cfg.templates || {});
      return dfd;
    });
  }
  TemplateExtension.prototype = {

    renderTemplate: function(templateName,context) {
      var template = this._templates[templateName];
      if (template) {
        return template.render(context);
      }
    }
  };

  function _initTemplates (templates) {
    var dfd = utils.Deferred(),
        templateModules = {};
      //parse templates
      if (!templates) {
        return dfd.resolveWith(this).promise();
      }
      this._templates = {}; //存储加载的模板字符串
      //load template engine 
      utils.each(templates, function(val, key) {
        if (val.indexOf('text!') === 0) {
          templateModules[key] = val;
        } else if (val.indexOf('#') === 0 || val.indexOf('.') === 0 ) {
          this._templates[key] = $(val).html();
        } else {
          this._templates[key] = val;
        }
      }, this);

      var modulePaths = [],
        moduleKeys = [];
      utils.each(templateModules, function(val, key) {
        moduleKeys.push(key);
        modulePaths.push(val);
      });
      // if(!TEMPLATE_ENGINE_MODULE_NAME){   compiler = _.template; }    
      // todo  先加载 templates 模块，检测是否存在 (extension方案)
      
      // modulePaths.unshift(TEMPLATE_ENGINE_MODULE_NAME)

      require(modulePaths, utils.bind(function() {

        utils.each(Array.prototype.slice.call(arguments), function(tplString, i) {
          this._templates[moduleKeys[i]] = tplString;
        }, this);
        utils.each(this._templates, function(val, key) {
          this._templates[key] = compiler.compile(val || '');
        }, this);
        dfd.resolveWith(this);

      }, this));


      return dfd.promise();
  }

  return TemplateExtension;
});