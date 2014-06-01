welcome.view = function(ctrl){
  return app.template(ctrl.app, [
    m("div#welcome", [
      m("section.banner", [
        m("div", {class:"row"}, [
          m("div", {class: "columns medium-8"}, [
            m("h1", "Open Reconstruction"),
            m("p", [
              "Tracking post-disaster reconstruction spending. Rebuilding a better Philippines, for all to see."
            ])
          ]),
          // m("div", {class: "columns medium-4 info"}, [
          //   m("h2", "Info 1"),
          //   m("h2", "Info 2")
          // ])
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
          m(".columns.medium-3", [
            m("i.fa.fa-clock-o.fa-4x"),
            m("h2.title", "Time since Disaster"),
            m("table.val-group", [
              m("tr", [
                m("td", [
                  m(".caption", "Yolanda"),
                ]),
                m("td", [
                  m("h2", [
                    "210 ",
                    m("span", "days")
                  ]),
                ])
              ])
            ]),
            m("table.val-group", [
              m("tr", [
                m("td", [
                  m(".caption", "Bohol"),
                ]),
                m("td", [
                  m("h2", [
                    "229 ",
                    m("span", "days")
                  ]),
                ])
              ])
            ]),
          ]),
          m(".columns.medium-3", [
            m("i.fa.fa-paste.fa-4x"),
            m("h2.title", "Proposals Submitted"),
            m("table.val-group", [
              m("tr", [
                m("td", [
                  m(".caption", "Yolanda"),
                ]),
                m("td", [
                  m("h2", [
                    ctrl.yolandaProposalsQuantity(),
                    m("h6", "PHP " + helper.truncate(ctrl.yolandaProposalsAmount(), 2))
                  ]),
                ])
              ])
            ]),
            m("table.val-group", [
              m("tr", [
                m("td", [
                  m(".caption", "Bohol"),
                ]),
                m("td", [
                  m("h2", [
                    ctrl.boholProposalsQuantity(),
                    m("h6", "PHP " + helper.truncate(ctrl.boholProposalsAmount(), 2) + "")
                  ]),
                ])
              ])
            ])
          ]),
          m(".columns.medium-3", [
            m("i.fa.fa-money.fa-4x"),
            m("h2.title", "Budget Allocated"),
            m("table.val-group", [
              m("tr", [
                m("td", [
                  m(".caption", "Yolanda"),
                ]),
                m("td", [
                  m("h2", [
                    ctrl.yolandaSAROQuantity() + " ",
                    m("span", "SAROs"),
                    m("h6", "PHP " + helper.truncate(ctrl.yolandaSAROAmount(), 2) )
                  ]),
                ])
              ])
            ]),
            m("table.val-group", [
              m("tr", [
                m("td", [
                  m(".caption", "Bohol"),
                ]),
                m("td", [
                  m("h2", [
                    // ctrl.boholSAROQuantity() + "",
                    "no data",
                    m("h6", "(" + ctrl.boholSAROAmount() + ")")
                  ]),
                ])
              ])
            ]),
          ]),
          m(".columns.medium-3", [
            m("i.fa.fa-wrench.fa-4x"),
            m("h2.title", "Ongoing Projects"),
            m("table.val-group", [
              m("tr", [
                m("td", [
                  m(".caption", "Yolanda"),
                ]),
                m("td", [
                  m("h2", [
                    ctrl.yolandaProjectsQuantity(),
                    m("h6", "PHP " + helper.truncate(ctrl.yolandaProjectsAmount(), 2) + "")
                  ]),
                ])
              ])
            ]),
            m("table.val-group", [
              m("tr", [
                m("td", [
                  m(".caption", "Bohol"),
                ]),
                m("td", [
                  m("h2", [
                    ctrl.boholProjectsQuantity(),
                    m("h6", "PHP " + helper.truncate(ctrl.boholProjectsAmount(), 2) + "")
                  ]),
                ])
              ])
            ])
          ])
        ])
      ]),
//    m("section.proposals", [
//        m(".row", [
//          m(".columns.medium-3", [
//            m("img",{src:"/assets/images/landing/1.svg"}),
//            m(".val-group", [
//              m("h2", ctrl.byLevel()[0].count),
//              m(".caption", "Proposals Submitted"),
//            ]),
//            m(".val-group#wut", [
//              m("h2", helper.truncate(ctrl.byLevel()[0].amount)),
//              m(".caption", "Total Cost (PHP)")
//            ]),
//          ]),
//          m(".columns.medium-3", [
//            m("img",{src:"/assets/images/landing/2.svg"}),
//            m(".val-group", [
//              m("h2", [ctrl.byLevel()[1].count+ " ",
//                m("span", "(n%)")
//              ]),
//              m("span", "Proposals for Assessment"),
//            ]),
//            m(".val-group", [
//              m("h2", helper.truncate(
//                parseFloat(ctrl.byLevel()[1].amount) +
//                parseFloat(ctrl.byLevel()[2].amount)
//              )),
//              m("span", "Cost of pending projects (PHP)")
//            ]),
//          ]),
//          m(".columns.medium-3", [
//            m("img",{src:"/assets/images/landing/3.svg"}),
//            m(".val-group", [
//              m("h2", [ctrl.byLevel()[3].count+ " ",
//                m("span", "(n%)")
//              ]),
//              m("span", "Proposals for Approval"),
//            ]),
//            m(".val-group", [
//              m("h2", helper.truncate(
//                parseFloat(ctrl.byLevel()[4].amount) +
//                parseFloat(ctrl.byLevel()[5].amount)
//              )),
//              m("span", "Total Approved Cost")
//            ]),
//          ]),
//          m(".columns.medium-3", [
//            m("img",{src:"/assets/images/landing/4.svg"}),
//            m(".val-group", [
//              m("h2", [ctrl.byLevel()[4].count + " ",
//                m("span", "(" + helper.percent(ctrl.percentApproved()) + ")")
//              ]),
//              m("span", "Projects for funding"),
//            ]),
//            m(".val-group", [
//              m("h2", ctrl.byLevel()[5].amount),
//              m("span", "Amount for disbursal")
//            ]),
//          ])
//        ])
//     ]),
      m("section.alt.agencies", [
        m(".row.info", [
          m(".columns.medium-12", [
            m("h2",["One Stop Shop"]),
            m("p", "Open Reconstruction streamlines the whole process from end to end, tracking a project throughout its lifecycle.")
          ])
        ]),
        m(".row.info", [
          m(".columns.medium-4", [
            m("figure.small", [
              m("img",{src:"/assets/images/landing/5.svg"})
            ]),
            m("h4", "Requests"),
            m("p","Physical forms, endorsements and documents have been replaced by an organized, efficient electronic database.")
          ]),
          m(".columns.medium-4", [
            m("figure.small", [
              m("img",{src:"/assets/images/landing/6.svg"}),
            ]),
            m("h4", "Approval"),
            m("p","Project approval now occurs digitally, without the need for physical mailing time or the risk of document loss.")
          ]),
          m(".columns.medium-4", [
            m("figure.small", [
              m("img",{src:"/assets/images/landing/7.svg"}),
            ]),
            m("h4", "Tracking"),
            m("p","Agencies and the public can keep track of requests and projects' overall progress.")
          ])
        ]),
      ]),
      m("section.public", [
        m(".row.info", [
          m(".columns.medium-12", [
            m("h2",["Transparency to the People"]),
            m("p", [
              "We have really cool graphs, charts, and lists that you can play with.",
              m("br"),
              "You can even get the raw data, if you want to dig deep and get your hands dirty. (coming soon)"]),
            m("a.button.micro", "List of all requests"),
            m("a.button.micro", "Stats, Graphs, and Visuals"),
            m("a.button.micro", "Data dumps, CSVs, and APIs"),
            m("figure.large")
          ])
        ]),
        m(".row", [
        ])
      ]),
      m("section.alt.etc", [
        m(".row.info", [
          m(".columns.medium-4", [
            m("figure.small", [
              m("img",{src:"/assets/images/landing/8.svg"})
            ]),
            m("h4", "About this site"),
            m("p","Open Recon is spearheaded by the Open Data Task Force, and is a joint initiative by OPARR, DBM, and DPWH. The site was built and designed by a team from By Implication."),
            m("a.button.micro", "Learn more about this project")
          ]),
          m(".columns.medium-4", [
            m("figure.small", [
              m("img",{src:"/assets/images/landing/9.svg"})
            ]),
            m("h4", "Spread the word"),
            m("p","Tweet us, Like us, Follow us! Spread the word, and let us know what else you'd like to see! You can also comment on individual charts and projects, and embedding is coming soon."),
            m("a.button.micro", "Facebook Link"),
            m("a.button.micro", "Twitter Link")
          ]),
          m(".columns.medium-4", [
            m("figure.small", [
              m("img",{src:"/assets/images/landing/10.svg"})
            ]),
            m("h4", "Open Source"),
            m("p","This system proudly builds upon and contributes to several open-source projects, and is open source itself. Check out the code, submit issues, or even contribute patches!"),
            m("a.button.micro", "Link to GitHub project")
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
