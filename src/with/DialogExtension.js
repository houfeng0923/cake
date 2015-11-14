
/**
 * [扩展类] 为组件提供对话框功能支持；组件可以在对话框内显示 
 */
define(['cake/utils','dialog'], function(utils,dialog) {

  "use strict";
  
  function DialogExtension() {
    // this.before('initialize', function(cfg) {  })
    this.after('destroy',function() {
      this.closeDialog();
    });
  }
  DialogExtension.prototype = {

    //dialog.title()
    //dialog.reset() 
    resetDialog:function() {
      this._dialog && this._dialog.reset();
    },

    setDialogTitle:function(title) {
      this._dialog && this._dialog.title(title) ;
    },
    //tips(content,[time],[callback])
    tips:function(content,time,callback) { 
      // dialog.tips(content,lock,time)
      var args = arguments,noop = function() {};
      if(args.length==2){
        callback = typeof args[1] == 'function'? args[1]:noop;
        time = typeof args[1] == 'number'? time : 1000;
      }else if(args.length==1){
        callback = noop;
        time = 1000;
      }
      var d = dialog({
          content: content||'空' ,
          onclose:callback
      }).show();
      setTimeout(function () {
          d.close().remove();
      }, time);
    },

    alert:function(content,callback) {
      // dialog.alert(content,callback);
       
      dialog({
        id: 'Alert',
        fixed: true,
        // quickClose: true,
        title:'提示', 
        content: content,
        width:'150px',
        ok: false,
        onclose: callback
      }).showModal();
    },

    //confirm(content,[ok],[cancel])
    confirm:function(content, ok, cancel) {
      // dialog.confirm(content, ok, cancel)
      var _dialog, okFn, cfg , noop = function() {};

      okFn = ok ? function() {ok.call(_dialog,_dialog);}:noop;

      if(typeof arguments[0]=='object'){
        cfg = arguments[0];
      }else{
        cfg = {
          id:'Confirm',
          fixed:true,
          title:'确认',
          content:content,
          width:'300px',
          okValue:'确认',
          cancelValue:'取消',
          ok:okFn, 
          cancel:cancel||noop
        };
      }
      _dialog = dialog(cfg);
      _dialog.showModal();
    },

    // prompt:function(content, ok, defaultValue) {
    //   dialog.prompt(content, ok, defaultValue);
    // },

    _openDialog:function(cfg) { 
      this._dialog = dialog(cfg);
      this.$dialog = $(this._dialog.node) ;
      this._registeCloseHandler(this._dialog);
    },

    openDialog:function(cfg) {
      this._openDialog(cfg);
      
      this._dialog.show();

      return this._dialog;
    },

    openModalDialog:function(cfg) {
      this._openDialog(cfg);

      this._dialog.showModal();

      return this._dialog;
    },

    closeDialog:function() {
      if(this._dialog){
        try{
          this._dialog.close().remove();
        }catch(e){
          console.log(e);
        }
        this._dialog = null;
        this.$dialog = null;
      }
    },

    _registeCloseHandler:function(dialog) {
      var self = this;
      // var oldClose =  dialog.close;
      // dialog.close = function() {
      //   oldClose.apply(this)
      //   self.publish('dialogClosed')
      // }
      dialog.addEventListener('close',function() {
        self.publish('dialogClosed');
        dialog.removeEventListener('close');
      });
    }
    
  };
 
  return DialogExtension;
});