visPanel.view = function(ctrl){
  return m(".vis-panel", {
    className: _.chain(ctrl.tags())
      .map(function(tagGroup, tagGroupName){
        return tagGroup.map(function(tag){
          return tagGroupName + "-" + tag;
        })
      })
      .flatten()
      .reduce(function(acc, cur){
        return acc + " " + cur
      }, "")
      .value()
  }, [
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
