lguCreation.controller = function(){
  
  this.app = new app.controller();

  this.input = {
    name: m.prop(""),
    acronym: m.prop("")
  }

  this.level = parseInt(m.route.param("level"));
  this.parentId = m.route.param("parentId");
  this.parentName = m.prop("");
  this.lguType = m.prop("");

  switch(this.level){
    case 0: this.lguType("Province"); break;
    case 1: this.lguType("City / Municipality"); break;
    case 2: this.lguType("Barangay"); break;
  }

  m.request({method: "GET", url: "/lgus/new/" + this.level + "/" + this.parentId + "/meta"}).then(function (r){
    this.parentName(r.parentName);
  }.bind(this));

  this.submit = function(e){
    e.preventDefault();
    m.request({method: "POST", data: this.input, config: app.xhrConfig}).then(function (r){
      if(r.success){
        window.location = "/admin/lgus";
      } else if(r.reason == "form error"){
        alert("Agency not created!");
      } else {
        alert(r.reason);
      }
    })
  }.bind(this)
  
}