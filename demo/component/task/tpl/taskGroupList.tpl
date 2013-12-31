<div class="tasklist-header clearfix js-taskgrouplist-header">
  <ul class="tasklist-filter">
    <li class="active">
      <a class="task-status processing-tasks" data-task-status="processing" data-toggle="tab"  href="javascript:;">进行中</a>
    </li>
    <li>
      <a class="task-status finished-tasks" data-task-status="finished" data-toggle="tab" href="javascript:;">已完成</a>
    </li>
  </ul>
  <div class="list-filter active-underline ">
    <a href="javascript:;" class="{{active}}">
      <span>按时间</span>
    </a>
  </div>
</div>
<div class="tasklist-body js-taskgrouplist-body" id="tasklist-collapse">
  {{#taskGroup}}
  <dl class="tasklist-area">
    <dt class="tasklist-title {{groupStyleclass}}">
      <a href="#group_{{groupId}}" title="" data-toggle="collapse" class="" >
        <span class="title">{{groupName}}</span>
        <span class="num">{{groupCount}}</span>
        <span class="fa fa-angle-up up"></span>
        <span class="fa fa-angle-down down"></span>
      </a>
    </dt>
    <ul id="group_{{groupId}}" class="tasklist-content in">
      {{#taskList}}
      <li class="task-item {{taskStatusClass}}" data-taskid="{{taskId}}"><a href="javascript:;">
          <label class="task-checkbox">
            <input type="checkbox"  data-taskid="{{taskId}}" class="toggle {{taskDisabled}}" {{taskDisabled}} {{taskChecked}} ></label>
          <span class="task-name">{{taskName}}</span>
          <span class="task-time">{{taskPlanFinishTime}}</span>
          {{#ifShowName}}
          <span class="task-principal">{{principalName}}</span>
          {{/ifShowName}}
          {{#ifShowComment}}
          <span class="task-comment-num"> <i class="fa fa-comments"></i>0</span>
          {{/ifShowComment}}

          {{#ifShowDelete}}
          <span class="task-delete" data-taskid="{{taskId}}" title="删除任务"> <i class="fa fa-trash-o"></i></span>
          {{/ifShowDelete}}
      </a><span class="arrow"></span></li>
      {{/taskList}}
    </ul>
  </dl>
  {{/taskGroup}}
</div> 