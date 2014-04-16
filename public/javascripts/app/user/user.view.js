user.view = function(ctrl){
  return app.template(ctrl, [
    common.banner(ctrl.user().name),
    m("div", {class: "row"}, [
      m("div", {class: "columns medium-9"}, [
        m("h1",[m("small", "List of projects requested by this user")]),
        project.listView(ctrl)
      ])
    ])
  ])
}