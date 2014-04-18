agency.view = function(ctrl){
  return app.template(ctrl.app, [
    common.banner(ctrl.agency().name),
    m("section", [
      m(".row", "id: " + ctrl.agency().id),
      m(".row", "name: " + ctrl.agency().name),
      m(".row", "acronym: " + ctrl.agency().acronym),
      m(".row", "role: " + ctrl.agency().role)
    ]),
  ])
}