/*
 * Copyright (c) 2014 By Implication, Inc. under the terms of the
 * ISC license found in LICENSE.txt
 */

project.view = function(ctrl){

  return app.template(ctrl.app, "Project — " + ctrl.project().name, [
    JSON.stringify(ctrl.project())
  ]);

}