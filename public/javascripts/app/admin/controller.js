admin.controller = function(){
  this.app = new app.controller();
  this.agencyList = m.prop([]);
  this.roles = m.prop({});
  this.tabs = new common.tabs.controller();
  this.tabs.tabs = m.prop([
    {label: m.prop("Agencies"), href: routes.controllers.Application.adminAgencies().url}, 
    {label: m.prop("LGUs"), href: routes.controllers.Application.adminLgus().url}
  ]);
  this.regions = m.prop([]);

  bi.ajax(routes.controllers.GovUnits.createAgencyMeta()).then(function (r){
    if(r.success){
      var roles = _.object(r.roles.map(function(role) {
        return [role.id, role.name];
      }));
      this.roles(roles);
    } else {
      alert(r.reason);
    }
  }.bind(this));

  bi.ajax(routes.controllers.GovUnits.listAgencies()).then(function (r){
    if(r.success){
      this.agencyList(r.agencies);
    } else {
      alert(r.reason);
    }
  }.bind(this));

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
      bi.ajax(routes.controllers.GovUnits.getChildren(lgu.level(), lgu.id())).then(function (r){
        lgu.children(r.map(function (child){
          return new govUnit.LGU(child);
        }));
        lgu.isExpanded(isExpanded);
      });
    } else {
      lgu.isExpanded(isExpanded);
    }
  }

}