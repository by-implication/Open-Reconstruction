viz.view = function(ctrl){
  return app.template(ctrl.app, {className: "detail"}, [
    m("div#view.viz", [
      common.banner(ctrl.vis.title()),
      visPanel.view(ctrl.vis),
      m("section", [
        m(".row", [
          m(".columns.medium-8", [
            m("h1", [
              "Comments go here"
            ]),
          ]),
          m(".columns.medium-4", [
            m("h1", [
              "Share options here"
            ]),
          ]),
        ]),
      ])
    ])
  ])  
}