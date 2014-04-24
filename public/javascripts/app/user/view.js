user.view = function(ctrl){
  return app.template(ctrl.app, [
    common.banner(ctrl.user().name),
    m("section", [
      m(".row", [
        m(".columns.medium-9", [
          m("div", [
            "Agency",
            m("h3", [
              ctrl.user().agency.name
            ]),
          ]),
          m("hr.dashed"),
          ctrl.app.isUserAuthorized(ctrl.user(), 1) ?
            m("div", [
              m("h1",[m("small", "List of projects requested by this user")]),
              project.listView(ctrl)
            ])
          : ""
        ])
      ])
    ]),
  ])
}