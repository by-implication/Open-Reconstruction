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
        pages = _.range(0, pageCount);
      }
      else {
        pages.push(0);
        if(pageNum <= allowance) {
          pages = pages.concat(_.range(1, displayedPages - 2));
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
          href: routes.controllers.Requests.indexPage(ctrl.tab, ctrl.page - 1, ctrl.projectTypeId, ctrl._queryLocFilters).url,
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
                href: routes.controllers.Requests.indexPage(ctrl.tab, page, ctrl.projectTypeId, ctrl._queryLocFilters).url,
                config: m.route
              }, [
                page + 1
              ])
            ])
          }
        })
        .value(),
      m("li.arrow",{className: ctrl.page === ctrl.maxPage() ? "unavailable" : ""}, [
        m("a", {
          href: routes.controllers.Requests.indexPage(ctrl.tab, ctrl.page + 1, ctrl.projectTypeId, ctrl._queryLocFilters).url,
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

      ctrl.app.isAuthorized(process.permissions.CREATE_REQUESTS) ?
        m(".row", [
          m(".columns.medium-12", [
            m(
              "a.button",
              {href: routes.controllers.Requests.create().url, config: m.route},
              "New Request"
            )
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
                  href: routes.controllers.Requests.indexPage(ctrl.tab, ctrl.page, filter.id, ctrl._queryLocFilters).url,
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
