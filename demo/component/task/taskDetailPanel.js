// 任务详情

define(['cake','with/DialogExtension','with/TemplateExtension','lib/date/Date'],function(Cake,DialogExtension,TemplateExtension,$D){
  
  var CONTEXT = window.PATH_CONTEXT;
  //有状态组件
  var TaskDetailPanel = Cake.define({
    name:'TaskDetailPanel',
    model:{
      data:null
    },
    attrs:{
      detailContainerSelector:'.task-right',
      rejectReasonFormContainerSelector:'.js-reject-form',
      taskDeleteBtnSelector : '.task-delete',
      taskAcceptSelector : '.btn-accept',
      taskRejectSelector : '.btn-reject',
      taskRejectSubmitSelector : '.btn-reject-submit',
      taskReallocateBtnSelector : '.btn-reallocate-task', 
      taskStatusSelector : '.task-title .task-status',
      taskHistoryListSelector : '.task-history-list',  
      taskCheckboxSelector:'.task-checkbox :checkbox',
      rejectReasonFieldName:'rejectionReasion',

      rejectPreventTip : '请输入拒绝理由',

      detailUrl:CONTEXT + '/task/obtain.ajax',
      acceptUrl:CONTEXT + '/task/accept.ajax',
      rejectUrl:CONTEXT + '/task/reject.ajax',
      reallocateUrl:CONTEXT + '/task/reallocate.ajax',

      discussUrl:CONTEXT + '/task/discuss.ajax',
      attachmentUrl:CONTEXT + '/task/attachment.ajax',
      historyUrl:CONTEXT + '/task/history.ajax'
    },
    events:{
      'click@{{detailContainerSelector}} {{taskDeleteBtnSelector}}':'_taskDeleteHandler',
      'click@{{detailContainerSelector}} {{taskAcceptSelector}}':'_acceptBtnClickHandler',
      'click@{{detailContainerSelector}} {{taskRejectSelector}}':'_rejectBtnClickHandler',
      'click@{{detailContainerSelector}} {{taskReallocateBtnSelector}}':'_reallocateBtnClickHandler',
      'click@{{detailContainerSelector}} {{taskRejectSubmitSelector}}':'_rejectSubmitBtnClickHandler'
    },
    templates:{
      'content':'text!component/task/tpl/taskDetail.tpl'
    },
    initialize:function() {

      this.$element.find(this.attrs.detailContainerSelector)
      .on('shown.bs.tab','a[data-toggle="tab"]',$.proxy(function (e) {
        // e.target // activated tab // e.relatedTarget // previous tab
        var url,
            detailTabSelector = $(e.target).attr('href'),
            detailType = detailTabSelector.substr(1);

        if(detailType=='task-detail-history') url = this.attrs.historyUrl
        if(detailType=='task-detail-attachment') url = this.attrs.attachmentUrl
        if(detailType=='task-detail-discuss') url = this.attrs.discussUrl

        if(url)  this.fetchDetailTabInfo(url,detailTabSelector) 
      },this));   


      this.subscribe('uiOpenTaskDetailPanel',function(e,task) {  
        if(this.model.data&&this.model.data.taskVO&&this.model.data.taskVO.id==task.id) return;
        this.fetchTaskDetail(task.id)
      }) 
      this.subscribe('taskDeleted taskReAllocated',function(e,task) {
        var data = this.model.data;
        if(!data) return; 
        if(task.id==data.taskVO.id){
          this.reset()
        }
      })
      this.subscribe('taskCompleted taskRestarted',function(e,task) {
        var data = this.model.data;
        if(!data) return; 
        if(task.id == data.taskVO.id){
          this.updateModel(task)
          this.renderTaskStateView()
        }
      })

      //如果是自显示组件 读取 data-taskid 自动显示 
      var taskId = this.$element.data('taskid');
      if(taskId && !this.model.data){
        this.fetchTaskDetail(taskId);
      }else if(this.model.data){ //如果初始化组件时 传入了model ， 直接显示
        this.renderTaskDetailView();
      }

    },
    teardown:function() {
      this.reset()
    },

    reset:function() { 
      this.$element.find(this.attrs.detailContainerSelector).empty()
        .off('shown.bs.tab','a[data-toggle="tab"]')
      this.model.data = null
    },
    updateModel:function(task) { 
      this.model.data.taskVO = $.extend(true,{},task)
    },

    fetchTaskDetail:function(taskId) {
      var self = this,
          url = this.attrs.detailUrl;
      // self.$element.find(this.attrs.detailContainerSelector)
      //   .prepend($('<div>').addClass('loading').html('loading......'))

      return $.getJSON(url,{taskId:taskId}).always(function() {
        // self._hideLoadingView()
      }).then(function(resp) {
          if(resp.code!=0) return; 
          
          self.model.data = resp.data;

          self.renderTaskDetailView()          
      })
    },
    //获取任务详情信息显示
    fetchDetailTabInfo:function(url,targetSelector) {  
      var self = this,
          taskId = this.model.data.taskVO.id;
          // historyVO = this.model.data.historyVO;
      // if(historyVO){
      //   this.renderDetailTabView(targetSelector)
      // }
      this.$element.find(targetSelector).empty().html('loading');
      $.getJSON(url,{taskId:taskId}).then(function(resp) {
        if(resp.code!=0) return;
        var historyVO = resp.data.historyVO;

        self.model.data.historyVO = historyVO;
        self.renderDetailTabView(targetSelector)
      })

    },

    _taskDeleteHandler:function(e) { 
      e.preventDefault()
      e.stopPropagation()
      var taskVO = this.model.data.taskVO,
          task = $.extend({},taskVO);
      this.publish('uiOpenTaskDeleteConfirmDialog',[task]) // need id,name
    },

    _acceptBtnClickHandler:function(e) {
      var self = this,
          url = this.attrs.acceptUrl,
          taskVO = this.model.data.taskVO,
          taskId = taskVO.id,
          task = $.extend({},taskVO);

      $.post(url,{taskId:taskVO.id},'json').then(function(resp) {
          self.tips(resp.msg)
      }).then(function(resp) {
        if(resp.code==0){
          self.publish('taskAccepted',[task])
          self.reset()
        }
      })
    },
    _rejectBtnClickHandler:function(e) {
      e.preventDefault()
      var $reason = this.$element.find(this.attrs.rejectReasonFormContainerSelector)
      $reason.removeClass('hide').find('input:first').focus()
    },
    _reallocateBtnClickHandler:function(e) {
      e.preventDefault()
      var self = this,
        url = this.attrs.reallocateUrl,
        taskVO = this.model.data.taskVO,
        task = $.extend({},taskVO,{
          planFinishTime:new Date(taskVO.planFinishTime),          
          //参与人
          participantIdList : $.map(taskVO.taskParticipantList,function(i) {return i.participantId})
        });
        delete task.taskParticipantList;

      $.post(url,task,'json').then(function(resp) {
          self.tips(resp.msg)
      }).then(function(resp) {
        if(resp.code==0){
          self.publish('taskReAllocated',[task])
          self.reset()
        }
      })

    }, 

    _rejectSubmitBtnClickHandler:function(e) {
      var self = this,
          url = this.attrs.rejectUrl,
          taskVO = this.model.data.taskVO,
          taskId = taskVO.id,
          task = $.extend({},taskVO),
          reasonFieldName = this.attrs.rejectReasonFieldName,
          $reason = this.$element.find('[name='+reasonFieldName+']'),
          reason = $reason.val(),
          ajaxData = {};

      if(!reason){
        $reason.focus()
        return this.tips(this.attrs.rejectPreventTip) 
      }
      ajaxData.taskId = taskVO.id;
      ajaxData[reasonFieldName] = reason;
      $.post(url,ajaxData,'json').then(function(resp) {
          self.tips(resp.msg)
      }).then(function(resp) {
        if(resp.code==0){
          self.publish('taskRejected',[task])
          self.reset()
        }
      })
    },

    renderTaskDetailView:function() {
      var detail = this._assembleDetailModel()
      this.$element.find(this.attrs.detailContainerSelector)
          .html(this.renderTemplate('content',detail))
  
    },
    // 仅更新任务状态显示部分
    renderTaskStateView:function() {
      var taskStatusSelector = this.attrs.taskStatusSelector,
          detailContainerSelector = this.attrs.detailContainerSelector,
          taskCheckboxSelector = this.attrs.taskCheckboxSelector,
          $taskStatus = this.$element.find(detailContainerSelector).find(taskStatusSelector),
          detail = this._assembleDetailModel(),
          $html = $(this.renderTemplate('content',detail)),
          statusNode = $html.find(taskStatusSelector)[0];

      if(statusNode) $taskStatus.replaceWith(statusNode.outerHTML)

      var taskChecked = detail.taskChecked;
      this.$element.find(taskCheckboxSelector).prop('checked',taskChecked)
      
    },
    //获取任务详情信息显示
    renderDetailTabView:function(targetSelector) {
      var taskHistoryListSelector = this.attrs.taskHistoryListSelector,
          historyList = this.model.data.historyVO,
          $html,self = this;

      $.each(historyList,function(_,item) {
        item.operationTimeStr = self._dateFormater(item.operationTime)
      })
      $html = $(this.renderTemplate('content',{
        taskHistoryList:historyList
      }));

      this.$element.find(targetSelector).empty().html($html.find(taskHistoryListSelector))      

    },


    _assembleDetailModel:function() {
      var userId = this.model.data.userId,
          taskDetail = $.extend(true,{},this.model.data.taskVO),
          state = taskDetail.state,
          //是否是参与者角色
          ifParticipantRole = taskDetail.creatorId!=userId && taskDetail.principalId!=userId
      ;

      // console.log(taskDetail);
      taskDetail.taskId = taskDetail.id
      taskDetail.description = taskDetail.description || '未填写详细描述'
      taskDetail.remindPointStr = {
          '01':'不提醒',
          '02':'准时',
          '03':'提前5分钟',
          '04':'提前10分钟',
          '05':'提前30分钟',
          '06':'提前1小时',
          '07':'提前2小时',
          '08':'提前6小时',
          '09':'提前1天',
          '10':'提前2天'
      }[taskDetail.remindPoint]
      taskDetail.stateStr = ['待接收','已拒绝','进行中','已完成','已删除','已过期'][state]
      taskDetail.stateCls = state==5?'overdue':''
      taskDetail.createTimeStr = this._dateFormater(taskDetail.createTime)
      taskDetail.planFinishTimeStr = this._dateFormater(taskDetail.planFinishTime)
      //
      taskDetail.ifEditable = false
      taskDetail.taskChecked = state==3?'checked':''
      taskDetail.taskDisabled = (state==0 || state==1 || ifParticipantRole) ? 'disabled':''
      taskDetail.ifShowReceivableOperationPanel = state==0 && taskDetail.principalId==userId
      taskDetail.ifShowRejectedOperationPanel = state==1 && taskDetail.creatorId==userId
      taskDetail.ifShowDelete = taskDetail.creatorId==userId
      return taskDetail
    },

    _showLoadingView:function() {},
    _hideLoadingView:function() {},

    _dateFormater:function(time) {
      var d = new Date(time)
      return $D(d).format('%Y-%m-%d %H:%M')
      // return (d.getYear()+1900)+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()
    }

  },[DialogExtension,TemplateExtension])

  return TaskDetailPanel;

});