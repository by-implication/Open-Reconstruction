projectCreation.controller = function(){
  this.app = new app.controller();
  this.projectType = m.prop("Road");
  this.scopeOfWork = m.prop("Reconstruction");
  this.initMap = function(elem, isInit){
    this.app.initMap(elem, isInit, {drawControl: true, scrollWheelZoom: false});
  }.bind(this);
  database.pull();
}
