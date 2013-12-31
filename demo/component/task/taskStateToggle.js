// 任务完成重启

define(['cake','with/DialogExtension'],function(Cake,DialogExtension){
  //有状态组件
  var TaskStateToggle = Cake.define({
    name:'TaskStateToggle', 
    attrs:{
      parentContainerSelector:'.tasklist-container',  
      taskCheckboxSelector:'.task-checkbox :checkbox', 
      
      toCompleteStateTip:'点击完成',
      toRestartStateTip:'取消完成',
      restartDialogMsg:'是否重启该任务?',
      
      completeUrl:window.PATH_CONTEXT + '/task/complete.ajax',
      restartUrl:window.PATH_CONTEXT + '/task/restart.ajax'
    },
    events:{
      'click@{{parentContainerSelector}} {{taskCheckboxSelector}}':'_taskToggleClickHandler', 
      
      'mouseout@{{parentContainerSelector}} {{taskCheckboxSelector}}':'_taskToggleMouseOutHandler',
      'mouseover@{{parentContainerSelector}} {{taskCheckboxSelector}}':'_taskToggleMouseOverHandler'

    },
    
    _taskToggleMouseOverHandler:function(e) {
      var $checkbox = $(e.currentTarget)
      var tipMsg = this.attrs[$checkbox.is(':checked')?'toRestartStateTip':'toCompleteStateTip']
      $checkbox.attr('title',tipMsg)
    },
    _taskToggleMouseOutHandler:function(e) {},

    _taskToggleClickHandler:function(e) {
      var self = this,
          $checkbox = $(e.currentTarget),
          taskId = $checkbox.data('taskid'),
          isChecked = $checkbox.is(':checked'); 

      if(isChecked){
        this.completeTask(taskId).then(function(resp) {
          if(resp.code==0){
            $checkbox.prop('checked',true)
            $checkbox.trigger('mouseover')          
          }
        });
      }else {
        var msg = this.attrs.restartDialogMsg
        this.confirm(msg,function(dialog) {
          self.restartTask(taskId).then(function(resp) {
            if(resp.code==0){
              dialog.close()
              $checkbox.prop('checked',false)
            }
          }); 
        })
      }
      return false
    },

    completeTask:function(taskId) {
      var self = this,
          url = this.attrs.completeUrl;

      return $.post(url,{taskId:taskId},'json').then(function(resp){
        self.tips(resp.msg)
      }).then(function(resp) {
        if(resp.code==0){ 
          self.publish('taskCompleted',[resp.data.taskVO])
        }
      })
    }, 

    restartTask:function(taskId) {
      var self = this,
          url = this.attrs.restartUrl;

      return $.post(url,{taskId:taskId},'json').then(function(resp){
        self.tips(resp.msg)
      }).then(function(resp) {
        if(resp.code==0){ 
          self.publish('taskRestarted',[resp.data.taskVO])
        }
      })
    }

  },[DialogExtension])

  return TaskStateToggle;

});