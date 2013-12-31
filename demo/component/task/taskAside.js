// 首页 右边栏 task 


define(['cake','with/TemplateExtension'],function(Cake,TemplateExtension){
  // 有状态组件
  // this.taskType = responsibleTask//assignedTask//participantTask
  var TaskAside = Cake.define({
    name:'TaskAside', 
    attrs:{
      containerSelector:'.main-right .task-aside',  
      btnCreateTaskSelector: '.btn-create-task',
      btnAssignTaskSelector: '.btn-assign-task',
      dropdownItemSelector:'.dropdown-menu .item-link',
      dropdownCaptionSelector: '.dropdown-toggle .text',
      btnSeeMoreSelector:'.see-more',
      taskListSelector:'.tasklist-content',
      // 我负责的任务
      responsibleTaskUrl:window.PATH_CONTEXT + '/task/my/open.ajax',
      // 我分配的任务
      assignedTaskUrl:window.PATH_CONTEXT + '/task/other/open.ajax',
      // 我参与的任务
      participantTaskUrl:window.PATH_CONTEXT + '/task/participant/open.ajax'
    },
    model:{
      data:null //{state,taskList,userId}
    },

    events:{
      'click@{{btnCreateTaskSelector}}': '_openNewTaskForSelfDialog',
      'click@{{btnAssignTaskSelector}}': '_openNewTaskForOthersDialog',
      'click@{{containerSelector}} {{btnSeeMoreSelector}}':'_seeMoreClickHandler',

      'click@{{dropdownItemSelector}}' : '_dropdownItemClickHandler'
    },
    
    templates:{
      'content':'text!component/task/tpl/taskAside.tpl'
    },

    initialize:function() {
      this.taskType = 'responsibleTask';

      this.$container = this.$element.find(this.attrs.containerSelector)
      this.render();


      require(['component/task/taskAssignForSelfDialog'], function(TaskAssignForSelfDialog) {
        TaskAssignForSelfDialog.attachTo(document.body)
      });
      require(['component/task/taskAssignForOthersDialog'], function(TaskAssignForOthersDialog) {
        TaskAssignForOthersDialog.attachTo(document.body)
      });

      require(['component/task/taskStateToggle'], function(TaskStateToggle) {
        TaskStateToggle.attachTo(document.body)
      });
    },

    render:function() {
      this.fetchTaskList().then($.proxy(function() {
        var context = this._assembleTaskList()
        this.$container.html(this.renderTemplate('content',context))
      },this))
    },

    updateBodyView:function() {
      this.fetchTaskList().then($.proxy(function() {
        var listSelector = this.attrs.taskListSelector,
            $html,
            context = this._assembleTaskList();

        $html = $(this.renderTemplate('content',context)).find(listSelector)
        this.$container.find(listSelector).html($html)

      },this))
    },

    fetchTaskList:function() {  
      var self = this,
          url = this.attrs[this.taskType+'Url'];

      return $.ajax(url,{
        type:'get',dataType:'json'
      }).then(function(resp) {
        if(resp.code==0){
          self.model.data = resp.data
        }
      })
    },

    _assembleTaskList:function() {
      var data = $.extend(true,{},this.model.data),
          state = data.state,
          userId = data.userId;

      data.taskList = data.taskList.slice(0,5); // 取前5个
      $.each(data.taskList,function(_,item) {
        var ifParticipantRole = item.creatorId!=userId && item.principalId!=userId
        item.taskChecked = state==3?'checked':''
        item.taskDisabled = (state==0 || state==1 || ifParticipantRole) ? 'disabled':''
      })
      return data;
    },


    _openNewTaskForSelfDialog: function(e) {
      this.publish('uiOpenTaskAssignForSelfDialog')
    },

    _openNewTaskForOthersDialog: function(e) {
      this.publish('uiOpenTaskAssignForOthersDialog')
    },

    _seeMoreClickHandler:function(e) {
      e.preventDefault();
      //todo
      location.href = window.PATH_CONTEXT + '/task?type=' + this.taskType
    },

    _dropdownItemClickHandler:function(e) {
      e.preventDefault();
      var $menu = $(e.target).closest('.dropdown-menu'),
          $li = $(e.target).closest('li'),
          $text = this.$container.find(this.attrs.dropdownCaptionSelector),
          type = $(e.target).attr('href').substr(1),
          text = $(e.target).text();
      $menu.find('>li').removeClass('active')
      $li.addClass('active')
      $text.text(text)
      this.taskType = type
      
      this.updateBodyView()
    }

  },TemplateExtension)

  return TaskAside;

});