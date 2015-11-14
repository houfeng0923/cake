/**
 * registry 机制
 * 管理自定义事件（可以在适当时候从eventbus中移除）；
 * 管理dom事件
 * 管理组件实例（在适当的时候销毁）
 */
define(['./utils'], function(utils) {

  "use strict";

  var ComponentsManager;

  /**
   * 组件信息类
   */
  function ComponentInfo(component) {
    this.component = component;
    this.attachedTo = [];
    this.instances = {};

    this.addInstance = function(instance) {
      var instanceInfo = new InstanceInfo(instance);
      this.instances[instance.id] = instanceInfo;
      this.attachedTo.push(instance.element);

      return instanceInfo;
    };

    this.removeInstance = function(instance) {
      delete this.instances[instance.id];
      var indexOfNode = utils.inArray(instance.element,this.attachedTo);
      (indexOfNode > -1) && this.attachedTo.splice(indexOfNode, 1);


      if (!utils.keys(this.instances).length) {
        //if I hold no more instances remove me from registry
        ComponentsManager.removeComponentInfo(this);
      }
    };

    this.isAttachedTo = function(element) {
      return utils.inArray(element,this.attachedTo) > -1 ; 
    };
  }

  /**
   * 组件实例信息类
   */
  function InstanceInfo(instance) {
    this.instance = instance;
    this.events = [];

    this.addBind = function(event) {

      this.events.push(event);
      // ComponentsManager.events.push(event);
    };

    this.removeBind = function(event) {
      for (var i = 0, e; e = this.events[i]; i++) {
        if (e.equals(event)) {
          this.events.splice(i, 1);
        }
      }
    };
  }


  /**
   * 组件管理器
   */
  ComponentsManager = {
    components: [],
    allInstances: {},
    // events: [],

    /**
     * 重置
     */
    reset: function() {
      this.components = [];
      this.allInstances = {};
      // this.events = [];
    },


    /**
     * 添加一个实例到管理器
     */
    addInstance: function(instance) {
      var component = this.findComponentInfo(instance);

      if (!component) {
        component = new ComponentInfo(instance.constructor);
        this.components.push(component);
      }

      var inst = component.addInstance(instance);

      this.allInstances[instance.id] = inst;

      return component;
    },


    /**
     * 移除一个实例
     */
    removeInstance: function(instance) {
      // var index, instInfo = this.findInstanceInfo(instance);

      //remove from component info
      var componentInfo = this.findComponentInfo(instance);
      componentInfo && componentInfo.removeInstance(instance);

      //remove from registry
      delete this.allInstances[instance.id];
    },


    /**
     * 移除一个组件类
     */
    removeComponentInfo: function(componentInfo) {
      var index = utils.inArray(componentInfo,this.components);
      (index > -1) && this.components.splice(index, 1);
    },


    /**
     * 根据实例获取对应的组件信息类
     */
    findComponentInfo: function(which) {
      var component = which.attachTo ? which : which.constructor;

      for (var i = 0, c; c = this.components[i]; i++) {
        if (c.component === component) {
          return c;
        }
      }

      return null;
    },


    /**
     * 根据实例查找对应的实例信息类
     */
    findInstanceInfo: function(instance) {
      return this.allInstances[instance.id] || null;
    },


    /**
     * 根据dom节点查找实例信息类
     */
    findInstanceInfoByNode: function(node) {
      var result = [];
      utils.each(utils.keys(this.allInstances),function(k) {
        var thisInstanceInfo = this.allInstances[k];
        if (thisInstanceInfo.instance.element === node) {
          result.push(thisInstanceInfo);
        }
      },this);
      
      return result;
    }

  };


  return ComponentsManager;
});