project.view = function(ctrl){

  return app.template(ctrl.app, "Project — " + ctrl.project().name, [
    JSON.stringify(ctrl.project())
  ]);

}