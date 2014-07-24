admin.view = function(ctrl){
  
  function renderLGU(lgu){
    var level = lgu.level();

    return m("li.lgu", [
      m(".info", [
        level < 3 ?
          m("label.expander", {className: lgu.isExpanded() ? "expanded" : ""}, [
            m("input", {type: "checkbox", onchange: m.withAttr("checked", function(){ ctrl.toggleLguExpansion(lgu); }), checked: lgu.isExpanded()}),
            m(".control", [
              m("i.fa.fa-caret-right.fa-fw")
            ]),
          ])
        : m("label.expander", []),
        (level ?
          m("a", {href: routes.controllers.GovUnits.view(lgu.id()).url, config: m.route}, lgu.name()) :
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
        : "",
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
        m("ul.children", lgu.children().map(renderLGU)) :
        ""
    ])
  }

  function renderType(t){
    return t.view(
      function(){
        return m("li", t.value());
      },
      function(){
        return m("div", [
          m("input", {type: "text", value: t.input(), onchange: m.withAttr("value", t.input)}),
        ])
      }
    )
  }

  return app.template(ctrl.app, "Admin", {},
    [ctrl.modal ? common.modal.view(ctrl.modal, function (ctrl){
      return m("form", {onsubmit: ctrl.submit}, [
        m(".section", [
          m("h3", ctrl.input.id() ? "Editing Requirement" : "New Requirement")
        ]),
        m("hr"),
        m(".section", [
          common.field("Name", m("input", {
            type: "text",
            onchange: m.withAttr("value", ctrl.input.name),
            value: ctrl.input.name()
          })),
          common.field("Description", m("input", {
            type: "text",
            onchange: m.withAttr("value", ctrl.input.description),
            value: ctrl.input.description()
          })),
          common.field("Level", select2.view({
            data: process.levelDict.toSelectValues(),
            value: ctrl.input.level(),
            onchange: function(data){
              ctrl.input.level(data.id);
            }}
          )),
          common.field("Target", m("input", {
            type: "text",
            onchange: m.withAttr("value", ctrl.input.target),
            value: ctrl.input.target()
          })),
          common.field("Image", m("input", { // Boolean = false,
            type: "checkbox",
            onchange: m.withAttr("checked", ctrl.input.isImage),
            checked: ctrl.input.isImage()
          })),
          m("button", [
            "Submit"
          ]),
        ]),
      ]);
    }) : ""
  ], 
  [
    common.banner("Administrative Interface"),
    ctrl.app.isSuperAdmin()?
      m("section", [
        m(".row", [
          common.tabs.menu(ctrl.tabs, {className: "vertical"}),
          m.switch(ctrl.tabs.currentTab())
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
                          a.role
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
            .case("Project Types", function(){
              return m(".tabs-content.vertical", [
                m(".row", [
                  m(".columns.medium-6", [
                    m("form", {onsubmit: ctrl.createProjectType}, [
                      m(".row.collapse", [
                        m(".columns.medium-8", [
                          m("input[type='text']", {onchange: m.withAttr("value", ctrl.typeName)}),
                        ]),
                        m(".columns.medium-4", [
                          m("button.postfix[type='submit']", "Add")
                        ]),
                      ]),
                    ]),
                    m(".row", [
                      m(".columns.medium-12", [
                        m("ul", [
                          ctrl.degs.projectTypes().map(renderType)
                        ])
                      ]),
                    ]),
                  ]),
                ]),
              ])
            })
            .case("Disaster Types", function(){
              return m(".tabs-content.vertical", [
                m(".row", [
                  m(".columns.medium-6", [
                    m("form", {onsubmit: ctrl.createDisasterType}, [
                      m(".row.collapse", [
                        m(".columns.medium-8", [
                          m("input[type='text']", {onchange: m.withAttr("value", ctrl.typeName)}),
                        ]),
                        m(".columns.medium-4", [
                          m("button.postfix[type='submit']", "Add")
                        ]),
                      ]),
                    ]),
                    m(".row", [
                      m(".columns.medium-12", [
                        m("ul", [
                          ctrl.degs.disasterTypes().map(renderType)
                        ])
                      ]),
                    ]),
                  ])
                ]),
              ])
            })
            .case("Disasters", function(){
              return m(".tabs-content.vertical", [
                m("a.button", {href: routes.controllers.Disasters.create().url, config: m.route}, [
                  "New disaster"
                ]),
                m("table", [
                  m("thead", [
                    m("tr", [
                      m("td", [
                        "Name"
                      ]),
                      m("td", [
                        "Type"
                      ]),
                      m("td", [
                        "Date"
                      ])
                    ]),
                  ]),
                  m("tbody", [
                    ctrl.disasters().map(function (d){
                      return m("tr", [
                        m("td", [
                          m("a", {
                            href: routes.controllers.Disasters.edit(d.id).url,
                            config: m.route
                          }, d.name),
                        ]),
                        m("td", ctrl.disasterTypes().filter(function (dt){
                          return dt.id == d.typeId;
                        })[0].name),
                        m("td", new Date(d.date).toDateString())
                      ]);
                    }),
                  ]),
                ]),
              ])
            })
            .case("Requirements", function(){
              return m(".tabs-content.vertical", [
                m("a.button", {onclick: ctrl.modal.openWithValues.bind(ctrl.modal)}, [
                  "New requirement"
                ]),
                m("table", [
                  m("thead", [
                    m("tr", [
                      m("td", ["Name"]),
                      m("td", ["Description"]),
                      m("td", ["Level"]),
                      m("td", ["Target"]),
                      m("td", ["Image"]),
                      m("td", ["Deprecate"])
                    ]),
                  ]),
                  m("tbody", [
                    ctrl.reqts().map(function (r){
                      return m("tr", [
                        m("td", [
                          m("a", {onclick: r.edit}, r.name),
                        ]),
                        m("td", [r.description]),
                        m("td", [process.levelDict[r.level]]),
                        m("td", [r.target]),
                        m("td", [r.isImage ? "YES" : "NO"]),
                        m("td", [
                          m("a", {onclick: r.deprecate}, "Deprecate")
                        ])
                      ]);
                    }),
                  ]),
                ]),
              ])
            })
            .render()
        ]),
      ])
    : ""
  ])
}