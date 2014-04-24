lguCreation.view = function(ctrl){
  return app.template(ctrl.app, [
    common.banner("New LGU under " + ctrl.parentName()),
    ctrl.app.isSuperAdmin() ? m("form", {onsubmit: ctrl.submit}, [
      common.formSection(
        "fa-star",
        [
          common.field(
            "LGU Name",
            m("input[type='text']", {onchange: m.withAttr("value", ctrl.input.name)})
          ),
          common.field(
            "LGU Acronym (optional)",
            m("input[type='text']", {onchange: m.withAttr("value", ctrl.input.acronym)})
          )
        ]
      ),
      common.formSection("", [m("button", "Submit")])
    ]) : ""
  ])
}