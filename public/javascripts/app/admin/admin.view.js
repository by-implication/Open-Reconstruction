admin.view = function(ctrl){
  
  return app.template(ctrl.app, [
    common.banner("Administrative Interface"),
    m.if(ctrl.app.isSuperAdmin(),
      m("section", [
        m(".row", [
          // create agencies
          // list of agencies
          m(".columns.medium-8", [
            m("a.button", {href: "/agencies/new", config: m.route}, [
              "New agency"
            ]),
            m("a.button", {href: "/users/new", config: m.route}, [
              "New users"
            ]),
            m("table", [
              m("thead", [
                m("tr", [
                  m("td", [
                    "Agency Name"
                  ]),
                  m("td", [
                    "Acronym"
                  ]),
                  m("td", [
                    "Users"
                  ]),
                  m("td", [
                    "Permissions"
                  ]),
                ]),
              ]),
              m("tbody", [
                ctrl.agencyList().map(function(a){
                  return m("tr", [
                    m("td", [
                      m("a", {href: "/agencies/"+a.id, config: m.route}, [
                        a.name
                      ]),
                    ]),
                    m("td", [
                      a.acronym
                    ]),
                    m("td", [
                      a.totalUsers
                    ]),
                    m("td", [
                      a.role
                    ])
                  ]);
                })
              ]),
            ]),
          ]),
        ]),
      ])
    )
      
  ])
}