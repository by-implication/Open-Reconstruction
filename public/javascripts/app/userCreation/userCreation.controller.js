userCreation.controller = function(){
  this.app = new app.controller();
  this.agencyList = m.prop([]);
  
  m.request({
    method: "GET", 
    url: "/agencies/all/meta", 
    config: app.xhrConfig
  }).then(function (r){
    if(r.success){
      this.agencyList(r.agencies);
    } else {
      alert(r.reason);
    }
  }.bind(this));
}