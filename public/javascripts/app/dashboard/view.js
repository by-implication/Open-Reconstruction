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
        ctrl.events().length ?
          m(".card", ctrl.events().map(function (e){
            e.isNew = e.date > ctrl.lastVisit();
            return feedEvent[e.kind](e);
          }))
        : m("h3.empty.center-text", [
            "Nothing in your Feed yet. Do something!"
          ]),
        pagination,
      ];
      
      break;

    }

    case "mine": {

      var pagination = initPagination(function (p){
        return routes.controllers.Dashboard.minePage(p).url;
      });

      tabContent = [
        pagination,
        ctrl.reqs().length ?
          request.listView(ctrl.reqs())
        : m("h3.empty.center-text", [
            "No requests to list."
          ]),
        pagination,
      ];

      break;

    }

    case "pending": {

      var filters = [];
      filters.ASSESSOR = {id: "assessor", label: "Needs assessor"};
      filters.EXECUTOR = {id: "executor", label: "Needs executor"};
      filters.SIGNOFF = {id: "signoff", label: "Needs signoff"};
      filters.ALL = {id: "all", label: "All"};

      filters.push(filters.ALL);
      
      if(ctrl.app.currentUser().govUnit.role != "LGU"){
        filters.push(filters.SIGNOFF);
      }

      if(ctrl.app.isSuperAdmin()){
        filters.push(filters.ASSESSOR);
      } else if(!(ctrl.app.isDBM() || ctrl.app.isOP())){
        filters.push(filters.EXECUTOR);
      }

      var pagination = initPagination(function (p){
        return routes.controllers.Dashboard.pendingPage(ctrl.filter, p).url;
      });

      tabContent = [
        m("ul.filters.inline.text-center", filters.map(function (f){
          return m("li.filter", {
            className: (ctrl.filter == f.id) ? "active" : ""
          }, [
            m("a", {
              config: m.route,
              href: routes.controllers.Dashboard.pendingPage(f.id, 1).url
            }, f.label)
          ]);
        })),
        pagination,
        ctrl.reqs().length ?
          request.listView(ctrl.reqs())
        : m("h3.empty.center-text", [
            "No requests to list."
          ]),
        pagination,
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
            common.tabs.menu(ctrl.tabs, {className: "switch"})
          ]),
        ]),
        m(".row", [
          m(".columns.medium-12", tabContent)
        ]),
      ]),
    ]
  );

}
