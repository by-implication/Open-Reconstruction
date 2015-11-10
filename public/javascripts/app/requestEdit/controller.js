/*
 * Copyright (c) 2014 By Implication, Inc. under the terms of the
 * ISC license found in LICENSE.txt
 */

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
		bi.ajax(routes.controllers.Requests.update(ctrl.id), {data: {
      status: ctrl.status(),
      date: ctrl.date(),
      saroNo: ctrl.saroNo()
    }}).then(function (r){
      m.route(routes.controllers.Requests.view(ctrl.id).url);
    });
	}

  bi.ajax(routes.controllers.Requests.editMeta(ctrl.id)).then(function (r){
  	ctrl.status(r.status);
  	ctrl.date(r.date);
    ctrl.htmlDate(helper.toDateValue(r.date));
  	ctrl.saroNo(r.saroNo);
  });

}
