govUnit.view = function(ctrl){

  var pagination = common.pagination(
    ctrl.page,
    ctrl.maxPage(),
    function (p){
      return routes.controllers.GovUnits.viewPage(ctrl.id, p).url;
    }
  );

  return app.template(ctrl.app, [
    common.banner([
      ctrl.govUnit().name,
      ctrl.govUnit().acronym ?
        m("span.acronym", [
          "(" + ctrl.govUnit().acronym + ")"
        ])
      : ""
    ]),
    m("section", [
      m(".row", [
        m(".columns.medium-12", [
          m("ul.button-group", [
            ctrl.app.isGovUnitAdmin(ctrl.govUnit().id) ?
              m("li", [
                m("a.button", 
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
                  "a.button", 
                  {href: routes.controllers.GovUnits.edit(ctrl.govUnit().id).url, config: m.route}, 
                  "Edit"
                )
              ])
            : ""
          ]),
        ]),
      ]),
      m(".row", [
        m("h1", "Users"),
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
      ]),
      m(".row", [
        m("h1", "Requests"),
        m(".columns.medium-9", [
          pagination,
          request.listView(ctrl.requests())
        ]),
      ])
    ]),
  ])
}