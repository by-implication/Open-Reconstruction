dashboard.controller = function(){
  var self = this;
  this.app = new app.controller();

  this.mostCommonDisasterType = m.prop(0);
  this.mostCommonProjectType = m.prop(0);
  this.byDisasterType = m.prop([]);
  this.byProjectType = m.prop([]);
  this.byMonth = m.prop([]);
  this.byLevel = m.prop([]);
  this.byNamedDisaster = m.prop();

  m.startComputation();
  bi.ajax(routes.controllers.Application.dashboardMeta()).then(function (r){
    self.mostCommonDisasterType(r.mostCommonDisasterType);
    self.mostCommonProjectType(r.mostCommonProjectType);
    self.byLevel(r.byLevel);
    self.byMonth(visualizations.padMonths(r.byMonth));
    self.byDisasterType(r.byDisasterType);
    self.byProjectType(r.byProjectType);
    self.byNamedDisaster(r.byNamedDisaster);
    m.endComputation();
  });

  this.projectHistory = visualizations.library['requestHistory'](self);
  this.disasterHistory = visualizations.library['disasterHistory'](self);
  this.projectTypes = visualizations.library['projectTypes'](self);
  this.topDisasters = visualizations.library['topDisasters'](self);
  this.topDisastersAmount = visualizations.library['topDisastersAmount'](self);
}
