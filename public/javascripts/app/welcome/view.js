welcome.view = function(ctrl){
  return app.template(ctrl.app, [
    m("div#view.welcome", [
      m("section.banner", [
        m("div", {class:"row"}, [
          m("div", {class: "columns medium-8"}, [
            m("h1", "Open Reconstruction"),
            m("p", [
              "Tracking post-disaster reconstruction spending. We need some copy up in here. Maybe a photo, too."
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
          // m(".columns.medium-12", [
          //   m("h1", [m("small", "Project Proposals")]),
          // ]),
          m(".columns.medium-3", [
            m("img",{src:"/assets/images/landing/1.svg"}),
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
            m("img",{src:"/assets/images/landing/2.svg"}),
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
            m("img",{src:"/assets/images/landing/3.svg"}),
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
            m("img",{src:"/assets/images/landing/4.svg"}),
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
            m("p","Say good-bye to paper forms, endorsements, and documents, and hello to geotagged ACID transactions in a relational database.")
          ]),
          m(".columns.medium-4", [
            m("figure.small", [
              m("img",{src:"/assets/images/landing/6.svg"}),
            ]),
            m("h4", "Approval"),
            m("p","Why spam the rubber stamp when you can now spam the approve button? (Hey, it's faster, saves paper, and you still feel important! )")
          ]),
          m(".columns.medium-4", [
            m("figure.small", [
              m("img",{src:"/assets/images/landing/7.svg"}),
            ]),
            m("h4", "Tracking"),
            m("p","ermahgerd! Numbers are going up!!!! That means we've got some progress going on, right! We have CHARTS to prove it!")
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
            m("p","Open Reconstruction is a project spearheaded by the World Bank and the DBM. It was built and designed by awesome people, By Implication."),
            m("a.button.micro", "Learn more about this project")
          ]),
          m(".columns.medium-4", [
            m("figure.small", [
              m("img",{src:"/assets/images/landing/9.svg"})
            ]),
            m("h4", "Spread the word"),
            m("p","Tweet us, Like Us, Follow Us! Tell your friends! Just like you, our sense of self-worth is determined by what other people think."),
            m("a.button.micro", "Facebook Link"),
            m("a.button.micro", "Twitter Link"),
            m("a.button.micro", "That Other Thing No One Uses")
          ]),
          m(".columns.medium-4", [
            m("figure.small", [
              m("img",{src:"/assets/images/landing/10.svg"})
            ]),
            m("h4", "Open Source"),
            m("p","This system proudly builds upon and contributes to several open-source projects, and is open source itself. Because the more times I say open, the better!"),
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
