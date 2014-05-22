var displayEditGroup = function(editable, edit, save, cancel, params){

  _.extend(this, params);
  var ctrl = this;

  // edit, save, and cancel must be of the form f(callback){ ... callback() }
  edit = edit || function (c){ c(); }
  save = save || function (c){ c(); }
  cancel = cancel || function (c){ c(); }

  var editMode = false;
  var editModeSetter = function(v){ return function(){ editMode = v; } }

  this.input = m.prop();
  this.view = function(displayView, editView){

    return m(".display-edit-group",{className: (editMode ? "edit-mode" : "") + " " + (editable() ? "can-edit": "")}, [
      editable() ?
        editMode ?
          m(".save-cancel-group", [
            m("button.micro.save-button",
              {type: "button", onclick: function(){
                save.bind(ctrl)(editModeSetter(false));
              }},
              [ "Save Changes", m("i.fa.fa-check.fa-lg") ]
            ),
            m("button.micro.cancel-button.alert",
              {type: "button", onclick: function(){
                cancel.bind(ctrl)(editModeSetter(false));
              } },
              [ m("i.fa.fa-times.fa-lg") ]
            ),
          ])
        : m("button.micro.edit-button",
            {type: "button", onclick: function(){
              edit.bind(ctrl)(editModeSetter(true));
            }},
            [ m("i.fa.fa-edit.fa-lg") ]
          )
      : "",
      editable() && editMode ?
        editView.bind(ctrl)()
      : displayView.bind(ctrl)()
    ])
  }

}
