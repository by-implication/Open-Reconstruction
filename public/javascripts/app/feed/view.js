feed.view = function(ctrl){

  return app.template(
    ctrl.app,
    "Feed",
    {className: "detail"},
    ['Feed']
  )

}
