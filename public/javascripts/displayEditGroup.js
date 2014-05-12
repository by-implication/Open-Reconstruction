var displayEditGroup = {
  controller: function(req, field){
    this.isEditMode = m.prop(false);
    this.input = m.prop("");
    this.req = req;
    this.field = field;
  },
  view: function(reqCtrl, ctrl, viewView, editView){
    return m(".display-edit-group",{className: (ctrl.isEditMode() ? "edit-mode" : "") + " " + (reqCtrl.canEdit() ? "can-edit": "")}, [
      reqCtrl.canEdit() ?
        !ctrl.isEditMode() ? 
          m("button.micro.edit-button", 
            {type: "button", onclick: function(){ ctrl.isEditMode(true); }}, 
            [ m("i.fa.fa-edit.fa-lg") ]
          )
        : m(".save-cancel-group", [
            m("button.micro.save-button", 
              {type: "button", onclick: function(){
                bi.ajax(routes.controllers.Requests.editField(ctrl.req().id, ctrl.field), {
                  data: {input: ctrl.input}
                }).then(function (r){
                  if(r.success){
                    ctrl.req()[ctrl.field] = ctrl.input();
                    reqCtrl.history().unshift(r.event);
                  } else {
                    alert("Your input was invalid.");
                  }
                  ctrl.isEditMode(false);
                });
              } }, 
              [ "Save Changes", m("i.fa.fa-check.fa-lg") ]
            ),
            m("button.micro.cancel-button.alert", 
              {type: "button", onclick: function(){ ctrl.isEditMode(false); } }, 
              [ m("i.fa.fa-times.fa-lg") ]
            ),
          ])
      : "",
      
      ctrl.isEditMode() && reqCtrl.canEdit() ?
        editView()
      : viewView()
    ])
  }
}