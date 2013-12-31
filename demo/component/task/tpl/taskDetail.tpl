<div class="task-detail">
  <!-- .tasklist-detail -->
  {{#ifShowReceivableOperationPanel}}
  <div class="alert alert-success task-alert">
    <div class=" clearfix">
    <span style="line-height:22px;">【{{creatorName}}】给我分配了此任务</span>
    <span class="pull-right">
    <a class="btn btn-success btn-xs btn-accept">接受</a>
    <a class="btn btn-default btn-xs btn-reject">拒绝</a>
    </span>
    </div>
    <div class="js-reject-form hide"  style="position:relative;margin-top:5px;width:100%;">
      <div style="margin-right:40px">
      <input type="text" name="rejectionReasion" style="width:100%" placeholder="拒绝理由">
      </div>
      <a class="btn btn-default btn-xs btn-reject-submit" style="position:absolute;right:0;top:0">提交</a>
    </div>
  </div>
  {{/ifShowReceivableOperationPanel}}
  {{#ifShowRejectedOperationPanel}}
  <div class="alert alert-danger task-alert">
    <div>【{{principalName}}】拒绝了该任务。理由是：“{{rejectionReasion}}”</div>
    <div class="base-color"><span>&nbsp;您可以修改之后重新分配</span> 或 <span><a href="#" class="task-delete">删除此任务</a></span></div> 
  </div>
  {{/ifShowRejectedOperationPanel}}
  <div class="task-title">
    <h3>{{name}}</h3>
    <div class="task-desc gray">{{description}}</div>
    <div class="task-status {{stateCls}}">
      <span class="title">
      <i class="fa fa-clock-o fa-fw"></i>
        {{stateStr}} 
      </span>
    </div>
    {{#ifShowDelete}}
    <a href="javascript:;" class="task-delete" >
      <span title="删除"> <i class="fa fa-trash-o"></i></span>
    </a>
    {{/ifShowDelete}}
    <a href="#">
    <label class="task-checkbox">
      <input type="checkbox"  data-taskid="{{taskId}}" class="toggle {{taskDisabled}}" {{taskDisabled}} {{taskChecked}} ></label>
    </a>
  </div>
  <div class="task-body">
    <dl class="href-text-list">
      <dd>
        该任务于
        <span>{{createTimeStr}}</span>
        由
        <a href="#">{{creatorName}}</a>
        创建
      </dd>
      <dd class="img-list no-padding">
        <label>负责人：</label>
        <a href="#"  data-userid="{{principalId}}">
        <img src="{{principalAvatar}}" alt="{{principalName}}" title="{{principalName}}"/>
        </a>
      </dd>
      <dd>
        <label>截止：</label>
        <span>{{planFinishTimeStr}}</span>
      </dd>
      <dd>
        <label>提醒：</label>
        <span >{{remindPointStr}}</span>
      </dd>
      <dd class="img-list no-padding">
        <label>参与人：</label>
        {{#taskParticipantList}}
          <a href="#" data-userid="{{participantId}}">
          <img src="{{participantAvatar}}" alt="{{participantName}}"  title="{{participantName}}"  />
          </a>
        {{/taskParticipantList}}
      </dd>
      <dd>
        <label>业务：</label>
        <i class="fa fa-cny margin" title="这是一个客户"></i>
        <a href="#">TODO</a>
      </dd>
    </dl>
   {{#ifShowRejectedOperationPanel}}
    <div> 
      <button class="btn btn-reallocate-task">重新分配</button>
    </div>
   {{/ifShowRejectedOperationPanel}}
  </div> 
  
  <div class="list-filter narrow active-arrow">
    <ul class="tab">
      <li class="active">
        <a href="#task-detail-discuss" data-toggle="tab">
          <span>讨论</span>
        </a>
      </li>
      <li>
        <a href="#task-detail-attachment" data-toggle="tab">
          <span>附件(2)</span>
        </a>
      </li>
      <li>
        <a href="#task-detail-history" data-toggle="tab">
          <span>任务历史</span>
        </a>
      </li>
    </ul>
  </div>
  <div class="tab-content">
    <div id="task-detail-discuss" class="tab-pane active">1</div>
    <div id="task-detail-attachment" class="tab-pane">2</div>
    <div id="task-detail-history" class="tab-pane">
      <div class="task-history-list">
      {{#taskHistoryList}}
        <dl class="img-text-list no-border" >
          <dd class="left">
            <a href="#"  data-userid="{{operatorId}}">
              <img src="{{operatorAvatar}}" title="{{operatorName}}"></a>
          </dd>
          <dd class="right">
            {{&message}}
            <span class="br gray-light">{{operationTimeStr}}</span>
          </dd>
        </dl>
      {{/taskHistoryList}}
      </div>
    </div>
  </div>
  <!-- .tasklist-detail -->
</div>