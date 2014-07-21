dashboard.view = function(ctrl){

  function initPagination(f){
    return common.pagination(ctrl.page, ctrl.count(), ctrl.pageLimit(), f);
  }

  var tabContent;
  switch(ctrl.tab){

    case "feed": {

      var pagination = initPagination(function (p){
        return routes.controllers.Dashboard.feedPage(p).url;
      });

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

    case "mine": {

      var pagination = initPagination(function (p){
        return routes.controllers.Dashboard.minePage(p).url;
      });

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

      break;

    }

    case "pending": {

      var filters = [];
      filters.ASSESSOR = {id: "assessor", label: "Needs assessor"};
      filters.EXECUTOR = {id: "executor", label: "Needs executor"};
      filters.SIGNOFF = {id: "signoff", label: "Needs signoff"};

      filters.push(filters.SIGNOFF);
      if(ctrl.app.isSuperAdmin()){
        filters.push(filters.ASSESSOR);
      } else if(!(ctrl.app.isDBM() || ctrl.app.isOP())){
        filters.push(filters.EXECUTOR);
      }

      var pagination = initPagination(function (p){
        return routes.controllers.Dashboard.pendingPage(ctrl.filter, p).url;
      });

      tabContent = [
        filters.map(function (f){
          return m("a", {
            className: (ctrl.filter == f.id) ? "active" : "",
            config: m.route,
            href: routes.controllers.Dashboard.pendingPage(f.id, 1).url
          }, f.label);
        }),
        pagination,
        request.listView(ctrl.reqs()),
        pagination,
        !ctrl.reqs().length ?
          m("h3.empty.center-text", [
            "No requests to list."
          ])
        : ""
      ];

      break;

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
          m(".columns.medium-6.medium-centered", tabContent)
        ]),
      ]),
    ]
  );

}
