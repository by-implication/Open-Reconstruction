admin.view = function(ctrl){
  // var agencyList = m.prop([
  //   {
  //     shortname: "OCD",
  //     name: "Office of Civil Defense",
  //     permissions: "xxrrdd",
  //     userCount: 42, 
  //   },
  //   {
  //     shortname: "DPWH",
  //     name: "Department of Public Works and Highways",
  //     permissions: "xxrrdd",
  //     userCount: 145, 
  //   },
  // ])
  return app.template(ctrl.app, [
    common.banner("Administrative Interface"),
    // console.log(ctrl.app.getLoggedIn().department),
    m.if(ctrl.app.isSuperAdmin(),
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
                        // a.name()
                        a.name
                      ]),
                    ]),
                    m("td", [
                      a.acronym
                    ]),
                    m("td", [
                      "count"
                    ]),
                    m("td", [
                      a.role
                    ]),
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