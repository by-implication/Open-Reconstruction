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
  	m("h1", "Projects"),
  	pagination,
  	m("table", [
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
  ]);

}