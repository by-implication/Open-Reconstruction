requestListing.view = function(ctrl){
  
  var pagination = common.pagination(
    ctrl.page,
    ctrl.count,
    ctrl.pageLimit,
    function (p){
      return ctrl.nav({page: p});
    }
  );

  var filterColumns = function(filterArr, filterId, filterNav){
    return m("ul.filters", filterArr.map(function(f){
      var navObj = {};
      navObj[filterNav] = f.id
      return m("li.filter", {className: (f.id == filterId) ? "active" : ""}, [
        m("a", {href: ctrl.nav(navObj), config: m.route}, f.name)
      ]);
    }));
  }
  var currentDrawerValueFromArray = function(arr, id){
    if(arr){
      var obj = _.find(arr, function(e){
        return e.id == id;
      }); // find an element with id of 'id' inside arr.
      if(!_.isUndefined(obj)){
        return obj.name;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  var locFilterPreview = function(){
    var names = ctrl.locFilters.map(function(f){
      var name = currentDrawerValueFromArray(f.data, f.value())
      if(name == "All") {
        return;
      } else {
        return name;
      }
    }).filter(function(v){return v}).reverse()
    return names.length ? names.join(", ") : "All";
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
    m("section", [
      m(".row", [
        m(".columns.medium-4", [
          m("h4", [
            "Filters"
          ]),
          ctrl.locationCF.view(
            locFilterPreview(),
            function(){
              return m("ul", ctrl.locFilters.map(function (f, index){
                return m("li", [
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
              }));
            }
          ),
          ctrl.disasterCF.view(
            currentDrawerValueFromArray(ctrl.disasters, ctrl.disaster),
            filterColumns.bind(null, ctrl.disasters, ctrl.disaster, "disaster")
          ),
          ctrl.agencyCF.view(
            currentDrawerValueFromArray(ctrl.agencies, ctrl.agencyFilterId),
            filterColumns.bind(null, ctrl.agencies, ctrl.agencyFilterId, "agencyFilterId")
          ),
          ctrl.projectTypeCF.view(
            currentDrawerValueFromArray(ctrl.projectFilters, ctrl.projectTypeId),
            filterColumns.bind(null, ctrl.projectFilters, ctrl.projectTypeId, "projectTypeId")
          ),
          ctrl.rejectStatusCF.view(
            currentDrawerValueFromArray(ctrl.rejectStatuses, ctrl.rejectStatus),
            filterColumns.bind(null, ctrl.rejectStatuses, ctrl.rejectStatus, "rejectStatus")
          ),
          ctrl.requestLevelCF.view(
            currentDrawerValueFromArray(ctrl.requestPipeline, ctrl.requestLevel),
            filterColumns.bind(null, ctrl.requestPipeline, ctrl.requestLevel, "requestLevel")
          )
        ]),
        m(".columns.medium-8", [
          pagination,
          request.listView(ctrl.requestList, ctrl.sortBy, ctrl),
          pagination,
        ]),
      ])
    ])
  ])
}
