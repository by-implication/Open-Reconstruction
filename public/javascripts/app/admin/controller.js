admin.controller = function(){
  this.app = new app.controller();
  this.agencyList = m.prop([]);
  this.roles = m.prop({});
  this.tabs = new common.tabs.controller();
  this.tabs.tabs = m.prop([
    {label: m.prop("Agencies"), href: routes.controllers.Application.adminAgencies().url}, 
    {label: m.prop("LGUs"), href: routes.controllers.Application.adminLgus().url},
    {label: m.prop("Project Types"), href: routes.controllers.Admin.projectTypes().url},
    {label: m.prop("Disaster Types"), href: routes.controllers.Admin.disasterTypes().url}
  ]);
  this.regions = m.prop([]);
  this.degs = {
    projectTypes: m.prop([]),
    disasterTypes: m.prop([])
  }

  bi.ajax(routes.controllers.GovUnits.listAgencies()).then(function (r){
    this.agencyList(r.agencies);
  }.bind(this), function (r){
    alert(r.reason);
  });

  bi.ajax(routes.controllers.GovUnits.listLgus()).then(function (r){
    var regions = [];
    r.regions
      .map(function(r){
        return new govUnit.Region(r);
      })
      .forEach(function (region){
        regions[region.id()] = region;
      });
    this.regions(regions);
  }.bind(this));

  var degMaker = function(type){
    return function(t){
      var deg = new displayEditGroup(true, function (c){
        this.input(this.value());
        c();
      }, function (c){
        bi.ajax(routes.controllers.Admin.updateType(type, t.id), {
          data: {name: this.input}
        }).then(function (r){
          this.value(r.type.name);
          c();
        }.bind(this), function (r){
          alert("Your input was invalid.");
          c();
        });
      }, null, {value: m.prop(t.name)});
      return deg;
    }
  }

  bi.ajax(routes.controllers.Admin.projectTypesMeta()).then(function (r){
    this.degs.projectTypes(r.map(degMaker("project")));
  }.bind(this));

  bi.ajax(routes.controllers.Admin.disasterTypesMeta()).then(function (r){
    this.degs.disasterTypes(r.map(degMaker("disaster")));
  }.bind(this));

  var expandCollapseRecurse = function(node, ec){
    if (node.children().length) {
      node.isExpanded(ec);
      node.children().forEach(function(n){
        expandCollapseRecurse(n, ec);
      })
    }
  }

  this.collapseAll = function(){
    this.regions().forEach(function(r){
      expandCollapseRecurse(r, false);
    })
  }

  this.toggleLguExpansion = function(lgu){
    var isExpanded = !lgu.isExpanded();
    if(isExpanded){
      bi.ajax(routes.controllers.GovUnits.getChildren(lgu.psgc())).then(function (r){
        lgu.children(r.map(function (child){
          return new govUnit.LGU(child);
        }));
        lgu.isExpanded(isExpanded);
      });
    } else {
      lgu.isExpanded(isExpanded);
    }
  }

  this.typeName = m.prop("");

  var createType = function(type){
    return function (e){
      e.preventDefault();
      if(this.typeName()){
        bi.ajax(routes.controllers.Admin.insertType(type), {data: {name: this.typeName()}})
        .then(function (r){
          this[type + "Types"]().push(degMaker(type)(r[type + "Type"]));
          alert("Successfully created new " + type + " type.");
        }.bind(this));
      } else {
        alert("Empty input.");
      }
    }.bind(this);
  }.bind(this);

  this.createProjectType = createType("project");
  this.createDisasterType = createType("disaster");

}