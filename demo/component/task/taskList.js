//   待接收任务 

define(['cake','with/TemplateExtension','lib/date/Date'], function(Cake,TemplateExtension,$D) {
 
  // 有状态组件
  var TaskList = Cake.define({

    name: 'TaskList',
    model:{
      data : null
    },
    attrs: { 
      taskListParentSelector:'.task-left', 
      taskItemSelector:'.task-item',
      taskDeleteBtnSelector : '.task-item .task-delete',
      todoTaskListClass : 'todo',
      rejectedTaskListClass : 'rejected',

      taskType:null,//responsibleTask//assignedTask//participantTask// 参数传入，标记任务类型
      listType:null,//receivable//rejected//参数传入,标记列表类型

      listUrl:null// 参数传入
    },
    events: {
      'click@{{taskItemSelector}}':'_taskItemClickHandler',
      //task delete , 需要区分
      'click@{{taskDeleteBtnSelector}}':'_taskDeleteHandler'
    },

    templates:{
      'list':'text!component/task/tpl/taskList.tpl'
    },
    initialize: function() {

      this.fetchRemoteList(this.attrs.listUrl)


      this.subscribe('taskDeleted',function(e,task) {
        this._removeModelItem(task.id);
        this.updateView()
      })

      if(this.attrs.taskType=='responsibleTask'&&this.attrs.listType=='receivable'){
        this.subscribe('taskAccepted taskRejected',function(e,task) { 
          if(this._findModelItem(task.id)){
            this._removeModelItem(task.id)
            this.updateView()
          }
        })
      }
      
      if(this.attrs.taskType=='assignedTask'&&this.attrs.listType=='receivable'){
        this.subscribe('taskAssignForOthers',function(e,task) {
          if(!this._findModelItem(task.id)){
            this._addModelItem(task)
            this.updateView()
          }
        }) 
        this.subscribe('taskReAllocated',function(e,task) {
          if(!this._findModelItem(task.id)){
            this._addModelItem(task)
            this.updateView()
          }
        })
      }

      if(this.attrs.taskType=='assignedTask'&&this.attrs.listType=='rejected'){
        this.subscribe('taskReAllocated',function(e,task) {
          if(this._findModelItem(task.id)){
            this._removeModelItem(task.id)
            this.updateView()
          }
        })
      }
    },

    fetchRemoteList:function(url) {
      var self =this;
      $.ajax(url,{
        type:'get',
        dataType:'json',
        mode:'sync',
        port:'task'
      }).then(function(resp) {
        if(resp.code==0){
          var data = resp.data;
          self.model.data = data;// 组件模型 
          self.updateView()
        } 

      })
    },

    renderView:function(jsonData) { 
      var $container = this._getContainer(),
          html = this.renderTemplate('list',jsonData)

      $container.empty().html(html)
    },

    updateView:function() {
      var data = $.extend(true,{},this.model.data);
      var jsonData = this._preprocessModel(data);
      this.renderView(jsonData)
    },
 
    _getContainer:function() {
      return this.$element;
    },

    _taskDeleteHandler:function(e) { 
      e.preventDefault()
      e.stopPropagation()
      var list = this.model.data.taskList;
      var taskid = $(e.currentTarget).data('taskid');
      var taskList = $.grep(list,function(item) {return item.id==taskid});
      var task = taskList.length?($.extend(true,{},taskList[0])):null
      if(task)  this.publish('uiOpenTaskDeleteConfirmDialog',[task])
    },

    _taskItemClickHandler:function(e) {
      var list = this.model.data.taskList;
      var taskid = $(e.currentTarget).data('taskid');
      var taskList = $.grep(list,function(item) {return item.id==taskid});
      var task = taskList.length?($.extend(true,{},taskList[0])):null
      if(task) this.publish('uiOpenTaskDetailPanel',[task])

      $(this.attrs.taskListParentSelector).find(this.attrs.taskItemSelector).removeClass('active')
      $(e.currentTarget).addClass('active')
    },

    _dateFormater:function(time) {
      var d = new Date(time)
      return $D(d).format('%Y-%m-%d %H:%M')
      // return (d.getYear()+1900)+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()
    },

    _findModelItem:function(taskId) {
      var taskList = this.model.data.taskList;
      var filterTask = $.grep(taskList,function(item) {
        return item.id == taskId
      })
      return filterTask.length?filterTask[0]:null
    },
    _addModelItem:function(task) {
      this.model.data.taskList.push($.extend(true,{},task))
    },
    _removeModelItem:function(taskId) {
      var newList = $.grep(this.model.data.taskList,function(item) {return item.id!=taskId})
      this.model.data.taskList = newList;
    },

    _preprocessModel:function(data) {
      // todo 按时间排序
      var self = this,
        userId = data.userId,
        list = data.taskList,
        ifTodo = data.state==0,
        jsonData = {
          taskCount:list.length,
          taskList:list,
          ifTodoList:ifTodo,
          taskListClass:ifTodo ? this.attrs.todoTaskListClass:this.attrs.rejectedTaskListClass
        }
      $.each(list,function(_,item) {
        item.taskId = item.id
        item.taskName = item.name
        item.taskPlanFinishTime = self._dateFormater(item.planFinishTime)
        //todo
        item.ifShowName = userId!=item.principalId
        // item.ifShowComment = !item.ifShowName 
        item.ifShowDelete = item.creatorId==userId
      })
      return jsonData
    },
    teardown:function() {
      this._getContainer().empty()
    }


  },[TemplateExtension]);

  return TaskList;

})

