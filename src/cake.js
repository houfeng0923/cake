/*
  Cake 核心类。
  提供Cake组件定义、组件移除、以及消息订阅相关方法。
  职责：根据定义生成组件类，并集成声明的扩展类。
 */
define(['./utils', './component-base', './eventbus','./event-target', './manager', './ext/RegistryExtension','./ext/EventExtension'], 
  function(utils, ComponentBase, eventbus, EventTarget, manager, RegistryExtension, EventExtension) {

  "use strict";

  var Cake = {};
  Cake._compNames = [];
  
  function attachTo(selector, options) {
    $(selector).each(utils.bind(function(i, node) { 
      var componentInfo = manager.findComponentInfo(this); 
      if (componentInfo && componentInfo.isAttachedTo(node)) {
        // already attached
        return;
      }
      new this(node, options);
      //添加绑定标记
      $(node).attr('data-cake-flag',true);
      //查看页面cake组件绑定情况
      // console.log(this,node);
    }, this));
  }

  function destroyAll() {
    var componentInfo = manager.findComponentInfo(this);
    //todo 
    componentInfo && utils.each(utils.keys(componentInfo.instances),function(k) {
      var info = componentInfo.instances[k];
      info.instance.destroy();
    }) ;
  }

  function mixinExtensions(extensions) {
    var proto = this.prototype;
    utils.each(extensions, function(extension) {
      utils.mixin(proto, extension.prototype);
      extension.call(proto);
    });
    //标记
    proto._extensions = extensions;
  }

  function defineComponent(cfg, extensions) {

    var componentName = cfg.name,
      mixinFunctions = {},
      mixinConfigs = {};

    if(!componentName) {
      console.error(cfg);
      throw new Error('[name] is necessary when define a cake component!');
    }
    if(~utils.inArray(componentName,Cake._compNames)){
      throw new Error('duplicate name ("'+componentName+'") is not allowed when define a cake component!');
    }
    Cake._compNames.push(componentName);

    utils.each(cfg, function(val, key) {
      if (typeof val == 'function') {
        mixinFunctions[key] = val;
      }else if(typeof val == 'string' || typeof val == 'object' || typeof val == 'number'){
        mixinConfigs[key] = val;
      }
    });

    // mixinConfigs = {
    //   templates: cfg.templates,
    //   attrs: cfg.attrs,
    //   events: cfg.events,
    //   model: cfg.model,
    //   name: cfg.name
    // }
    
    function Component(element, options) {
      var mixinConfigsObj = {} ;
      options = options || {};

      utils.mixin(true, mixinConfigsObj, mixinConfigs, {
        attrs : utils.mixin(true,{},options.attrs),
        model : utils.mixin(true,{},options.model),
        $element : $(element),
        element : element
      });


      Component.superclass.constructor.call(this, mixinConfigsObj);
      // ComponentBase.call(this,mixinConfigsObj);
    }


    Component.toString = Component.prototype.toString = function() {
      return componentName;
    };

    Component.attachTo = attachTo;

    Component.destroyAll = destroyAll;

    Component.mixinExtensions = mixinExtensions;

    utils.extend(Component, ComponentBase, mixinFunctions);
    // utils.mixin(Component.prototype,ComponentBase.prototype,mixinFunctions);

    //mixinExtensions 
    if(!utils.isArray(extensions)){
      extensions = typeof extensions=='undefined'?[]:[extensions];
    }

    extensions.push(EventExtension); // 声明事件注册扩展
    extensions.push(RegistryExtension); // 实例及实例事件管理扩展
    Component.mixinExtensions(extensions);

    return Component;
  }


  utils.mixin(Cake,EventTarget,{
    /**
     * cake 组件定义入口
     */
    define : defineComponent,
    /**
     * 销毁所有组件（可传入组件名称，销毁一类组件）
     */
    destroyAll: function( /*Component*/ ) {
      var Component = arguments[0];
      if (typeof Component == 'string') {
        Component = this.getComponent(Component);
      }
      if (Component) {
        Component.destroyAll();
      } else {
        utils.each(manager.components.slice(), function(cinfo) { 
          cinfo.component.destroyAll();
        });
        manager.reset();
      }
    },

    getComponent: function(componentName) {
      var c = utils.filter(manager.components, function(cinfo) { 
        return cinfo.component.name == componentName;
      });

      return c.length ? c[0]:null;
    },
    //2013-12-5 add 
    /**
     * 根据dom节点查找绑定到dom及子dom上的cake组件实例。
     */
    findInstancesInfoByNode:function(node) {
      return manager.findInstanceInfoByNode(node);
    },
    //2013-12-10 add
    /**
     * 根据dom节点移除绑定到dom及子dom上的cake组件实例。（可递归）
     */
    removeInstancesByNode:function(node,recursion) {
      
      if(recursion!==true){
        this._removeInstancesByNode(node);
        node.removeAttribute('data-cake-flag');
        return;
      }
      var $node = $(node),
          $all = $node.add($node.find('[data-cake-flag=true]'));
      //按照逆序依次移除
      for(var i=$all.length-1;i>=0;i--){
        this._removeInstancesByNode($all[i]);
      }
      $all.removeAttr('data-cake-flag');
    },
    /**
     * 根据dom节点移除绑定到dom
     */
    _removeInstancesByNode:function(node) {
      var instInfos = manager.findInstanceInfoByNode(node);
      for(var i=instInfos.length-1;i>=0;i--){ 
        instInfos[i].instance.destroy();
      } 
      // utils.each(instInfos,function(instInfo) { 
      //   instInfo.instance.destroy()
      // })
    }
  });

  /**
   * Cake 继成了 EventTarget 的所有方法。这里指保留业务消息订阅和取消的方法。dom事件相关方法移除。
   */
  Cake.on = Cake.off = undefined;


  return Cake ;

 



});