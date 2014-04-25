admin.controller = function(){
  this.app = new app.controller();
  this.agencyList = m.prop([]);
  this.roles = m.prop({});
  this.tabs = new common.tabs.controller();
  this.tabs.tabs = m.prop([{label: "Agencies"}, {label: "LGUs"}]);

  m.request({method: "GET", url: ("/agencies/new/meta"), config: app.xhrConfig}).then(function (r){
    if(r.success){
      var roles = _.object(r.roles.map(function(role) {
        return [role.id, role.name];
      }));
      this.roles(roles);
    } else {
      alert(r.reason);
    }
  }.bind(this));

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