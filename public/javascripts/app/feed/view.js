feed.view = function(ctrl){

  return app.template(
    ctrl.app,
    "Feed",
    {className: "detail"},
    [
      m("h1", "Feed"),
      m("div",
        ctrl.events().map(function (e){
          return historyEvent[e.kind].bind(ctrl)(e);
        })
      )
    ]
  )

}
