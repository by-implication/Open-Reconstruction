viz.view = function(ctrl){
  return app.template(ctrl.app, "Visualizations", {className: "detail"}, [
    m("div#view.viz", [
      common.banner(ctrl.vis.title()),
      visPanel.view(ctrl.vis),
      m("section", [
        m(".row", [
          m(".columns.medium-8", [
            m("h2", [
              "Comments"
            ]),
            m("p", [
              "Coming Soon"
            ]),
          ]),
          m(".columns.medium-4", [
            m("h2", [
              "Share options"
            ]),
            m("p", [
              "Coming Soon"
            ]),
          ]),
        ]),
      ])
    ])
  ])  
}