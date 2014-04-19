projectListing.view = function(ctrl){
  return app.template(ctrl.app, [
    common.banner("List of Requested Projects"),
    m("section", [
      m("div",{class: "row"}, [
        m("div", {class: "columns medium-9"}, [
          m("div.clearfix", [
            ctrl.app.isAuthorized(1) ?
              m(
                "a.button.left", 
                {href: "/projects/new", config: m.route}, 
                "New Request"
              )
            : null,
            ctrl.app.currentUser() ?
              common.tabs.view(ctrl.tabs, {className: "right"})
            : null
          ]),
          
          project.listView(ctrl)
        ]),
        m("div", {class: "columns medium-3"}, [
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