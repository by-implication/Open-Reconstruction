agency.view = function(ctrl){
  return app.template(ctrl.app, [
    common.banner([
      ctrl.agency().name,
      ctrl.agency().acronym ?
        m("span.acronym", [
          "(" + ctrl.agency().acronym + ")"
        ])
      : ""
    ]),
    m("section", [
      m(".row", [
        m(".columns.medium-12", [
          ctrl.app.isAgencyAdmin(ctrl.agency().id) ?
            m("a.button", 
              {
                href: routes.controllers.Users.create(ctrl.agency().id).url,
                config: m.route
              }, 
              ["Add new user"]
            )
          : ""
        ]),
      ]),
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
                    m("a", {href: routes.controllers.Users.view(u.id).url, config: m.route}, [
                      u.name
                    ]),
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
    ]),
  ])
}