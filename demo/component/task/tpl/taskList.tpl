<dl class="tasklist-area ">
  <dt class="tasklist-title {{taskListClass}} ">
      {{#ifTodoList}}
      <span class="title">待接收任务</span>
      {{/ifTodoList}}
      {{^ifTodoList}}
      <span class="title">被拒绝任务</span>
      {{/ifTodoList}}
      <span class="num">{{taskCount}}</span>
  </dt>
  <ul class="tasklist-content">
    {{#taskList}}
    <li class="task-item" data-taskid="{{taskId}}"><a href="javascript:;">
      <span class="task-name">{{taskName}}</span>
      <span class="task-time">{{taskPlanFinishTime}}</span>
      {{#ifShowName}}
      <span class="task-principal">{{principalName}}</span>
      {{/ifShowName}}
      {{#ifShowComment}}
      <span class="task-comment-num"> <i class="fa fa-comments"></i>0</span>
      {{/ifShowComment}}
      {{#ifShowDelete}}
      <span class="task-delete" data-taskid="{{taskId}}" title="删除任务">
        <i class="fa fa-trash-o"></i>
      </span>
      {{/ifShowDelete}}
    </a><span class="arrow"></span></li>
    {{/taskList}}
  </ul>
</dl>