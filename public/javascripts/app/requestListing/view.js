requestListing.view = function(ctrl){
  
  var pagination = common.pagination(
    ctrl.page,
    ctrl.maxPage(),
    function (p){
      return ctrl.nav({page: p});
    }
  );

  return app.template(ctrl.app, "Requests", [
    common.banner("Requests"),
    m("section#new-request-banner", [
      m(".row", [
        m(".columns.medium-12", [
          m("h2.left", [
            "Make a new request. We're here to help."
          ]),
          m.cookie().logged_in ? m(
            "a.button.right",
            {href: routes.controllers.Requests.create().url, config: m.route},
            "New Request"
          ) : ""
        ]),
      ]),
    ]),
    m("section#loc-filters", [
      m(".row", [
        ctrl.locFilters.map(function (f){
          return m(".columns.medium-3", [
            m("label", [
              f.label,
              select2.view({data: f.data, value: f.value(), onchange: f.onchange})
            ]),
          ])
        }),
      ]),
    ]),
    m("section", [
      m(".row", [
        m("h4", [
          "Filter by Disaster"
        ]),
        m("ul.filters",
          ctrl.disasters.map(function (d){
            return m("li.filter", {className: (d.id == ctrl.disaster) ? "active" : ""}, [
              m("a", {href: ctrl.nav({disaster: d.id}), config: m.route}, d.name)
            ]);
          })
        ),
      ]),
      m(".row", [
        m("h4", [
          "Filter by Agency"
        ]),
      ]),
      m(".row", [
        helper.splitArrayTo(ctrl.agencies, 6)
          .map(function(fg){
            return m(".columns.medium-2", [
              m("ul.filters", fg.map(function(f){
                return m("li.filters", {className: (ctrl.agencyFilterId == f.id) ? "active" : ""}, [
                  m("a", {
                    href: ctrl.nav({agencyFilterId: f.id}),
                    config: m.route
                  }, f.acronym)
                ])
              }))
            ])
          })
        // m("ul.filters",
        //   _.chain(ctrl.agencies)
        //   .map(function (filter){
        //     return m("li.filter",{className: (ctrl.agencyFilterId == filter.id) ? "active" : ""}, [
        //       m("a", {
        //         href: ctrl.nav({agencyFilterId: filter.id}),
        //         config: m.route
        //       }, filter.acronym)
        //     ])
        //   })
        //   .value()
        // ),
      ]),
    ]),
    m("section", [
      m.cookie().logged_in ?
        m(".row", [
          m(".columns.medium-12.text-center", [
            common.tabs.menu(ctrl.tabs, {id: "relevance", config: ctrl.setCurrentTab})
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
            "Filter by Project Type"
          ]),
          m("ul.filters",
            _.chain(ctrl.projectFilters)
            .map(function (filter){
              return m("li.filter",{className: (ctrl.projectTypeId == filter.id) ? "active" : ""}, [
                m("a", {
                  href: ctrl.nav({projectTypeId: filter.id}),
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
