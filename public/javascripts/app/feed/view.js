feed.view = function(ctrl){

  return app.template(
    ctrl.app,
    "Feed",
    {className: "detail"},
    [
      common.banner("Feed"),
      m("section", [
        m(".row", [
          m(".card.columns.medium-6.medium-centered", [
            m("div",
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
