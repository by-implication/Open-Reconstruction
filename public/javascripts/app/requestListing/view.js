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

  var currentFilterNameFromArray = function(arr, id){
    id = id * 1;
    var obj = _.find(arr, function(e){
      return e.id === id;
    });
    // console.log(obj);
    if(!_.isUndefined(obj)){
      return obj.name;
    } else {
      return null;
    }
  }
// {disaster: f.id}
  return app.template(ctrl.app, "Requests", [
    common.banner("Requests"),
    m.cookie().logged_in ?
      m("section#new-request-banner", [
        m(".row", [
          m(".columns.medium-12", [
            m("h2.left", [
              "Don't have an existing request? Make a new one."
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
      ctrl.locationCF.view(
        null, 
        function(){
          return ctrl.locFilters.map(function (f){
            return m(".columns.medium-3", [
              m("label", [
                f.label,
                select2.view({data: f.data, value: f.value(), onchange: f.onchange})
              ]),
            ])
          })
        }
      ),
      ctrl.disasterCF.view(
        currentFilterNameFromArray(ctrl.disasters, ctrl.disaster), 
        filterColumns.bind(null, ctrl.disasters, 4, ctrl.disaster, "disaster")
      ),
      ctrl.agencyCF.view(
        currentFilterNameFromArray(ctrl.agencies, ctrl.agencyFilterId),
        filterColumns.bind(null, ctrl.agencies, 4, ctrl.agencyFilterId, "agencyFilterId")
      ),
      ctrl.projectTypeCF.view(
        currentFilterNameFromArray(ctrl.projectFilters, ctrl.projectTypeId),
        filterColumns.bind(null, ctrl.projectFilters, 4, ctrl.projectTypeId, "projectTypeId")
      ),
    ]),
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
