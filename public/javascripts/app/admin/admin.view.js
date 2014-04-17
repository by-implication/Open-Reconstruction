admin.view = function(ctrl){
  var agencyList = m.prop([
    {
      shortname: "OCD",
      name: "Office of Civil Defense",
      permissions: "xxrrdd",
      userCount: 42, 
    },
    {
      shortname: "DPWH",
      name: "Department of Public Works and Highways",
      permissions: "xxrrdd",
      userCount: 145, 
    },
  ])
  return app.template(ctrl, [
    common.banner("Administrative Interface"),
    m("section", [
      m(".row", [
        m(".columns.medium-4", [
          "derp"
        ]),
      ]),
    ]),
    console.log(ctrl.app.getLoggedIn().department),
    m.if(ctrl.app.getLoggedIn().department == "OCD", 
      m("section", [
        m(".row", [
          "children",
          // create agencies
          // list of agencies
          m(".columns.medium-8", [
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
                agencyList().map(function(a){
                  return m("tr", [
                    m("td", [
                      a.name
                    ]),
                    m("td", [
                      a.shortname
                    ]),
                    m("td", [
                      a.userCount
                    ]),
                    m("td", [
                      a.permissions
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