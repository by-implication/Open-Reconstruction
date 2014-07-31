userCreation.view = function(ctrl){
  return app.template(ctrl.app, "New User", [
    common.banner("Adding a user for " + ctrl.govUnit().name),
    m("section", [
      m(".row", [
        m(".columns.medium-12", [
          m("form", {onsubmit: ctrl.submit}, [
            m("ul", [
              m("li.new-user", [
                m(".row", [
                  m(".columns.medium-12", [
                    m("button.alert[type=button].tiny.radius.right", {}, [
                      m("i.fa.fa-fw.fa-lg.fa-times")
                    ]),
                    m("h3", [
                      "User 1"
                    ]),
                  ]),
                ]),
                m(".row", [
                  m(".columns.medium-4", [
                    common.field(
                      "Full Name",
                      m("input[type='text']", {onchange: m.withAttr("value", ctrl.input.name), placeholder: "e.g., Juan Carlos Dizon de Guzman"})
                    ),
                  ]),
                  m(".columns.medium-3", [
                    common.field(
                      "Username",
                      m("input[type='text']", {onchange: m.withAttr("value", ctrl.input.handle)}),
                      "The pattern should be [first initial][middle initial][surname]. For example, Juan Carlos Dizon de Guzman should be jddeguzman.",
                      true
                    ),
                  ]),
                  m(".columns.medium-3", [
                    common.field(
                      "Password",
                      m("input[type='password']", {onchange: m.withAttr("value", ctrl.input.password)})
                    ),
                  ]),
                  m(".columns.medium-2", [
                    common.field(
                      "Privileges",
                      m("label", [
                        m("input[type='checkbox']", {onchange: m.withAttr("checked", ctrl.input.isAdmin)},""),
                        m("span", "Make this user an admin for this agency")
                      ]),
                      "As an admin, this user will be able to add and delete users",
                      true
                    ),
                  ]),
                ]),
              ]),
            ]),
            m(".row", [
              m(".columns.medium-12", [
                m("button", {type: "button", onclick: ctrl.newEntry}, "Add new entry"),
              ]),
            ]),
            m(".row", [
              m(".columns.medium-12", [
                m("button", "Submit")
              ]),
            ]),
          ]),
        ]),
      ]),
    ]),
  ])
}