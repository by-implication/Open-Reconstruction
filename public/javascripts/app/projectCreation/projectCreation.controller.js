projectCreation.controller = function(){
  this.app = new app.controller();
  this.projectType = m.prop("Road");
  this.scopeOfWork = m.prop("Reconstruction");
  this.input = {
    disaster_type: m.prop(""),
    disaster_date: m.prop(""),
    disaster_name: m.prop(""),
    description: m.prop(""),
    location: m.prop(""),
    amount: m.prop(0),
    photographs: m.prop("")
  }

  this.initMap = function(elem, isInit){
    this.app.initMap(elem, isInit, {drawControl: true, scrollWheelZoom: false});
  }.bind(this);
  database.pull();
  m.request({method: "GET", url: "/requests/info"}).then(function(data){
    this.requestCreationInfo = data;
  }.bind(this));
  
  this.submitNewRequest = function(e){
    e.preventDefault();
    m.request({method: "POST", url: "/requests/new", data: this.input}).then(function(r){
      console.log(r);
    })
  }.bind(this);
}
