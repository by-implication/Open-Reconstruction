lguCreation.controller = function(){
  
  this.app = new app.controller();

  this.input = {
    name: m.prop(""),
    acronym: m.prop("")
  }

  this.parentId = m.route.param("parentId");
  this.parentName = m.prop("");

  m.request({method: "GET", url: "/lgus/new/" + this.parentId + "/meta"}).then(function (r){
    this.parentName(r.parentName);
  }.bind(this));

  this.submit = function(e){
    e.preventDefault();
    m.request({method: "POST", data: this.input, config: app.xhrConfig}).then(function (r){
      if(r.success){
        window.location = '/';
      } else if(r.reason == "form error"){
        alert("Agency not created!");
      } else {
        alert(r.reason);
      }
    })
  }.bind(this)
  
}