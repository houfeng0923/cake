define(['cake', 'cake/utils', 'with/DialogExtension', 'with/TemplateExtension'], function(Cake, utils, DialogExtension, TemplateExtension) {


  var dialogId = 'dialog_' + ($.guid++);

  var TaskAssignForSelfDialog = Cake.define({
    name: 'TaskAssignForSelfDialog',
    attrs: { 
      formSelector : '.task-dialog-form', 
      title: '给自己安排任务',
      loadingTitle: '提交中...',
      newTaskUrl: window.PATH_CONTEXT + '/task/new.ajax'
    },  
    templates: {
      'dialog-content': 'text!component/task/tpl/taskAssignForm.tpl'
    },

    initialize: function() {
      this.subscribe('uiOpenTaskAssignForSelfDialog', function() {
        this.openNewTaskForSelfDialog();
      })
      //lazy loading form modules 
      this.subscribe('uiOpenTaskAssignForSelfDialog', function() {
        require(['jquery/ajaxForm', 'jquery/validate']);
      })
    },

    openNewTaskForSelfDialog: function() {
      var self = this;
      this.openModalDialog({
        id:dialogId,
        title: this.attrs.title,
        content: this.renderTemplate('dialog-content', {
          newTaskUrl: this.attrs.newTaskUrl
        }),
        onshow: function() {
          self.initializeDialogView(self.$dialog)
        }
      })
    },

    initializeDialogView: function($dialog) {
      var self = this,
        $form = $dialog.find(this.attrs.formSelector);
      require(['jquery/datetimepicker'], function() { 
        $dialog.find('#planFinishTime').datetimepicker({
          autoclose: true
        })
      });
 
      //把验证和提交逻辑包装起来，便于分配他人任务使用。？
      //todo form validate 
      //
      //form ajax submit
      require(['jquery/ajaxForm','jquery/validate','bootstrap'], function() {
        self._registerValidate($form)
        self._registerSubmit($form)
      });
    },

    _registerValidate:function($form) {
      var self = this;
      $.validator.messages.required = "该项不能为空";
      $form.validate({
        showErrors:function(map,list) { 
           $('[rel="tooltip"]',this.currentForm).tooltip('destroy')
           .removeAttr('data-original-title')  
           // $('.form-group' ,this.currentForm).removeClass('error') 
           $.each(list,function(i,e) { 
             $(e.element).attr({
               'rel':'tooltip'
               // ,'data-placement':'bottom'
               ,'data-original-title':e.message
             })/*.closest('.form-group').addClass('error') */
           }) 
           $(this.currentForm).tooltip({
               selector:'[rel="tooltip"]'
           }) ;
        }
      })
    },

    _registerSubmit: function($form) {
      var self = this;
      $form.ajaxForm({
        beforeSubmit: function() {
          var result = $form.valid();
          // $submit.val('处理中..').attr('disabled', 'disabled') ;
          if(result)  self.setDialogTitle(self.attrs.loadingTitle)
          return result;
        },
        success: function(resp) {
          self.setDialogTitle(self.attrs.title)
          if (resp.code == 0) {
            self.closeDialog();
            self.tips('任务已安排！') 
            //广播 ‘给自己安排任务’事件
            self.publish('taskAssignForSelf',[resp.data]) 
          } else {
            self.alert(resp.msg)
          }
        },
        error: function() {}
      })
    } 
    
  }, [DialogExtension, TemplateExtension]);

  return TaskAssignForSelfDialog;
});