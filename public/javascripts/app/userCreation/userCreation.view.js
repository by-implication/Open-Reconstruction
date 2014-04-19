userCreation.view = function(ctrl){
  return app.template(ctrl.app, [
    common.banner("User Creation"),
    m("form", {onsubmit: ctrl.submit}, [
      common.formSection(
        "fa-star",
        [
          m("div", "for " + ctrl.agency().name),
          common.field(
            "Username",
            m("input[type='text']", {onchange: m.withAttr("value", ctrl.input.handle)})
          ),
          common.field(
            "Password",
            m("input[type='password']", {onchange: m.withAttr("value", ctrl.input.password)})
          ),
          common.field(
            "Admin",
            m("input[type='checkbox']", {onchange: m.withAttr("value", ctrl.input.isAdmin)},"")
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