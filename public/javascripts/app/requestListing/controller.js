requestListing.controller = function(){

  var self = this;
  this.app = new app.controller();
  this.locationCF = new common.collapsibleFilter.controller("Location", "location");
  this.disasterCF = new common.collapsibleFilter.controller("Disaster", "disaster");
  this.agencyCF = new common.collapsibleFilter.controller("Agency", "agency");
  this.projectTypeCF = new common.collapsibleFilter.controller("Project Type", "project_type");

  this.filterAccordion = new common.accordion.controller();
  // this.filterAccordion.drawers([
  //   new common.collapsibleFilter.controller("Location", "location"),
  //   new common.collapsibleFilter.controller("Disaster", "disaster"),
  //   new common.collapsibleFilter.controller("Agency", "agency"),
  //   new common.collapsibleFilter.controller("Project Type", "project_type")
  //   ])

  var filterColumns = function(filterArr, filterId, filterNav){
    console.log(filterArr);
    var columnNum = 4;
    if(filterArr.length){
      return helper.splitArrayTo(filterArr, columnNum)
        .map(function(fg, index){
          var threshold = Math.min(columnNum, filterArr.length);
          var isLast = index + 1 >= threshold;
          return m(".columns", {className: (isLast ? "end " : "") + "medium-" + (12/columnNum)}, [
            m("ul.filters", fg.map(function(f){
              var navObj = {};
              navObj[filterNav] = f.id
              return m("li.filter", {className: (f.id == filterId) ? "active" : ""}, [
                m("a", {href: ctrl.nav(navObj), config: m.route}, f.name)
              ]);
            })),
          ])
        });
    }
  }
  var currentDrawerValueFromArray = function(arr, id){
    if(arr){
      id = id * 1; // force id into a number
      var obj = _.find(arr, function(e){
        return e.id === id;
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

  this.filterAccordion.drawers([
    {
      ctrl: self.locationCF,
      preview: null,
      drawer: function(){
        return self.locFilters.map(function (f, index){
          return m(".columns.medium-3", [
            m("label", {className: (index && (self.locFilters[index - 1].value() === "-")) ? "disabled" : ""}, [
              f.label,
              select2.view({
                data: f.data, 
                value: f.value(), 
                onchange: f.onchange
              }, {
                disabled: (index && (self.locFilters[index - 1].value() === "-"))
              })
            ])
          ])
        })
      }
    },
    {
      ctrl: self.disasterCF,
      preview: currentDrawerValueFromArray(self.disasters, self.disaster),
      drawer: filterColumns.bind(null, self.disasters, self.disaster, "disaster")
    }
  ]);
  
  this.disasters = [];

  this.page = parseInt(m.route.param("page")) || 1;
  this.pageLimit = 1;
  this.projectTypeId = m.route.param("projectTypeId") || 0;
  this.agencyFilterId = m.route.param("agencyFilterId") || 0;
  this._queryLocFilters = m.route.param("l") || "-";
  this.sort = m.route.param("sort") || "id";
  this.sortDir = m.route.param("sortDir") || "asc";
  this.disaster = m.route.param("disaster") || 0;

  var nav = this.nav = function(params, meta){
    var keys = ["page", "projectTypeId", "_queryLocFilters", "sort", "sortDir", "disaster", "agencyFilterId"];
    var p = {};
    keys.forEach(function (k){
      p[k] = self[k];
    });
    for(var k in params){
      if(k != 'page'){
        params.page = 1;
        break;
      }
    }
    _.extend(p, params);
    return routes.controllers.Requests[meta ? "indexMeta" : "indexPage"].apply(
      null, keys.map(function (k){ return p[k]; })
    ).url;
  }
  
  this.sortBy = function(sort){
    var sortDir = (self.sortDir == "asc" && sort == self.sort) ? "desc" : "asc";
    return nav({sort: sort, sortDir: sortDir});
  }

  this.queryLocFilters = function(){
    var f = self._queryLocFilters;
    f = (f != "-" && f.split(".")) || [];
    while(f.length < 4){ f.push("-");}
    return f;
  }
  this.counts = {};

  this.hierarchy = ["Region", "Province", "City / Municipality", "Barangay"];

  function DefLocFilter(label, value){
    this.label = label;
    this.data = [];
    this.value = m.prop(value);
    this.onchange = function(data){
      var v = data.id;
      var _qlf = self._queryLocFilters;
      var i = self.hierarchy.indexOf(label);
      var qlf = (v == '-' && i) ? _qlf.split(".").slice(0, i).join(".") : v;
      this.value(v);
      var targetRoute = nav({_queryLocFilters: qlf});
      m.route(targetRoute);
    }.bind(this);
  };

  this.locFilters = this.hierarchy.map(function (label, index){
    var val;
    var qlf = self.queryLocFilters();
    if(qlf[index] != "-"){
      val = qlf.slice(0, index+1).join(".");
    } else {
      val = "-"
    }
    return new DefLocFilter(label, val);
  });

  this.requestList = [];
  this.projectFilters = [{id: 0, name: "All"}];
  this.agencies = [{id: 0, name: "All", acronym: "All"}];

  bi.ajax(nav(null, true)).then(function (r){

    this.requestList = r.list;
    this.count = r.count;
    this.pageLimit = r.pageLimit;
    this.projectFilters = this.projectFilters.concat(r.filters);
    this.agencies = this.agencies.concat(r.agencies);
    this.disasters = [{id: 0, name: "All"}].concat(r.disasters);
    for(var i in r.locFilters){
      this.locFilters[i].data = [{id: '-', name: 'All'}].concat(r.locFilters[i].sort(function (a, b){
        return a.id - b.id;
      }));
    }

  }.bind(this));

}