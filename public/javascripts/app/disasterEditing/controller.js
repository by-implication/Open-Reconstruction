disasterEditing.controller = function(){

  this.app = new app.controller();
  var ctrl = this;

  this.id = m.route.param("id");
  this.typeId = m.prop();
  this.name = m.prop("");
  this.date = m.prop();
  this.htmlDate = m.prop("");
  this.disasterTypes = m.prop([]);
  this.setDate = function(v){
    ctrl.htmlDate(v);
    ctrl.date((new Date(v)).getTime());
  }

  if(ctrl.id){
    bi.ajax(routes.controllers.Disasters.editMeta(ctrl.id)).then(function (r){
      ctrl.disasterTypes(r.disasterTypes);
      ctrl.typeId(r.disaster.typeId);
      ctrl.name(r.disaster.name);
      ctrl.date(r.disaster.date);
      ctrl.htmlDate(helper.toDateValue(r.disaster.date));
    });
  } else {
    bi.ajax(routes.controllers.Disasters.createMeta()).then(function (r){
      ctrl.disasterTypes(r.disasterTypes);
    });
  }

  function getData(){
    return {data: {
      typeId: ctrl.typeId(),
      name: ctrl.name(),
      date: ctrl.date()
    }};
  }

  this.submit = function(e){
    e.preventDefault();
    if(ctrl.id){
      bi.ajax(routes.controllers.Disasters.update(ctrl.id), getData()).then(function (r){
        m.route(routes.controllers.Disasters.index().url);
      });
    } else {
      bi.ajax(routes.controllers.Disasters.insert(), getData()).then(function (r){
        m.route(routes.controllers.Disasters.index().url);
      });
    }
  }

}
