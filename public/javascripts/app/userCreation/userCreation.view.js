userCreation.view = function(ctrl){
  return app.template(ctrl.app, [
    common.banner("Adding a user for " + ctrl.agency().name),
    m("form", {onsubmit: ctrl.submit}, [
      common.formSection(
        "fa-user",
        [
          common.field(
            "Full Name",
            m("input[type='text']", {onchange: m.withAttr("value", ctrl.input.name), placeholder: "e.g., Juan Carlos Dizon de Guzman"})
          ),
          common.field(
            "Username",
            m("input[type='text']", {onchange: m.withAttr("value", ctrl.input.handle)}),
            "In general the pattern should be [first initial][middle initial][surname]. For example, Juan Carlos Dizon de Guzman should be jddeguzman."
          ),
          common.field(
            "Password",
            m("input[type='password']", {onchange: m.withAttr("value", ctrl.input.password)})
          ),
          common.field(
            "Privileges",
            m("label", [
              m("input[type='checkbox']", {onchange: m.withAttr("checked", ctrl.input.isAdmin)},""),
              m("span", "Make this user an admin for this agency")
            ]),
            "As an admin, this user will be able to add and delete users"
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