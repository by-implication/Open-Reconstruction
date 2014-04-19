agency.view = function(ctrl){
  return app.template(ctrl.app, [
    common.banner([
      ctrl.agency().name,
      ctrl.agency().acronym ?
        m("span.acronym", [
          "(" + ctrl.agency().acronym + ")"
        ])
      : null
    ]),
    m("section", [
      m(".row", [
        m(".columns.medium-12", [
          ctrl.app.isAgencyAdmin(ctrl.agency().id) ?
            m("a.button", 
              {
                href: ("/agencies/"+ctrl.agency().id+"/newUser"), 
                config: m.route
              }, 
              ["Add new user"]
            )
          : null
        ]),
      ]),
      ctrl.app.isAgencyAdmin(ctrl.agency().id) ?
        m(".row", [
          m(".columns.medium-9", [
            m("table", [
              m("thead", [
                m("tr", [
                  m("td", [
                    "Name"
                  ]),
                  m("td", [
                    "Username"
                  ]),
                  m("td", [
                    "Type"
                  ]),
                ])
              ]),
              m("tbody", [
                ctrl.users().map(function(u){
                  return m("tr", [
                    m("td", [
                      u.name
                    ]),
                    m("td", [
                      u.handle
                    ]),
                    m("td", [
                      u.isAdmin ?
                        "Admin"
                      : "Normal"
                    ]),
                  ])
                })
              ]),
            ]),
          ]),
        ])
      : null
    ]),
  ])
}