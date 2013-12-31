
define(['cake/utils','cake',
  'with/TemplateExtension','with/DialogExtension'], 
  function(utils,Cake,TemplateExtension,DialogExtension) {
  

  var DialogExampleComp = Cake.define({
    name: 'LoginDialogComp', // 组件名称，debug ， event, logger 等功能会使用
    model: {
      firstname:'hou',
      lastname:'feng'
    },
    attrs: {
      resultPanelClass: 'resultPanel'
    },
    templates: {
      'content': 'text!component/DialogExample/content.tpl'
    },
    //基于delegate 
    events: { 
      'click@.dialogWidget>.btn': '_clickButtonHandler'
    }, 

    initialize: function() { 
      
      this.render();
      // this.subscribe('dialogClosed',function() {
      //   this.destroy();
      // })
    },
    render: function() {  
      var html = this.renderTemplate('content', utils.mixin({}, this.model))
      this.openDialog({
        content:html
      })
      // this.$element.find('.fields').append(html)
    },

    teardown:function() { 
    },

    _clickButtonHandler: function() { 
      var firstname = this.$dialog.find('[name=firstname]').val(),
            lastname = this.$dialog.find('[name=lastname]').val();

            
      alert(firstname+'.'+lastname);
      this.closeDialog();
    }
 
  },[TemplateExtension,DialogExtension])


  return DialogExampleComp

})