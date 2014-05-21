requestListing.view = function(ctrl){
  var pagination = function(){
    return m("ul.pagination", [
      m("li.arrow",{className: ctrl.page === 0 ? "unavailable" : ""}, [
        m("a", {
          href: routes.controllers.Requests.indexPage(ctrl.tab, 0, ctrl.projectTypeId).url, 
          config: m.route
        }, [
          "«"
        ]),
      ]),
      _.chain(_.range(0, ctrl.maxPage() + 1))
        .map(function(page){
          return m("li", {className: page === ctrl.page ? "current" : ""}, [
            m("a", {
              href: routes.controllers.Requests.indexPage(ctrl.tab, page, ctrl.projectTypeId).url, 
              config: m.route
            }, [
              page
            ])
          ])
        })
        .value(),
      m("li.arrow",{className: ctrl.page === ctrl.maxPage() ? "unavailable" : ""}, [
        m("a", {
          href: routes.controllers.Requests.indexPage(ctrl.tab, ctrl.maxPage(), ctrl.projectTypeId).url, 
          config: m.route
        },[
          "»"
        ]),
      ]),
    ])
  }
  return app.template(ctrl.app, [
    common.banner("List of Requested Projects"),
    m("section", [

      ctrl.app.currentUser() ?
        m(".row", [
          m(".columns.medium-12", [
            ctrl.app.isAuthorized(process.permissions.CREATE_REQUESTS) ?
              m(
                "a.button", 
                {href: routes.controllers.Requests.create().url, config: m.route}, 
                "New Request"
              )
            : ""
          ]),
        ])
      : "",

      m(".row", [
        m(".columns.medium-12", [
          common.tabs.menu(ctrl.tabs, {className: "left", config: ctrl.setCurrentTab})
        ]),
      ]),
      m(".row", [
        m(".columns.medium-9", [
          // m("a", {
          //   href: routes.controllers.Requests.indexPage(ctrl.tab, 0, ctrl.projectTypeId).url, 
          //   config: m.route
          // }, "<<"),
          // m("a", {
          //   href: routes.controllers.Requests.indexPage(ctrl.tab, Math.max(ctrl.page - 1, 0), ctrl.projectTypeId).url, 
          //   config: m.route
          // }, "<"),
          // m("span", ctrl.page),
          // m("a", {
          //   href: routes.controllers.Requests.indexPage(ctrl.tab, Math.min(ctrl.page + 1, ctrl.maxPage()), ctrl.projectTypeId).url, 
          //   config: m.route
          // }, ">"),
          // m("a", {
          //   href: routes.controllers.Requests.indexPage(ctrl.tab, ctrl.maxPage(), ctrl.projectTypeId).url, 
          //   config: m.route
          // }, ">>"),
          pagination(),
          common.tabs.content(ctrl.tabs),
          pagination(),
        ]),
        m(".columns.medium-3", [
          m("h4", [
            "Filter by Project Type"
          ]),
          m("ul.filters", 
            _.chain(ctrl.projectFilters)
            .map(function (filter){
              return m("li.filter",{className: (ctrl.projectTypeId == filter.id) ? "active" : ""}, [
                m("a", {
                  href: routes.controllers.Requests.indexPage(ctrl.tab, ctrl.page, filter.id).url,
                  config: m.route
                }, filter.name)
              ])
            })
            .value()
          )
        ])
      ])
    ])
  ])
}