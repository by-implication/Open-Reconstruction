agency.view = function(ctrl){
  return app.template(ctrl, [
    common.banner(ctrl.agency().name()),
    m("section", [
      m(".row", [
        m(".columns.medium-9", [
          ctrl.agency().name()
        ]),
      ]),
    ]),
  ])
}