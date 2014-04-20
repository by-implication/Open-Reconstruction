admin.view = function(ctrl){
  
  return app.template(ctrl.app, [
    common.banner("Administrative Interface"),
    ctrl.app.isSuperAdmin()?
      m("section", [
        m(".row", [
          // create agencies
          // list of agencies
          m(".columns.medium-8", [
            m("a.button", {href: "/agencies/new", config: m.route}, [
              "New agency"
            ]),
            m("table", [
              m("thead", [
                m("tr", [
                  m("td", [
                    "Agency Name"
                  ]),
                  m("td", [
                    "Users"
                  ]),
                  m("td", [
                    "Role"
                  ]),
                ]),
              ]),
              m("tbody", [
                ctrl.agencyList().map(function(a){
                  return m("tr", [
                    m("td", [
                      m("a", {href: "/agencies/"+a.id, config: m.route}, [
                        a.name,
                        a.acronym ?
                          m("span.acronym", [
                            "("+a.acronym+")"
                          ])
                        : null
                      ]),
                    ]),
                    m("td", [
                      a.totalUsers
                    ]),
                    m("td", [
                      ctrl.roles()[a.role]
                    ])
                  ]);
                })
              ]),
            ]),
          ]),
        ]),
      ])
    : null
  ])
}