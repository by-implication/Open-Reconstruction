home.view = function(ctrl){
  return app.template(ctrl.app, "Home", [
    m("div#home", [
      m("section.banner", [
        m(".banner-content", [
          m(".row", [
            m(".columns.medium-12.text-center", [
              m("div#logo", {config: ctrl.drawLogo}, [m.trust(home.Logo)]),
            ]),
            m(".columns.medium-12.text-center", [
              m("h1", ["Open Reconstruction"]),
              m("p", [
                "Tracking taxpayer money spent on post-disaster reconstruction in the Philippines",
              ]),
              m("a.button.learn",{href:"#infodump"},[
                "Learn how Open Reconstruction promotes transparency and improves efficiency. ",
                m("i.fa.fa-chevron-circle-down")
              ])
            ]),
          ])
        ]),
        m("a.search", {
          href: routes.controllers.Requests.index().url,
          config:m.route
        },[
          m(".row",[
            m(".columns.medium-8.medium-centered",[
              m("h2.text-center", [
                m("i.fa.fa-search"),
                "Browse for projects and requests in your town, region, or area.",
                // m("a.button",{
                //     href: routes.controllers.Requests.index().url,
                //     config:m.route
                //   },[
                //     "Search ",
                    
                // ])
              ])
            ])
          ])
        ]),
      ]),
      // m("section", [
      //   m(".row", [
      //     m(".columns.medium-12", [
      //       m(".notice", [
      //         m("i.fa.fa-exclamation-triangle"),
      //         "Note: This system is very new, and not all legacy data has been imported. Please check back for updates, and let us ",
      //         m("a", {target:"potato", href:"https://docs.google.com/forms/d/1GUdE6Si1QnnMtVJ8ig8rwECo9DK9BloOXiGVVnj_efw/viewform"},
      //           "know what you think"
      //         ),
      //         "!"
      //       ])
      //     ])
      //   ]),
      // ]),
      m("section.proposals", [
        m(".row.info", [
          m(".columns.medium-12", [
            m("h2", [
              "Real Data"
            ]),
            m(".columns.medium-6.medium-centered", [
              m("p.big.text-center", [
                "We like to keep everyone updated. This is the progress we've made in addressing the requests made in response to past disasters."
              ]),
            ]),
            m("p.notice", [
              m("i.fa.fa-exclamation-triangle"),
              "Note: This system is very new, and not all legacy data has been imported. Please check back for updates, and let us ",
              m("a", {target:"potato", href:"https://docs.google.com/forms/d/1GUdE6Si1QnnMtVJ8ig8rwECo9DK9BloOXiGVVnj_efw/viewform"},
                "know what you think"
              ),
              "!"
            ])
          ]),
        ]),
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
                href: routes.controllers.Requests.index().url,
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
                href: routes.controllers.Viz.indexFilter("dataset", "SARO").url,
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
                      m("h6", [
                        m("span.dpwh-label", "DPWH:"),
                        " PHP ",
                        m("span.fig", helper.truncate(ctrl.vizData().yolanda.dpwh.amt, 2))
                      ]),
                      m("h6", [
                        m("span.dpwh-label", "DILG:"),
                        " PHP ",
                        m("span.fig", helper.truncate(ctrl.vizData().yolanda.dilg.amt, 2))
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
                      m("h6", [
                        m("span.dpwh-label", "DPWH:"),
                        " PHP ",
                        m("span.fig", helper.truncate(ctrl.vizData().bohol.dpwh.amt, 2))
                      ]),
                      m("h6", [
                        m("span.dpwh-label", "DILG:"),
                        " PHP ",
                        m("span.fig", helper.truncate(ctrl.vizData().bohol.dilg.amt, 2))
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
                href: routes.controllers.Projects.index().url,
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
                        "PHP ",
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
                        "PHP ",
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
            // m("p", [
            //   // "Open Reconstruction streamlines the whole process from end to end, tracking a project throughout its lifecycle.",
            //   // m("br"),
            //   "Both public and government sectors can take advantage of the system. See how."
            // ]),
          ]),
        ]),
        m(".row", [
          m(".columns.medium-12.text-center", [
            m("dl.tabs.switch", [
              m("dd", {className: ctrl.infoDumpCurrentTab() === "public" ? "active" : ""}, [
                m("a", {onclick: ctrl.infoDumpCurrentTab.bind(ctrl, "public")}, [
                  "Public"
                ]),
              ]),
              m("dd", {className: ctrl.infoDumpCurrentTab() === "govUnit" ? "active" : ""}, [
                m("a", {onclick: ctrl.infoDumpCurrentTab.bind(ctrl, "govUnit")}, [
                  "Government Units"
                ]),
              ]),
            ]),
          ]),
        ]),
        ctrl.infoDumpCurrentTab() === "govUnit" ?
          m(".div", [
            m(".row", [
              m(".columns.medium-6.medium-centered", [
                m("p.text-center.big", [
                  "We've streamlined the approval process so that the reconstruction gets from paper to brick—lightning fast."
                ]),
              ]),
            ]),
            m(".row", [
              m(".columns.medium-4.feature", [
                m("figure.small", [
                  m("img",{src:"/assets/images/landing/5-request.svg"})
                ]),
                m("h4", "Request"),
                m("p", "You can check if your projects are already in the system, with our search and filtering. If they are not yet there, request access, and submit a new eTicket for it!"),
              ]),
              m(".columns.medium-4.feature", [
                m("figure.small", [
                  m("img",{src:"/assets/images/landing/6-approval.svg"}),
                ]),
                m("h4", "Approval"),
                m("p","Project approval now occurs digitally, without the need for physical mailing time or the risk of document loss.")
              ]),
              m(".columns.medium-4.feature", [
                m("figure.small", [
                  m("img",{src:"/assets/images/landing/7-tracking.svg"}),
                ]),
                m("h4", "Tracking"),
                m("p","Agencies and the public can keep track of requests and projects' overall progress.")
              ]),
            ])
          ])
        : m("div", [
            m(".row", [
              m(".columns.medium-6.medium-centered", [
                m("p.text-center.big", [
                  "We've always said that transparency is essential for good governance. We're putting our money where our mouth is, so we've made all this data public."
                ]),
              ]),
            ]),
            m(".row", [
                m(".columns.medium-4.feature", [
                  m("figure.small", [
                    m("img",{src:"/assets/images/landing/7-tracking.svg"}),
                  ]),
                  m("h4", "Tracking"),
                    m("p","Agencies and the public can keep track of requests and projects' overall progress.")
                ]),
                m(".columns.medium-4.feature", [
                  m("figure.small", [
                    m("img",{src:"/assets/images/landing/9-sharing.svg"}),
                  ]),
                  m("h4", "Sharing"),
                  m("p", "Let people know about requests and projects that are important to you. Share your thoughts on Facebook and Twitter!")
                ]),
                m(".columns.medium-4.feature", [
                  m("figure.small", [
                    m("img",{src:"/assets/images/landing/8-interact.svg"}),
                  ]),
                  m("h4", "Interact"),
                  m("p", "Or if you'd prefer, you can simply leave comments and suggestions on the site itself.")
                ]),
              ]),
            ]),
          ]),
      m("section.public", [
        m(".row.info", [
          m(".columns.medium-12", [
            m("h2",["Transparency to the People"]),
            m("p.big", [
              "We have really cool graphs, charts, and lists that you can play with.",
              m("br"),
              "You can even get the raw data, if you want to dig deep and get your hands dirty. (coming soon)"]),
            m("ul.button-group.centerize.radius", [
              m("li", [
                m("a.button.tiny", "List of all requests"),
              ]),
              m("li", [
                m("a.button.tiny", "Stats, Graphs, and Visuals"),
              ]),
              m("li", [
                m("a.button.tiny", "Data dumps, CSVs, and APIs"),
              ]),
            ]),
            m("figure.large", [
              visPanel.view(ctrl.yolandaSaroVis)
            ]),
            m("h3.graph-title", "SARO Releases, Value and Quantity, per month")
          ])
        ]),
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
              " and is a joint initiative by OPARR, DBM, and DPWH. The site was built and designed by a team from ",
              m("a", {href:"http://byimplication.com"}, "By Implication"),
              "."
              ]),
            m("a.button.tiny.radius", {
              href: routes.controllers.Application.faq().url,
              config:m.route
            }, "Learn more about this project")
          ]),
          m(".columns.medium-4", [
            m("figure.small", [
              m("img",{src:"/assets/images/landing/11-spread.svg"})
            ]),
            m("h4", "Spread the word"),
            m("p","Tweet us, Like us, Follow us! Spread the word, and let us know what else you'd like to see! You can also comment on individual charts and projects, and embedding is coming soon."),
            m("ul.button-group.centerize.radius", [
              m("li", [
                m("a.button.tiny", "Facebook Link"),
              ]),
              m("li", [
                m("a.button.tiny", "Twitter Link")
              ]),
            ]),
          ]),
          m(".columns.medium-4", [
            m("figure.small", [
              m("img",{src:"/assets/images/landing/12-open source.svg"})
            ]),
            m("h4", "Open Source"),
            m("p","This system proudly builds upon and contributes to several open-source projects, and is open source itself. Check out the code, submit issues, or even contribute patches!"),
            m("a.button.tiny.radius", {
              href:"https://github.com/by-implication/Open-Reconstruction"
            }, "Fork us on GitHub")
            // (twss)
          ])
        ]),
      ])
    ])
  ]);
};
