dashboard.controller = function(){
  var self = this;
  this.app = new app.controller();

  this.requests = m.prop({});
  this.projects = m.prop({});
  this.saros = m.prop({});

  this.mostCommonDisasterType = m.prop(0);
  this.mostCommonProjectType = m.prop(0);

  this.requests().byDisasterType = m.prop([]);
  this.requests().byProjectType = m.prop([]);
  this.requests().byMonth = m.prop([]);
  this.requests().byLevel = m.prop([]);
  this.requests().byNamedDisaster = m.prop();

  this.projects().byMonth = m.prop([]);

  m.startComputation();
  bi.ajax(routes.controllers.Application.dashboardMeta()).then(function (r){
    self.mostCommonDisasterType(r.mostCommonDisasterType);
    self.mostCommonProjectType(r.mostCommonProjectType);

    self.requests().byLevel(r.byLevel);
    self.requests().byMonth(visualizations.padMonths(r.byMonth));
    self.requests().byDisasterType(r.byDisasterType);
    self.requests().byProjectType(r.byProjectType);
    self.requests().byNamedDisaster(r.byNamedDisaster);
    m.endComputation();
  });

  bi.ajax(routes.controllers.Visualizations.getData("EPLC")).then(function (r){
    self.projects(r.data);
    var ctrl = self;
    var proto = _.chain(ctrl.projects())
      .filter(function(p){
        return p["contract_start_date"];
      })
      .map(function(p){
        var proj = {};
        var date = new Date(p["contract_start_date"]);
        var month = date.getMonth() + 1;
        var paddedMonth = ("0" + month).slice (-2); 
        proj.yearMonth = date.getFullYear() + "-" + paddedMonth;
        proj.count = 1;
        return proj;
      })
      .groupBy(function(p){
        return p.yearMonth
      })
      .map(function(p, k){
        return {
          yearMonth: k,
          count: p.length,
          amount: 0
        }
      })
      .value()
    // console.log(JSON.stringify(proto));

  });

  bi.ajax(routes.controllers.Visualizations.getData("DBMBureauG")).then(function(r){
    self.saros(r.data);
  })

  this.projectHistory = visualizations.library['requestHistory'](self);
  this.disasterHistory = visualizations.library['disasterHistory'](self);
  this.projectTypes = visualizations.library['projectTypes'](self);
  this.topDisasters = visualizations.library['topDisasters'](self);
  this.topDisastersAmount = visualizations.library['topDisastersAmount'](self);
}
