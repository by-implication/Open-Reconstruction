var displayEditGroup = {
  controller: function(srcObject, srcName){
    this.isEditMode = m.prop(false);
    this.input = m.prop("");
    this.srcObject = srcObject;
    this.srcName = srcName;
  },
  view: function(ctrl, viewView, editView){
    return m(".display-edit-group",{className: ctrl.isEditMode() ? "edit-mode" : ""}, [
      !ctrl.isEditMode() ? 
        m("button.micro.edit-button", 
          {type: "button", onclick: function(){ ctrl.isEditMode(true); }}, 
          [ m("i.fa.fa-edit.fa-lg") ]
        )
      : m(".save-cancel-group", [
          m("button.micro.save-button", 
            {type: "button", onclick: function(){
              // make a request and callback
              ctrl.srcObject()[ctrl.srcName] = ctrl.input();
              ctrl.isEditMode(false);
            } }, 
            [ "Save Changes", m("i.fa.fa-check.fa-lg") ]
          ),
          m("button.micro.cancel-button.alert", 
            {type: "button", onclick: function(){ ctrl.isEditMode(false); } }, 
            [ m("i.fa.fa-times.fa-lg") ]
          ),
        ]),
      
      !ctrl.isEditMode() ?
        viewView()
      : editView()
    ])
  }
}