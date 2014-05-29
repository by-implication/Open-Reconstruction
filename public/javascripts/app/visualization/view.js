visualization.view = function(ctrl){
  return app.template(ctrl.app, [
    m("div#view.dashboard", [
      common.banner(ctrl.vis.title()),
      visPanel.view(ctrl.vis),
      m("section", [
        m(".row", [
          m(".columns.medium-12", [
            "hi"
          ]),
        ]),
      ])
    ])
  ])  
}