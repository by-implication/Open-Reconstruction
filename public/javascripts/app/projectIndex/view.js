/*
 * Copyright (c) 2014 By Implication, Inc. under the terms of the
 * ISC license found in LICENSE.txt
 */

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
    m("section.banner", [
      m(".row", [
        m(".columns.medium-12", [
          m("dl.tabs.switch.reverse.right", [
            m("dd", [
              m("a", {href: routes.controllers.Requests.index().url, config: m.route}, [
                "Requests"
              ]),
            ]),
            m("dd.active", [
              m("a", [
                "Projects"
              ]),
            ]),
          ]),
          m("h1", [
            "Browsing projects for implementation"
          ]),
        ]),
      ]),
    ]),
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
                  "Request ID"
                ]),
                m("td", [
                  "Scope"
                ]),
                m("td", [
                  "Amount"
                ]),
                m("td", [
                  "Bid Price"
                ]),
                m("td", [
                  "Contract ID"
                ]),
                m("td", [
                  "Contract Cost"
                ]),
                m("td", [
                  "Contract Start"
                ]),
                m("td", [
                  "Contract End"
                ]),
              ]),
            ]),
            m("tbody",
              ctrl.projects().map(function (p){
                console.log(p);
                return m("tr", [
                  m("td", [
                    // m("a", {href: routes.controllers.Projects.view(p.id).url}, [
                      p.id
                    // ])
                  ]),
                  m("td", [
                    // m("a", {href: routes.controllers.Projects.view(p.id).url}, [
                      p.name
                    // ])
                  ]),
                  m("td", [
                    m("a", {href: routes.controllers.Requests.view(p.reqId).url, config: m.route}, [
                      p.reqId
                    ])
                  ]),
                  m("td", [
                    p.scope
                  ]),
                  m("td", [
                    helper.commaize(p.amount)
                  ]),
                  m("td", [
                    p.bidPrice || "N/A"
                  ]),
                  m("td", [
                    p.projectContractId
                  ]),
                  m("td", [
                    p.contract.cost || "N/A"
                  ]),
                  m("td", [
                    (p.contract.start && new Date(p.contract.start).toDateString()) || "N/A"
                  ]),
                  m("td", [
                    (p.contract.end && new Date(p.contract.end).toDateString()) || "N/A"
                  ]),
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