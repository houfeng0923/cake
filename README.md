# Cake

lightweight component framework

## features

 - 借鉴backbone一些语法，flight 特性，目标是建立一个light-weight、简洁易用的组件框架

   选型： amd + jquery

   缘起：模块化下组件开发不规范

   方案：了解社区方案，kissy、arale、mvc框架（backbone等），重，成本高，期望的方案：简单

 - 简化生命周期： initialize - [render] - destroy
 - 扁平化：无继承，组件关系扁平化； （base <--classic extends-- component）
 - 事件驱动：eventbus 关注点分离
   1. 组件间解耦（横向和纵向拆分）
   2. 组件内事件，更合理组织代码
 - 逻辑拆分原则：
     - 页面视图区块、影响范围
     - 页面逻辑复杂度(按照预估代码量评定，没有强制规范；评审可以拆分的话，分为dom操作层和业务逻辑层)
     - 按逻辑的职责 （逻辑分属不同，根据复杂度决定是否拆分）


## usage

### simple

    define(['cake'],function (Cake){

      var Comp = Cake.define({
        name : 'simple_component',
        initialize : function (){},
        destroy : function (){}
      });
      return Comp;

    });
> name ： 组件类型标识，唯一。


### 组件定义 demo

    define(['cake'],function (Cake){

      var Follow = Cake.define({
        name : 'biz_follow',
        attrs:{}, // 属性
        events : {
          'click@.js-to-follow' : '_follow',
          'click@.js-to-unfollow' : '_unfollow'
        },
        templates : {
          'tpl-dialog' : './tpl/follow-confirm.tpl',
          'tpl-step1' : '#template_step1'
        },
        initialize : function (){
          // this.renderTemplate('tpl-step1',ctx,this.$element.find('.step'))
          // 订阅其他组件消息
          // this.subscribe('***',function(){});
        },
        // ... 关注
        _follow : function (e){
          // this.publish('follow');
        },
        // ... 取消关注
        _unfollow : function (e){
          // this.publish('unfollow');
        }
      },[/*扩展*/]);
      // ps: 内置扩展模块  EventExtension ,TemplateExtension , RegisterExtension

      return Follow;

    });



### 扩展定义

    define(['utils','hogan'],function (utils,Engine){

      function TemplateExtension () {
        this.before('initialize',function (next){ // if async ,add 'next' param;
          var templates = this.templates;
          // ... pre-load & pre-compiler tpl
        });
      }

      utils.mixin(TemplateExtension.prototype,{
        renderTemplate : function (name,context,dom){
          // ...
          this._preCompiled[name](context);
        }
      });

      return TemplateExtension;

    });

#### 扩展列表

    // EventExtension
    // RegisterExtension
    // TemplateExtension (封装 hogan )
    //
    // XhrExtension(deprecated)   (hack $ ajax)
    // DialogExtension  (封装 $ artDialog )
    // FormExtension     (封装 $ ajaxForm/formValidate )



### 组件调用

    require(['follow','followed-list'],function (Follow,FollowedList){

      Follow.attachTo('body',{
        attrs:{},
        model:{}
      });

      FollowedList.attachTo('.followed',{});

    });


> 统一的组件对外接口。强制的组件隔离，提高组件的内聚性



### 组件销毁

    require(['cake'],function (Cake){
      Cake.destroy('body');
      Cake.destroy('body',true);
      // 简单粗暴 （需要对绑定的dom元素有良好的规划）
      // 补充方案：attachTo时增加type/channel进行分类，按照类别进行销毁
    });




## TODO

### BindExtension

    // one : 单向 model->view
    define(['utils'],function (utils){

      function BindExtension () {
        this.before('initialize',function (/*promise*/){

        });
      }

      utils.mixin(BindExtension.prototype,{
        set:function (){},
      });

      return BindExtension;

    });


