user.view = function(ctrl){

  var pagination = common.pagination(
    ctrl.page,
    ctrl.requestCount(),
    ctrl.pageLimit(),
    function (p){
      return routes.controllers.Users.viewPage(ctrl.id, p).url
    }
  );

  return app.template(ctrl.app, "User — " + ctrl.user().name, [
    common.banner(ctrl.user().name),
    m("section", [
      m(".row", [
        m(".columns.medium-9", [
          m("div", [
            "Government Unit",
            m("h3", [
              ctrl.user().govUnit.name
            ]),
          ]),
          m("hr.dashed"),
          m("div", [
            m("h1",[m("small", "List of projects requested by this user (" + ctrl.requestCount() + ")")]),
            pagination,
            request.listView(ctrl.requestList(), ctrl.sortBy)
          ])
        ])
      ])
    ]),
  ])
}