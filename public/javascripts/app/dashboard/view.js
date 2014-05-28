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
      // m("section.proposals", [
      //   m(".row", [
      //     m(".columns.medium-12", [
      //       m("h1", [m("small", "Project Proposals")]),
      //     ]),
      //     m(".columns.medium-3", [
      //       m("i.fa.fa-file-text-o.fa-5x"),
      //       m(".val-group", [
      //         m("h2", ctrl.byLevel()[0].count),
      //         m(".caption", "Proposals Submitted"),
      //       ]),
      //       m(".val-group", [
      //         m("h2", helper.truncate(ctrl.byLevel()[0].amount)),
      //         m(".caption", "Total Cost (PHP)")
      //       ]),
      //     ]),
      //     m(".columns.medium-3", [
      //       m("i.fa.fa-search.fa-5x"),
      //       m(".val-group", [
      //         m("h2", ctrl.byLevel()[1].count),
      //         m("span", "Proposals for Assessment"),
      //       ]),
      //       m(".val-group", [
      //         m("h2", helper.truncate(
      //           parseFloat(ctrl.byLevel()[1].amount) +
      //           parseFloat(ctrl.byLevel()[2].amount)
      //         )),
      //         m("span", "Cost of pending projects (PHP)")
      //       ]),
      //     ]),
      //     m(".columns.medium-3", [
      //       m("i.fa.fa-check-circle-o.fa-5x"),
      //       m(".val-group", [
      //         m("h2", ctrl.byLevel()[3].count),
      //         m("span", "Proposals for Approval"),
      //       ]),
      //       m(".val-group", [
      //         m("h2", helper.truncate(
      //           parseFloat(ctrl.byLevel()[4].amount) +
      //           parseFloat(ctrl.byLevel()[5].amount)
      //         )),
      //         m("span", "Total Approved Cost")
      //       ]),
      //     ]),
      //     m(".columns.medium-3", [
      //       m("i.fa.fa-money.fa-5x"),
      //       m(".val-group", [
      //         m("h2", [ctrl.byLevel()[4].count, helper.percent(ctrl.percentApproved())]),
      //         m("span", "Projects for funding"),
      //       ]),
      //       m(".val-group", [
      //         m("h2", ctrl.byLevel()[5].amount),
      //         m("span", "Amount for disbursal")
      //       ]),
      //     ])
      //   ])
      // ]),
      m("section.alt", [
        m(".row", [
          m(".columns.medium-9", [
            m("ul.medium-block-grid-2", [
              m("li", [
                visPanel.view(ctrl.projectHistory)
              ]),
              m("li", [
                visPanel.view(ctrl.disasterHistory)
              ]),
              m("li", [
                visPanel.view(ctrl.projectTypes)
              ]),
              m("li", [
                visPanel.view(ctrl.topDisasters)
              ]),
              m("li", [
                visPanel.view(ctrl.topDisastersAmount)
              ]),
            ]),
          ]),
          m(".columns.medium-3", [
            m("h4", [
              "Filter by Visualization Type"
            ]),
            m("ul.filters", 
              _.chain([{name: "hi", id: 2}])
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
          ]),
        ]),
      ]),
    ])
  ])
}
