/*
 * Copyright (c) 2014 By Implication, Inc. under the terms of the
 * ISC license found in LICENSE.txt
 */

project.controller = function(){
  
  var ctrl = this;
  this.app = new app.controller();
  this.id = m.route.param("id");
  this.project = m.prop({});

  bi.ajax(routes.controllers.Projects.viewMeta(this.id)).then(function (r){
    ctrl.project(r.project);
  });

}