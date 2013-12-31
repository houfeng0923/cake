// 任务删除 

define(['cake','with/DialogExtension'],function(Cake,DialogExtension){

  var TaskDeleteDialog = Cake.define({
    name:'TaskDeleteDialog',
    attrs:{
      message:'删除 【{{name}}】后，该任务的评论、文档等所有内容都将一起删除且无法恢复！<br>请确认是否删除？',
      deleteUrl:window.PATH_CONTEXT + '/task/delete.ajax'
    },
    initialize:function() {
      this.subscribe('uiOpenTaskDeleteConfirmDialog',function(e,task) {
        this.showDeleteConfirmDialog(task)        
      })
    },
    showDeleteConfirmDialog:function(task) {
      var self = this,
          msg = this.attrs.message.replace(/{{name}}/g,task.name)
      // this.openModalDialog({
      //   title:'确认',
      //   content:msg ,
      //   width:'400px',
      //   okValue:'确认',
      //   cancelValue:'取消',
      //   ok:function() {
      //     self._deleteTask(task)
      //     return false;
      //   },
      //   cancel:function() {}
      // })
      this.confirm(msg,function(dialog) { 
        self._deleteTask(task).always(function() { 
          dialog.close()
          // self.closeDialog()
        })
        return false
      })
    },

    _deleteTask:function(task) {
      var self = this,
          url = this.attrs.deleteUrl,
          taskParams = $.extend({},task);
          
      return $.post(url,{taskId:task.id},'json').then(function(resp) {
        if(resp.code==0){
          self.tips(resp.msg)
          self.publish('taskDeleted',[taskParams])
        }else{
          self.alert(resp.msg)
        }
      })
    }

  },[DialogExtension])

  return TaskDeleteDialog;

});