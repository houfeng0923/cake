<div class="wizzard step1">
  <form class="task-dialog-form form-horizontal form-step1" method="post"   >
    <div class="form-group">
      <label for="principalId" class="control-label">
        请选择该任务的负责人
        <span class="required">*</span>
      </label>
      <input type="text"  autofocus="autofocus" class="form-control input-sm" id="principalId"  name="principalId" placeholder="" required></div>
    <div class="form-group">
      <label for="participantIdList" class="control-label">请选择参与此任务的人</label>
      <input type="text" class="form-control input-sm" id="participantIdList"  name="participantIdList" placeholder="">
      <span class="help-block">这些人将会收到与此任务相关的通知</span>
    </div>
    <div>
      <button  id="btn-step-to2" class="btn btn-success pull-right">下一步</button>
      <button   class="btn btn-reset  " style="display:none">reset</button>
    </div>
  </form>
</div>
<div class="wizzard step2 hide">
  <form class="task-dialog-form form-horizontal form-step2" method="post" action="{{newTaskUrl}}" >
    <input type="hidden" name="principalId" id="principalId">
    <input type="hidden" name="participantIdList" id="participantIdList">
    <div class="form-group">
      <label for="taskName" class="col-sm-3 control-label">
        任务名称
        <span class="required">*</span>
      </label>
      <div class="col-sm-9">
        <input type="text"  autofocus="autofocus" class="form-control input-sm" id="taskName"  name="taskName" placeholder="简单描述任务内容(10字以内)" required  maxlength="10"></div>
    </div>
    <div class="form-group">
      <label for="planFinishTime" class="col-sm-3 control-label">
        截止时间
        <span class="required">*</span>
      </label>
      <div class="col-sm-9">
        <div class="input-group">
          <input type="text" class="form-control input-sm" id="planFinishTime" name="planFinishTime" data-date-format="yyyy/mm/dd hh:ii" readonly required >
          <a href="javascript:;" class="input-group-addon"> <i class="fa fa-calendar"></i>
          </a>
        </div>
      </div>
    </div>
    <div class="form-group">
      <label for="creatorRemindPoint" class="col-sm-3 control-label">提醒<span class="required">*</span></label>
      <div class="col-sm-9">
        <select id="creatorRemindPoint" name="creatorRemindPoint" class="form-control input-sm" style="width:100%">
          <option value="01">不提醒</option>
          <option value="02">准时</option>
          <option value="03">提前5分钟</option>
          <option value="04">提前10分钟</option>
          <option value="05">提前30分钟</option>
          <option value="06">提前1小时</option>
          <option value="07">提前2小时</option>
          <option value="08">提前6小时</option>
          <option value="09">提前1天</option>
          <option value="10">提前2天</option>
        </select>
      </div>
    </div> 
    <div class="form-group">
      <label for="relationToType" class="col-sm-3 control-label">业务</label>
      <div class="col-sm-9">
        <select id="relationToType" name="relationToType" class="form-control input-sm"  style="width:40%;float:left;" >
          <option value="1">客户</option>
          <option value="2">销售机会</option>
          <option value="3">联系人</option>
          <option value="4">销售线索</option>
        </select>
        <input type="text" class="form-control input-sm" id="relationToId" name="relationToId" placeholder="" style="width:55%;float:right;" ></div>
    </div>
    <div class="form-group">
      <label for="description" class="col-sm-3 control-label">详细描述</label>
      <div class="col-sm-9">
        <textarea id="description" name="description" class="form-control input-sm" ></textarea>
      </div>
    </div>
    <div class="form-group">
      <label for="attachmentId" class="col-sm-3 control-label">附件</label>
      <div class="col-sm-9">
        <input type="hidden" id="attachmentId" name="attachmentId" class="form-control input-sm"></div>
    </div> 
    <div>
      <button id="btn-step-end" class="btn btn-success pull-right" type="submit">确定</button>
      <button id="btn-step-to1" class="btn btn-link pull-left">&lt;上一步</button>
    </div>
  </form>
</div>