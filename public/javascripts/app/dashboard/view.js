dashboard.view = function(ctrl){

  return app.template(
    ctrl.app,
    "Dashboard",
    {className: "detail"},
    [
      common.banner("Dashboard"),
      m("section#new-request-banner", [
        m(".row", [
          m(".columns.medium-12", [
            m("h2.left", [
              "Don't have an existing request? Make a new one."
            ]),
            m("a.button.right",
              {href: routes.controllers.Requests.create().url, config: m.route},
              "New Request"
            ),
          ]),
        ]),
      ]),
      m("section", [
        m(".row", [
          m(".columns.medium-12.text-center", [
            common.tabs.menu(ctrl.tabs, {className: "switch", config: ctrl.setCurrentTab})
          ]),
        ]),
        m(".row", [
          m(".columns.medium-6.medium-centered", [
            "DASHBOARD"
          ]),
        ]),
      ]),
    ]
  );

}
