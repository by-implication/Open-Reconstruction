requestListing.view = function(ctrl){
  var pagination = function(){
    var adjacentPages = 3;
    var displayedPages = 1 + 2 * adjacentPages + 2 + 2;
    var allowance = 1 + 2 + adjacentPages;

    var pagesToDisplay = function() {
      var pageCount = ctrl.maxPage();
      var pageNum = ctrl.page;
      var pages = [];
      if(pageCount <= displayedPages) {
        pages = _.range(1, pageCount+1);
      }
      else {
        pages.push(1);
        if(pageNum <= allowance) {
          pages = pages.concat(_.range(2, displayedPages - 2));
          pages.push("...");
        }
        else if(pageNum <= pageCount - allowance) {
          pages.push("...");
          pages = pages.concat(_.range(pageNum - adjacentPages, pageNum + adjacentPages + 1));
          pages.push("...");
        }
        else {
          pages.push("...");
          pages = pages.concat(_.range(pageCount - displayedPages + 3, pageCount));
        }
        pages.push(pageCount);
      }
      return pages;
    }

    return m("ul.pagination", [
      m("li.arrow",{className: ctrl.page === 0 ? "unavailable" : ""}, [
        m("a", {
          href: routes.controllers.Requests.indexPage(ctrl.tab, ctrl.page - 1, ctrl.projectTypeId, ctrl._queryLocFilters, ctrl.sort, ctrl.sortDir).url,
          config: m.route
        }, [
          "«"
        ]),
      ]),
      _.chain(pagesToDisplay())
        .map(function(page){
          if(page == "...") {
            return m("li.unavailable", m("a", "..."));
          }
          else {
            return m("li", {className: page === ctrl.page ? "current" : ""}, [
              m("a", {
                href: routes.controllers.Requests.indexPage(ctrl.tab, page, ctrl.projectTypeId, ctrl._queryLocFilters, ctrl.sort, ctrl.sortDir).url,
                config: m.route
              }, page)
            ])
          }
        })
        .value(),
      m("li.arrow",{className: ctrl.page === ctrl.maxPage() ? "unavailable" : ""}, [
        m("a", {
          href: routes.controllers.Requests.indexPage(ctrl.tab, ctrl.page + 1, ctrl.projectTypeId, ctrl._queryLocFilters, ctrl.sort, ctrl.sortDir).url,
          config: m.route
        },[
          "»"
        ]),
      ]),
    ])
  }
  return app.template(ctrl.app, [
    common.banner("Requests"),
    ctrl.app.isAuthorized(process.permissions.CREATE_REQUESTS) ?
      m("section#new-request-banner", [
        m(".row", [
          m(".columns.medium-12", [
            m("h2.left", [
              "Make a new request. We're here to help."
            ]),
            m(
              "a.button.right",
              {href: routes.controllers.Requests.create().url, config: m.route},
              "New Request"
            )
          ]),
        ]),
      ])
    : "",
    m("section", [
      m.cookie().logged_in ?
        m(".row", [
          m(".columns.medium-12", [
            common.tabs.menu(ctrl.tabs, {className: "left", config: ctrl.setCurrentTab})
          ]),
        ]) : "",
      m(".row", [
        m(".columns.medium-9", [
          pagination(),
          common.tabs.content(ctrl.tabs),
          pagination(),
        ]),
        m(".columns.medium-3", [
          m("h4", [
            "Filter by Location"
          ]),
          ctrl.locFilters.map(function (f){
            return m("label", [
              f.label,
              select2.view({data: f.data, value: f.value(), onchange: f.onchange.bind(f)})
            ])
          }),
          m("h4", [
            "Filter by Project Type"
          ]),
          m("ul.filters",
            _.chain(ctrl.projectFilters)
            .map(function (filter){
              return m("li.filter",{className: (ctrl.projectTypeId == filter.id) ? "active" : ""}, [
                m("a", {
                  href: routes.controllers.Requests.indexPage(ctrl.tab, 1, filter.id, ctrl._queryLocFilters, ctrl.sort, ctrl.sortDir).url,
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
