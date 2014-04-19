projectCreation.controller = function(){
  this.app = new app.controller();
  
  this.input = {
    amount: m.prop(0),
    attachments: m.prop([]),
    date: m.prop(""),
    description: m.prop(""),
    disasterDate: m.prop("2001-1-1"),
    disasterName: m.prop(""),
    disasterType: m.prop(""),
    location: m.prop(""),
    projectType: m.prop("Road"),
    scopeOfWork: m.prop("Reconstruction")
  }

  this.initMap = function(elem, isInit){
    this.app.initMap(elem, isInit, {scrollWheelZoom: false}, true);
  }.bind(this);
  m.request({method: "GET", url: "/requests/info"}).then(function(data){
    this.requestCreationInfo = data;
  }.bind(this));

  this.disasterDate = [2001, 1, 1];
  this.updateDateField = function(e){
    var i = ["disaster-year", "disaster-month", "disaster-day"].indexOf(e.srcElement.id);
    this.disasterDate[i] = e.srcElement.value;
    this.input.disasterDate(this.disasterDate.join("-"));
  }.bind(this);

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
