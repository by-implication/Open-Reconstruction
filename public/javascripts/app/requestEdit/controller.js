requestEdit.controller = function(){

  var ctrl = this;
  this.app = new app.controller();
  this.request = m.prop({});
  this.id = m.route.param("id");
	this.status = m.prop();
  this.date = m.prop();
	this.htmlDate = m.prop();
	this.saroNo = m.prop();

	this.submit = function(e){
		e.preventDefault();
		console.log('submit!');
	}

  bi.ajax(routes.controllers.Requests.editMeta(this.id)).then(function (r){
  	ctrl.status(r.status);
  	ctrl.date(r.date);
    ctrl.htmlDate(helper.toDateValue(r.date));
  	ctrl.saroNo(r.saroNo);
  });

}
