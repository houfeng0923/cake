<dl class="href-text-list">
  <dt class="cursor dropdown">
    <a href="#" class="see-more pull-right">全部</a>
    <span class="dropdown-toggle" data-toggle="dropdown">
      <span class="text">我负责的任务</span> <i class="fa fa-caret-down"></i>
    </span>
    <ul class="dropdown-menu">
      <li class="active" >
        <a href="#responsibleTask" class="item-link">我负责的任务</a>
      </li>
      <li>
        <a href="#assignedTask" class="item-link">我分配的任务</a>
      </li>
      <li>
        <a href="#participantTask" class="item-link">我参与的任务</a>
      </li>
    </ul>
  </dt>
  <ul class="tasklist-content">
    {{#taskList}}
    <li class="task-item" data-taskid="{{id}}" style="position:relative;">
      <label class="task-checkbox">
      <input type="checkbox"  data-taskid="{{id}}" class="toggle {{taskDisabled}}" {{taskDisabled}} {{taskChecked}} ></label>
      <a href="javascript:;" style="margin-left:20px;" >
        <span class="task-name">{{name}}</span>
      </a>
    </li>
    {{/taskList}}
  </ul>
  <!-- <dd class="strike">
  <i class="fa fa-check-square-o" title="点击完成"></i>
  <a href="#">打电话给客户</a>
</dd>
-->
<dd class="button">
  <button class="btn btn-sm btn-create-task">
    <i class="fa fa-reply small"></i>
    <span>给自己安排任务</span>
  </button>
  <button class="btn btn-sm btn-assign-task">
    <i class="fa fa-reply-all small"></i>
    <span>给他人安排任务</span>
  </button>
</dd>
</dl>