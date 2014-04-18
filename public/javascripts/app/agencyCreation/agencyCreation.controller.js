agencyCreation.controller = function(){
  this.app = new app.controller();
  database.pull();

  var self = this;

  this.roles = m.prop([{id: 0, name: 'Loading...'}]);

  m.request({method: "GET", url: ("/agencies/new/meta"), config: app.xhrConfig}).then(function (r){
    if(r.success){
      self.roles(r.roles);
    } else {
      alert(r.reason);
    }
  });

  this.input = {
    name: m.prop(""),
    acronym: m.prop(""),
    roleId: m.prop(this.roles()[0].id)
  }
  
  this.submit = function(e){
    e.preventDefault();
    m.request({method: "POST", url: "/agencies/new", data: self.input, config: app.xhrConfig}).then(function (r){
      if(r.success){
        window.location = '/';
      } else if(r.reason == "form error"){
        alert("Agency not created!");
      } else {
        alert(r.reason);
      }
    })
  }
}