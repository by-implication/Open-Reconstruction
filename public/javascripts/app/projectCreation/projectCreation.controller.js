projectCreation.controller = function(){
  this.app = new app.controller();
  
  this.input = {
    amount: m.prop(0),
    attachments: m.prop([]),
    date: m.prop(""),
    description: m.prop(""),
    disasterDate: m.prop(""),
    disasterName: m.prop(""),
    disasterType: m.prop(""),
    location: m.prop(""),
    projectType: m.prop("Road"),
    scopeOfWork: m.prop("Reconstruction")
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
    m.request({method: "POST", url: "/requests/new", data: this.input, config: app.xhrConfig}).then(function(r){
      if(r.success){
        window.location = '/';
      } else if(r.reason == "form error"){
        alert("Request not created!");
      } else {
        alert(r.reason);
      }
    })
  }.bind(this);
}
