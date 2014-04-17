admin.controller = function(){
  this.app = new app.controller();
  this.agencyList = m.prop([]);
  database.pull().then(function(data){
    this.agencyList(database.agencyList());
  }.bind(this));
}