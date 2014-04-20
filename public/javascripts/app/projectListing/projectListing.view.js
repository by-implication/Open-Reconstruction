projectListing.view = function(ctrl){
  return app.template(ctrl.app, [
    common.banner("List of Requested Projects"),
    m("section", [
      m(".row", [
        m(".columns.medium-8", [
          m(".clearfix", [
            ctrl.app.isAuthorized(1) ?
              m(
                "a.button.right", 
                {href: "/projects/new", config: m.route}, 
                "New Request"
              )
            : "",
            ctrl.app.currentUser() ?
              common.tabs.view(ctrl.tabs, {className: "left", config: ctrl.setCurrentTab})
            : ""
          ]),
          project.listView(ctrl)
        ]),
      // ]),
      // m(".row", [
      //   m(".columns.medium-8", [
          
      //   ]),
        m(".columns.medium-4", [
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