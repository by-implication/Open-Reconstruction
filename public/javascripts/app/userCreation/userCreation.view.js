userCreation.view = function(ctrl){
  return app.template(ctrl.app, [
    common.banner("User Creation"),
    m("form", {onsubmit: ctrl.submit}, [
      common.formSection(
        "fa-star",
        [
          m("div", "for " + ctrl.agency().name)
          // common.field(
          //   "Agency Name",
          //   m("input[type='text']", {onchange: m.withAttr("value", ctrl.input.name)})
          // ),
          // common.field(
          //   "Agency Acronym (optional)",
          //   m("input[type='text']", {onchange: m.withAttr("value", ctrl.input.acronym)})
          // ),
          // common.field(
          //   "Agency Role",
          //   m("select", {onchange: m.withAttr("value", ctrl.input.roleId)}, 
          //     ctrl.roles().map(function(role){
          //       return m("option", {value: role.id}, role.name)
          //     }
          //   ))
          // )
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