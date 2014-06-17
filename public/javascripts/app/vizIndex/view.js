vizIndex.view = function(ctrl){
  var directory = function(){
    var linkGroup = function(key){
      var g = ctrl.visDict[key]
      var title;
      if (key === "request") {
        title = "Requests (Infrastructure Cluster)";
      }
      if (key === "saro") {
        title = "Budget Releases (DBM SAROs)";
      }
      if (key === "project") {
        title = "Projects (DPWH)";
      }
      return [
        m("h4", [
          title
        ]),
        m("ul", g.map(function(v){
          return m("li", [
            m("a", {href: routes.controllers.Viz.view(v(ctrl).link()).url, config: m.route}, v(ctrl).title())
          ]);
        })),
      ]
    }
    return m("div", _.flatten([
      linkGroup("request"),
      linkGroup("saro"),
      linkGroup("project")
    ]))
  }

  var visSection = function(key){
    var g = ctrl.visDict[key];
    var title;
    var desc;
    if (key === "request") {
      title = "Requests (Infrastructure Cluster)";
      desc = "Requests are submitted by LGUs and NGAs. These are essentially requests for financial and implementation support.";
    }
    if (key === "saro") {
      title = "Budget Releases (DBM SAROs)";
      desc = "SAROs, or Special Allotment Release Orders, signify government approval for the release for funds for a certain purpose.";
    }
    if (key === "project") {
      title = "Projects (DPWH)";
      desc = "The DPWH looks at the requests that come their way, and divide it into manageable projects and entered into their PMS. In other words, projects are children of requests.";
    }
    return m(".section", {id: key + "-visualizations"}, [
      m("h2.section-title", [
        title,
        //" Visualizations"
      ]),
      m("p", [
        desc
      ]),
      m("ul.medium-block-grid-2", g.map(function(v){
        return m("li", [
          visPanel.view(v(ctrl))
        ])
      })),
    ])
  }
  return app.template(ctrl.app, [
    m("div", [
      common.banner("Visualizations"),
      m("section", [
        m(".row",[
          m(".columns.medium-12",[
            m(".notice",[
              "Some introductory text goes here. Explains that this is a live snapshot of data, but you can access the raw data if you make to make your own visualizations. Other obligatory disclaimers and all that."
            ])
          ])
        ])
      ]),
      m("section.alt", [
        m(".row", [
          // common.stickyTabs.menu(ctrl.projectVisTabs, {className: "vertical", config: ctrl.scrollHandler}),
          m(".columns.medium-3", {config: common.sticky.config(ctrl)}, [
            directory(),
          ]),
          m(".columns.medium-9", [
            visSection("request"),
            visSection("saro"),
            visSection("project")
          ]),
        ]),
      ])
    ])
  ]);
}
