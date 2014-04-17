admin.controller = function(){
  var self = this;
  this.app = new app.controller();
  database.pull();
}