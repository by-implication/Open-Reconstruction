dashboard.view = function(ctrl){

  return app.template(
    ctrl.app,
    "Dashboard",
    {className: "detail"},
    [
      common.banner("Dashboard"),
      m("section", [
        m(".row", [
          m(".columns.medium-6.medium-centered", [
            "DASHBOARD"
          ]),
        ]),
      ]),
    ]
  );

}
