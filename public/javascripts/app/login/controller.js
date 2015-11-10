/*
 * Copyright (c) 2014 By Implication, Inc. under the terms of the
 * ISC license found in LICENSE.txt
 */

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
      m.route(routes.controllers.Application.index().url);
    }, common.formErrorHandler)
  }
}