lguCreation.view = function(ctrl){
  return app.template(ctrl.app, "New LGU", [
    common.banner("New " + ctrl.lguType() + " under " + ctrl.parentName()),
    ctrl.app.isSuperAdmin() ? m("form", {onsubmit: ctrl.submit}, [
      common.formSection(
        "fa-group",
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