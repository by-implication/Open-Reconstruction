govUnit.view = function(ctrl){

  var pagination = common.pagination(
    ctrl.page,
    ctrl.totalReqs(),
    ctrl.pageLimit(),
    function (p){
      return routes.controllers.GovUnits.viewPage(ctrl.id, ctrl.tab, p).url;
    }
  );

  return app.template(ctrl.app, "Agency / LGU — " + ctrl.govUnit().name, {className: ""}, [
    common.modal.view(
      ctrl.editUserModal,
      function(ctrl){
        return m("form", {onsubmit: ctrl.submit}, [
          m(".section", [
            m("h3", "User Creation"),
            m("p", [
              "Create one or more users under this government unit."
            ]),
          ]),
          m("hr"),
          m(".section", [
            common.field("Username", m("input", {
              value: ctrl.input.handle(),
              type: "text",
              disabled: true
            })),
            common.field("Name", m("input", {
              value: ctrl.input.name(),
              type: "text",
              onchange: m.withAttr("value", ctrl.input.name)
            })),
            common.field("Admin Privileges", m("input[type='checkbox']", {
              checked: ctrl.input.isAdmin(),
              onclick: m.withAttr("checked", ctrl.input.isAdmin)
            }))
          ]),
          m(".section", [
            m("button", [
              "Submit"
            ])
          ])
        ])
      }
    )], [
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
            : "",
            ctrl.app.isSuperAdmin() ?
              m("a.right", {href: routes.controllers.GovUnits.edit(ctrl.govUnit().id).url, config: m.route}, [
                m("i.fa.fa-edit"), 
                " Edit"
              ])
            : "",
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
        common.tabs.menu(ctrl.tabs, {className: "vertical"}),
        m.switch(ctrl.tabs.currentTab())
          .case("Users", function(){
            return m(".columns.medium-9", [
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
                    ctrl.app.isGovUnitAdmin(ctrl.govUnit().id) ?
                      m("td", [
                        "Edit"
                      ])
                    : "",
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
                        ctrl.app.isGovUnitAdmin(ctrl.govUnit().id) ?
                          m("td", [
                            m("button.small", {onclick: u.edit}, [
                              "Edit"
                            ])
                          ])
                        : "",
                      ])
                    })
                  : m("tr", [
                      m("td", [
                        "No users are currently registered under this government unit."
                      ]),
                    ]),
                ]),
              ]),
            ])
          })
          .case("Requests", function(){
            return m(".columns.medium-9", [
              m("h1", "Requests"),
              pagination,
              request.listView(ctrl.requests())
            ])
          })
          .case("Sub-LGUs", function(){
            return ctrl.children().length ?
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
            ]) : ""
          })
          .render()

      ]),
    ]),
  ])
}