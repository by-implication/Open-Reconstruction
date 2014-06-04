dashboard.controller = function(){
  var self = this;
  this.app = new app.controller();

  this.requests = m.prop({});
  this.eplc = m.prop({});
  this.saros = m.prop([]);

  this.mostCommonDisasterType = m.prop(0);
  this.mostCommonProjectType = m.prop(0);

  this.requests().byDisasterType = m.prop([]);
  this.requests().byProjectType = m.prop([]);
  this.requests().byMonth = m.prop([]);
  this.requests().byLevel = m.prop([]);
  this.requests().byNamedDisaster = m.prop();

  bi.ajax(routes.controllers.Application.dashboardMeta()).then(function (r){
    self.mostCommonDisasterType(r.mostCommonDisasterType);
    self.mostCommonProjectType(r.mostCommonProjectType);

    self.requests().byLevel(r.byLevel);
    self.requests().byMonth(visualizations.padMonths(r.byMonth));
    self.requests().byDisasterType(r.byDisasterType);
    self.requests().byProjectType(r.byProjectType);
    self.requests().byNamedDisaster(r.byNamedDisaster);
  });

  bi.ajax(routes.controllers.Visualizations.getData("EPLC")).then(function (r){
    self.eplc(r.data);
  });

  bi.ajax(routes.controllers.Visualizations.getData("DBMBureauG")).then(function(r){
    self.saros(r.data);
  })
  
  // this is to make sure charts are ok
  // (ideally) we need a callback when rendering is finished

  window.setTimeout(function(){
    window.onresize();
  },1500);

}
