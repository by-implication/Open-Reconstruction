requestListing.view = function(ctrl){
  
  var pagination = common.pagination(
    ctrl.page,
    ctrl.maxPage(),
    function (p){
      return ctrl.nav({page: p});
    }
  );

  var filterColumns = function(filterArr, columnNum, currentFilter, filterNav){
    return helper.splitArrayTo(filterArr, columnNum)
      .map(function(fg, index){
        var threshold = Math.min(columnNum, filterArr.length);
        var isLast = index + 1 >= threshold;
        return m(".columns", {className: (isLast ? "end " : "") + "medium-" + (12/columnNum)}, [
          m("ul.filters", fg.map(function(f){
            var navObj = {};
            navObj[filterNav] = f.id
            return m("li.filter", {className: (f.id == currentFilter) ? "active" : ""}, [
              m("a", {href: ctrl.nav(navObj), config: m.route}, f.name)
            ]);
          })),
        ])
      });
  }
// {disaster: f.id}
  return app.template(ctrl.app, "Requests", [
    common.banner("Requests"),
    m.cookie().logged_in ?
      m("section#new-request-banner", [
        m(".row", [
          m(".columns.medium-12", [
            m("h2.left", [
              "Make a new request. We're here to help."
            ]),
            m("a.button.right",
              {href: routes.controllers.Requests.create().url, config: m.route},
              "New Request"
            ),
          ]),
        ]),
      ])
    : "",
    
    m("section#loc-filters", [
      m(".row", [
        m(".columns.medium-12", [
          m("h2", [
            "Looking for something specific? Try our filters."
          ]),
        ]),
      ]),
      m(".row", [
        m(".columns.medium-12", [
          m("h4", [
            "Location"
          ]),
        ]),
      ]),
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
      // m(".row", [
      //   m(".columns.medium-12", [
      //     m("h4", [
      //       "Disaster"
      //     ]),
      //   ]),
      // ]),
      common.collapsibleFilter.view(ctrl.disasterCF, "Disaster", filterColumns.bind(null, ctrl.disasters, 4, ctrl.disaster, "disaster")),
      m(".row", [
        // filterColumns(ctrl.disasters, 4, ctrl.disaster, "disaster"),
      ]),
      m(".row", [
        m(".columns.medium-12", [
          m("h4", [
            "Agency"
          ]),
        ]),
      ]),
      m(".row", [
        filterColumns(ctrl.agencies, 4, ctrl.agencyFilterId, "agencyFilterId")
      ]),
      m(".row", [
        m(".columns.medium-12", [
          m("h4", [
            "Project Type"
          ]),
        ]),
      ]),
      m(".row", [
        filterColumns(ctrl.projectFilters, 4, ctrl.projectTypeId, "projectTypeId")
      ]),
    ]),
    // m("section", [
      
    // ]),
    m("section", [
      m.cookie().logged_in ?
        m(".row", [
          m(".columns.medium-12.text-center", [
            common.tabs.menu(ctrl.tabs, {id: "relevance", config: ctrl.setCurrentTab})
          ]),
        ]) : "",
      m(".row", [
        m(".columns.medium-12", [
          pagination,
          common.tabs.content(ctrl.tabs),
          pagination,
        ]),
      ])
    ])
  ])
}
