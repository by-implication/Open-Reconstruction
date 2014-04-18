agencyCreation.controller = function(){
  this.app = new app.controller();
  database.pull();

  var self = this;

  this.roles = [
    {id: 1, name: 'LGU'},
    {id: 2, name: 'OCD'},
    {id: 3, name: 'OP'},
    {id: 4, name: 'DPWH'},
    {id: 5, name: 'DBM'},
    {id: 6, name: 'NGA'}
  ]

  this.input = {
    name: m.prop(""),
    acronym: m.prop(""),
    roleId: m.prop(this.roles[0].id)
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