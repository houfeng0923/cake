define(['cake', 'cake/utils', 'with/DialogExtension', 'with/TemplateExtension'], function(Cake, utils, DialogExtension, TemplateExtension) {

  var dialogId = 'dialog_' + ($.guid++);

  var TaskAssignForOthersDialog = Cake.define({
    name: 'TaskAssignForOthersDialog',
    attrs: {
      nextBtnSelector:'#content\\:'+dialogId+' #btn-step-to2',
      prevBtnSelector:'#content\\:'+dialogId+' #btn-step-to1',
      form1Selector : '.form-step1',
      form2Selector : '.form-step2',

      title: '为他人分配任务',
      loadingTitle: '提交中...',
      
      newTaskUrl: window.PATH_CONTEXT + '/task/new.ajax'
    },
    events: {
      'click@{{nextBtnSelector}}': '_showStep2',
      'click@{{prevBtnSelector}}': '_showStep1' 
    },
    templates: {
      'dialog-content': 'text!component/task/tpl/taskAssignForOthers.tpl'
    },
    initialize: function() {
      this.subscribe('uiOpenTaskAssignForOthersDialog', function() {
        this.openNewTaskForOthersDialog();
      })
      //lazy loading form modules 
      this.subscribe('uiOpenTaskAssignForOthersDialog', function() {
        require(['jquery/ajaxForm', 'jquery/validate']);
      })
    },

    openNewTaskForOthersDialog: function() {
      var self = this;
      this.openModalDialog({
        id: dialogId,
        title: this.attrs.title,
        content: this.renderTemplate('dialog-content', {
          newTaskUrl: this.attrs.newTaskUrl
        }),
        onshow: function() {
          self._initializeDialogView(self.$dialog)
        }
      })
    },

    _initializeDialogView: function($dialog) {
      var self = this,
        $form1 = $dialog.find(this.attrs.form1Selector),
        $form2 = $dialog.find(this.attrs.form2Selector);


      require(['jquery/datetimepicker'], function() {
        $dialog.find('.step2 #planFinishTime').datetimepicker({
          autoclose: true
        })
      });
 

      //把验证和提交逻辑包装起来，便于分配他人任务使用。？
      //todo form validate 
      //
      //form ajax submit
      require(['jquery/ajaxForm','jquery/validate','bootstrap'], function() {
        
        self._registerValidate($form1)

        self._registerValidate($form2)
        self._registerSubmit($form2) 

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

    _registerSubmit: function($form2) {
      var self = this;
      $form2.ajaxForm({
        beforeSubmit: function() {
          var result = $form2.valid();
          if(result) self.setDialogTitle(self.attrs.loadingTitle)
          // // $submit.val('处理中..').attr('disabled', 'disabled') ;
          return result;
        },
        success: function(resp) {
          self.setDialogTitle(self.attrs.title)
          if (resp.code == 0) {
            self.closeDialog();
            self.tips('任务已分配！')
            //广播 ‘为他人分配任务’事件
            self.publish('taskAssignForOthers',[resp.data])
          } else {
            self.alert(resp.msg)
          }
        },
        error: function() {}
      })
    },
 

    _showStep2: function(e) {
      e.preventDefault()  
      var self = this,
          $form1 = $(e.target).closest('form');   

      var result = $form1.valid();
      if(!result) {
        $form1.find('input:first').focus() //临时解决 验证后不聚焦的问题
        return;
      }

      self.$dialog.find('.step1,.step2').toggleClass('hide')
      self.resetDialog()
      self.$dialog.find('.step2 #principalId').val(self.$dialog.find('.step1 #principalId').val())
      self.$dialog.find('.step2 #participantIdList').val(self.$dialog.find('.step1 #participantIdList').val())
 
    },

    _showStep1: function(e) {
      e.preventDefault()
      //todo
      this.$dialog.find('.step1,.step2').toggleClass('hide')
      this.resetDialog()
    }


  }, [DialogExtension, TemplateExtension]);

  return TaskAssignForOthersDialog;
});