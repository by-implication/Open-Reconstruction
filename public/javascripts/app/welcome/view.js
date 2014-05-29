welcome.view = function(ctrl){
  return app.template(ctrl.app, [
    m("div#view.welcome", [
      m("section.banner", [
        m("div", {class:"row"}, [
          m("div", {class: "columns medium-8"}, [
            m("h1", "Open Reconstruction"),
            m("p", [
              "Tracking post-disaster reconstruction spending. We need some copy up in here. Maybe a photo, too."
            ]),
            // m("a.button.micro", "Learn More"),
            // m("a.button.micro", "See all requests"),
            // m("a.button.micro", "Stats and Graphs")
          ]),
          m("div", {class: "columns medium-4 info"}, [
            m("h2", "Info 1"),
            m("h2", "Info 2")
          ])
        ])
      ]),
      m("section", [
        m(".row", [
          m(".columns.medium-12", [
            m(".notice", [
              m("i.fa.fa-exclamation-triangle"),
              "Note: This system is very new, and not all legacy data has been imported. Please check back for updates!"
            ])
          ])
        ]),
      ]),
m("section.proposals", [
        m(".row", [
          m(".columns.medium-12", [
            m("h1", [m("small", "Project Proposals")]),
          ]),
          m(".columns.medium-3", [
            m("i.fa.fa-file-text-o.fa-5x"),
            m(".val-group", [
              m("h2", ctrl.byLevel()[0].count),
              m(".caption", "Proposals Submitted"),
            ]),
            m(".val-group", [
              m("h2", helper.truncate(ctrl.byLevel()[0].amount)),
              m(".caption", "Total Cost (PHP)")
            ]),
          ]),
          m(".columns.medium-3", [
            m("i.fa.fa-search.fa-5x"),
            m(".val-group", [
              m("h2", [ctrl.byLevel()[1].count+ " ",
                m("span", "(n%)")
              ]),
              m("span", "Proposals for Assessment"),
            ]),
            m(".val-group", [
              m("h2", helper.truncate(
                parseFloat(ctrl.byLevel()[1].amount) +
                parseFloat(ctrl.byLevel()[2].amount)
              )),
              m("span", "Cost of pending projects (PHP)")
            ]),
          ]),
          m(".columns.medium-3", [
            m("i.fa.fa-check-circle-o.fa-5x"),
            m(".val-group", [
              m("h2", [ctrl.byLevel()[3].count+ " ",
                m("span", "(n%)")
              ]),
              m("span", "Proposals for Approval"),
            ]),
            m(".val-group", [
              m("h2", helper.truncate(
                parseFloat(ctrl.byLevel()[4].amount) +
                parseFloat(ctrl.byLevel()[5].amount)
              )),
              m("span", "Total Approved Cost")
            ]),
          ]),
          m(".columns.medium-3", [
            m("i.fa.fa-money.fa-5x"),
            m(".val-group", [
              m("h2", [ctrl.byLevel()[4].count + " ",
                m("span", "(" + helper.percent(ctrl.percentApproved()) + ")")
              ]),
              m("span", "Projects for funding"),
            ]),
            m(".val-group", [
              m("h2", ctrl.byLevel()[5].amount),
              m("span", "Amount for disbursal")
            ]),
          ])
        ])
      ]),
      m("section.alt", [
        m(".row", [
          m(".columns.medium-12", [
            "content goes here. deferred to lower priority. see sketches for details"
          ])
        ]),
      ]),
      m("footer", [
        m(".row", [
          m(".columns.medium-12",
            "This is where the obligatory standard gov.ph footer goes. We need to know what goes in here."
          )
        ])
      ])
    ])
  ]);
};
