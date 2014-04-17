admin.controller = function(){
  var self = this;
  this.app = new app.controller();
  this.agencyList = m.prop([]);
  database.pull().then(function(data){
    self.agencyList(database.agencyList());
  });
}