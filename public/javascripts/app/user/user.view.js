user.view = function(ctrl){
  return app.template(ctrl.app, [
    common.banner(ctrl.user().name),
    m(".row", [
      m(".colums.medium-9", [
        m("h1",[m("small", "List of projects requested by this user")]),
        project.listView(ctrl)
      ])
    ])
  ])
}