agency.controller = function(){
  var self = this;
  this.app = new app.controller();
  this.slug = m.prop(m.route.param("id"));
  this.agency = m.prop({});
  database.pull().then(function(data){
    this.agency(_.find(database.agencyList(), function(a){
      return a.slug() == this.slug();
    }.bind(this)))
  }.bind(this))
}