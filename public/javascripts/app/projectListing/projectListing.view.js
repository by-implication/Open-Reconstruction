projectListing.view = function(ctrl){
  var tabs = [
    {label: "All"},
    {label: "Assigned to Me"}
  ];
  return app.template(ctrl, [
    common.banner("List of Requested Projects"),
    m("section", [
      m("div",{class: "row"}, [
        m("div", {class: "columns medium-9"}, [
          common.tabs.view(ctrl.tabs, tabs),
          project.listView(ctrl)
        ]),
        m("div", {class: "columns medium-3"}, [
          m.if(ctrl.app.isLoggedIn(),
            m(
              "a.button", 
              {href: "/projects/new", config: m.route}, 
              "New Request"
            )
          ),
          m("ul", [
            m("li", [
              m("a", {onclick: ctrl.currentFilter.projects.bind(ctrl.currentFilter, "")}, "All")
            ]),
            _.chain(ctrl.projectFilters())
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