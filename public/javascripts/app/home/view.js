home.view = function(ctrl){
  return app.template(ctrl.app, "Home", [
    m("div#home", [
      m("section.banner", [
        m(".row", [
          m(".columns.medium-1"),
          m(".columns.medium-11", [
            m("div#logo", {config: ctrl.drawLogo}, [m.trust(home.Logo)]),
            m("h1", "Open Reconstruction"),
            m("p", [
              "Tracking taxpayer money spent on post-disaster reconstruction in the Philippines",
              m("br"),
              m("a.button",{href:"#infodump"},[
                "Learn how Open Reconstruction promotes transparency and improves efficiency. ",
                m("i.fa.fa-chevron-circle-down")
              ])
            ])
          ]),
        ])
      ]),
      m("section.search",[
        m(".row",[
          m(".columns.medium-1"),
          m(".columns.medium-11",[
            m("h2", [
              "Find projects and requests in your town, region, or area.",
              m("a.button",{
                  href:"/requests",
                  config:m.route
                },[
                  "Search ",
                  m("i.fa.fa-search")
              ])
            ])
          ])
        ])
      ]),
      m("section", [
        m(".row", [
          m(".columns.medium-12", [
            m(".notice", [
              m("i.fa.fa-exclamation-triangle"),
              "Note: This system is very new, and not all legacy data has been imported. Please check back for updates, and let us ",
              m("a", {target:"potato", href:"https://docs.google.com/forms/d/1GUdE6Si1QnnMtVJ8ig8rwECo9DK9BloOXiGVVnj_efw/viewform"},
                "know what you think"
              ),
              "!"
            ])
          ])
        ]),
      ]),
      m("section.proposals", [
        m(".row", [
          m("ul.medium-block-grid-4#derp", [
            m("li", [
                m("img", {src:"/assets/images/landing/1-time since.svg"}),
                m("h2.title", "Time since Disaster"),
                m("table.val-group.first", [
                  m("tr", [
                    m("td", [
                      m(".caption", "Typhoon Yolanda"),
                    ]),
                    m("td", [
                      m("h2", [
                        ctrl.daysSinceYolanda,
                        m("span", " days")
                      ]),
                    ])
                  ])
                ]),
                m("table.val-group.first", [
                  m("tr", [
                    m("td", [
                      m(".caption", "Bohol Earthquake"),
                    ]),
                    m("td", [
                      m("h2", [
                        ctrl.daysSinceBohol,
                        m("span", " days")
                      ]),
                    ])
                  ])
                ]),
            ]),
            m("li.arrow", [
              m("a", {
                href:"/requests",
                config:m.route
              }, [
                m("img", {src:"/assets/images/landing/2-projects requested.svg"}),
                m("h2.title", [
                  "Requested Projects",
                  common.help("Projects sought by local governments, agencies related to reconstruction. Project requests are vetted and then approved by the relevant agency before a budget for them from the reconstruction fund is approved.", true)
                ]),
                m("table.val-group", [
                  m("tr", [
                    m("td", [
                      m(".caption", "Typhoon Yolanda"),
                    ]),
                    m("td", [
                      m("h2", [
                        m("span", "PHP"),
                        " " + helper.truncate(ctrl.vizData().yolanda.projects.amt, 2) + "",
                        m("h6", helper.commaize(ctrl.vizData().yolanda.projects.qty) + " Projects")
                      ]),
                    ])
                  ])
                ]),
                m("table.val-group", [
                  m("tr", [
                    m("td", [
                      m(".caption", "Bohol Quake"),
                    ]),
                    m("td", [
                      m("h2", [
                        m("span", "PHP"),
                        " " + helper.truncate(ctrl.vizData().bohol.projects.amt, 2) + "",
                        m("h6", helper.commaize(ctrl.vizData().bohol.projects.qty) + " Projects")
                      ]),
                    ])
                  ])
                ])
              ])
            ]),
            m("li.arrow", [
              m("a", {
                href: routes.controllers.Viz.index().url,
                config:m.route
              }, [
                m("img", {src:"/assets/images/landing/3-budget releases.svg"}),
                m("h2.title", [
                  "Projects with Released Budget*",
                  common.help("Reconstruction funds are allocated and readied for release.", true)
                ]),
                m("table.val-group", [
                  m("tr", [
                    m("td", [
                      m(".caption", "Typhoon Yolanda"),
                    ]),
                    m("td", [
                      // ctrl.vizData().yolanda.saro.qty + " ",
                      // m("span", "SAROs"),
                      m("h6", [
                        m("span.dpwh-label", "DPWH:"),
                        " PHP ",
                        m("span.fig", helper.truncate(ctrl.vizData().yolanda.dpwh.amt, 2))
                      ]),
                      m("h6", [
                        "All Agencies: PHP ",
                        m("span.fig",  helper.truncate(ctrl.vizData().yolanda.saro.amt, 2))
                      ])
                    ])
                  ])
                ]),
                m("table.val-group", [
                  m("tr", [
                    m("td", [
                      m(".caption", "Bohol Quake"),
                    ]),
                    m("td", [
                      // ctrl.vizData().bohol.saro.qty + " ",
                      // m("span", "SAROs"),
                      m("h6", [
                        m("span.dpwh-label", "DPWH:"),
                        " PHP ",
                        m("span.fig", helper.truncate(ctrl.vizData().bohol.dpwh.amt, 2))
                      ]),
                      m("h6", [
                        "All Agencies: PHP ",
                        m("span.fig",  helper.truncate(ctrl.vizData().bohol.saro.amt, 2))
                      ])
                    ])
                  ])
                ]),
              ])
            ]),
            m("li", [
              m("a", {
                href:"/requests",
                config:m.route
              }, [
                m("img", {src:"/assets/images/landing/4-ongoing projects.svg"}),
                m("h2.title", [
                  "Ongoing Projects (Public Works)*",
                  common.help("Projects under implementation. Once approved and funds are allocated for the projects, the proponent is given a go-signal to proceed with building it.", true)
                ]),
                m("table.val-group", [
                  m("tr", [
                    m("td", [
                      m(".caption", "Typhoon Yolanda"),
                    ]),
                    m("td", [
                      m("h6", [
                        m("span.dpwh-label", "DPWH:"),
                        " PHP ",
                        m("span.fig", helper.truncate(ctrl.vizData().yolanda.fundedProjects.amt, 2))
                      ]),
                      m("h6", ctrl.vizData().yolanda.fundedProjects.qty + " Projects")
                    ])
                  ])
                ]),
                m("table.val-group", [
                  m("tr", [
                    m("td", [
                      m(".caption", "Bohol Quake"),
                    ]),
                    m("td", [
                      m("h6", [
                        m("span.dpwh-label", "DPWH:"),
                        " PHP ",
                        m("span.fig", helper.truncate(ctrl.vizData().bohol.fundedProjects.amt, 2))
                      ]),
                      m("h6", ctrl.vizData().bohol.fundedProjects.qty + " Projects")
                    ])
                  ])
                ])
              ])
            ])
          ]),
        ]),
      ]),
      m("section.alt.for-everyone#infodump",[
        m(".row.info", [
          m(".columns.medium-12", [
            m("h2", [
              "One-Stop Shop"
            ]),
            m("p", [
              "Open Reconstruction streamlines the whole process from end to end, tracking a project throughout its lifecycle.",
              m("br"),
              "All sectors can take advantage of the system. See how."
            ]),
          ]),
        ]),
        m(".row.details", [
          m(".columns.medium-6.large-gutters", [
            m("h3.ruled", "Government Units"),
            m(".row", [
              m(".columns.medium-3", [
                m("figure.small", [
                  m("img",{src:"/assets/images/landing/5-request.svg"})
                ]),
              ]),
              m(".columns.medium-9", [
                m("h4", "Request"),
                m("p", "You can check if your projects are already in the system, with our search and filtering. If they are not yet there, request access, and submit a new eTicket for it!"),
              ]),
            ]),
            m(".row", [
              m(".columns.medium-3", [
                m("figure.small", [
                  m("img",{src:"/assets/images/landing/6-approval.svg"}),
                ]),
              ]),
              m(".columns.medium-9", [
                m("h4", "Approval"),
                m("p","Project approval now occurs digitally, without the need for physical mailing time or the risk of document loss.")
              ]),
            ]),
            m(".row", [
              m(".columns.medium-3", [
                m("figure.small", [
                  m("img",{src:"/assets/images/landing/7-tracking.svg"}),
                ]),
              ]),
              m(".columns.medium-9", [
                m("h4", "Tracking"),
                m("p","Agencies and the public can keep track of requests and projects' overall progress.")
              ]),
            ]),
          ]),
          m(".columns.medium-6.large-gutters", [
            m("h3.ruled", "Public"),
            m(".row", [
              m(".columns.medium-3", [
                m("figure.small", [
                  m("img",{src:"/assets/images/landing/7-tracking.svg"}),
                ]),
              ]),
              m(".columns.medium-9", [
                m("h4", "Tracking"),
                m("p","Agencies and the public can keep track of requests and projects' overall progress.")
              ]),
            ]),
            m(".row", [
              m(".columns.medium-3", [
                m("figure.small", [
                  m("img",{src:"/assets/images/landing/9-sharing.svg"}),
                ]),
              ]),
              m(".columns.medium-9", [
                m("h4", "Sharing"),
                m("p", "Let people know about requests and projects that are important to you. Share your thoughts on Facebook and Twitter!")
              ]),
            ]),
            m(".row", [
              m(".columns.medium-3", [
                m("figure.small", [
                  m("img",{src:"/assets/images/landing/8-interact.svg"}),
                ]),
              ]),
              m(".columns.medium-9", [
                m("h4", "Interact"),
                m("p", "Or if you'd prefer, you can simply leave comments and suggestions on the site itself.")
              ]),
            ]),
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
            m("figure.large", [
              visPanel.view(ctrl.yolandaSaroVis)
            ]),
            m("h3.graph-title", "SARO Releases, Value and Quantity, per month")
          ])
        ]),
        m(".row", [
        ])
      ]),
      m("section.etc.alt", [
        m(".row.info", [
          m(".columns.medium-4", [
            m("figure.small", [
              m("img",{src:"/assets/images/landing/10-about.svg"})
            ]),
            m("h4", "About this site"),
            m("p", [
              "Open Recon is spearheaded by the ",
              m("a", {href:"http://data.gov.ph"}, "Open Data Task Force"),
              "and is a joint initiative by OPARR, DBM, and DPWH. The site was built and designed by a team from ",
              m("a", {href:"http://byimplication.com"}, "By Implication"),
              "."
              ]),
            m("a.button.micro", {
              href:"/faq",
              config:m.route
            }, "Learn more about this project")
          ]),
          m(".columns.medium-4", [
            m("figure.small", [
              m("img",{src:"/assets/images/landing/11-spread.svg"})
            ]),
            m("h4", "Spread the word"),
            m("p","Tweet us, Like us, Follow us! Spread the word, and let us know what else you'd like to see! You can also comment on individual charts and projects, and embedding is coming soon."),
            m("a.button.micro", "Facebook Link"),
            m("a.button.micro", "Twitter Link")
          ]),
          m(".columns.medium-4", [
            m("figure.small", [
              m("img",{src:"/assets/images/landing/12-open source.svg"})
            ]),
            m("h4", "Open Source"),
            m("p","This system proudly builds upon and contributes to several open-source projects, and is open source itself. Check out the code, submit issues, or even contribute patches!"),
            m("a.button.micro", {
              href:"https://github.com/by-implication/Open-Reconstruction"
            }, "Fork us on GitHub")
            // (twss)
          ])
        ]),
      ])
    ])
  ]);
};
