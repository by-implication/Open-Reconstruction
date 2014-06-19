requestListing.view = function(ctrl){
  
  var pagination = common.pagination(
    ctrl.page,
    ctrl.maxPage(),
    function (p){
      return routes.controllers.Requests.indexPage(ctrl.tab, p, ctrl.projectTypeId, ctrl._queryLocFilters, ctrl.sort, ctrl.sortDir).url;
    }
  );

  return app.template(ctrl.app, [
    common.banner("Requests"),
    ctrl.app.isAuthorized(process.permissions.CREATE_REQUESTS) ?
      m("section#new-request-banner", [
        m(".row", [
          m(".columns.medium-12", [
            m("h2.left", [
              "Make a new request. We're here to help."
            ]),
            m(
              "a.button.right",
              {href: routes.controllers.Requests.create().url, config: m.route},
              "New Request"
            )
          ]),
        ]),
      ])
    : "",
    m("section", [
      m.cookie().logged_in ?
        m(".row", [
          m(".columns.medium-12", [
            common.tabs.menu(ctrl.tabs, {className: "left", config: ctrl.setCurrentTab})
          ]),
        ]) : "",
      m(".row", [
        m(".columns.medium-9", [
          pagination,
          common.tabs.content(ctrl.tabs),
          pagination,
        ]),
        m(".columns.medium-3", [
          m("h4", [
            "Filter by Location"
          ]),
          ctrl.locFilters.map(function (f){
            return m("label", [
              f.label,
              select2.view({data: f.data, value: f.value(), onchange: f.onchange.bind(f)})
            ])
          }),
          m("h4", [
            "Filter by Project Type"
          ]),
          m("ul.filters",
            _.chain(ctrl.projectFilters)
            .map(function (filter){
              return m("li.filter",{className: (ctrl.projectTypeId == filter.id) ? "active" : ""}, [
                m("a", {
                  href: routes.controllers.Requests.indexPage(ctrl.tab, 1, filter.id, ctrl._queryLocFilters, ctrl.sort, ctrl.sortDir).url,
                  config: m.route
                }, filter.name)
              ])
            })
            .value()
          )
        ])
      ])
    ])
  ])
}
