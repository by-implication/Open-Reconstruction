login.controller = function(){
  this.app = new app.controller();
  this.input = {
    handle: m.prop(""),
    password: m.prop("")
  }
  database.pull();
  var self = this;
  this.submit = function(e){
    e.preventDefault();
    bi.ajax(routes.controllers.Users.authenticate(), {data: self.input}).then(function (r){
      if(r.success){
        window.location = '/';
      } else if(r.reason == "form error"){
        alert("Invalid credentials.");
      } else {
        alert(r.reason);
      }
    })
  }
}