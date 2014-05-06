requestListing.view = function(ctrl){
  return app.template(ctrl.app, [
    common.banner("List of Requested Projects"),
    m("section", [

      ctrl.app.currentUser() ?
        m(".row", [
          m(".columns.medium-12", [
            ctrl.app.isAuthorized(1) ?
              m(
                "a.button", 
                {href: routes.controllers.Requests.create().url, config: m.route}, 
                "New Request"
              )
            : ""
          ]),
        ])
      : "",

      m(".row", [
        m(".columns.medium-12", [
          common.tabs.view(ctrl.tabs, {className: "left", config: ctrl.setCurrentTab})
        ]),
      ]),
      m(".row", [
        m(".columns.medium-9", [
          request.listView(ctrl)
        ]),
        m(".columns.medium-3", [
          m("h4", [
            "Filter by Project Type"
          ]),
          m("ul.filters", [
            m("li.filter", {className: (ctrl.currentFilter.requests() == "") ? "active" : ""}, [
              m("a", {
                onclick: ctrl.currentFilter.requests.bind(ctrl.currentFilter, "")
              }, "All")
            ]),
            _.chain(ctrl.projectFilters)
            .map(function(filter){
              return m("li.filter",{className: (ctrl.currentFilter.requests() == filter) ? "active" : ""}, [
                m("a", {
                  onclick: ctrl.currentFilter.requests.bind(ctrl.currentFilter, filter)
                }, filter)
              ])
            })
            .value()
          ])
        ])
      ])
    ])
  ])
}