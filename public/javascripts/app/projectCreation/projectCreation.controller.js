projectCreation.controller = function(){
  this.app = new app.controller();
  this.projectType = m.prop("Road");
  this.scopeOfWork = m.prop("Reconstruction");
  this.initMap = function(elem, isInit){
    this.app.initMap(elem, isInit, {drawControl: true, scrollWheelZoom: false});
  }.bind(this);
  database.pull();
  m.request({method: "GET", url: "/requests/info"}).then(function(data){
    this.requestCreationInfo = data;
  }.bind(this));

  this.input = {
    disaster_date: "1/1/2001"
  }

  this.disasterDate = [1, 1, 2001];
  this.updateDateField = function(e){
    var i = ["disaster-month", "disaster-day", "disaster-year"].indexOf(e.srcElement.id);
    this.disasterDate[i] = e.srcElement.value;
    this.input.disaster_date = this.disasterDate.join("/");
  }.bind(this);

  this.submitNewRequest = function(e){
    e.preventDefault();
    m.request({method: "POST", url: "/requests/new"}).then(function(r){
      console.log(r);
    })
  };
}
