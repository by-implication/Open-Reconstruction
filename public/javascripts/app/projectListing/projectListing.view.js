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
          m("div.clearfix", [
            common.tabs.view(ctrl.tabs, {className: "left"}, tabs),
            m.if(ctrl.app.isLoggedIn(),
              m(
                "a.button.right", 
                {href: "/projects/new", config: m.route}, 
                "New Request"
              )
            ),
          ]),
          
          project.listView(ctrl)
        ]),
        m("div", {class: "columns medium-3"}, [
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