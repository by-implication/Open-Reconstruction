admin.controller = function(){
  this.app = new app.controller();
  this.agencyList = m.prop([]);
  this.roles = m.prop({});
  this.tabs = new common.tabs.controller("/admin");
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
        return new agency.Region(r);
      })
      .forEach(function (region){
        regions[region.id()] = region;
      });

    var r_lgus = r.lgus.map(function(lgu){
        return new agency.LGU(lgu);
    })

    var lgus = [];
    r_lgus.forEach(function (lgu){
      lgus[lgu.id()] = lgu;
    });

    r_lgus.forEach(function (lgu){
      var parent = lgu.parentLGU() ? lgus[lgu.parentLGU()] : regions[lgu.parentRegion()];
      parent.children( parent.children().concat(lgu) );
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

  this.expandAll = function(){
    this.regions().forEach(function(r){
      expandCollapseRecurse(r, true);
    })
  }

  this.collapseAll = function(){
    this.regions().forEach(function(r){
      expandCollapseRecurse(r, false);
    })
  }
}