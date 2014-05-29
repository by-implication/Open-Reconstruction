visPanel.view = function(ctrl){
  return m(".vis-panel", [
    m(".section", [
      m("h5", [
        m("a", {href: routes.controllers.Requests.visualization(ctrl.link()).url}, ctrl.title())
      ]),
    ]),
    m("hr"),
    m(".section", [
      m("div", {config: ctrl.config})
    ]),
  ])
}