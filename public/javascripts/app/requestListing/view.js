requestListing.view = function(ctrl){
  
  var pagination = common.pagination(
    ctrl.page,
    ctrl.count,
    ctrl.pageLimit,
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
    if(!_.isUndefined(obj)){
      return obj.name;
    } else {
      return null;
    }
  }

  return app.template(ctrl.app, "Requests", [
    m("section.banner", [
      m(".row", [
        m(".columns.medium-12", [
          m("dl.tabs.switch.reverse.right", [
            m("dd.active", [
              m("a", [
                "Requests"
              ]),
            ]),
            m("dd", [
              m("a", {href: routes.controllers.Projects.index().url, config: m.route}, [
                "Projects"
              ]),
            ]),
          ]),
          m("h1", [
            "Browsing requests"
          ]),
        ]),
      ]),
    ]),
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
          return ctrl.locFilters.map(function (f, index){
            return m(".columns.medium-3", [
              m("label", {className: (index && (ctrl.locFilters[index - 1].value() === "-")) ? "disabled" : ""}, [
                f.label,
                select2.view({
                  data: f.data, 
                  value: f.value(), 
                  onchange: f.onchange
                }, {
                  disabled: (index && (ctrl.locFilters[index - 1].value() === "-"))
                })
              ])
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
      m(".row", [
        m(".columns.medium-12", [
          pagination,
          request.listView(ctrl.requestList, ctrl.sortBy, ctrl),
          pagination,
        ]),
      ])
    ])
  ])
}
