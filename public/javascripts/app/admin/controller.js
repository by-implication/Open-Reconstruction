admin.controller = function(){
  var ctrl = this;
  this.app = new app.controller();
  this.tabs = new common.tabs.controller();
  this.tabs.tabs = m.prop([
    {label: m.prop("Agencies"), href: routes.controllers.Application.adminAgencies().url}, 
    {label: m.prop("LGUs"), href: routes.controllers.Application.adminLgus().url},
    {label: m.prop("Project Types"), href: routes.controllers.Admin.projectTypes().url},
    {label: m.prop("Disaster Types"), href: routes.controllers.Admin.disasterTypes().url},
    {label: m.prop("Disasters"), href: routes.controllers.Disasters.index().url},
    {label: m.prop("Requirements"), href: routes.controllers.Requirements.index().url}
  ]);

  if(m.route().split("/")[2] == "types"){

    this.degs = {
      projectTypes: m.prop([]),
      disasterTypes: m.prop([])
    }

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
            common.formErrorHandler(r);
            c();
          });
        }, null, {value: m.prop(t.name)});
        return deg;
      }
    }

    this.typeName = m.prop("");
    var createType = function(type){
      return function (e){
        e.preventDefault();
        if(ctrl.typeName()){
          bi.ajax(routes.controllers.Admin.insertType(type), {data: {name: ctrl.typeName()}})
          .then(function (r){
            this[type + "Types"]().push(degMaker(type)(r[type + "Type"]));
            alert("Successfully created new " + type + " type.");
          });
        } else {
          alert("Empty input.");
        }
      };
    };

  }

  switch(this.tabs.currentTab()){

    case "Agencies": {
      this.agencyList = m.prop([]);
      bi.ajax(routes.controllers.GovUnits.listAgencies()).then(function (r){
        ctrl.agencyList(r.agencies);
      });
      break;
    }

    case "LGUs": {
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
      this.regions = m.prop([]);
      bi.ajax(routes.controllers.GovUnits.listLgus()).then(function (r){
        var regions = [];
        r.regions
          .map(function(r){
            return new govUnit.Region(r);
          })
          .forEach(function (region){
            regions[region.id()] = region;
          });
        ctrl.regions(regions);
      });
      break;
    }

    case "Project Types": {
      this.createProjectType = createType("project");
      bi.ajax(routes.controllers.Admin.projectTypesMeta()).then(function (r){
        ctrl.degs.projectTypes(r.map(degMaker("project")));
      });
      break;
    }

    case "Disaster Types": {
      this.disasterTypes = m.prop([]);
      this.createDisasterType = createType("disaster");
      bi.ajax(routes.controllers.Admin.disasterTypesMeta()).then(function (r){
        ctrl.disasterTypes(r);
        ctrl.degs.disasterTypes(r.map(degMaker("disaster")));
      });
      break;
    }
  
    case "Disasters": {
      this.disasterTypes = m.prop([]);
      this.disasters = m.prop([]);
      bi.ajax(routes.controllers.Disasters.indexMeta()).then(function (r){
        ctrl.disasterTypes(r.disasterTypes);
        ctrl.disasters(r.disasters);
      });
      break;
    }

    case "Requirements": {
      this.reqts = m.prop([]);
      this.modal = new common.modal.controller({
        openWithValues: function(reqt){
          reqt = reqt || {};
          ctrl.modal.input = {
            id: m.prop(reqt.id),
            name: m.prop(reqt.name || ""),
            description: m.prop(reqt.description || ""),
            level: m.prop(reqt.level || 0),
            target: m.prop(reqt.target || ""),
            isImage: m.prop(reqt.isImage)
          };
          ctrl.modal.open();
        },
        submit: function(e){
          e.preventDefault();
          bi.ajax(routes.controllers.Requirements.upsert(), {data: ctrl.modal.input}).then(function (r){
            var id = ctrl.modal.input.id()
            var rs = ctrl.reqts();
            if(id){
              for(var i in rs){
                if(rs[i].id == id){
                  rs[i] = r.reqt;
                  break;
                }
              }
            } else {
              rs.push(r.reqt);
            }
            ctrl.modal.close();
          });
        }
      });
      function Reqt(init){
        var reqt = this;
        _.extend(this, init);
        this.deprecate = function(){
          bi.ajax(routes.controllers.Requirements.deprecate(reqt.id)).then(function (r){
            var rs = ctrl.reqts();
            rs.splice(rs.indexOf(reqt), 1);
          });
        };
        this.edit = function(){
          ctrl.modal.openWithValues(reqt);
        }
        return this;
      }
      bi.ajax(routes.controllers.Requirements.indexMeta()).then(function (r){
        ctrl.reqts(r.reqts.map(function (init){ return new Reqt(init); }));
      });
      break;
    }

  }

}