/*
 * Copyright (c) 2014 By Implication, Inc. under the terms of the
 * ISC license found in LICENSE.txt
 */

agencyCreation.controller = function(){
  this.app = new app.controller();

  var self = this;

  this.roles = m.prop([{id: 0, name: 'Loading...'}]);

  bi.ajax(routes.controllers.GovUnits.createAgencyMeta()).then(function (r){
    self.roles(r.roles);
  });

  this.input = {
    name: m.prop(""),
    acronym: m.prop(""),
    roleId: m.prop(this.roles()[0].id)
  }
  
  this.submit = function(e){
    e.preventDefault();
    bi.ajax(routes.controllers.GovUnits.insertAgency(), {data: self.input}).then(function (r){
      m.route(routes.controllers.GovUnits.view(r.id).url);
    }, common.formErrorHandler)
  }
}