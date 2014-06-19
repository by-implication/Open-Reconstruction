login.view = function(ctrl){
  return app.template(ctrl.app, "Login", {className: "detail"}, [
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
              m("form", {onsubmit: ctrl.submit}, [
                m("label", [
                  "Username",
                  m("input[type='text']", {onchange: m.withAttr("value", ctrl.input.handle)})
                ]),
                m("label", [
                  "Password",
                  m("input[type='password']", {onchange: m.withAttr("value", ctrl.input.password)})
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