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
      pagination,
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
      pagination
    ]
  )

}
