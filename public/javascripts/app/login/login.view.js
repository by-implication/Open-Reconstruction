login.view = function(ctrl){
  return app.template(ctrl, [
    m("section", [
      m(".row", [
        m(".columns.medium-6.medium-centered", [
          m(".card", [
            m(".section", [
              m("form", [
                m("label", [
                  "Username",
                  m("input[type='text']"),
                ]),
                m("label", [
                  "Password",
                  m("input[type='password']")
                ]),
                m("button", "Log in")
              ]),
            ]),
          ]),
        ]),
      ]),
    ]),
  ])
}