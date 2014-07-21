dashboard.view = function(ctrl){

  var pagination = common.pagination(
    ctrl.page,
    ctrl.count(),
    ctrl.pageLimit(),
    function (p){
      return routes.controllers.Dashboard.tabPage(ctrl.tab, p).url;
    }
  );

  var tabContent;
  switch(ctrl.tab){

    case "feed": {

      tabContent = [
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
      ];
      
      break;

    }

    default: {

      tabContent = [
        pagination,
        request.listView(ctrl.reqs()),
        pagination,
        !ctrl.reqs().length ?
          m("h3.empty.center-text", [
            "No requests to list."
          ])
        : ""
      ];

    }

  }

  return app.template(
    ctrl.app,
    "Dashboard",
    {className: "detail"},
    [
      common.banner("Dashboard"),
      m("section#new-request-banner", [
        m(".row", [
          m(".columns.medium-12", [
            m("h2.left", [
              "Don't have an existing request? Make a new one."
            ]),
            m("a.button.right",
              {href: routes.controllers.Requests.create().url, config: m.route},
              "New Request"
            ),
          ]),
        ]),
      ]),
      m("section", [
        m(".row", [
          m(".columns.medium-12.text-center", [
            common.tabs.menu(ctrl.tabs, {className: "switch", config: ctrl.setCurrentTab})
          ]),
        ]),
        m(".row", [
          m(".columns.medium-6.medium-centered", tabContent),
        ]),
      ]),
    ]
  );

}
