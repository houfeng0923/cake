// 任务主页面

define(['cake','ks/ajax-extends'], function(Cake) {

  var CONTEXT = window.PATH_CONTEXT;

  var TaskMainPage = Cake.define({
    name: 'TaskMainPage',
    attrs: {
      btnCreateTaskSelector: '.task-action .btn-create-task',
      btnAssignTaskSelector: '.task-action .btn-assign-task',
      tabChangeSelector : '.tasklist-container .list-filter .nav-pills li',
      taskContainerSelector : '.tasklist-container',
      taskLeftSelector : '.tasklist-container .task-left',
      taskRightSelector : '.tasklist-container .task-right',
      tasklistReceivableJsSelector : '.js-tasklist-receivable',
      tasklistRejectedJsSelector : '.js-tasklist-rejected',
      taskGrouplistJsSelector : '.js-taskgrouplist'
    },
    events: {
      'click@{{btnCreateTaskSelector}}': '_openNewTaskForSelfDialog',
      'click@{{btnAssignTaskSelector}}': '_openNewTaskForOthersDialog',
      //tab change
      'click@{{tabChangeSelector}}':'_tabChangeHandler'

    },
    initialize: function() {
      this.$taskLeft = this.$element.find(this.attrs.taskLeftSelector);
      this.$taskRight = this.$element.find(this.attrs.taskRightSelector);
      this.$taskContainer = this.$element.find(this.attrs.taskContainerSelector);


      require(['component/task/taskAssignForSelfDialog'], function(TaskAssignForSelfDialog) {
        TaskAssignForSelfDialog.attachTo(document.body)
      });
      require(['component/task/taskAssignForOthersDialog'], function(TaskAssignForOthersDialog) {
        TaskAssignForOthersDialog.attachTo(document.body)
      });
      require(['component/task/taskDeleteDialog'], function(TaskDeleteDialog) {
        TaskDeleteDialog.attachTo(document.body)
      });
      require(['component/task/taskStateToggle'], function(TaskStateToggle) {
        TaskStateToggle.attachTo(document.body)
      });

      
      //todo cookie detection
      var $activeItem = this.$element.find(this.attrs.tabChangeSelector).filter('.active');
      
      $activeItem.click()
      // this.initResponsibleTaskView();
    },

    _openNewTaskForSelfDialog: function(e) {
      this.publish('uiOpenTaskAssignForSelfDialog')
    },

    _openNewTaskForOthersDialog: function(e) {
      this.publish('uiOpenTaskAssignForOthersDialog')
    },

    _tabChangeHandler:function(e) { 
      this.destroyComponent()        

      var type = $(e.currentTarget).find('>a').attr('href').substr(1)
      switch(type){
        case 'responsibleTask' : this.initResponsibleTaskView();break;
        case 'assignedTask' : this.initAssignedTaskView();break;
        case 'participantTask' : this.initParticipantTaskView();break;
      }
    },

     // 我负责的任务
    initResponsibleTaskView:function() {
      var $taskLeft = this.$taskLeft,
          $taskReceivableContainer = $taskLeft.find('>'+this.attrs.tasklistReceivableJsSelector),
          $taskGroupListContainer = $taskLeft.find('>'+this.attrs.taskGrouplistJsSelector),
          $taskContainer = this.$taskContainer

      require([
        'component/task/taskList',
        'component/task/taskGroupList',
        'component/task/taskDetailPanel'
        ],function(TaskList,TaskGroupList,TaskDetailPanel) {

        TaskDetailPanel.attachTo($taskContainer)

        TaskList.attachTo($taskReceivableContainer,{
          attrs:{
            taskType:'responsibleTask',
            listType:'receivable',
            listUrl:CONTEXT + '/task/my/receivable.ajax'
          }
        });

        TaskGroupList.attachTo($taskGroupListContainer,{
          attrs:{
            taskType:'responsibleTask',
            openListUrl:CONTEXT+ '/task/my/open.ajax',
            completedListUrl:CONTEXT+ '/task/my/completed.ajax'
          }
        });
      })
 
    },
    // 我分配的任务
    initAssignedTaskView:function() {
      var $taskLeft = this.$taskLeft,
          $taskContainer = this.$taskContainer,
          $taskReceivableContainer = $taskLeft.find('>'+this.attrs.tasklistReceivableJsSelector),
          $taskRejectedContainer = $taskLeft.find('>'+this.attrs.tasklistRejectedJsSelector),
          $taskGroupListContainer = $taskLeft.find('>'+this.attrs.taskGrouplistJsSelector);


      require([
        'component/task/taskList',
        'component/task/taskGroupList',
        'component/task/taskDetailPanel'
        ],function(TaskList,TaskGroupList,TaskDetailPanel) {

        TaskDetailPanel.attachTo($taskContainer);

        TaskList.attachTo($taskReceivableContainer,{
          attrs:{
            taskType:'assignedTask',
            listType:'receivable', 
            listUrl:CONTEXT + '/task/other/receivable.ajax'
          }
        })
        // 被拒绝的任务
        TaskList.attachTo($taskRejectedContainer,{
          attrs:{
            taskType:'assignedTask',
            listType:'rejected', 
            listUrl:CONTEXT + '/task/rejected.ajax'
          }
        })
        // 
        TaskGroupList.attachTo($taskGroupListContainer,{
          attrs:{
            taskType:'assignedTask',
            openListUrl:CONTEXT+ '/task/other/open.ajax',
            completedListUrl:CONTEXT+ '/task/other/completed.ajax'
          }
        })

      }) 

    },
    // 我参与的任务
    initParticipantTaskView:function() {
      var $taskLeft = this.$taskLeft ,
          $taskContainer = this.$taskContainer,
          $taskGroupListContainer = $taskLeft.find('>'+this.attrs.taskGrouplistJsSelector)

      require([
        'component/task/taskGroupList',
        'component/task/taskDetailPanel'
        ],function(TaskGroupList,TaskDetailPanel) {

        TaskDetailPanel.attachTo($taskContainer)

        TaskGroupList.attachTo($taskGroupListContainer,{
          attrs:{
            taskType:'participantTask',
            openListUrl:CONTEXT+ '/task/participant/open.ajax',
            completedListUrl:CONTEXT+ '/task/participant/completed.ajax'
          }
        })

      })
      
    },

    destroyComponent:function() {
      var $taskContainer = this.$taskContainer
      Cake.removeInstancesByNode($taskContainer[0],true)
    }
 
  });

  return TaskMainPage;
});