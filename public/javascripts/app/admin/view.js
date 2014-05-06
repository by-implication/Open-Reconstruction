admin.view = function(ctrl){
  
  function renderLGU(lgu){
    // lgu.isExpanded = false;
    var level = lgu.level();

    return m("li.lgu", [
      m(".info", [
        level < 3 && lgu.children().length ?
          m("label.expander", {className: lgu.isExpanded ? "expanded" : ""}, [
            m("input", {type: "checkbox", onchange: m.withAttr("checked", lgu.isExpanded), checked: lgu.isExpanded()}),
            m(".control", [
              m("i.fa.fa-caret-right.fa-fw")
            ]),
          ])
        : m("label.expander", []),
        (level ?
          m("a", {href: routes.controllers.GovUnits.view(lgu.id()).url}, lgu.name()) :
          m("span", lgu.name())
        ),
        lgu.children().length ? 
          m("span", [
            " (",
            lgu.children().length,
            " ",
            m.switch(level)
              .case(0, function(){
                return "provinces"
              })
              .case(1, function(){
                return "cities"
              })
              .case(2, function(){
                return "barangays"
              })
              .render(),
            ")"
          ])
        : null,
        (level < 3 ?
          m("a.add.button.micro", {href: routes.controllers.GovUnits.createLgu(level, lgu.id()).url}, [
            m.switch(level)
              .case(0, function(){
                return "Add Province"
              })
              .case(1, function(){
                return "Add City/Municipality"
              })
              .case(2, function(){
                return "Add Barangay"
              })
              .render()
          ]) :
          ""
        )
      ]),
      lgu.isExpanded() ?
        m("ul.children", [
          (lgu.children && lgu.children() && lgu.children().map(renderLGU)) || []
        ]) :
        null
    ])
  }

  return app.template(ctrl.app, [
    common.banner("Administrative Interface"),
    ctrl.app.isSuperAdmin()?
      m("section", [
        m(".row", [
          common.tabs.view(ctrl.tabs, {className: "vertical"}),
          m.switch(ctrl.tabs.currentTab()())
            .case("Agencies", function(){
              return m(".tabs-content.vertical", [
                m("a.button", {href: routes.controllers.GovUnits.createAgency().url, config: m.route}, [
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
                          m("a", {href: routes.controllers.GovUnits.view(a.id).url, config: m.route}, [
                            a.name,
                            a.acronym ?
                              m("span.acronym", [
                                "("+a.acronym+")"
                              ])
                            : ""
                          ]),
                        ]),
                        m("td", [
                          a.totalUsers
                        ]),
                        m("td", [
                          ctrl.roles()[a.role]
                        ])
                      ]);
                    }),
                  ]),
                ]),
              ])
            })
            .case("LGUs", function(){
              return m(".tabs-content.vertical", [
                m("ul.button-group", [
                  m("li", [
                    m("button.small.secondary", {onclick: ctrl.expandAll.bind(ctrl)}, [
                      "Expand all"
                    ]),
                  ]),
                  m("li", [
                    m("button.small.secondary", {onclick: ctrl.collapseAll.bind(ctrl)}, [
                      "Collapse all"
                    ]),
                  ]),
                ]),
                m("ul", [
                  ctrl.regions().map(renderLGU)
                ])
              ])
            })
            .render()
        ]),
      ])
    : ""
  ])
}