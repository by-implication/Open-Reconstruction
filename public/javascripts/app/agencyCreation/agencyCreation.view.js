agencyCreation.view = function(ctrl){
  return app.template(ctrl.app, [
    common.banner("New Agency"),
    m("form", {onsubmit: ctrl.submit}, [
      common.formSection(
        "fa-star",
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
            m("select", ctrl.roles.map(function(role){
              return m("option", {value: role.id}, role.name)
            }), {onchange: m.withAttr("value", ctrl.input.roleId)})
          )
        ]
      ),
      common.formSection(
        null,
        [
          m("button", "Submit")
        ]
      )
    ]),
  ])
}