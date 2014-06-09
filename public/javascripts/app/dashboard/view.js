dashboard.view = function(ctrl){
  var directory = function(){
    var linkGroup = function(key){
      var g = ctrl.visDict[key]
      return [
        m("h4", [
          key
        ]),
        m("ul", g.map(function(v){
          // console.log(v(ctrl));
          return m("li", [
            m("a", {href: routes.controllers.Visualizations.view(v(ctrl).link()).url}, v(ctrl).title())
          ]);
        })),
      ]
    }
    return m("div", [
      linkGroup("request"),
      linkGroup("saro"),
      linkGroup("project")
    ])
  }

  var visSection = function(key){
    var g = ctrl.visDict[key];
    return m(".section", {id: key + "-visualizations"}, [
      m("h2.section-title", [
        key, 
        " Visualizations"
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
