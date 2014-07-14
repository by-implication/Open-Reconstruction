feed.view = function(ctrl){

  return app.template(
    ctrl.app,
    "Feed",
    {className: "detail"},
    [
      common.banner("Feed"),
      m("section", [
        m(".row", [
          m(".columns.medium-6.medium-centered", [
            m(".card",
              ctrl.events().map(function (e){
                e.isNew = e.date > ctrl.lastVisit();
                return feedEvent[e.kind](e);
              })
            )
          ]),
        ]),
      ]),
    ]
  )

}
