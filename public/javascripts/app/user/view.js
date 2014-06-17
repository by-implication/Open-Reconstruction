user.view = function(ctrl){

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
          href: routes.controllers.Users.viewPage(ctrl.id, ctrl.page - 1).url,
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
                href: routes.controllers.Users.viewPage(ctrl.id, page).url,
                config: m.route
              }, page)
            ])
          }
        })
        .value(),
      m("li.arrow",{className: ctrl.page === ctrl.maxPage() ? "unavailable" : ""}, [
        m("a", {
          href: routes.controllers.Users.viewPage(ctrl.id, ctrl.page + 1).url,
          config: m.route
        },[
          "»"
        ]),
      ]),
    ])
  }

  return app.template(ctrl.app, [
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
          ctrl.app.isUserAuthorized(ctrl.user(), 1) ?
            m("div", [
              m("h1",[m("small", "List of projects requested by this user (" + ctrl.requestCount() + ")")]),
              pagination(),
              request.listView(ctrl.requestList(), ctrl.sortBy)
            ])
          : ""
        ])
      ])
    ]),
  ])
}