feed.view = function(ctrl){

  var pagination = common.pagination(
    ctrl.page,
    ctrl.count(),
    ctrl.pageLimit(),
    function (p){
      return routes.controllers.Feed.indexPage(p).url;
    }
  );

  return app.template(
    ctrl.app,
    "Feed",
    {className: "detail"},
    [
      common.banner("Feed"),
      m("section", [
        m(".row", [
          m(".columns.medium-6.medium-centered", [
            pagination,
            m(".card", ctrl.events().map(function (e){
              e.isNew = e.date > ctrl.lastVisit();
              return feedEvent[e.kind](e);
            })),
            pagination,
            !ctrl.events().length ?
              m("h3.empty.center-text", [
                "Nothing in your Feed yet. Do something!"
              ])
            : ""
          ]),
        ]),
      ]),
    ]
  )
}
