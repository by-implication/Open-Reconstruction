govUnitEdit.view = function(ctrl){

  return app.template(ctrl.app, "Edit Agency", [
    common.banner("Edit " + ctrl.govUnitType()),
    m("form", {onsubmit: ctrl.submit}, [
      common.formSection(
        "fa-group",
        [
          common.field(
            "Agency Name",
            m("input[type='text']", {value: ctrl.input.name(), onchange: m.withAttr("value", ctrl.input.name)})
          ),
          common.field(
            "Agency Acronym (optional)",
            m("input[type='text']", {value: ctrl.input.acronym(), onchange: m.withAttr("value", ctrl.input.acronym)})
          ),
          common.field(
            "Agency Role",
            ctrl.govUnitType() == "LGU" ?
              ctrl.role() :
              m("select", {onchange: m.withAttr("value", ctrl.input.roleId)},
                ctrl.roles().map(function (role){
                  return m("option", {selected: role.id == ctrl.input.roleId(), value: role.id}, role.name)
                }
              ))
          )
        ]
      ),
      common.formSection(
        "", [
          m("button", "Save"),
          m("button.alert", {type: "button", onclick: ctrl.cancel}, "Cancel")
        ]
      )
    ]),
  ])

}
