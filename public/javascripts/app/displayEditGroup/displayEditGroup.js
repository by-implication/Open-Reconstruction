var displayEditGroup = {
  controller: function(){
    this.isEditMode = m.prop(false);
  },
  view: function(ctrl, viewView, editView){
    return m(".display-edit-group", [
      m("button.micro.edit-button", 
        {type: "button", onclick: function(){ ctrl.isEditMode(true); }}, 
        [ m("i.fa.fa-edit.fa-lg") ]
      ),
      !ctrl.isEditMode() ?
        viewView()
      : editView()
    ])
  }
}