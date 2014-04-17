dashboard.view = function(ctrl){
  return app.template(ctrl, [
    m("div#view", [
      common.banner("Dashboard"),
      m("section", [
        m(".row", [
          m(".columns.medium-12", [
            m("h1", [m("small", "Project Status")]),
          ]),
          m(".columns.medium-3", [
            m("h1", ctrl.totalProjects()),
            m("p", "Total number of projects")
          ]),
          m(".columns.medium-3", [
            m("h1", ctrl.totalProjects()),
            m("p", "Pending projects")
          ]),
          m(".columns.medium-3", [
            m("h1", "0"),
            m("p", "Approved projects")
          ]),
          m(".columns.medium-3", [
            m("h1", "0%"),
            m("p", "Percent of approved projects")
          ])
        ])
      ]),
      m("section.alt", [
        m(".row", [
          m(".columns.medium-12", [
            m("h1", [m("small", "Project Costs")])
          ]),
          m(".columns.medium-3", [
            m("h1", ctrl.totalProjectCost()),
            m("p", "Total cost of all projects")
          ]),
          m(".columns.medium-3", [
            m("h1", ctrl.totalProjectCost()),
            m("p", "Cost of pending projects")
          ]),
          m(".columns.medium-3.end", [
            m("h1", "0"),
            m("p", "Amount approved")
          ]),
        ])
      ]),
      m("section", [
        m(".row", [
          m(".columns.medium-12", [
            m("h1", [m("small", "Trends")])
          ]),
          m(".columns.medium-3", [
            m("h1", ctrl.mostCommonProjectType()[0]),
            m("p", "Most common project type")
          ]),
          m(".columns.medium-3", [
            m("h1", ctrl.mostCommonDisasterType()[0]),
            m("p", "Most common disaster type")
          ]),
          m(".columns.medium-3.end", [
            m("h1", "You"),
            m("p", "Most awesome person")
          ])
        ])
      ]),
      m("section.alt", [
        m(".row", [
          m(".columns.medium-12", [
            m("h1", [m("small", "History")]),
            m("h4.text-center", "The number of requests per month plotted against amount"),
            m("canvas#chart", {config: ctrl.chartInit, width: 970, height: 300}),
            m("div.legend", [
              m("p", [
                m("div.swatch.black"),
                m("span", "Number of requests")
              ]),
              m("p", [
                m("div.swatch.orange"),
                m("span", "Amount (In 100 millions)")
              ])
            ])
          ])
        ])
      ])
    ])
  ])
}