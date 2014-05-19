requestListing.view = function(ctrl){
  return app.template(ctrl.app, [
    common.banner("List of Requested Projects"),
    m("section", [

      ctrl.app.currentUser() ?
        m(".row", [
          m(".columns.medium-12", [
            ctrl.app.isAuthorized(process.permissions.CREATE_REQUESTS) ?
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
          common.tabs.menu(ctrl.tabs, {className: "left", config: ctrl.setCurrentTab})
        ]),
      ]),
      m(".row", [
        m(".columns.medium-9", common.tabs.content(ctrl.tabs)),
        m(".columns.medium-3", [
          m("h4", [
            "Filter by Project Type"
          ]),
          m("ul.filters", [
            m("li.filter", {className: !ctrl.currentFilter() ? "active" : ""}, [
              m("a", {
                onclick: ctrl.currentFilter.bind(ctrl.currentFilter, 0)
              }, "All")
            ]),
            _.chain(ctrl.projectFilters)
            .map(function (filter){
              return m("li.filter",{className: (ctrl.currentFilter() == filter.id) ? "active" : ""}, [
                m("a", {
                  onclick: ctrl.currentFilter.bind(ctrl.currentFilter, filter.id)
                }, filter.name)
              ])
            })
            .value()
          ])
        ])
      ])
    ])
  ])
}