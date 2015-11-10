/*
 * Copyright (c) 2014 By Implication, Inc. under the terms of the
 * ISC license found in LICENSE.txt
 */

userCreation.controller = function(){
  this.app = new app.controller();
  this.slug = m.prop(m.route.param("id"));
  this.govUnit = m.prop({});

  var ctrl = this;

  bi.ajax(routes.controllers.GovUnits.viewMeta(this.slug(), "users", 1)).then(function (r){
    this.govUnit(r.govUnit);
  }.bind(this));

  this.entries = [];

  this.submit = function(e){
    e.preventDefault();
    bi.ajax(routes.controllers.Users.insert(this.slug()), {data: {users: this.entries}}).then(function (r){
      m.route(routes.controllers.GovUnits.view(this.slug()).url);
    }.bind(this), common.formErrorHandler);
  }.bind(this)

  this.newEntry = function(){
    var entry = {
      name: m.prop(""),
      handle: m.prop(""),
      password: m.prop(""),
      isAdmin: m.prop(false),
      remove: function(){
        ctrl.removeEntry(entry);
      }
    }
    ctrl.entries.push(entry)
  }

  this.newEntry();

  this.removeEntry = function (e){
    ctrl.entries.splice(ctrl.entries.indexOf(e), 1);
  }
}