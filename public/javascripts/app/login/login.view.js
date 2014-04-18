login.view = function(ctrl){
  return app.template(ctrl, {className: "detail"}, [
    common.banner("Open Reconstruction"),
    m("section", [
      m(".row", [
        m(".columns.medium-6.medium-centered", [
          m(".card", [
            m(".section", [
              m("h2", [
                "Log in"
              ]),
            ]),
            m("hr"),
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