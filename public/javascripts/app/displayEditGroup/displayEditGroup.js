var displayEditGroup = {
  controller: function(req, field){
    this.isEditMode = m.prop(false);
    this.input = m.prop("");
    this.req = req;
    this.field = field;
  },
  view: function(currentUserCanEdit, ctrl, viewView, editView){
    return m(".display-edit-group",{className: (ctrl.isEditMode() ? "edit-mode" : "") + " " + (currentUserCanEdit ? "can-edit": "")}, [
      currentUserCanEdit ?
        !ctrl.isEditMode() ? 
          m("button.micro.edit-button", 
            {type: "button", onclick: function(){ ctrl.isEditMode(true); }}, 
            [ m("i.fa.fa-edit.fa-lg") ]
          )
        : m(".save-cancel-group", [
            m("button.micro.save-button", 
              {type: "button", onclick: function(){
                m.request({
                  method: "POST", url: "/requests/" + ctrl.req().id + "/edit/" + ctrl.field,
                  data: {input: ctrl.input},
                  config: app.xhrConfig
                }).then(function (r){
                  if(r.success){
                    ctrl.req()[ctrl.field] = ctrl.input();
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
      
      ctrl.isEditMode() && currentUserCanEdit ?
        editView()
      : viewView()
    ])
  }
}