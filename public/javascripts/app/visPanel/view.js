visPanel.view = function(ctrl){
  return m(".vis-panel", [
    m(".section", [
      m("h5", ctrl.title()),
    ]),
    m("hr"),
    m(".section", [
      m("div", {config: ctrl.config})
    ]),
  ])
}