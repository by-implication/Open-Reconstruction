agencyCreation.view = function(ctrl){
  return app.template(ctrl.app, [
    common.banner("New Agency"),
    m("form", {onsubmit: ctrl.submit}, [
      common.formSection(
        "fa-group",
        [
          common.field(
            "Agency Name",
            m("input[type='text']", {onchange: m.withAttr("value", ctrl.input.name)})
          ),
          common.field(
            "Agency Acronym (optional)",
            m("input[type='text']", {onchange: m.withAttr("value", ctrl.input.acronym)})
          ),
          common.field(
            "Agency Role",
            m("select", {onchange: m.withAttr("value", ctrl.input.roleId)}, 
              ctrl.roles().map(function(role){
                return m("option", {value: role.id}, role.name)
              }
            ))
          )
        ]
      ),
      common.formSection(
        "",
        [
          m("button", "Submit")
        ]
      )
    ]),
  ])
}