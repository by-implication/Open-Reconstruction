projectIndex.view = function(ctrl){

	var pagination = common.pagination(
	  ctrl.page,
	  ctrl.count(),
	  ctrl.pageLimit(),
	  function (p){
	    return routes.controllers.Projects.indexPage(p).url;
	  }
	);

  return app.template(ctrl.app, "Projects", [
    common.banner("Projects for implementation"),
    m("section", [
      m(".row", [
        m(".columns.medium-12", [
          m("p.help", [
            "These are entries from agency project management systems (PMS). These are in a separate list from the request list because this comes from a different data source. Requests contain references to these projects."
          ]),
          pagination,
          m("table.responsive", [
            m("thead", [
              m("tr", [
                m("td", [
                  "Id"
                ]),
                m("td", [
                  "Name"
                ]),
                m("td", [
                  "Scope"
                ]),
                m("td", [
                  "Amount"
                ])
              ]),
            ]),
            m("tbody",
              ctrl.projects().map(function (p){
                return m("tr", [
                  m("td", [
                    m("a", {href: routes.controllers.Projects.view(p.id).url}, [
                      p.id
                    ])
                  ]),
                  m("td", [
                    m("a", {href: routes.controllers.Projects.view(p.id).url}, [
                      p.name
                    ])
                  ]),
                  m("td", [
                    p.scope
                  ]),
                  m("td", [
                    helper.commaize(p.amount)
                  ])
                ])
              })
            ),
          ]),
          pagination
        ]),
      ]),
    ]),
  ]);
}