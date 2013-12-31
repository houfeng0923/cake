define(['./utils', './component-base', './eventbus','./event-target', './manager', './ext/RegistryExtension','./ext/EventExtension'], 
  function(utils, ComponentBase, eventbus, EventTarget, manager, RegistryExtension, EventExtension) {

  "use strict";

  var Cake = {};
  
  function attachTo(selector, options) {
    $(selector).each(utils.bind(function(i, node) { 
      var componentInfo = manager.findComponentInfo(this); 
      if (componentInfo && componentInfo.isAttachedTo(node)) {
        // already attached
        return;
      }
      new this(node, options)
      //添加绑定标记
      $(node).attr('data-cake-flag',true)
    }, this))
  }

  function destroyAll() {
    var componentInfo = manager.findComponentInfo(this);
    //todo 
    componentInfo && utils.each(utils.keys(componentInfo.instances),function(k) {
      var info = componentInfo.instances[k]
      info.instance.destroy();
    }) 
  }

  function mixinExtensions(extensions) {
    var proto = this.prototype
    utils.each(extensions, function(extension) {
      utils.mixin(proto, extension.prototype)
      extension.call(proto)
    })
    //标记
    proto._extensions = extensions;
  }

  function defineComponent(cfg, extensions) {
    var componentName = cfg.name,
      mixinFunctions = {},
      mixinConfigs = {};


    utils.each(cfg, function(val, key) {
      if (typeof val == 'function') {
        mixinFunctions[key] = val
      }else if(typeof val == 'string' || typeof val == 'object' || typeof val == 'number'){
        mixinConfigs[key] = val
      }
    })

    // mixinConfigs = {
    //   templates: cfg.templates,
    //   attrs: cfg.attrs,
    //   events: cfg.events,
    //   model: cfg.model,
    //   name: cfg.name
    // }
    
    function Component(element, options) {
      var mixinConfigsObj = {} ;
      options = options || {}

      utils.mixin(true, mixinConfigsObj, mixinConfigs, {
        attrs : utils.mixin(true,{},options.attrs),
        model : utils.mixin(true,{},options.model),
        $element : $(element),
        element : element
      })


      Component.superclass.constructor.call(this, mixinConfigsObj)
      // ComponentBase.call(this,mixinConfigsObj)
    }


    Component.toString = Component.prototype.toString = function() {
      return componentName
    }

    Component.attachTo = attachTo

    Component.destroyAll = destroyAll

    Component.mixinExtensions = mixinExtensions

    utils.extend(Component, ComponentBase, mixinFunctions)
    // utils.mixin(Component.prototype,ComponentBase.prototype,mixinFunctions)

    //mixinExtensions 
    if(!utils.isArray(extensions)){
      extensions = typeof extensions=='undefined'?[]:[extensions]
    }

    extensions.push(EventExtension) // 声明事件注册扩展
    extensions.push(RegistryExtension) // 实例及实例事件管理扩展
    Component.mixinExtensions(extensions)

    return Component

  }


  utils.mixin(Cake,EventTarget,{
    
    define : defineComponent,

    destroyAll: function( /*Component*/ ) {
      var Component = arguments[0];
      if (typeof Component == 'string') {
        Component = this.getComponent(Component)
      }
      if (Component) {
        Component.destroyAll();
      } else {
        utils.each(manager.components.slice(), function(cinfo) { 
          cinfo.component.destroyAll();
        })
        manager.reset();
      }
    },

    // getComponent: function(componentName) {
    //   //todo
    // },
    //2013-12-5 add 
    findInstancesInfoByNode:function(node) {
      return manager.findInstanceInfoByNode(node)
    },
    //2013-12-10 add
    removeInstancesByNode:function(node,recursion) {
      
      if(recursion!==true){
        this._removeInstancesByNode(node);
        node.removeAttribute('data-cake-flag')
        return;
      }
      var $node = $(node),
          $all = $node.add($node.find('[data-cake-flag=true]'));
      //按照逆序依次移除
      for(var i=$all.length-1;i>=0;i--){
        this._removeInstancesByNode($all[i])
      }
      $all.removeAttr('data-cake-flag')
    },
    _removeInstancesByNode:function(node) {
      var instInfos = manager.findInstanceInfoByNode(node)
      for(var i=instInfos.length-1;i>=0;i--){ 
        instInfos[i].instance.destroy()
      } 
      // utils.each(instInfos,function(instInfo) { 
      //   instInfo.instance.destroy()
      // })
    }
  })

  Cake.on = Cake.off = undefined;


  return Cake 

 



})