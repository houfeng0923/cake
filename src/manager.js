/**
 * registry 机制
 * 管理自定义事件（可以在适当时候从eventbus中移除）；
 * 管理dom事件
 * 管理组件实例（在适当的时候销毁）
 */
define(['./utils'], function(utils) {

  "use strict";

  var ComponentsManager;

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
      var indexOfNode = this.attachedTo.indexOf(instance.element);
      (indexOfNode > -1) && this.attachedTo.splice(indexOfNode, 1);


      if (!utils.keys(this.instances).length) {
        //if I hold no more instances remove me from registry
        ComponentsManager.removeComponentInfo(this);
      }
    };

    this.isAttachedTo = function(element) {
      return this.attachedTo.indexOf(element) > -1;
    };
  }

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

  ComponentsManager = {
    components: [],
    allInstances: {},
    // events: [],

    reset: function() {
      this.components = [];
      this.allInstances = {};
      // this.events = [];
    },

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

    removeInstance: function(instance) {
      var index, instInfo = this.findInstanceInfo(instance);

      //remove from component info
      var componentInfo = this.findComponentInfo(instance);
      componentInfo && componentInfo.removeInstance(instance);

      //remove from registry
      delete this.allInstances[instance.id];
    },

    removeComponentInfo: function(componentInfo) {
      var index = this.components.indexOf(componentInfo);
      (index > -1) && this.components.splice(index, 1);
    },

    findComponentInfo: function(which) {
      var component = which.attachTo ? which : which.constructor;

      for (var i = 0, c; c = this.components[i]; i++) {
        if (c.component === component) {
          return c;
        }
      }

      return null;
    },

    findInstanceInfo: function(instance) {
      return this.allInstances[instance.id] || null;
    },

    findInstanceInfoByNode: function(node) {
      var result = [];
      utils.each(utils.keys(this.allInstances),function(k) {
        var thisInstanceInfo = this.allInstances[k];
        if (thisInstanceInfo.instance.element === node) {
          result.push(thisInstanceInfo);
        }
      },this)
      
      return result;
    }

  };


  return ComponentsManager
});