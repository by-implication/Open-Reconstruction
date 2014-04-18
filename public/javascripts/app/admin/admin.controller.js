admin.controller = function(){
  this.app = new app.controller();
  this.agencyList = m.prop([]);

  m.request({
    method: "GET",
    url: "/agencies/all/meta"
  }).then(function(r){
    this.agencyList(r.agencies);
  }.bind(this))
}