
define(['cake/utils','cake','with/TemplateExtension'], 
  function(utils,Cake,TemplateExtension) {
  

  var ExampleComp = Cake.define({
    name: 'LoginFormComp', // 组件名称，debug ， event, logger 等功能会使用
    model: {
      firstname:'hou',
      lastname:'feng'
    },
    attrs: {
      resultPanelClass: 'resultPanelold'
      ,testold:'testold'
    },
    //基于delegate 
    events: { 
      'click@.btn': '_clickButtonHandler',
      'mousedown@.{{resultPanelClass}}': '_toggleHandler',
      'dblclick' : '_dblclickHandler'
    },
    templates: {
      'left': 'text!component/TemplateExample/left.tpl',
      'right': '#id1',
      'right2': '.class1',
      'center': '<p> inline template </p>'
    },
    //测试是否会覆盖父类方法
    // init:function() {},
    // initializer:function() {},

    initialize: function() { 
      this.subscribe('initialized.LoginFormComp',function(e,params) {
            console.log(this); //component
            console.log(e,params);
        },this)
      this.on('mousedown','input',function(e) {
        console.log('mousedown',this,e);
      })
      this.render();
    },
    
    render: function() {  
      var html = this.renderTemplate('left', utils.mixin({}, this.model))
      // console.log(html);
      this.$element.find('.fields').append(html)
    },

    teardown: function() {
      this.$element.html('')
    },

    _clickButtonHandler: function() {
      var firstname = this.$element.find('[name=firstname]').val(),
            lastname = this.$element.find('[name=lastname]').val();
      this.$element.find('.'+this.attrs['resultPanelClass']).html(firstname+'.'+lastname)
    },

    _toggleHandler: function(e) {
      $(e.currentTarget).css('background-color', 'red');
    },

    _dblclickHandler:function(e) {
      alert('dblclick this.$element')
    }

  },[TemplateExtension])


  return ExampleComp

})