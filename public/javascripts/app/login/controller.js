login.controller = function(){
  this.app = new app.controller();
  this.input = {
    handle: m.prop(""),
    password: m.prop("")
  }

  var self = this;
  this.submit = function(e){
    e.preventDefault();
    bi.ajax(routes.controllers.Users.authenticate(), {data: self.input}).then(function (r){
      window.location = '/';
    }, function (r){
      if(r.reason == "form error"){
        alert("Invalid credentials.");
      } else {
        alert(r.reason);
      }
    })
  }
}