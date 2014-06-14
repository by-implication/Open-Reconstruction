visPanel.view = function(ctrl){
  return m(".vis-panel", [
    ctrl.isFullView() ?
      ""
      // m("div", [
      //   m(".section", [
      //     "sorting shit",
      //     ctrl.sorts() ?
      //       console.log(ctrl.sorts())
      //     : ""
      //   ]),
      // ])
    : m("div", [
        m(".section", [
          m("h5", [
            m("a", {href: routes.controllers.Viz.view(ctrl.link()).url, config: m.route}, ctrl.title())
          ]),
        ]),
        m("hr")
      ]),
    m(".section", [
      m("div", {config: ctrl.config})
    ]),
  ])
}
