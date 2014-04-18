agencyCreation.controller = function(){
  this.app = new app.controller();
  database.pull();

  var self = this;

  this.roles = [
    {id: 0, name: 'LGU'},
    {id: 1, name: 'OCD'},
    {id: 2, name: 'OP'},
  ]

  this.input = {
    name: m.prop(""),
    roleId: m.prop(this.roles[0].id)
  }
  
  this.submit = function(e){
    e.preventDefault();
    console.log(self.input);
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