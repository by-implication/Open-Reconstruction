requestEdit.view = function(ctrl){

  return app.template(
    ctrl.app,
    "Edit Legacy Request — " + ctrl.request().description,
    {className: "detail"},
    "hello"
  );

}
