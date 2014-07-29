govUnit.view = function(ctrl){

  var pagination = common.pagination(
    ctrl.page,
    ctrl.totalReqs(),
    ctrl.pageLimit(),
    function (p){
      return routes.controllers.GovUnits.viewPage(ctrl.id, p).url;
    }
  );

  return app.template(ctrl.app, "Agency / LGU — " + ctrl.govUnit().name, [
    m(".section.breadcrumbs", [
      m(".row", [
        m(".columns.medium-12", [
          ctrl.ancestors().length ?
            ctrl.ancestors().map(function (c, i){
              return m("span.crumb", [
                m("a", {href: routes.controllers.GovUnits.view(c.id).url, config: m.route}, c.name),
                m("i.fa.fa-angle-right.arrow")
              ])
            }): "",
            ctrl.govUnit().name,
            ctrl.govUnit().acronym ?
              m("span.acronym", [
                "(" + ctrl.govUnit().acronym + ")"
              ])
            : ""
        ]),
      ]),
    ]),
    common.banner([
      ctrl.govUnit().name,
      m("p", [
        ctrl.incomeClass() ? ("Income class " + ctrl.incomeClass()) : "Unspecified Income Class"
      ]),
    ]),
    m("section.map-container", [
      m("#detailMap", {config: ctrl.initMap}),
      ctrl.coords() ?
        ""
      : m(".map-shroud", [
        m("h3", [
          "Map unavailable because no coordinates are available"
        ]),
      ])
    ]),
    m("section", [
      // m(".row", [
      //   m(".columns.medium-12", [
          
      //   ]),
      // ]),
      m(".row", [
        m(".columns.medium-9", [
          m("h1", "Users"),
          m("ul.button-group", [
            ctrl.app.isGovUnitAdmin(ctrl.govUnit().id) ?
              m("li", [
                m("a.button.small", 
                  {
                    href: routes.controllers.Users.create(ctrl.govUnit().id).url,
                    config: m.route
                  }, 
                  ["Add new user"]
                )
              ])
            : "",
            ctrl.app.isSuperAdmin() ?
              m("li", [
                m(
                  "a.button.small", 
                  {href: routes.controllers.GovUnits.edit(ctrl.govUnit().id).url, config: m.route}, 
                  "Edit"
                )
              ])
            : ""
          ]),
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
              ctrl.users().length ?
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
              : m("tr", [
                  m("td", [
                    "No users are currently registered under this government unit."
                  ]),
                ]),
            ]),
          ]),
        ]),
      ]),
      m(".row", [
        m(".columns.medium-9", [
          m("h1", "Requests"),
          pagination,
          request.listView(ctrl.requests())
        ]),
      ]),
      ctrl.children().length ?
      m(".row", [
        m(".columns.medium-9", [
          m("h1", "Sub-LGUs"),
          m("table", [
            m("thead", [
              m("tr", [
                m("th", [
                  "Name"
                ]),
                m("th", [
                  "Income Class"
                ]),
              ]),
            ]),
            m("tbody", [
              ctrl.children().map(function(c){
                return m("tr", [
                  m("td", [
                    m("a", {href: routes.controllers.GovUnits.view(c.id).url, config: m.route}, [
                      c.name
                    ])
                  ]),
                  m("td", [
                    c.incomeClass ? c.incomeClass : "Not specified"
                  ]),
                ])
              })
            ]),
          ]),
          // ctrl.children().map(function (c){
          //   return m("div",
          //     m("a", {href: routes.controllers.GovUnits.view(c.id).url, config: m.route}, [
          //       c.name
          //     ])
          //   );
          // })
        ]),
      ]) : ""
    ]),
  ])
}