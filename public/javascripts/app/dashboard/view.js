dashboard.view = function(ctrl){
  return app.template(ctrl.app, [
    m("div#view.dashboard", [
      common.banner("Dashboard"),
      m("section", [
        m(".row",[
          m(".columns.medium-12",[
            m(".notice",[
              "Some introductory text goes here. Explains that this is a live snapshot of data, but you can access the raw data if you make to make your own visualizations. Other obligatory disclaimers and all that."
            ])
          ])
        ])
      ]),
      m("section.proposals", [
        m(".row", [
          m(".columns.medium-12", [
            m("h1", [m("small", "Project Proposals")]),
          ]),
          m(".columns.medium-3", [
            m("i.fa.fa-file-text-o"),
            m("h3", ctrl.totalProjects()),
            m(".caption", "Proposals Submitted"),
            m("h3", ctrl.totalProjectCost()),
            m(".caption", "Total Cost (PHP)")
          ]),
          m(".columns.medium-3", [
            m("i.fa.fa-search"),
            m("h3", ctrl.pendingProjects()),
            m("span", "Proposals for Assessment"),
            m("h3", ctrl.totalProjectCost()),
            m("span", "Cost of pending projects (PHP)")
          ]),
          m(".columns.medium-3", [
            m("i.fa.fa-check-circle-o"),
            m("h3", "n"),
            m("span", "Proposals for Approval"),
            m("h3", ctrl.amountApproved()),
            m("span", "Total Approved Cost")
          ]),
          m(".columns.medium-3", [
            m("i.fa.fa-money"),
            m("h3", [ctrl.approvedProjects().length, helper.percent(ctrl.percentApproved())]),
            m("span", "Projects for funding"),
            m("h3", "n"),
            m("span", "Amount for disbursal")
          ])
        ])
      ]),
      m("section.alt", [
        m(".row", [
          m(".columns.medium-12", [
            m("h1", [m("small", "Project Proposals per Month")]),
            m("canvas#chart-history", {config: ctrl.chartHistory, height: 170}),
          ]),
          m(".columns.small-6.legend", [
            m("p", [
              m("div.swatch.black"),
              m("span", "Number of proposals submitted")
            ])
          ]),
          m(".columns.small-6.legend", [
            m("p", [
              m("div.swatch.orange"),
              m("span", "Amount (In 100 millions)")
            ])
          ])
        ])
      ]),
      m("section", [
        m(".row", [
          m(".columns.medium-12", [
            m("h1", [m("small", "Projects by Disaster Type")])
          ]),
          m(".columns.medium-8", [
            m("h4", "Projects by disaster types per month"),
            m("canvas#chart-disaster-history", {config: ctrl.chartDisasterHistory, height: 300}),
          ]),
          m(".columns.medium-4", [
            m("h4", "Disaster types breakdown"),
            m("canvas#chart-disaster-pie", {config: ctrl.chartDisasterPie, height: 300}),
          ]),
        ]),
        m(".row", [
          m(".columns.medium-12.list", [
            m("p", "Legends and filters go here."),
            m("p", "Ideally, we should have date range, filter by project type, and by location (region/province).")
          ])
        ])
      ]),
      m("section.alt", [
        m(".row", [
          m(".columns.medium-12", [
            m("h1", [m("small", "Types of Projects")]),
            m("p", "Bar chart of project types (Bridge, River Control, etc.)"),
            m("p", "There are 15, so horizontal is probably best."),
            m("p", "Filters for [disaster type] and/or [disaster name] ")
          ])
        ])
      ]),
      m("section", [
        m(".row", [
          m(".columns.medium-6",[
            m("h1", [m("small", "Projects per Disaster")]),
            m("p", "Horizontal bar chart of number of projects per unique named disaster."),
            m("p", "Think of this as a 'top 10' disasters thing. (e.g. #1 Yolanda, #2 Ondoy.)"),
            m("p")
          ]),
          m(".columns.medium-6",[
            m("h1", [m("small", "Amount per Disaster")]),
            m("p", "Same, but for amount spent/allocated/disbursed.")
          ])
        ])
      ])
    ])
  ])
}
