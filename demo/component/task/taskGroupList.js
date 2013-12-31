// 进行中，已完成的任务 

define(['cake','with/TemplateExtension','lib/date/Date'], function(Cake,TemplateExtension,$D) {

  // 有状态组件
  // this.taskListStatus : procdessing/finished
  var TaskGroupList = Cake.define({

    name: 'TaskGroupList',
    model:{
      data : null
    },
    attrs: { 
      taskListParentSelector:'.task-left',
      taskListFilterSelector:'.tasklist-filter .task-status',
      listContainerSelector:'.js-taskgrouplist',
      listHeaderContainerSelector:'.js-taskgrouplist-header',
      listBodyContainerSelector:'.js-taskgrouplist-body',
      taskDeleteBtnSelector : '.js-taskgrouplist-body .task-item .task-delete',
      taskItemSelector:'.task-item',
      taskDoneClass:'task-done',
      taskOverdueClass:'overdue',

      taskType:null,//responsibleTask//assignedTask//participantTask// 参数传入

      openListUrl:null,// 参数传入
      completedListUrl:null// 参数传入
    },
    events: {
      'click@{{taskListFilterSelector}}':'_changeTaskListHandler',
      'click@{{taskDeleteBtnSelector}}':'_taskDeleteHandler',
      'click@{{taskItemSelector}}':'_taskItemClickHandler'
    },

    templates:{
      'list':'text!component/task/tpl/taskGroupList.tpl'
    },
    
    initialize: function() { 
      this.taskListStatus = 'processing';//'finished'
      this.loadProcessingList().then($.proxy(function() {
        this.renderHeaderView()
      },this))


      this.subscribe('taskDeleted',function(e,task) {
        if(this._findModelItem(task.id)){
          this._removeModelItem(task.id);
          this.updateBodyView()
        }
      })


      if(this.attrs.taskType=='responsibleTask'){

        this.subscribe('taskAssignForSelf',function(e,task) {
          if(this.taskListStatus=='processing'){
            if(!this._findModelItem(task.id)){
              this._addModelItem(task)
              this.updateBodyView()
            }
          }
        })

        this.subscribe('taskAccepted',function(e,task) {
          if(this.taskListStatus=='processing'){
            if(!this._findModelItem(task.id)){
              this._addModelItem(task)
              this.updateBodyView()
            }
          }
        })
      }


      this.subscribe('taskCompleted',function(e,task) {
        var status = this.taskListStatus
        if(status=='processing'){
          if(this._findModelItem(task.id)){
            this._removeModelItem(task.id);
            this.updateBodyView()
          }
        }else if(status=='finished'){
          if(!this._findModelItem(task.id)){
            this._addModelItem(task)          
            this.updateBodyView()
          }
        }
      })

      this.subscribe('taskRestarted',function(e,task) {
        var status = this.taskListStatus
        if(status=='processing'){
          if(!this._findModelItem(task.id)){
            this._addModelItem(task)          
            this.updateBodyView()
          }
        }else if(status=='finished'){
          if(this._findModelItem(task.id)){
            this._removeModelItem(task.id);
            this.updateBodyView()
          }
        }
      })

    },

    loadProcessingList:function() {
      var self =this,
          data,
          url = this.attrs.openListUrl;

      return $.ajax(url,{
        type:'get',
        dataType:'json',
        mode:'sync',
        port:'task'
      }).then(function(resp) {
        if(resp.code==0){
          data = resp.data;
          self.model.data = data;// 组件模型
          self.updateBodyView();
        } 
      })
    },
    loadFinishedList:function() {
      var self = this,
          data,
          url = this.attrs.completedListUrl;

      return $.ajax(url,{
        type:'get',
        dataType:'json',
        mode:'sync',
        port:'task'
      }).then(function(resp) {
        if(resp.code==0){ 
          data = resp.data;
          self.model.data = data;// 组件模型
          self.updateBodyView(); 
        } 
      })
    },
    renderHeaderView:function() {
      var $container = this._getContainer(),
          html = this.renderTemplate('list'),
          $header = $(html).filter(this.attrs.listHeaderContainerSelector);

      $container.find(this.attrs.listHeaderContainerSelector).remove().end()
              .prepend($header) 
    },
    
    renderBodyView:function(jsonData) {
      var $container = this._getContainer(),
          html = this.renderTemplate('list',jsonData),
          $html = $(html).filter(this.attrs.listBodyContainerSelector)

      $container.find(this.attrs.listBodyContainerSelector).remove().end()
              .append($html)
                     
    },
    updateBodyView:function() { 
      var jsonData,
          data = $.extend(true,{},this.model.data);

      if(this.taskListStatus=='processing'){
        jsonData = this._assembleProcessingModel(data);
      }else{
        jsonData = this._assembleFinishedModel(data);
      }
      this.renderBodyView(jsonData)
    }, 

    _getContainer:function() {
      return this.$element
    },

    _taskDeleteHandler:function(e) { 
      e.preventDefault()
      e.stopPropagation()
      var list = this.model.data.taskList;
      var taskid = $(e.currentTarget).data('taskid'); 
      var taskList = $.grep(list,function(item) {return item.id==taskid});
      var task = taskList.length?($.extend({},taskList[0])):null
      this.publish('uiOpenTaskDeleteConfirmDialog',[task])
    },

    _taskItemClickHandler:function(e) {
      //过滤点击任务完成状态复选框事件
      if(e.target.type=='checkbox') return;

      var list = this.model.data.taskList;
      var taskid = $(e.currentTarget).data('taskid');
      var taskList = $.grep(list,function(item) {return item.id==taskid});
      var task = taskList.length?($.extend({},taskList[0])):null
      this.publish('uiOpenTaskDetailPanel',[task])

      
      $(this.attrs.taskListParentSelector).find(this.attrs.taskItemSelector).removeClass('active')
      $(e.currentTarget).addClass('active')
    },

    _changeTaskListHandler:function(e) {
      var status = $(e.currentTarget).data('task-status');
      this.taskListStatus = status;
      if(status=='processing'){
        this.loadProcessingList()
      }else if(status=='finished'){
        this.loadFinishedList()
      }
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
    //todo 
    // 进行中任务列表 数据组装规则
    _assembleProcessingModel:function(data) {
    
      var self = this,
        userId = data.userId,
        now = data.now?(new Date(data.now)):(new Date()),
        nowTime = data.now,
        todayTime = new Date((now.getYear()+1900)+'-'+(now.getMonth()+1)+'-'+(now.getDate()+1)).getTime(),
        tomorrowTime = new Date((now.getYear()+1900)+'-'+(now.getMonth()+1)+'-'+(now.getDate()+2)).getTime(),
        list = data.taskList;

      var overdueList = {name:'过期',taskList:[],groupStyleclass:this.attrs.taskOverdueClass},
          todayList= {name:'今天',taskList:[]},
          tomorrowList = {name:'明天',taskList:[]}, 
          planList = {name:'计划',taskList:[]},
          group = [overdueList,todayList,tomorrowList,planList],
          jsonData = {
            taskGroup:[]
          }

      list = this._sortTaskListByKey(list,'planFinishTime');
      //decorate
      $.each(list,function(_,item) {
        item.taskId = item.id
        item.taskName = item.name
        item.taskPlanFinishTime = self._dateFormater(item.planFinishTime)
        //todo
        item.ifShowName = userId!=item.principalId
        // item.ifShowComment = !item.ifShowName 
        //todo
        item.ifShowDelete = item.creatorId==userId
        item.taskDisabled = item.creatorId!=userId && item.principalId!=userId?'disabled':''
        item.taskChecked = item.state==3?'checked':''
      })

      //group
      $.each(list,function(_,item) {
        if(item.planFinishTime<=nowTime){//过期
          overdueList.taskList.push(item)
        }else if(item.planFinishTime<=todayTime){//今天
          todayList.taskList.push(item)
        }else if(item.planFinishTime<=tomorrowTime){//明天
          tomorrowList.taskList.push(item)
        }else{//计划
          planList.taskList.push(item)
        }
      });
      
      $.each(group,function(_,list) {
        if(!list.taskList.length) return;
        jsonData.taskGroup.push({
          groupId:$.guid++,
          groupName:list.name,
          groupStyleclass:list.groupStyleclass,
          groupCount:list.taskList.length,
          taskList:list.taskList
        })
      })


      return jsonData
    },
    // todo
    // 已完成任务列表 数据组装规则
    _assembleFinishedModel:function(data) {
      var self = this,
        userId = data.userId,
        now = data.now?(new Date(data.now)):(new Date()),
        nowTime = data.now,
        today = new Date((now.getYear()+1900)+'-'+(now.getMonth()+1)+'-'+(now.getDate()+1)),
        lastWeekTime = today.getTime() - (7*24*3600*1000),
        oneMonthAgoTime = today.setMonth(now.getMonth()-1),
        threeMonthsAgoTime = today.setMonth(now.getMonth()-3),
        list = data.taskList;

      var lastWeekList = {name:'一周前',taskList:[],taskStatusClass:this.attrs.taskDoneClass},
          oneMonthAgoList= {name:'一个月前',taskList:[],taskStatusClass:this.attrs.taskDoneClass},
          threeMonthsAgoList = {name:'三个月前',taskList:[],taskStatusClass:this.attrs.taskDoneClass},
          group = [lastWeekList,oneMonthAgoList,threeMonthsAgoList],
          jsonData = {
            taskGroup:[]
          }

      list = this._sortTaskListByKey(list,'finishTime',true);
      //decorate
      $.each(list,function(_,item) {
        item.taskId = item.id
        item.taskName = item.name
        item.taskPlanFinishTime = self._dateFormater(item.planFinishTime)
        //todo
        item.ifShowName = userId!=item.principalId
        // item.ifShowComment = !item.ifShowName 
        item.ifShowDelete = item.creatorId==userId
        item.taskDisabled = item.creatorId!=userId && item.principalId!=userId?'disabled':''
        item.taskChecked = item.state==3?'checked':''
        //todo 
      }) 
      //group
      $.each(list,function(_,item) {
        if(item.finishTime<=threeMonthsAgoTime){//三月前
          threeMonthsAgoList.taskList.unshift(item)
        }else if(item.finishTime<=oneMonthAgoList){//一个月前
          oneMonthAgoList.taskList.unshift(item)
        }/*else if(item.finishTime<=lastWeekList)*/{//一周前
          lastWeekList.taskList.unshift(item)
        }
      });
      
      $.each(group,function(_,list) {
        if(!list.taskList.length) return;
        jsonData.taskGroup.push({
          groupId:$.guid++,
          groupName:list.name,
          taskStatusClass:list.taskStatusClass,
          groupCount:list.taskList.length,
          taskList:list.taskList
        })
      })

      return jsonData
    },

    _sortTaskListByKey:function(taskList,key,desc) {
      var flag = 1;
      if(desc===true) flag = -1;
      return taskList.sort(function(a,b){ return flag*(a[key] - b[key]) })
    },

    _dateFormater:function(time) {
      var d = new Date(time)
      return $D(d).format('%Y-%m-%d %H:%M')
      // return (d.getYear()+1900)+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':'+d.getMinutes()
    },
    teardown:function() {
      this._getContainer().empty()
    }


  },[TemplateExtension]);

  return TaskGroupList;

})

