saro.view = function(ctrl){
  return app.template(ctrl.app, [
    m("div#view", [
      common.banner("SARO Releases")
    ])
  ])
};