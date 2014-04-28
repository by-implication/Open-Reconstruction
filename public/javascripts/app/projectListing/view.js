projectListing.view = function(ctrl){
  return app.template(ctrl.app, [
    common.banner("List of Requested Projects"),
    m("section", [
      ctrl.app.currentUser() ?
        m(".row", [
          m(".columns.medium-9", [
            common.tabs.view(ctrl.tabs, {className: "left", config: ctrl.setCurrentTab})
          ]),
          m(".columns.medium-3", [
            ctrl.app.isAuthorized(1) ?
              m(
                "a.button", 
                {href: "/projects/new", config: m.route}, 
                "New Request"
              )
            : ""
          ]),
        ])
      : "",
      m(".row", [
        m(".columns.medium-9", [
          project.listView(ctrl)
        ]),
        m(".columns.medium-3", [
          m("h4", [
            "Filter by Project Type"
          ]),
          m("ul", [
            m("li", [
              m("a", {onclick: ctrl.currentFilter.projects.bind(ctrl.currentFilter, "")}, "All")
            ]),
            _.chain(ctrl.projectFilters)
            .map(function(filter){
              return m("li", [
                m("a", {onclick: ctrl.currentFilter.projects.bind(ctrl.currentFilter, filter)}, filter)
              ])
            })
            .value()
          ])
        ])
      ])
    ])
  ])
}