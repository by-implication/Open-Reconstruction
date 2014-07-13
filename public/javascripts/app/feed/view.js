feed.view = function(ctrl){

  return app.template(
    ctrl.app,
    "Feed",
    {className: "detail"},
    [
      common.banner("Feed"),
      m("section", [
        m(".row", [
          m(".columns.medium-12", [
            m("div",
              ctrl.events().map(function (e){
                return feedEvent[e.kind](e);
              })
            )
          ]),
        ]),
      ]),
    ]
  )

}
